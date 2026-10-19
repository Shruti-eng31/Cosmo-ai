"""
Cosmo AI — Vector Retrieval
=============================
Searches the FAISS vector store for document chunks relevant
to a user's question.

The flow:
  1. Embed the user's question using the same model used during ingestion.
  2. Query FAISS for the top-K most similar chunks.
  3. Return the chunks with metadata (document name, page, excerpt).

Performance notes:
  - The embedding model is loaded once (singleton in embeddings.py).
  - FAISS performs exact nearest neighbor search — very fast for modest indexes.
  - Only top_k results are returned, not the entire collection.
"""

import logging
import time

from app.rag.embeddings import embed_query, search_vectors

logger = logging.getLogger(__name__)


def retrieve_relevant_chunks(
    question: str,
    top_k: int = 5,
    persist_dir: str = "data/vector_store",
    model_name: str = "all-MiniLM-L6-v2",
) -> tuple[list[dict], dict]:
    """
    Find the most relevant document chunks for a question.

    Args:
        question:    The user's question text.
        top_k:       Number of top results to return.
        persist_dir: Path to the FAISS persistence directory.
        model_name:  Embedding model name (must match ingestion model).

    Returns:
        A tuple of:
          - List of result dicts, each with keys:
              chunk_id, document, page, text, score
          - Timing dict with embed_ms and retrieval_ms
    """
    timings: dict = {}

    # Step 1: Embed the question
    t0 = time.time()
    query_embedding = embed_query(question, model_name)
    timings["embed_ms"] = round((time.time() - t0) * 1000, 1)

    # Step 2: Search FAISS
    t1 = time.time()
    chunks = search_vectors(
        query_embedding=query_embedding,
        top_k=top_k,
        persist_dir=persist_dir,
        model_name=model_name,
    )
    timings["retrieval_ms"] = round((time.time() - t1) * 1000, 1)

    logger.info(
        f"Retrieved {len(chunks)} chunks for question "
        f"(embed: {timings['embed_ms']}ms, retrieval: {timings['retrieval_ms']}ms)"
    )
    return chunks, timings


def create_excerpt(text: str, max_length: int = 200) -> str:
    """
    Create a short excerpt from a chunk's text for the API response.
    Truncates at a word boundary and adds ellipsis if needed.
    """
    if len(text) <= max_length:
        return text

    truncated = text[:max_length]
    # Try to break at a word boundary
    last_space = truncated.rfind(" ")
    if last_space > max_length * 0.5:
        truncated = truncated[:last_space]

    return truncated.rstrip() + "…"
