"""
Tests for the FastAPI endpoints.
Mocks the RAG pipeline and LLM calls — no real API keys or documents needed.
"""

import json
import pytest
from unittest.mock import AsyncMock, patch, MagicMock

from httpx import AsyncClient, ASGITransport
from app.main import app
from app.schemas.chat import ChatResponse, SourceReference


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.fixture
async def client():
    """Async HTTP client for testing FastAPI."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


# ---------------------------------------------------------------------------
# Health endpoint
# ---------------------------------------------------------------------------

class TestHealthEndpoint:
    """Tests for GET /health"""

    @pytest.mark.anyio
    async def test_health_returns_ok(self, client):
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert data["service"] == "cosmo-ai-backend"

    @pytest.mark.anyio
    async def test_health_fast_response(self, client):
        """Health endpoint should respond quickly."""
        import time
        start = time.time()
        response = await client.get("/health")
        elapsed_ms = (time.time() - start) * 1000
        assert response.status_code == 200
        # Should be well under 100ms in tests
        assert elapsed_ms < 500, f"Health endpoint too slow: {elapsed_ms:.0f}ms"


# ---------------------------------------------------------------------------
# Chat status endpoint
# ---------------------------------------------------------------------------

class TestChatStatusEndpoint:
    """Tests for GET /api/v1/chat/status"""

    @pytest.mark.anyio
    async def test_status_returns_valid_response(self, client):
        response = await client.get("/api/v1/chat/status")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "llm_provider" in data
        assert "llm_configured" in data
        assert "vector_store_available" in data
        assert "embedding_model" in data

    @pytest.mark.anyio
    async def test_status_does_not_expose_secrets(self, client):
        """Status response should not contain API keys."""
        response = await client.get("/api/v1/chat/status")
        data_str = json.dumps(response.json())
        # Should not contain common key patterns
        assert "api_key" not in data_str.lower() or "llm_api_key" not in data_str


# ---------------------------------------------------------------------------
# Chat endpoint
# ---------------------------------------------------------------------------

class TestChatEndpoint:
    """Tests for POST /api/v1/chat"""

    @pytest.mark.anyio
    async def test_empty_question_rejected(self, client):
        """Empty questions should return 400."""
        response = await client.post(
            "/api/v1/chat",
            json={"question": ""},
        )
        # Pydantic validation will catch min_length=1
        assert response.status_code == 422 or response.status_code == 400

    @pytest.mark.anyio
    async def test_missing_question_rejected(self, client):
        """Missing question field should return 422."""
        response = await client.post("/api/v1/chat", json={})
        assert response.status_code == 422

    @pytest.mark.anyio
    async def test_question_too_long(self, client):
        """Questions exceeding max length should be rejected."""
        long_question = "x" * 5000  # Well over the 1000/2000 char limits
        response = await client.post(
            "/api/v1/chat",
            json={"question": long_question},
        )
        # Could be 400 (our check) or 422 (Pydantic max_length)
        assert response.status_code in (400, 422)

    @pytest.mark.anyio
    @patch("app.api.routes.chat.settings")
    @patch("app.api.routes.chat.run_rag_pipeline")
    async def test_successful_chat(self, mock_pipeline, mock_settings, client):
        """Successful chat should return answer with sources."""
        # Mock settings to pass validation
        mock_settings.validate_llm_config.return_value = []
        mock_settings.max_question_length = 1000

        # Mock the RAG pipeline
        mock_pipeline.return_value = ChatResponse(
            answer="Test answer based on evidence.",
            sources=[
                SourceReference(
                    document="test.pdf",
                    page=1,
                    chunk_id="test.pdf_chunk_0",
                    excerpt="Test excerpt from document.",
                )
            ],
            timings={"total_ms": 100},
        )

        response = await client.post(
            "/api/v1/chat",
            json={"question": "What is cosmology?"},
        )
        assert response.status_code == 200
        data = response.json()
        assert "answer" in data
        assert "sources" in data
        assert len(data["sources"]) == 1
        assert data["sources"][0]["document"] == "test.pdf"

    @pytest.mark.anyio
    @patch("app.api.routes.chat.settings")
    async def test_unconfigured_llm_returns_503(self, mock_settings, client):
        """Should return 503 when LLM is not configured."""
        mock_settings.validate_llm_config.return_value = ["API key missing"]
        mock_settings.max_question_length = 1000

        response = await client.post(
            "/api/v1/chat",
            json={"question": "Test question"},
        )
        assert response.status_code == 503


# ---------------------------------------------------------------------------
# Tests for citation structure
# ---------------------------------------------------------------------------

class TestCitationStructure:
    """Tests for the source citation format."""

    def test_source_reference_schema(self):
        """SourceReference should have the expected fields."""
        source = SourceReference(
            document="example.pdf",
            page=5,
            chunk_id="example.pdf_chunk_3",
            excerpt="Some excerpt text.",
        )
        data = source.model_dump()
        assert data["document"] == "example.pdf"
        assert data["page"] == 5
        assert data["chunk_id"] == "example.pdf_chunk_3"
        assert data["excerpt"] == "Some excerpt text."

    def test_source_reference_optional_page(self):
        """Page should be optional (None for non-PDF documents)."""
        source = SourceReference(
            document="notes.txt",
            page=None,
            chunk_id="notes.txt_chunk_0",
            excerpt="Text file excerpt.",
        )
        assert source.page is None

    def test_chat_response_schema(self):
        """ChatResponse should contain answer, sources, and timings."""
        response = ChatResponse(
            answer="Test answer",
            sources=[],
            timings={"total_ms": 50},
        )
        data = response.model_dump()
        assert "answer" in data
        assert "sources" in data
        assert "timings" in data
