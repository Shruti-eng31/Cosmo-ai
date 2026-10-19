"""
Cosmo AI — Chat API Routes
============================
Endpoints for the RAG chat system:

  GET  /api/v1/chat/status  — Check backend configuration and vector store
  POST /api/v1/chat         — Ask a question (with optional streaming)

The POST endpoint supports two modes:
  1. Normal (default): Returns a JSON response with the answer and sources.
  2. Streaming (stream=true): Returns Server-Sent Events (SSE) with tokens.

SSE event format for streaming:
  event: token
  data: {"token": "partial text"}

  event: sources
  data: {"sources": [...], "timings": {...}}

  event: done
  data: {}

  event: error
  data: {"error": "message"}
"""

import asyncio
import json
import logging
import time

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from sse_starlette.sse import EventSourceResponse

from app.core.config import settings
from app.rag.embeddings import get_vector_store_stats
from app.rag.pipeline import run_rag_pipeline, run_rag_pipeline_streaming
from app.schemas.chat import (
    ChatRequest,
    ChatResponse,
    ChatStatusResponse,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/chat", tags=["Chat"])


# ---------------------------------------------------------------------------
# GET /api/v1/chat/status
# ---------------------------------------------------------------------------

@router.get(
    "/status",
    response_model=ChatStatusResponse,
    summary="Check backend status",
    description="Reports configuration validity and vector store availability.",
)
async def chat_status() -> ChatStatusResponse:
    """
    Check whether the backend is properly configured.
    Does NOT expose API keys or secrets.
    """
    errors = settings.validate_llm_config()
    store_stats = get_vector_store_stats(str(settings.vector_store_path))

    llm_configured = len(errors) == 0
    store_available = store_stats.get("available", False)

    if llm_configured and store_available:
        status = "ready"
    elif llm_configured or store_available:
        status = "degraded"
    else:
        status = "error"

    return ChatStatusResponse(
        status=status,
        llm_provider=settings.llm_provider,
        llm_configured=llm_configured,
        vector_store_available=store_available,
        documents_indexed=store_stats.get("document_count", 0),
        embedding_model=settings.embedding_model,
        errors=errors,
    )


# ---------------------------------------------------------------------------
# POST /api/v1/chat
# ---------------------------------------------------------------------------

@router.post(
    "",
    response_model=ChatResponse,
    summary="Ask a question",
    description="Send a question and receive a grounded answer with source citations.",
    responses={
        200: {"description": "Answer with sources"},
        400: {"description": "Invalid request (empty question, too long)"},
        503: {"description": "LLM provider unavailable"},
    },
)
async def chat(request: ChatRequest, http_request: Request) -> ChatResponse | EventSourceResponse:
    """
    Main chat endpoint.

    - Validates the question.
    - Retrieves relevant document chunks.
    - Generates a grounded answer.
    - Returns the answer with source citations.

    If `stream=true`, returns Server-Sent Events instead of JSON.
    """
    question = request.question.strip()

    # --- Validation -----------------------------------------------------------
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    if len(question) > settings.max_question_length:
        raise HTTPException(
            status_code=400,
            detail=f"Question too long ({len(question)} chars). "
            f"Maximum: {settings.max_question_length} chars.",
        )

    # Check LLM configuration before making expensive calls
    config_errors = settings.validate_llm_config()
    if config_errors:
        raise HTTPException(
            status_code=503,
            detail=f"LLM provider not configured: {'; '.join(config_errors)}",
        )

    # --- Streaming mode -------------------------------------------------------
    if request.stream:
        return await _handle_streaming(question, http_request)

    # --- Normal mode ----------------------------------------------------------
    return await _handle_normal(question)


async def _handle_normal(question: str) -> ChatResponse:
    """Handle a non-streaming chat request."""
    try:
        response = await run_rag_pipeline(question)
        return response
    except TimeoutError as e:
        raise HTTPException(status_code=504, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Chat error: {e}", exc_info=True)
        raise HTTPException(
            status_code=503,
            detail=f"Failed to generate answer: {type(e).__name__}. "
            "Check server logs for details.",
        )


async def _handle_streaming(question: str, http_request: Request) -> EventSourceResponse:
    """Handle a streaming chat request via Server-Sent Events."""

    async def event_generator():
        try:
            token_gen, sources, timings = await run_rag_pipeline_streaming(question)

            # Stream answer tokens
            first_token_time = None
            async for token in token_gen:
                # Check if client disconnected
                if await http_request.is_disconnected():
                    logger.info("Client disconnected during streaming")
                    return

                if first_token_time is None:
                    first_token_time = time.time()

                yield {
                    "event": "token",
                    "data": json.dumps({"token": token}),
                }

            # Send sources and timings as a final event
            sources_data = [s.model_dump() for s in sources]
            yield {
                "event": "sources",
                "data": json.dumps({"sources": sources_data, "timings": timings}),
            }

            # Signal completion
            yield {
                "event": "done",
                "data": json.dumps({}),
            }

        except TimeoutError as e:
            yield {
                "event": "error",
                "data": json.dumps({"error": str(e)}),
            }
        except Exception as e:
            logger.error(f"Streaming error: {e}", exc_info=True)
            yield {
                "event": "error",
                "data": json.dumps({"error": f"Generation failed: {type(e).__name__}"}),
            }

    return EventSourceResponse(event_generator())
