"""
Tests for the configuration module.
"""

import os
import pytest
from unittest.mock import patch

from app.core.config import Settings


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------

class TestSettings:
    """Tests for the Settings configuration class."""

    def test_default_values(self):
        """Settings should have sensible defaults."""
        s = Settings(
            _env_file=None,  # Don't load .env during tests
        )
        assert s.llm_provider == "gemini"
        assert s.embedding_model == "all-MiniLM-L6-v2"
        assert s.chunk_size == 500
        assert s.chunk_overlap == 50
        assert s.retrieval_top_k == 5
        assert s.llm_timeout_seconds == 30

    def test_validate_gemini_missing_key(self):
        """Should report error when Gemini key is missing."""
        s = Settings(llm_provider="gemini", gemini_api_key=None, _env_file=None)
        errors = s.validate_llm_config()
        assert len(errors) == 1
        assert "GEMINI_API_KEY" in errors[0]

    def test_validate_gemini_placeholder_key(self):
        """Should report error when Gemini key is still a placeholder."""
        s = Settings(
            llm_provider="gemini",
            gemini_api_key="replace_with_your_gemini_api_key",
            _env_file=None,
        )
        errors = s.validate_llm_config()
        assert len(errors) == 1

    def test_validate_gemini_valid_key(self):
        """Should pass when Gemini key is set."""
        s = Settings(
            llm_provider="gemini",
            gemini_api_key="AIzaSyActualKeyHere",
            _env_file=None,
        )
        errors = s.validate_llm_config()
        assert errors == []

    def test_validate_openai_missing_key(self):
        """Should report error when OpenAI key is missing."""
        s = Settings(llm_provider="openai", openai_api_key=None, _env_file=None)
        errors = s.validate_llm_config()
        assert len(errors) == 1
        assert "OPENAI_API_KEY" in errors[0]

    def test_validate_ollama_no_key_needed(self):
        """Ollama should never report a missing API key."""
        s = Settings(llm_provider="ollama", _env_file=None)
        errors = s.validate_llm_config()
        assert errors == []

    def test_safe_summary_no_secrets(self):
        """get_safe_summary should not contain API keys."""
        s = Settings(
            llm_provider="gemini",
            gemini_api_key="super_secret_key_12345",
            _env_file=None,
        )
        summary = s.get_safe_summary()

        # The summary should NOT contain the actual key
        summary_str = str(summary)
        assert "super_secret_key_12345" not in summary_str

        # But should indicate whether a key is set
        assert "llm_api_key_set" in summary
        assert summary["llm_api_key_set"] is True

    def test_safe_summary_key_not_set(self):
        """get_safe_summary should report key as not set for placeholders."""
        s = Settings(
            llm_provider="gemini",
            gemini_api_key="replace_with_your_gemini_api_key",
            _env_file=None,
        )
        summary = s.get_safe_summary()
        assert summary["llm_api_key_set"] is False

    def test_documents_path_is_absolute(self):
        """documents_path should return an absolute Path."""
        s = Settings(_env_file=None)
        assert s.documents_path.is_absolute()

    def test_vector_store_path_is_absolute(self):
        """vector_store_path should return an absolute Path."""
        s = Settings(_env_file=None)
        assert s.vector_store_path.is_absolute()

    def test_chunk_overlap_smaller_than_size(self):
        """Overlap should be smaller than chunk size (sanity check)."""
        s = Settings(_env_file=None)
        assert s.chunk_overlap < s.chunk_size
