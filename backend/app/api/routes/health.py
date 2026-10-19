"""
Cosmo AI — Health Check Route
===============================
Simple endpoint to verify the backend is running.
Used by monitoring tools, load balancers, and frontend health checks.
"""

from fastapi import APIRouter
from app.schemas.chat import HealthResponse

router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health check",
    description="Returns a simple status to confirm the backend is running.",
)
async def health_check() -> HealthResponse:
    """Always returns {"status": "ok", "service": "cosmo-ai-backend"}."""
    return HealthResponse()
