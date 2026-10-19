"""
Cosmo AI — Text Chunking
=========================
Splits document text into overlapping chunks for embedding.

Each chunk preserves metadata:
  - chunk_id:  unique ID like "filename_chunk_3"
  - document:  source filename
  - page:      page number (for PDFs; None for text files)
  - text:      the chunk content
  - file_hash: hash of the source file

Chunk size and overlap are configurable via environment variables.

Why overlapping chunks?
  Overlap ensures that sentences at the boundary of two chunks
  are not lost. If a key sentence spans the split point, both
  neighboring chunks will contain it, improving retrieval recall.
"""

import logging
import re
from typing import Optional

logger = logging.getLogger(__name__)


def create_chunks(
    document: dict,
    chunk_size: int = 500,
    chunk_overlap: int = 50,
) -> list[dict]:
    """
    Split a document's text into overlapping chunks with metadata.

    Args:
        document:      A document dict from the ingestion module.
        chunk_size:    Target number of characters per chunk.
        chunk_overlap: Number of characters overlapping between consecutive chunks.

    Returns:
        List of chunk dicts with keys: chunk_id, document, page, text, file_hash.
    """
    text = document["text"]
    filename = document["filename"]
    file_hash = document.get("file_hash", "")
    pages = document.get("pages", {})

    if not text.strip():
        logger.warning(f"Empty text in document: {filename}")
        return []

    # --- Split text into chunks -----------------------------------------------
    chunks: list[dict] = []
    start = 0
    chunk_index = 0

    while start < len(text):
        end = start + chunk_size

        # Try to break at a sentence boundary (period, newline) for cleaner chunks
        if end < len(text):
            # Look for a natural break point near the end of the chunk
            break_point = _find_break_point(text, start, end)
            if break_point > start:
                end = break_point

        chunk_text = text[start:end].strip()

        if chunk_text:
            # Determine which page this chunk belongs to (for PDFs)
            page_number = _find_page_number(text, start, pages) if pages else None

            chunks.append({
                "chunk_id": f"{filename}_chunk_{chunk_index}",
                "document": filename,
                "page": page_number,
                "text": chunk_text,
                "file_hash": file_hash,
            })
            chunk_index += 1

        # Move forward by (chunk_size - overlap) to create overlap
        start = end - chunk_overlap if end < len(text) else end

        # Safety: ensure we always move forward to avoid infinite loops
        if start <= (end - chunk_size):
            start = end

    logger.info(f"Created {len(chunks)} chunks from {filename}")
    return chunks


def _find_break_point(text: str, start: int, end: int) -> int:
    """
    Find a clean break point (sentence end, paragraph break) near `end`.
    Looks backwards from `end` up to 20% of chunk size to find a good split.

    Returns the position to break at, or `end` if no good break is found.
    """
    search_start = max(start, end - int((end - start) * 0.2))
    segment = text[search_start:end]

    # Prefer paragraph breaks, then sentence ends, then other whitespace
    for pattern in [r"\n\n", r"\.\s", r"\n", r"\s"]:
        matches = list(re.finditer(pattern, segment))
        if matches:
            # Use the last match (closest to desired end)
            return search_start + matches[-1].end()

    return end  # No good break found; split at the hard limit


def _find_page_number(
    full_text: str,
    char_position: int,
    pages: dict[int, str],
) -> Optional[int]:
    """
    Given a character position in the full text, determine which PDF page
    the chunk came from by accumulating page lengths.

    Args:
        full_text:      The concatenated full text.
        char_position:  Character offset of the chunk start.
        pages:          Dict mapping page_number → page_text.

    Returns:
        The 1-indexed page number, or None if it can't be determined.
    """
    cumulative = 0
    for page_num in sorted(pages.keys()):
        page_text = pages[page_num]
        cumulative += len(page_text) + 1  # +1 for the newline joiner
        if char_position < cumulative:
            return page_num
    # If position is beyond all pages, return the last page
    return max(pages.keys()) if pages else None


def chunk_all_documents(
    documents: list[dict],
    chunk_size: int = 500,
    chunk_overlap: int = 50,
) -> list[dict]:
    """
    Chunk a list of documents. Convenience wrapper around create_chunks.

    Args:
        documents:     List of document dicts from ingestion.
        chunk_size:    Characters per chunk.
        chunk_overlap: Overlap between consecutive chunks.

    Returns:
        Flat list of all chunks from all documents.
    """
    all_chunks: list[dict] = []
    for doc in documents:
        chunks = create_chunks(doc, chunk_size, chunk_overlap)
        all_chunks.extend(chunks)

    logger.info(
        f"Total chunks created: {len(all_chunks)} "
        f"from {len(documents)} documents"
    )
    return all_chunks
