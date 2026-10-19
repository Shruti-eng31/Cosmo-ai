"""
Cosmo AI — Embeddings & Vector Store Manager
==============================================
Manages the sentence-transformers embedding model and the FAISS
vector store. Both are initialized once and reused across requests.

Key design decisions:
  - The embedding model runs LOCALLY (no API key needed).
  - FAISS is used for fast, persistent vector similarity search.
  - The model and FAISS index are loaded once at startup.
  - Batch embedding is used during ingestion for efficiency.
  - Individual query embedding is used for search (fast, single vector).
  - Metadata is stored alongside the FAISS index in a JSON sidecar file.

Why FAISS?
  - Pre-built wheels for Windows/Python 3.14 (no C++ compiler needed)
  - Extremely fast similarity search (Facebook AI research)
  - Simple API, easy to persist to disk
"""

import json
import logging
import time
from pathlib import Path
from typing import Optional

import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

logger = logging.getLogger(__name__)

# Module-level singletons (initialized once, reused)
_embedding_model: Optional[SentenceTransformer] = None
_faiss_index: Optional[faiss.IndexFlatIP] = None  # Inner Product (cosine after normalization)
_metadata_store: list[dict] = []  # Parallel list: metadata_store[i] corresponds to vector i in the index
_document_texts: list[str] = []   # Parallel list: full chunk texts for retrieval

# File names for persistence
INDEX_FILE = "faiss_index.bin"
METADATA_FILE = "metadata.json"


def get_embedding_model(model_name: str = "all-MiniLM-L6-v2") -> SentenceTransformer:
    """
    Load the sentence-transformers embedding model (singleton).
    Downloads the model on first run (~80 MB for the default model).

    Args:
        model_name: HuggingFace model name for sentence-transformers.

    Returns:
        The loaded SentenceTransformer model.
    """
    global _embedding_model

    if _embedding_model is None:
        logger.info(f"Loading embedding model: {model_name} ...")
        start = time.time()
        _embedding_model = SentenceTransformer(model_name)
        elapsed = time.time() - start
        logger.info(f"Embedding model loaded in {elapsed:.2f}s")

    return _embedding_model


def _get_persist_paths(persist_dir: str) -> tuple[Path, Path]:
    """Get the file paths for the FAISS index and metadata."""
    base = Path(persist_dir).resolve()
    base.mkdir(parents=True, exist_ok=True)
    return base / INDEX_FILE, base / METADATA_FILE


