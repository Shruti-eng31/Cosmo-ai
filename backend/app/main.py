"""
Cosmo AI Backend — FastAPI Application
========================================
This is the main entry point for the backend server.

Run with:
  uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

Architecture:
  - FastAPI app with CORS enabled (for Next.js frontend)
  - Routes split into health and chat modules
  - RAG components loaded lazily on first use
  - Configuration from .env via Pydantic Settings
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routes import health, chat

# ---------------------------------------------------------------------------
# Logging setup
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper(), logging.INFO),
    format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Application lifespan (startup / shutdown)
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup:  Pre-warm the embedding model and FAISS vector store.
    Shutdown: Clean up resources.
    """
    logger.info("=" * 60)
    logger.info("Cosmo AI Backend — Starting up")
    logger.info("=" * 60)

    # Log configuration summary (no secrets)
    summary = settings.get_safe_summary()
    for key, value in summary.items():
        logger.info(f"  {key}: {value}")

    # Validate LLM config
    errors = settings.validate_llm_config()
    if errors:
        for err in errors:
            logger.warning(f"  ⚠ {err}")
    else:
        logger.info("  ✓ LLM provider configured")

    # Pre-warm embedding model and vector store (optional, improves first-request latency)
    try:
        from app.rag.embeddings import get_embedding_model, get_vector_store

        logger.info("Pre-warming embedding model...")
        get_embedding_model(settings.embedding_model)

        logger.info("Pre-warming FAISS vector store...")
        get_vector_store(
            persist_dir=str(settings.vector_store_path),
            model_name=settings.embedding_model,
        )
        logger.info("  ✓ Startup complete")
    except Exception as e:
        logger.warning(f"  ⚠ Pre-warming failed (non-fatal): {e}")

    logger.info("=" * 60)

    yield  # Application is running

    # Shutdown
    logger.info("Cosmo AI Backend — Shutting down")


# ---------------------------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Cosmo AI Backend",
    description=(
        "RAG-powered cosmology and space science assistant. "
        "Ask questions about your ISRO documents and get grounded, cited answers."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",       # Swagger UI
    redoc_url="/redoc",     # ReDoc
)

# ---------------------------------------------------------------------------
# CORS middleware (allows the Next.js frontend to call this API)
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",     # Next.js dev server
        "http://127.0.0.1:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Include routers
# ---------------------------------------------------------------------------
app.include_router(health.router)
app.include_router(chat.router)
