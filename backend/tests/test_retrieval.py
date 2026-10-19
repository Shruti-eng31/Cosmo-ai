"""
Tests for the retrieval module.
Tests excerpt creation (mocks FAISS internals).
"""

import pytest
from app.rag.retrieval import create_excerpt


# ---------------------------------------------------------------------------
# Tests: create_excerpt
# ---------------------------------------------------------------------------

class TestCreateExcerpt:
    """Tests for the excerpt creation utility."""

    def test_short_text_unchanged(self):
        """Text shorter than max_length should be returned as-is."""
        text = "Short text."
        assert create_excerpt(text, max_length=200) == text

    def test_long_text_truncated(self):
        """Text longer than max_length should be truncated with ellipsis."""
        text = "word " * 100  # 500 chars
        excerpt = create_excerpt(text, max_length=50)
        assert len(excerpt) <= 55  # 50 + a few chars for word boundary + ellipsis
        assert excerpt.endswith("…")

    def test_truncation_at_word_boundary(self):
        """Truncation should prefer word boundaries."""
        text = "Hello beautiful world of cosmology and astrophysics research"
        excerpt = create_excerpt(text, max_length=30)
        # Should not cut in the middle of a word
        assert not excerpt.rstrip("…").endswith("cosmo")

    def test_empty_text(self):
        """Empty text should return empty string."""
        assert create_excerpt("", max_length=200) == ""

    def test_exact_length_text(self):
        """Text exactly at max_length should be returned as-is."""
        text = "a" * 200
        assert create_excerpt(text, max_length=200) == text
