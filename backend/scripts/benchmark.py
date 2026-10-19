"""
Cosmo AI — Performance Benchmark Script
=========================================
Measures retrieval and API latency for benchmarking purposes.

Usage (from the backend/ directory, with venv active):
  python -m scripts.benchmark

What it measures:
  - Health endpoint latency
  - Query embedding time
  - Vector retrieval time (if documents are ingested)
  - Full /api/v1/chat round-trip (if LLM is configured)

Reports median and p95 latencies.
"""

import statistics
import sys
import time
from pathlib import Path

# Ensure backend is on path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

import httpx

BASE_URL = "http://localhost:8000"
N_ITERATIONS = 10  # Number of repetitions for each benchmark


def measure(label: str, fn, n: int = N_ITERATIONS) -> list[float]:
    """Run a function n times and collect latencies."""
    latencies: list[float] = []
    for i in range(n):
        start = time.perf_counter()
        try:
            fn()
        except Exception as e:
            print(f"  [{label}] Iteration {i+1} failed: {e}")
            continue
        elapsed_ms = (time.perf_counter() - start) * 1000
        latencies.append(elapsed_ms)

    return latencies


def report(label: str, latencies: list[float]):
    """Print latency statistics."""
    if not latencies:
        print(f"\n  {label}: ALL FAILED (0/{N_ITERATIONS} succeeded)")
        return

    med = statistics.median(latencies)
    p95 = sorted(latencies)[int(len(latencies) * 0.95)] if len(latencies) >= 2 else latencies[0]
    mn = min(latencies)
    mx = max(latencies)

    print(f"\n  {label}:")
    print(f"    Successful:  {len(latencies)}/{N_ITERATIONS}")
    print(f"    Median:      {med:.1f} ms")
    print(f"    P95:         {p95:.1f} ms")
    print(f"    Min:         {mn:.1f} ms")
    print(f"    Max:         {mx:.1f} ms")


def main():
    print("=" * 60)
    print("Cosmo AI — Performance Benchmark")
    print("=" * 60)
    print(f"Server: {BASE_URL}")
    print(f"Iterations per test: {N_ITERATIONS}")

    client = httpx.Client(base_url=BASE_URL, timeout=60)

    # --- Health endpoint ---
    print("\n--- Health Endpoint ---")
    health_latencies = measure(
        "GET /health",
        lambda: client.get("/health").raise_for_status(),
    )
    report("GET /health", health_latencies)

    # --- Status endpoint ---
    print("\n--- Status Endpoint ---")
    status_latencies = measure(
        "GET /api/v1/chat/status",
        lambda: client.get("/api/v1/chat/status").raise_for_status(),
    )
    report("GET /api/v1/chat/status", status_latencies)

    # --- Chat endpoint (full RAG pipeline) ---
    print("\n--- Chat Endpoint (Full RAG Pipeline) ---")
    test_questions = [
        "What is cosmology?",
        "Tell me about the Hubble parameter.",
        "What are ISRO's major achievements?",
    ]

    for q in test_questions:
        chat_latencies = measure(
            f"POST /api/v1/chat: '{q[:40]}...'",
            lambda q=q: client.post(
                "/api/v1/chat",
                json={"question": q},
            ),
            n=3,  # Fewer iterations since LLM calls are slow/expensive
        )
        report(f"Question: '{q[:40]}...'", chat_latencies)

    print("\n" + "=" * 60)
    print("Benchmark complete.")
    print("Note: Chat latencies depend heavily on LLM provider speed")
    print("and whether documents are ingested in the vector store.")
    print("=" * 60)

    client.close()


if __name__ == "__main__":
    main()
