# Cosmo AI — Documents Directory

Place your ISRO documents here for the RAG system to process.

## Supported file formats

| Format   | Extension | Notes                                    |
|----------|-----------|------------------------------------------|
| PDF      | `.pdf`    | Text extracted with page numbers         |
| Text     | `.txt`    | Plain text, UTF-8 encoding recommended   |
| Markdown | `.md`     | Treated as plain text                    |

## How to use

1. Copy your document files into this directory.
2. Run the ingestion script from the `backend/` directory:

   ```powershell
   python -m scripts.ingest_documents
   ```

3. The script will load, chunk, embed, and store the documents
   in the local vector database.

4. Start (or restart) the backend server and ask questions!

## Important notes

- **No documents are provided by default.** You must supply your own.
- Only files directly in this directory are processed (not subdirectories).
- Re-running ingestion is safe — unchanged documents are skipped.
- To force re-processing a document, delete its chunks from the vector store
  or remove the `data/vector_store/` directory and re-ingest everything.
