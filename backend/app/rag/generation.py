"""
Cosmo AI — Grounded Generation
================================
Sends retrieved evidence to a configured LLM and generates an answer
that is grounded in the provided document passages.

Supports three providers:
  - Google Gemini  (free tier available)
  - OpenAI         (paid)
  - Ollama         (local, free)

The provider is selected via the LLM_PROVIDER environment variable.

Key design rules:
  - The LLM is instructed to ONLY answer from the provided evidence.
  - If evidence is insufficient, the LLM must say so honestly.
  - Source citations are derived from the retrieved chunks, not hallucinated.
  - Streaming is supported via async generators (SSE-compatible).
  - Prompts are kept concise to minimize latency and token cost.
"""

import asyncio
import logging
import time
from typing import AsyncGenerator, Optional

from app.core.config import settings

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# System prompt: instructs the LLM to answer from evidence only
# ---------------------------------------------------------------------------
SYSTEM_PROMPT = """You are Cosmo AI, a helpful assistant that answers questions about cosmology and space science based ONLY on the provided document evidence.

RULES:
1. Answer ONLY using information from the evidence passages below.
2. If the evidence does not contain enough information to answer, say: "I don't have enough information in the provided documents to answer this question."
3. Be concise and accurate. Cite specific details from the evidence.
4. Do NOT make up facts, statistics, or claims not present in the evidence.
5. If the evidence partially answers the question, provide what you can and note what information is missing.
6. Use clear, educational language suitable for students."""


def build_prompt(question: str, evidence_chunks: list[dict]) -> str:
    """
    Build the user prompt with the question and retrieved evidence.

    Args:
        question:        The user's question.
        evidence_chunks: List of chunk dicts with 'text', 'document', 'page'.

    Returns:
        The formatted prompt string.
    """
    if not evidence_chunks:
        return (
            f"Question: {question}\n\n"
            "No relevant documents were found. "
            "Please inform the user that no documents have been ingested yet, "
            "or that no relevant information was found for this question."
        )

    evidence_parts: list[str] = []
    for i, chunk in enumerate(evidence_chunks, 1):
        source_info = f"[Source: {chunk['document']}"
        if chunk.get("page"):
            source_info += f", Page {chunk['page']}"
        source_info += "]"

        evidence_parts.append(f"Evidence {i} {source_info}:\n{chunk['text']}")

    evidence_text = "\n\n---\n\n".join(evidence_parts)

    return (
        f"Question: {question}\n\n"
        f"Document Evidence:\n\n{evidence_text}\n\n"
        "Please answer the question based on the evidence above."
    )


# ---------------------------------------------------------------------------
# Provider implementations
# ---------------------------------------------------------------------------

async def generate_gemini(
    prompt: str,
    stream: bool = False,
) -> str | AsyncGenerator[str, None]:
    """Generate an answer using Google Gemini API."""
    from google import genai

    client = genai.Client(api_key=settings.gemini_api_key)

    if stream:
        return _stream_gemini(client, prompt)

    # Non-streaming: run in thread pool to avoid blocking the event loop
    def _sync_call():
        response = client.models.generate_content(
            model=settings.gemini_model,
            contents=[
                {"role": "user", "parts": [{"text": SYSTEM_PROMPT + "\n\n" + prompt}]}
            ],
        )
        return response.text or ""

    loop = asyncio.get_event_loop()
    result = await asyncio.wait_for(
        loop.run_in_executor(None, _sync_call),
        timeout=settings.llm_timeout_seconds,
    )
    return result


async def _stream_gemini(client, prompt: str) -> AsyncGenerator[str, None]:
    """Stream tokens from Gemini."""
    loop = asyncio.get_event_loop()

    def _sync_stream():
        return client.models.generate_content_stream(
            model=settings.gemini_model,
            contents=[
                {"role": "user", "parts": [{"text": SYSTEM_PROMPT + "\n\n" + prompt}]}
            ],
        )

    response_stream = await loop.run_in_executor(None, _sync_stream)

    for chunk in response_stream:
        text = chunk.text
        if text:
            yield text


