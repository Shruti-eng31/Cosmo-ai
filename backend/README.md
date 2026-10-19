# 🚀 Cosmo AI — Backend

A RAG-powered (Retrieval-Augmented Generation) backend for answering questions about cosmology and space science using your own ISRO documents.

Built with **FastAPI**, **FAISS** (Facebook AI Similarity Search), **sentence-transformers**, and your choice of LLM provider (Gemini, OpenAI, or Ollama).

---

## 📁 Project Structure

```text
backend/
├── app/
│   ├── main.py                 # FastAPI application entry point
│   ├── api/routes/
│   │   ├── health.py           # GET /health
│   │   └── chat.py             # POST /api/v1/chat + GET /api/v1/chat/status
│   ├── core/
│   │   └── config.py           # Centralized configuration (env vars)
│   ├── rag/
│   │   ├── ingestion.py        # Document loading (PDF, TXT, MD)
│   │   ├── chunking.py         # Text splitting with overlap
│   │   ├── embeddings.py       # Embedding model + ChromaDB storage
│   │   ├── retrieval.py        # Vector similarity search
│   │   ├── generation.py       # LLM answer generation (multi-provider)
│   │   └── pipeline.py         # RAG orchestration
│   └── schemas/
│       └── chat.py             # Pydantic request/response models
├── data/
│   ├── documents/              # ← Place your documents here
│   └── vector_store/           # ChromaDB persistent storage (auto-generated)
├── scripts/
│   ├── ingest_documents.py     # Document ingestion script
│   └── benchmark.py            # Performance benchmarking
├── tests/                      # Pytest test suite
├── .env.example                # Environment variable template
├── .gitignore                  # Backend-specific ignores
├── requirements.txt            # Python dependencies
├── pyproject.toml              # Pytest config
└── README.md                   # This file
```

---

## ⚡ Quick Start (Windows PowerShell)

### 1. Create and activate virtual environment

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 2. Install dependencies

```powershell
pip install -r requirements.txt
```

> **Note:** First install downloads the embedding model (~80 MB) and PyTorch. This may take a few minutes.

### 3. Configure environment

```powershell
Copy-Item .env.example .env
```

Open `.env` in your editor and fill in the required values. At minimum:

