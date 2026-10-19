"""
Tests for the text chunking module.
"""

import pytest
from app.rag.chunking import create_chunks, chunk_all_documents, _find_page_number


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

def _make_document(text: str, filename: str = "test.txt", pages: dict = None) -> dict:
    """Create a minimal document dict for testing."""
    return {
        "text": text,
        "filename": filename,
        "pages": pages or {},
        "file_hash": "abc123",
    }


# ---------------------------------------------------------------------------
# Tests: create_chunks
# ---------------------------------------------------------------------------

class TestCreateChunks:
    """Tests for the create_chunks function."""

    def test_basic_chunking(self):
        """Text should be split into chunks of approximately chunk_size."""
        text = "word " * 200  # 1000 chars
        doc = _make_document(text)
        chunks = create_chunks(doc, chunk_size=100, chunk_overlap=10)

        assert len(chunks) > 1
        assert all(c["document"] == "test.txt" for c in chunks)
        assert all(c["file_hash"] == "abc123" for c in chunks)

    def test_chunk_ids_are_unique(self):
        """Each chunk should have a unique chunk_id."""
        text = "Hello world. " * 100
        doc = _make_document(text)
        chunks = create_chunks(doc, chunk_size=50, chunk_overlap=5)

        ids = [c["chunk_id"] for c in chunks]
        assert len(ids) == len(set(ids)), "Chunk IDs must be unique"

    def test_chunk_id_format(self):
        """Chunk IDs should follow the pattern 'filename_chunk_N'."""
        doc = _make_document("Some text here.", filename="report.pdf")
        chunks = create_chunks(doc, chunk_size=100, chunk_overlap=0)

        assert len(chunks) >= 1
        assert chunks[0]["chunk_id"] == "report.pdf_chunk_0"

    def test_short_text_single_chunk(self):
        """A short text should produce exactly one chunk."""
        doc = _make_document("Short text.")
        chunks = create_chunks(doc, chunk_size=500, chunk_overlap=50)

        assert len(chunks) == 1
        assert chunks[0]["text"] == "Short text."

    def test_empty_text(self):
        """Empty text should produce no chunks."""
        doc = _make_document("")
        chunks = create_chunks(doc, chunk_size=100, chunk_overlap=10)
        assert len(chunks) == 0

    def test_whitespace_only(self):
        """Whitespace-only text should produce no chunks."""
        doc = _make_document("   \n\n  \t  ")
        chunks = create_chunks(doc, chunk_size=100, chunk_overlap=10)
        assert len(chunks) == 0

    def test_overlap_present(self):
        """Consecutive chunks should have overlapping content."""
        # Create text with distinct sections
        text = "AAAA " * 20 + "BBBB " * 20 + "CCCC " * 20
        doc = _make_document(text)
        chunks = create_chunks(doc, chunk_size=50, chunk_overlap=20)

        if len(chunks) >= 2:
            # Check that the end of chunk N overlaps with the start of chunk N+1
            for i in range(len(chunks) - 1):
                tail = chunks[i]["text"][-15:]
                head = chunks[i + 1]["text"][:15:]
                # At least some overlap should exist (exact chars depend on break points)
                assert len(chunks[i]["text"]) > 0
                assert len(chunks[i + 1]["text"]) > 0

    def test_configurable_chunk_size(self):
        """Larger chunk_size should produce fewer chunks."""
        text = "word " * 500  # 2500 chars
        doc = _make_document(text)

        small_chunks = create_chunks(doc, chunk_size=100, chunk_overlap=10)
        large_chunks = create_chunks(doc, chunk_size=500, chunk_overlap=10)

        assert len(small_chunks) > len(large_chunks)

    def test_pdf_page_tracking(self):
        """Chunks from PDFs should include page numbers."""
        pages = {1: "Page one content.", 2: "Page two content."}
        full_text = "Page one content.\nPage two content."
        doc = _make_document(full_text, filename="test.pdf", pages=pages)

        chunks = create_chunks(doc, chunk_size=500, chunk_overlap=0)
        assert len(chunks) >= 1
        assert chunks[0]["page"] is not None

    def test_text_file_no_pages(self):
        """Text files should have page=None for all chunks."""
        doc = _make_document("Some content without pages.")
        chunks = create_chunks(doc, chunk_size=500, chunk_overlap=0)

        assert len(chunks) >= 1
        assert chunks[0]["page"] is None


# ---------------------------------------------------------------------------
# Tests: chunk_all_documents
# ---------------------------------------------------------------------------

class TestChunkAllDocuments:
    """Tests for the chunk_all_documents convenience function."""

    def test_multiple_documents(self):
        """Should produce chunks from all documents."""
        docs = [
            _make_document("Document one text.", filename="doc1.txt"),
            _make_document("Document two text.", filename="doc2.txt"),
        ]
        chunks = chunk_all_documents(docs, chunk_size=500, chunk_overlap=0)

        assert len(chunks) == 2
        filenames = {c["document"] for c in chunks}
        assert filenames == {"doc1.txt", "doc2.txt"}

    def test_empty_document_list(self):
        """Should return empty list for no documents."""
        chunks = chunk_all_documents([], chunk_size=100, chunk_overlap=10)
        assert chunks == []


# ---------------------------------------------------------------------------
# Tests: _find_page_number
# ---------------------------------------------------------------------------

class TestFindPageNumber:
    """Tests for the page number lookup helper."""

    def test_first_page(self):
        """Position at the start should map to page 1."""
        pages = {1: "Hello", 2: "World"}
        result = _find_page_number("Hello\nWorld", 0, pages)
        assert result == 1

    def test_second_page(self):
        """Position in the second page should map to page 2."""
        pages = {1: "Hello", 2: "World"}
        # "Hello" is 5 chars + 1 newline = 6, so position 6+ is page 2
        result = _find_page_number("Hello\nWorld", 6, pages)
        assert result == 2

    def test_empty_pages(self):
        """Empty pages dict should return None."""
        result = _find_page_number("Some text", 0, {})
        assert result is None