async def generate_openai(
    prompt: str,
    stream: bool = False,
) -> str | AsyncGenerator[str, None]:
    """Generate an answer using OpenAI API."""
    from openai import AsyncOpenAI

    client = AsyncOpenAI(api_key=settings.openai_api_key)

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": prompt},
    ]

    if stream:
        return _stream_openai(client, messages)

    response = await asyncio.wait_for(
        client.chat.completions.create(
            model=settings.openai_model,
            messages=messages,
            temperature=0.3,
        ),
        timeout=settings.llm_timeout_seconds,
    )
    return response.choices[0].message.content or ""


async def _stream_openai(client, messages: list) -> AsyncGenerator[str, None]:
    """Stream tokens from OpenAI."""
    response = await client.chat.completions.create(
        model=settings.openai_model,
        messages=messages,
        temperature=0.3,
        stream=True,
    )
    async for chunk in response:
        if chunk.choices and chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content


async def generate_ollama(
    prompt: str,
    stream: bool = False,
) -> str | AsyncGenerator[str, None]:
    """Generate an answer using local Ollama server."""
    from ollama import AsyncClient

    client = AsyncClient(host=settings.ollama_base_url)

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": prompt},
    ]

    if stream:
        return _stream_ollama(client, messages)

    response = await asyncio.wait_for(
        client.chat(model=settings.ollama_model, messages=messages),
        timeout=settings.llm_timeout_seconds,
    )
    return response.message.content or ""


async def _stream_ollama(client, messages: list) -> AsyncGenerator[str, None]:
    """Stream tokens from Ollama."""
    response = await client.chat(
        model=settings.ollama_model,
        messages=messages,
        stream=True,
    )
    async for chunk in response:
        if chunk.message.content:
            yield chunk.message.content


# ---------------------------------------------------------------------------
# Provider dispatcher
# ---------------------------------------------------------------------------

# Map provider names to their generator functions
_PROVIDERS = {
    "gemini": generate_gemini,
    "openai": generate_openai,
    "ollama": generate_ollama,
}


async def generate_answer(
    question: str,
    evidence_chunks: list[dict],
    stream: bool = False,
) -> tuple[str | AsyncGenerator[str, None], dict]:
    """
    Generate an answer using the configured LLM provider.

    Args:
        question:        The user's question.
        evidence_chunks: Retrieved document chunks.
        stream:          If True, return an async generator of tokens.

    Returns:
        A tuple of:
          - The answer string (or async generator if streaming)
          - Timing dict with generation_ms (only for non-streaming)
    """
    provider = settings.llm_provider
    generate_fn = _PROVIDERS.get(provider)
    timings: dict = {}

    if generate_fn is None:
        raise ValueError(
            f"Unknown LLM provider: '{provider}'. "
            f"Supported: {list(_PROVIDERS.keys())}"
        )

    # Build the prompt from evidence
    prompt = build_prompt(question, evidence_chunks)
    logger.info(f"Generating answer with provider='{provider}', stream={stream}")

    if stream:
        # For streaming, return the generator directly — timing is per-token
        generator = await generate_fn(prompt, stream=True)
        return generator, timings

    # Non-streaming: measure total generation time
    t0 = time.time()
    try:
        answer = await generate_fn(prompt, stream=False)
        timings["generation_ms"] = round((time.time() - t0) * 1000, 1)
        logger.info(f"Answer generated in {timings['generation_ms']}ms")
        return answer, timings
    except asyncio.TimeoutError:
        raise TimeoutError(
            f"LLM generation timed out after {settings.llm_timeout_seconds}s. "
            "Try a faster model or increase LLM_TIMEOUT_SECONDS."
        )
    except Exception as e:
        logger.error(f"LLM generation failed ({provider}): {e}")
        raise
