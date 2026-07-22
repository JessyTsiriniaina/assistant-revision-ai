import chromadb
from app.config import settings


class VectorStore:
    def __init__(self):
        self.client = chromadb.PersistentClient(path=settings.chroma_persist_dir)
        self.collection = self.client.get_or_create_collection(
            name=settings.chroma_collection_name,
            metadata={"hnsw:space": "cosine"},
        )

    def add_chunks(self, ids, embeddings, documents, metadatas):
        batch_size = 200
        for i in range(0, len(ids), batch_size):
            self.collection.add(
                ids=ids[i:i + batch_size],
                embeddings=embeddings[i:i + batch_size],
                documents=documents[i:i + batch_size],
                metadatas=metadatas[i:i + batch_size],
            )

    def query(self, query_embedding, top_k=5, where=None):
        return self.collection.query(query_embeddings=[query_embedding], n_results=top_k, where=where)

    def get_document_chunks(self, document_id: int, limit: int = 20) -> list[str]:
        result = self.collection.get(where={"document_id": document_id}, limit=limit)
        return result.get("documents", [])

    def delete_document(self, document_id: int) -> None:
        self.collection.delete(where={"document_id": document_id})


vector_store = VectorStore()