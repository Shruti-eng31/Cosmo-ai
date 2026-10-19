"""
Pytest Configuration
====================
Shared fixtures and settings for all tests.
"""

import pytest


@pytest.fixture(autouse=True)
def _reset_settings_cache():
    """
    Reset the cached settings singleton before each test.
    This ensures test isolation when tests modify environment variables.
    """
    from app.core.config import get_settings
    get_settings.cache_clear()
    yield
    get_settings.cache_clear()