def _load_index_from_disk(persist_dir: str, dimension: int) -> tuple[faiss.IndexFlatIP, list[dict], list[str]]:
    """
    Load a persisted FAISS index and its metadata from disk.
    If no index exists, creates a new empty one.

    Args:
        persist_dir: Directory containing the persisted files.
        dimension:   Embedding dimension (e.g., 384 for all-MiniLM-L6-v2).

    Returns:
        Tuple of (FAISS index, metadata list, texts list).
    """
    index_path, meta_path = _get_persist_paths(persist_dir)

    if index_path.exists() and meta_path.exists():
        logger.info(f"Loading existing FAISS index from {index_path}")
        index = faiss.read_index(str(index_path))
        with open(meta_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        metadata = data.get("metadata", [])
        texts = data.get("texts", [])
        logger.info(f"Loaded FAISS index with {index.ntotal} vectors")
        return index, metadata, texts
    else:
        logger.info("No existing index found — creating new empty FAISS index")
        index = faiss.IndexFlatIP(dimension)  # Inner product for cosine similarity
        return index, [], []


def _save_index_to_disk(
    index: faiss.IndexFlatIP,
    metadata: list[dict],
    texts: list[str],
    persist_dir: str,
) -> None:
    """Persist the FAISS index and metadata to disk."""
    index_path, meta_path = _get_persist_paths(persist_dir)

    faiss.write_index(index, str(index_path))
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump({"metadata": metadata, "texts": texts}, f, ensure_ascii=False)

    logger.info(f"Saved FAISS index ({index.ntotal} vectors) to {index_path}")


def get_vector_store(
    persist_dir: str = "data/vector_store",
    model_name: str = "all-MiniLM-L6-v2",
) -> tuple[faiss.IndexFlatIP, list[dict], list[str]]:
    """
    Get the FAISS index, metadata, and texts (singleton — loaded once).

    Returns:
        Tuple of (FAISS index, metadata list, texts list).
    """
    global _faiss_index, _metadata_store, _document_texts

    if _faiss_index is None:
        model = get_embedding_model(model_name)
        dimension = model.get_sentence_embedding_dimension()
        _faiss_index, _metadata_store, _document_texts = _load_index_from_disk(persist_dir, dimension)

    return _faiss_index, _metadata_store, _document_texts


def embed_texts(texts: list[str], model_name: str = "all-MiniLM-L6-v2") -> np.ndarray:
    """
    Generate embeddings for a batch of texts.
    Used during document ingestion.

    Args:
        texts:      List of text strings to embed.
        model_name: Embedding model to use.

    Returns:
        Numpy array of embedding vectors, L2-normalized for cosine similarity.
    """
    model = get_embedding_model(model_name)
    start = time.time()
    embeddings = model.encode(texts, show_progress_bar=False, convert_to_numpy=True)
    elapsed = time.time() - start

    # L2-normalize so inner product = cosine similarity
    faiss.normalize_L2(embeddings)

    logger.info(f"Embedded {len(texts)} texts in {elapsed:.2f}s")
    return embeddings


def embed_query(query: str, model_name: str = "all-MiniLM-L6-v2") -> np.ndarray:
    """
    Generate an embedding for a single search query.
    Used per-request during retrieval (fast for a single string).

    Args:
        query:      The user's question.
        model_name: Embedding model to use.

    Returns:
        Numpy array with shape (1, dimension), L2-normalized.
    """
    model = get_embedding_model(model_name)
    start = time.time()
    embedding = model.encode([query], convert_to_numpy=True)
    elapsed = time.time() - start

    # L2-normalize for cosine similarity
    faiss.normalize_L2(embedding)

    logger.debug(f"Query embedded in {elapsed*1000:.1f}ms")
    return embedding


def store_chunks(
    chunks: list[dict],
    persist_dir: str = "data/vector_store",
    model_name: str = "all-MiniLM-L6-v2",
    batch_size: int = 100,
) -> int:
    """
    Embed and store document chunks in the FAISS index.
    Skips chunks that already exist (by chunk_id) to support incremental ingestion.

    Args:
        chunks:      List of chunk dicts from the chunking module.
        persist_dir: Directory for FAISS persistence.
        model_name:  Embedding model to use.
        batch_size:  Number of chunks to embed at once.

    Returns:
        Number of new chunks added.
    """
    index, metadata, texts = get_vector_store(persist_dir, model_name)

    # Check which chunks already exist by chunk_id
    existing_ids = {m["chunk_id"] for m in metadata}
    new_chunks = [c for c in chunks if c["chunk_id"] not in existing_ids]

    if not new_chunks:
        logger.info("No new chunks to store — all already exist in vector store")
        return 0

    logger.info(f"Storing {len(new_chunks)} new chunks (skipping {len(existing_ids)} existing)")

    added = 0
    for i in range(0, len(new_chunks), batch_size):
        batch = new_chunks[i : i + batch_size]

        batch_texts = [c["text"] for c in batch]
        batch_metadata = [
            {
                "chunk_id": c["chunk_id"],
                "document": c["document"],
                "page": c.get("page"),
                "file_hash": c.get("file_hash", ""),
            }
            for c in batch
        ]

        # Generate embeddings for this batch
        embeddings = embed_texts(batch_texts, model_name)

        # Add to FAISS index
        index.add(embeddings)

        # Add to parallel metadata and text stores
        metadata.extend(batch_metadata)
        texts.extend(batch_texts)

        added += len(batch)
        logger.info(f"  Stored batch {i // batch_size + 1}: {len(batch)} chunks")

    # Persist to disk
    _save_index_to_disk(index, metadata, texts, persist_dir)

    logger.info(f"Ingestion complete — {added} chunks added, total in store: {index.ntotal}")
    return added


def search_vectors(
    query_embedding: np.ndarray,
    top_k: int = 5,
    persist_dir: str = "data/vector_store",
    model_name: str = "all-MiniLM-L6-v2",
) -> list[dict]:
    """
    Search the FAISS index for the most similar vectors.

    Args:
        query_embedding: The query embedding (shape: 1 x dimension).
        top_k:           Number of results to return.
        persist_dir:     FAISS persistence directory.
        model_name:      Embedding model name.

    Returns:
        List of result dicts with chunk_id, document, page, text, score.
    """
    index, metadata, texts = get_vector_store(persist_dir, model_name)

    if index.ntotal == 0:
        logger.info("Vector store is empty — no documents to search")
        return []

    # Search — top_k can't exceed the number of vectors
    actual_k = min(top_k, index.ntotal)
    scores, indices = index.search(query_embedding, actual_k)

    results: list[dict] = []
    for score, idx in zip(scores[0], indices[0]):
        if idx < 0:
            continue  # FAISS returns -1 for missing results

        meta = metadata[idx] if idx < len(metadata) else {}
        text = texts[idx] if idx < len(texts) else ""

        results.append({
            "chunk_id": meta.get("chunk_id", f"unknown_{idx}"),
            "document": meta.get("document", "unknown"),
            "page": meta.get("page"),
            "text": text,
            "score": float(score),
        })

    return results


def get_vector_store_stats(persist_dir: str = "data/vector_store") -> dict:
    """
    Get statistics about the current vector store.
    Used by the status endpoint.

    Returns:
        Dict with count and availability info.
    """
    try:
        index, metadata, _ = get_vector_store(persist_dir)
        return {
            "available": True,
            "document_count": index.ntotal,
        }
    except Exception as e:
        logger.error(f"Vector store error: {e}")
        return {
            "available": False,
            "document_count": 0,
            "error": str(e),
        }


def reset_singletons():
    """Reset module-level singletons. Used in testing."""
    global _embedding_model, _faiss_index, _metadata_store, _document_texts
    _embedding_model = None
    _faiss_index = None
    _metadata_store = []
    _document_texts = []
