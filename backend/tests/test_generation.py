"""
Tests for the generation module.
Mocks all external LLM providers — no API keys needed.
"""

import pytest
from unittest.mock import patch, MagicMock, AsyncMock

from app.rag.generation import build_prompt, SYSTEM_PROMPT


# ---------------------------------------------------------------------------
# Tests: build_prompt
# ---------------------------------------------------------------------------

class TestBuildPrompt:
    """Tests for the prompt builder."""

    def test_prompt_with_evidence(self):
        """Prompt should include question and evidence."""
        chunks = [
            {"text": "Evidence text 1", "document": "doc1.pdf", "page": 1},
            {"text": "Evidence text 2", "document": "doc2.txt", "page": None},
        ]
        prompt = build_prompt("What is dark matter?", chunks)

        assert "What is dark matter?" in prompt
        assert "Evidence text 1" in prompt
        assert "Evidence text 2" in prompt
        assert "doc1.pdf" in prompt
        assert "Page 1" in prompt

    def test_prompt_without_evidence(self):
        """Prompt should handle empty evidence gracefully."""
        prompt = build_prompt("What is dark energy?", [])

        assert "What is dark energy?" in prompt
        assert "No relevant documents" in prompt

    def test_prompt_does_not_include_system_prompt(self):
        """build_prompt returns user prompt only; system prompt is separate."""
        prompt = build_prompt("Test?", [{"text": "T", "document": "d", "page": 1}])
        # The system prompt is applied separately in generate_*() functions
        assert SYSTEM_PROMPT not in prompt

    def test_system_prompt_content(self):
        """System prompt should instruct grounded answering."""
        assert "ONLY" in SYSTEM_PROMPT
        assert "evidence" in SYSTEM_PROMPT.lower()
        assert "make up" in SYSTEM_PROMPT.lower() or "NOT make up" in SYSTEM_PROMPT

    def test_evidence_numbering(self):
        """Each evidence chunk should be numbered."""
        chunks = [
            {"text": "A", "document": "a.pdf", "page": 1},
            {"text": "B", "document": "b.pdf", "page": 2},
        ]
        prompt = build_prompt("Q?", chunks)
        assert "Evidence 1" in prompt
        assert "Evidence 2" in prompt
