# app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import httpx

from app.database import init_db
from app.config import settings
from app.routers import documents, chat, quiz, summary, progress


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(title="Assistant de Révision - API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents.router)
app.include_router(chat.router)
app.include_router(quiz.router)
app.include_router(summary.router)
app.include_router(progress.router)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/test-ollama")
async def test_ollama():
    """Vérifie que la connexion à Ollama Cloud (API directe, sans install locale) fonctionne."""
    if not settings.ollama_api_key:
        raise HTTPException(500, "OLLAMA_API_KEY manquante dans le .env")

    headers = {"Authorization": f"Bearer {settings.ollama_api_key}"}
    payload = {
        "model": settings.llm_model,
        "messages": [{"role": "user", "content": "Réponds juste 'bonjour' en un mot."}],
        "stream": False,
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(
                f"{settings.ollama_base_url}/api/chat",
                json=payload,
                headers=headers,
            )
            resp.raise_for_status()
            data = resp.json()
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            e.response.status_code,
            f"Ollama a répondu une erreur: {e.response.text}",
        )
    except httpx.RequestError as e:
        raise HTTPException(502, f"Impossible de contacter ollama.com: {e}")

    return {
        "status": "ok",
        "model": settings.llm_model,
        "reponse": data["message"]["content"],
    }