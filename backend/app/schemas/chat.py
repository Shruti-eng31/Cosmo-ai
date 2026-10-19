"""
Cosmo AI Backend — Pydantic Schemas for Chat API
=================================================
Defines request and response models for the chat endpoint.
These schemas serve as the contract between the frontend and backend.
"""

from typing import Optional
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """Request body for POST /api/v1/chat"""
    question: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="The user's question about cosmology / ISRO documents.",
        examples=["What do my supplied documents say about the Hubble parameter?"],
    )
    stream: bool = Field(
        default=False,
        description="If true, the response will be streamed via Server-Sent Events.",
    )


class SourceReference(BaseModel):
    """A single source reference from a retrieved document chunk."""
    document: str = Field(
        ...,
        description="Filename of the source document.",
        examples=["isro_annual_report.pdf"],
    )
    page: Optional[int] = Field(
        default=None,
        description="Page number in the PDF (1-indexed), if available.",
    )
    chunk_id: str = Field(
        ...,
        description="Unique identifier for the retrieved chunk.",
    )
    excerpt: str = Field(
        ...,
        description="Short excerpt from the retrieved evidence.",
    )


class ChatResponse(BaseModel):
    """Response body for POST /api/v1/chat"""
    answer: str = Field(
        ...,
        description="The AI-generated answer grounded in retrieved documents.",
    )
    sources: list[SourceReference] = Field(
        default_factory=list,
        description="Source references with document names, pages, and excerpts.",
    )
    timings: Optional[dict] = Field(
        default=None,
        description="Performance timing breakdown (ms) for diagnostics.",
    )


class ChatStatusResponse(BaseModel):
    """Response for GET /api/v1/chat/status"""
    status: str = Field(..., description="Overall status: 'ready', 'degraded', or 'error'.")
    llm_provider: str = Field(..., description="Configured LLM provider name.")
    llm_configured: bool = Field(..., description="Whether the LLM API key / connection is configured.")
    vector_store_available: bool = Field(..., description="Whether the vector store is initialized and accessible.")
    documents_indexed: int = Field(default=0, description="Number of documents currently in the vector store.")
    embedding_model: str = Field(..., description="Name of the embedding model in use.")
    errors: list[str] = Field(default_factory=list, description="List of configuration issues found.")


class HealthResponse(BaseModel):
    """Response for GET /health"""
    status: str = "ok"
    service: str = "cosmo-ai-backend"