| Variable | Required? | How to get it |
|----------|-----------|---------------|
| `LLM_PROVIDER` | ✅ Yes | Set to `gemini`, `openai`, or `ollama` |
| `GEMINI_API_KEY` | If using Gemini | Free at [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `OPENAI_API_KEY` | If using OpenAI | Paid at [OpenAI Platform](https://platform.openai.com/api-keys) |
| `OLLAMA_MODEL` | If using Ollama | Install [Ollama](https://ollama.com), then `ollama pull llama3.2` |

### 4. Add your documents

Place your ISRO PDF, TXT, or Markdown files in:

```
backend/data/documents/
```

### 5. Ingest documents

```powershell
python -m scripts.ingest_documents
```

This loads, chunks, embeds, and stores your documents in the local vector database. Re-run whenever you add or update documents.

### 6. Start the server

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The server will be available at `http://localhost:8000`.

### 7. Test it!

```powershell
# Health check
Invoke-RestMethod http://localhost:8000/health

# Check status
Invoke-RestMethod http://localhost:8000/api/v1/chat/status

# Ask a question
Invoke-RestMethod -Method Post -Uri http://localhost:8000/api/v1/chat `
  -ContentType "application/json" `
  -Body '{"question": "What do my documents say about ISRO?"}'
```

Or open the interactive API docs at: **http://localhost:8000/docs**

---

## 🏗️ Architecture

```
User Question
     │
     ▼
┌──────────────┐
│  FastAPI API  │  POST /api/v1/chat
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌─────────────────┐
│   Retrieval   │────▶│  ChromaDB        │
│  (embed query │     │  Vector Store    │
│   + search)   │     │  (persistent)    │
└──────┬───────┘     └─────────────────┘
       │
       ▼
┌──────────────┐
│  Generation   │  Gemini / OpenAI / Ollama
│  (grounded    │
│   answering)  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Response    │  Answer + Source Citations
└──────────────┘
```

### What runs once (at startup)
- Embedding model loading (~1-3s)
- ChromaDB client initialization

### What runs per request
- Query embedding (~10-50ms)
- Vector search (~5-50ms)
- LLM generation (~500ms-5s depending on provider)

---

## 🔌 API Reference

### `GET /health`

Returns `{"status": "ok", "service": "cosmo-ai-backend"}`.

### `GET /api/v1/chat/status`

Reports whether the LLM provider is configured and the vector store is available. Does **not** expose API keys.

### `POST /api/v1/chat`

**Request:**
```json
{
  "question": "What do my documents say about the Hubble parameter?",
  "stream": false
}
```

**Response:**
```json
{
  "answer": "Based on the provided documents...",
  "sources": [
    {
      "document": "isro_report.pdf",
      "page": 12,
      "chunk_id": "isro_report.pdf_chunk_5",
      "excerpt": "The Hubble parameter describes..."
    }
  ],
  "timings": {
    "embed_ms": 15.2,
    "retrieval_ms": 8.4,
    "generation_ms": 1523.7,
    "total_ms": 1550.3
  }
}
```

### Streaming Mode

Set `"stream": true` in the request body. The response will use **Server-Sent Events (SSE)**:

```
event: token
data: {"token": "Based on"}

event: token
data: {"token": " the provided"}

event: sources
data: {"sources": [...], "timings": {...}}

event: done
data: {}
```

---

## 🧪 Running Tests

```powershell
# From the backend/ directory with venv active
python -m pytest tests/ -v
```

Tests mock all external LLM calls — no API keys or documents are needed to run them.

### Run the benchmark (requires a running server)

```powershell
# Start the server in one terminal
uvicorn app.main:app --host 0.0.0.0 --port 8000

# In another terminal
python -m scripts.benchmark
```

---

## 🔧 Configuration Reference

All settings are in `.env`. See `.env.example` for the full list.

| Variable | Default | Description |
|----------|---------|-------------|
| `LLM_PROVIDER` | `gemini` | LLM provider: `gemini`, `openai`, or `ollama` |
| `GEMINI_API_KEY` | — | Google Gemini API key |
| `GEMINI_MODEL` | `gemini-2.0-flash` | Gemini model name |
| `OPENAI_API_KEY` | — | OpenAI API key |
| `OPENAI_MODEL` | `gpt-4o-mini` | OpenAI model name |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama server URL |
| `OLLAMA_MODEL` | `llama3.2` | Ollama model name |
| `EMBEDDING_MODEL` | `all-MiniLM-L6-v2` | HuggingFace sentence-transformers model |
| `CHUNK_SIZE` | `500` | Characters per chunk |
| `CHUNK_OVERLAP` | `50` | Overlap between chunks |
| `RETRIEVAL_TOP_K` | `5` | Number of results to retrieve |
| `LLM_TIMEOUT_SECONDS` | `30` | Timeout for LLM calls |
| `MAX_QUESTION_LENGTH` | `1000` | Max question length |
| `MAX_CONCURRENT_GENERATIONS` | `5` | Concurrent LLM call limit |

---

## 🔑 LLM Provider Setup

### Google Gemini (Recommended — Free Tier)

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a free API key
3. Set in `.env`:
   ```
   LLM_PROVIDER=gemini
   GEMINI_API_KEY=your_key_here
   ```
4. Free tier: 15 requests/minute

### OpenAI (Paid)

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an API key (requires billing)
3. Set in `.env`:
   ```
   LLM_PROVIDER=openai
   OPENAI_API_KEY=your_key_here
   ```

### Ollama (Local, Free)

1. Download [Ollama](https://ollama.com/download)
2. Pull a model: `ollama pull llama3.2`
3. Set in `.env`:
   ```
   LLM_PROVIDER=ollama
   OLLAMA_MODEL=llama3.2
   ```
4. Requires ~4-8 GB disk space and RAM

---

## 🔄 Connecting to the Next.js Frontend

The backend runs on `http://localhost:8000` with CORS enabled for `localhost:3000` (Next.js dev server).

Example fetch from the frontend:

```typescript
const response = await fetch("http://localhost:8000/api/v1/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ question: "What is dark matter?" }),
});
const data = await response.json();
console.log(data.answer, data.sources);
```

For streaming:

```typescript
const response = await fetch("http://localhost:8000/api/v1/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ question: "What is dark matter?", stream: true }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const text = decoder.decode(value);
  // Parse SSE events from text
}
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `ModuleNotFoundError` | Ensure venv is activated: `.\venv\Scripts\Activate.ps1` |
| `GEMINI_API_KEY missing` | Copy `.env.example` to `.env` and add your key |
| `No documents found` | Place PDF/TXT/MD files in `data/documents/` and run ingestion |
| `ChromaDB error` | Delete `data/vector_store/` and re-run ingestion |
| `Connection refused (Ollama)` | Start Ollama: `ollama serve` |
| `Slow first request` | Normal — embedding model loads on first use (~1-3s) |
| Port conflict | Change port: `uvicorn app.main:app --port 8001` |
| `ExecutionPolicy error` | Run: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` |

---

## 📝 License

This backend is part of the Cosmo AI project.
