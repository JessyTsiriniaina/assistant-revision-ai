import json
import httpx
from app.config import settings


MISTRAL_CHAT_URL = "https://api.mistral.ai/v1/chat/completions"


class LLMService:
    def __init__(self):
        self.api_key = settings.mistral_api_key
        self.model = settings.mistral_model

    def _headers(self):
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    async def chat(self, messages: list[dict]) -> dict:
        payload = {
            "model": self.model,
            "messages": messages,
            "stream": False,
        }
        async with httpx.AsyncClient(timeout=180.0) as client:
            resp = await client.post(MISTRAL_CHAT_URL, json=payload, headers=self._headers())
            resp.raise_for_status()
            data = resp.json()
            return {
                "message": {
                    "content": data["choices"][0]["message"]["content"],
                    "role": "assistant",
                }
            }

    async def chat_stream(self, messages: list[dict]):
        payload = {
            "model": self.model,
            "messages": messages,
            "stream": True,
        }
        async with httpx.AsyncClient(timeout=180.0) as client:
            async with client.stream("POST", MISTRAL_CHAT_URL, json=payload, headers=self._headers()) as resp:
                async for line in resp.aiter_lines():
                    if not line:
                        continue
                    if line.startswith("data: "):
                        data_str = line[6:].strip()
                        if data_str == "[DONE]":
                            break
                        try:
                            data = json.loads(data_str)
                            delta = data.get("choices", [{}])[0].get("delta", {})
                            content = delta.get("content", "")
                            if content:
                                yield content
                        except json.JSONDecodeError:
                            continue


llm_service = LLMService()