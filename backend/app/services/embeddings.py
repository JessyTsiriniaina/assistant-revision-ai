import asyncio
import httpx
from app.config import settings

MISTRAL_EMBED_URL = "https://api.mistral.ai/v1/embeddings"


class EmbeddingService:
    def __init__(self):
        self.api_key = settings.mistral_api_key
        self.model = settings.mistral_embedding_model

    def _headers(self):
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    async def _embed_one(self, client: httpx.AsyncClient, text: str) -> list[float]:
        resp = await client.post(
            MISTRAL_EMBED_URL,
            json={"model": self.model, "input": text},
            headers=self._headers(),
        )
        resp.raise_for_status()
        return resp.json()["data"][0]["embedding"]

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