import json
import httpx
from app.config import settings


class LLMService:
    def __init__(self):
        self.base_url = settings.ollama_base_url  # https://ollama.com
        self.api_key = settings.ollama_api_key
        self.model = settings.llm_model

    def _headers(self):
        return {"Authorization": f"Bearer {self.api_key}"}

    async def chat(self, messages: list[dict]) -> dict:
        payload = {"model": self.model, "messages": messages, "stream": False}
        async with httpx.AsyncClient(timeout=180.0) as client:
            resp = await client.post(f"{self.base_url}/api/chat", json=payload, headers=self._headers())
            resp.raise_for_status()
            return resp.json()

    async def chat_stream(self, messages: list[dict]):
        payload = {"model": self.model, "messages": messages, "stream": True}
        async with httpx.AsyncClient(timeout=180.0) as client:
            async with client.stream("POST", f"{self.base_url}/api/chat", json=payload, headers=self._headers()) as resp:
                async for line in resp.aiter_lines():
                    if not line:
                        continue
                    data = json.loads(line)
                    if "message" in data:
                        yield data["message"].get("content", "")
                    if data.get("done"):
                        break


llm_service = LLMService()