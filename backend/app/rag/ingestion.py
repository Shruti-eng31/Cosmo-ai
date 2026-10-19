"""
Cosmo AI — Document Ingestion
==============================
Loads documents from the local filesystem.
Supports PDF, TXT, and Markdown (.md) files.

Each loaded document is returned as a dict with:
  - "text": the extracted full text
  - "filename": original filename
  - "pages": dict mapping page number → text (for PDFs)
  - "file_hash": SHA-256 hash of the file contents (for change detection)

This module does NOT fetch external data. It only reads files
from the configured documents directory on disk.
"""

import hashlib
import logging
from pathlib import Path
from typing import Optional

from PyPDF2 import PdfReader

logger = logging.getLogger(__name__)

# Supported file extensions
SUPPORTED_EXTENSIONS = {".pdf", ".txt", ".md"}


def compute_file_hash(file_path: Path) -> str:
    """
    Compute a SHA-256 hash of the file contents.
    Used to detect whether a file has changed since last ingestion.
    """
    hasher = hashlib.sha256()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            hasher.update(chunk)
    return hasher.hexdigest()


def load_pdf(file_path: Path) -> dict:
    """
    Extract text from a PDF file, preserving per-page information.

    Returns:
        dict with keys: text, filename, pages, file_hash
    """
    reader = PdfReader(str(file_path))
    pages: dict[int, str] = {}
    all_text_parts: list[str] = []

    for i, page in enumerate(reader.pages):
        page_text = page.extract_text() or ""
        page_number = i + 1  # 1-indexed for user-friendliness
        pages[page_number] = page_text
        all_text_parts.append(page_text)

    return {
        "text": "\n".join(all_text_parts),
        "filename": file_path.name,
        "pages": pages,
        "file_hash": compute_file_hash(file_path),
    }


def load_text_file(file_path: Path) -> dict:
    """
    Load a plain text or markdown file.

    Returns:
        dict with keys: text, filename, pages (empty), file_hash
    """
    text = file_path.read_text(encoding="utf-8", errors="replace")
    return {
        "text": text,
        "filename": file_path.name,
        "pages": {},  # no page concept for text files
        "file_hash": compute_file_hash(file_path),
    }


def load_document(file_path: Path) -> Optional[dict]:
    """
    Load a single document based on its file extension.

    Returns:
        A document dict, or None if the format is unsupported.
    """
    ext = file_path.suffix.lower()

    if ext == ".pdf":
        return load_pdf(file_path)
    elif ext in {".txt", ".md"}:
        return load_text_file(file_path)
    else:
        logger.warning(f"Skipping unsupported file type: {file_path.name}")
        return None


def load_all_documents(documents_dir: Path) -> list[dict]:
    """
    Scan a directory and load all supported documents.

    Args:
        documents_dir: Path to the directory containing documents.

    Returns:
        List of document dicts. Empty list if no documents are found.
    """
    if not documents_dir.exists():
        logger.warning(f"Documents directory does not exist: {documents_dir}")
        return []

    documents: list[dict] = []
    supported_files = [
        f for f in sorted(documents_dir.iterdir())
        if f.is_file() and f.suffix.lower() in SUPPORTED_EXTENSIONS
    ]

    if not supported_files:
        logger.info(f"No supported documents found in {documents_dir}")
        return []

    for file_path in supported_files:
        try:
            doc = load_document(file_path)
            if doc and doc["text"].strip():
                documents.append(doc)
                logger.info(
                    f"Loaded: {file_path.name} "
                    f"({len(doc['text'])} chars, {len(doc.get('pages', {}))} pages)"
                )
            elif doc:
                logger.warning(f"Skipping empty document: {file_path.name}")
        except Exception as e:
            logger.error(f"Failed to load {file_path.name}: {e}")

    logger.info(f"Total documents loaded: {len(documents)}")
    return documents
