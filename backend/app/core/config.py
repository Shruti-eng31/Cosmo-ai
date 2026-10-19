"""
Cosmo AI Backend — Centralized Configuration
=============================================
Loads all settings from environment variables (.env file).
Uses Pydantic Settings for validation and type safety.

Usage:
    from app.core.config import settings
    print(settings.llm_provider)
"""

from pathlib import Path
from functools import lru_cache
from typing import Literal, Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    All application settings, loaded from environment variables.
    Copy .env.example → .env and fill in your values.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",  # ignore unexpected env vars
    )

    # ── LLM Provider ─────────────────────────────────────────────────────
    # Which provider to use: "gemini", "openai", or "ollama"
    llm_provider: Literal["gemini", "openai", "ollama"] = "gemini"

    # Google Gemini
    gemini_api_key: Optional[str] = None
    gemini_model: str = "gemini-2.0-flash"

    # OpenAI
    openai_api_key: Optional[str] = None
    openai_model: str = "gpt-4o-mini"

    # Ollama (local)
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3.2"

    # ── Embedding Model ──────────────────────────────────────────────────
    embedding_model: str = "all-MiniLM-L6-v2"

    # ── RAG Settings ─────────────────────────────────────────────────────
    chunk_size: int = 500
    chunk_overlap: int = 50
    retrieval_top_k: int = 5

    # ── Paths ────────────────────────────────────────────────────────────
    documents_dir: str = "data/documents"
    vector_store_dir: str = "data/vector_store"

    # ── Server ───────────────────────────────────────────────────────────
    host: str = "0.0.0.0"
    port: int = 8000
    log_level: str = "info"

    # ── Performance ──────────────────────────────────────────────────────
    llm_timeout_seconds: int = 30
    max_question_length: int = 1000
    max_concurrent_generations: int = 5
    enable_answer_cache: bool = False
    answer_cache_ttl_seconds: int = 300

    # ── Derived Helpers ──────────────────────────────────────────────────

    @property
    def documents_path(self) -> Path:
        """Absolute path to the documents directory."""
        return Path(self.documents_dir).resolve()

    @property
    def vector_store_path(self) -> Path:
        """Absolute path to the vector store directory."""
        return Path(self.vector_store_dir).resolve()

    def validate_llm_config(self) -> list[str]:
        """
        Check that the selected LLM provider has the required credentials.
        Returns a list of error messages (empty if valid).
        """
        errors: list[str] = []

        if self.llm_provider == "gemini":
            if not self.gemini_api_key or self.gemini_api_key.startswith("replace_"):
                errors.append(
                    "GEMINI_API_KEY is missing or still a placeholder. "
                    "Get a free key at https://aistudio.google.com/app/apikey"
                )

        elif self.llm_provider == "openai":
            if not self.openai_api_key or self.openai_api_key.startswith("replace_"):
                errors.append(
                    "OPENAI_API_KEY is missing or still a placeholder. "
                    "Get a key at https://platform.openai.com/api-keys"
                )

        elif self.llm_provider == "ollama":
            pass  # No API key needed; connectivity checked at runtime.

        return errors

    def get_safe_summary(self) -> dict:
        """
        Return a summary of config for diagnostics WITHOUT exposing secrets.
        """
        return {
            "llm_provider": self.llm_provider,
            "llm_model": {
                "gemini": self.gemini_model,
                "openai": self.openai_model,
                "ollama": self.ollama_model,
            }.get(self.llm_provider, "unknown"),
            "embedding_model": self.embedding_model,
            "chunk_size": self.chunk_size,
            "chunk_overlap": self.chunk_overlap,
            "retrieval_top_k": self.retrieval_top_k,
            "documents_dir": str(self.documents_path),
            "vector_store_dir": str(self.vector_store_path),
            "llm_api_key_set": self._is_key_set(),
        }

    def _is_key_set(self) -> bool:
        """Check if the relevant API key is configured (without revealing it)."""
        if self.llm_provider == "gemini":
            return bool(self.gemini_api_key and not self.gemini_api_key.startswith("replace_"))
        if self.llm_provider == "openai":
            return bool(self.openai_api_key and not self.openai_api_key.startswith("replace_"))
        return True  # Ollama doesn't need a key


@lru_cache()
def get_settings() -> Settings:
    """
    Cached singleton — the Settings object is created once and reused.
    Call this instead of constructing Settings() directly.
    """
    return Settings()


# Convenience alias used throughout the codebase
settings = get_settings()
