"""
Cosmo AI — RAG Pipeline
=========================
Orchestrates the full Retrieval-Augmented Generation flow:

  1. Receive user question
  2. Retrieve relevant chunks from the vector store
  3. Pass evidence to the configured LLM
  4. Return grounded answer with source citations

This module ties together retrieval.py and generation.py.
It is the single entry point for the chat API endpoint.
"""

import asyncio
import logging
import time
from typing import AsyncGenerator

from app.core.config import settings
from app.rag.retrieval import retrieve_relevant_chunks, create_excerpt
from app.rag.generation import generate_answer
from app.schemas.chat import ChatResponse, SourceReference

logger = logging.getLogger(__name__)

# Simple semaphore to limit concurrent LLM calls
_generation_semaphore: asyncio.Semaphore | None = None


def _get_semaphore() -> asyncio.Semaphore:
    """Lazy-initialize the concurrency semaphore."""
    global _generation_semaphore
    if _generation_semaphore is None:
        _generation_semaphore = asyncio.Semaphore(settings.max_concurrent_generations)
    return _generation_semaphore


# ---------------------------------------------------------------------------
# Optional answer cache (disabled by default)
# ---------------------------------------------------------------------------
_answer_cache: dict[str, tuple[ChatResponse, float]] = {}


def _normalize_question(question: str) -> str:
    """Normalize a question for cache key purposes."""
    return question.strip().lower()


def _get_cached_answer(question: str) -> ChatResponse | None:
    """Check the answer cache. Returns None if caching is disabled or miss."""
    if not settings.enable_answer_cache:
        return None

    key = _normalize_question(question)
    if key in _answer_cache:
        response, timestamp = _answer_cache[key]
        age = time.time() - timestamp
        if age < settings.answer_cache_ttl_seconds:
            logger.info(f"Cache hit for question (age: {age:.0f}s)")
            return response
        else:
            # Expired
            del _answer_cache[key]

    return None


def _cache_answer(question: str, response: ChatResponse) -> None:
    """Store an answer in the cache if caching is enabled."""
    if not settings.enable_answer_cache:
        return

    key = _normalize_question(question)
    _answer_cache[key] = (response, time.time())


# ---------------------------------------------------------------------------
# Main pipeline
# ---------------------------------------------------------------------------

async def run_rag_pipeline(question: str) -> ChatResponse:
    """
    Execute the full RAG pipeline for a question (non-streaming).

    Steps:
      1. Check cache (if enabled)
      2. Retrieve relevant chunks
      3. Generate grounded answer
      4. Build response with source citations
      5. Cache result (if enabled)

    Args:
        question: The user's question.

    Returns:
        A ChatResponse with the answer, sources, and timing info.
    """
    total_start = time.time()
    timings: dict = {}

    # Step 0: Check cache
    cached = _get_cached_answer(question)
    if cached is not None:
        cached.timings = {"cached": True}
        return cached

    # Step 1: Retrieve relevant chunks
    chunks, retrieval_timings = retrieve_relevant_chunks(
        question=question,
        top_k=settings.retrieval_top_k,
        persist_dir=str(settings.vector_store_path),
        model_name=settings.embedding_model,
    )
    timings.update(retrieval_timings)

    # Step 2: Generate answer (with concurrency limit)
    semaphore = _get_semaphore()
    async with semaphore:
        answer, gen_timings = await generate_answer(
            question=question,
            evidence_chunks=chunks,
            stream=False,
        )
    timings.update(gen_timings)

    # Step 3: Build source references
    sources = [
        SourceReference(
            document=chunk["document"],
            page=chunk.get("page"),
            chunk_id=chunk["chunk_id"],
            excerpt=create_excerpt(chunk["text"]),
        )
        for chunk in chunks
    ]

    # Step 4: Calculate total time
    timings["total_ms"] = round((time.time() - total_start) * 1000, 1)

    response = ChatResponse(
        answer=answer,
        sources=sources,
        timings=timings,
    )

    # Step 5: Cache (if enabled)
    _cache_answer(question, response)

    logger.info(
        f"RAG pipeline complete — "
        f"total: {timings['total_ms']}ms, "
        f"retrieval: {timings.get('retrieval_ms', '?')}ms, "
        f"generation: {timings.get('generation_ms', '?')}ms, "
        f"sources: {len(sources)}"
    )

    return response


async def run_rag_pipeline_streaming(
    question: str,
) -> tuple[AsyncGenerator[str, None], list[SourceReference], dict]:
    """
    Execute the RAG pipeline with streaming generation.

    Returns a tuple of:
      - An async generator yielding answer tokens
      - Source references (available immediately from retrieval)
      - Timing dict (retrieval timings; generation timing is per-token)

    The caller should stream tokens to the client, then send sources
    as a final SSE event.
    """
    timings: dict = {}

    # Step 1: Retrieve relevant chunks
    chunks, retrieval_timings = retrieve_relevant_chunks(
        question=question,
        top_k=settings.retrieval_top_k,
        persist_dir=str(settings.vector_store_path),
        model_name=settings.embedding_model,
    )
    timings.update(retrieval_timings)

    # Step 2: Build source references (available before generation starts)
    sources = [
        SourceReference(
            document=chunk["document"],
            page=chunk.get("page"),
            chunk_id=chunk["chunk_id"],
            excerpt=create_excerpt(chunk["text"]),
        )
        for chunk in chunks
    ]

    # Step 3: Get streaming generator (with concurrency limit)
    semaphore = _get_semaphore()
    await semaphore.acquire()

    try:
        token_generator, gen_timings = await generate_answer(
            question=question,
            evidence_chunks=chunks,
            stream=True,
        )
        timings.update(gen_timings)
    except Exception:
        semaphore.release()
        raise

    # Wrap the generator to release the semaphore when done
    async def _wrapped_generator() -> AsyncGenerator[str, None]:
        try:
            async for token in token_generator:
                yield token
        finally:
            semaphore.release()

    return _wrapped_generator(), sources, timings
