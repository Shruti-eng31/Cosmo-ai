"""
Cosmo AI — Document Ingestion Script
======================================
Run this script whenever you add, update, or remove documents
in the data/documents/ directory.

Usage (from the backend/ directory):
  python -m scripts.ingest_documents

What it does:
  1. Scans data/documents/ for PDF, TXT, and MD files.
  2. Loads and extracts text from each file.
  3. Splits text into overlapping chunks with metadata.
  4. Computes embeddings using the local embedding model.
  5. Stores vectors in FAISS vector database (incremental — skips unchanged chunks).

This script ONLY processes local files. It does NOT download,
scrape, or fetch any external data.
"""

import logging
import sys
import time
from pathlib import Path

# Ensure the backend directory is on the Python path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.core.config import settings
from app.rag.ingestion import load_all_documents
from app.rag.chunking import chunk_all_documents
from app.rag.embeddings import store_chunks

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)


def main():
    """Run the document ingestion pipeline."""
    logger.info("=" * 60)
    logger.info("Cosmo AI — Document Ingestion")
    logger.info("=" * 60)

    docs_dir = settings.documents_path
    logger.info(f"Documents directory: {docs_dir}")
    logger.info(f"Vector store:        {settings.vector_store_path}")
    logger.info(f"Embedding model:     {settings.embedding_model}")
    logger.info(f"Chunk size:          {settings.chunk_size} chars")
    logger.info(f"Chunk overlap:       {settings.chunk_overlap} chars")
    logger.info("")

    # Step 1: Load documents
    logger.info("Step 1/3: Loading documents...")
    start = time.time()
    documents = load_all_documents(docs_dir)

    if not documents:
        logger.warning(
            f"\n  No supported documents found in {docs_dir}\n"
            f"  Place your PDF, TXT, or MD files there and run this script again.\n"
            f"  Supported extensions: .pdf, .txt, .md"
        )
        return

    load_time = time.time() - start
    logger.info(f"  Loaded {len(documents)} documents in {load_time:.2f}s")

    # Step 2: Chunk documents
    logger.info("\nStep 2/3: Chunking documents...")
    start = time.time()
    chunks = chunk_all_documents(
        documents,
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap,
    )
    chunk_time = time.time() - start
    logger.info(f"  Created {len(chunks)} chunks in {chunk_time:.2f}s")

    # Step 3: Embed and store
    logger.info("\nStep 3/3: Embedding and storing in vector database...")
    start = time.time()
    added = store_chunks(
        chunks,
        persist_dir=str(settings.vector_store_path),
        model_name=settings.embedding_model,
    )
    embed_time = time.time() - start
    logger.info(f"  Stored {added} new chunks in {embed_time:.2f}s")

    # Summary
    logger.info("")
    logger.info("=" * 60)
    logger.info("Ingestion Summary")
    logger.info("=" * 60)
    logger.info(f"  Documents processed:  {len(documents)}")
    logger.info(f"  Total chunks:         {len(chunks)}")
    logger.info(f"  New chunks added:     {added}")
    logger.info(f"  Skipped (existing):   {len(chunks) - added}")
    logger.info(f"  Loading time:         {load_time:.2f}s")
    logger.info(f"  Chunking time:        {chunk_time:.2f}s")
    logger.info(f"  Embedding time:       {embed_time:.2f}s")
    logger.info(f"  Total time:           {load_time + chunk_time + embed_time:.2f}s")
    logger.info("")
    logger.info("Done! You can now start the server and ask questions.")


if __name__ == "__main__":
    main()
