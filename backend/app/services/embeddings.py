import asyncio
import httpx
from app.config import settings


class EmbeddingService:
    def __init__(self):
        self.base_url = "http://localhost:11434"  # local, requiert Ollama installé pour cette partie
        self.model = settings.embedding_model

    async def _embed_one(self, client: httpx.AsyncClient, text: str) -> list[float]:
        resp = await client.post(
            f"{self.base_url}/api/embeddings",
            json={"model": self.model, "prompt": text},
        )
        resp.raise_for_status()
        return resp.json()["embedding"]

    async def embed_texts(self, texts: list[str], concurrency: int = 8) -> list[list[float]]:
        semaphore = asyncio.Semaphore(concurrency)

        async def bounded(client, text):
            async with semaphore:
                return await self._embed_one(client, text)

        async with httpx.AsyncClient(timeout=120.0) as client:
            tasks = [bounded(client, t) for t in texts]
            return await asyncio.gather(*tasks)

    async def embed_query(self, text: str) -> list[float]:
        async with httpx.AsyncClient(timeout=60.0) as client:
            return await self._embed_one(client, text)


embedding_service = EmbeddingService()