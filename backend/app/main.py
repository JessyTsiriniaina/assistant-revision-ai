# app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import httpx

from app.database import init_db
from app.config import settings
from app.routers import documents, chat, quiz, summary, progress

MISTRAL_CHAT_URL = "https://api.mistral.ai/v1/chat/completions"


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


@app.get("/test-mistral")
async def test_mistral():
    """Vérifie que la connexion à l'API Mistral AI fonctionne."""
    if not settings.mistral_api_key:
        raise HTTPException(500, "MISTRAL_API_KEY manquante dans le .env")

    headers = {
        "Authorization": f"Bearer {settings.mistral_api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": settings.mistral_model,
        "messages": [{"role": "user", "content": "Réponds juste 'bonjour' en un mot."}],
        "stream": False,
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(
                MISTRAL_CHAT_URL,
                json=payload,
                headers=headers,
            )
            resp.raise_for_status()
            data = resp.json()
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            e.response.status_code,
            f"Mistral AI a répondu une erreur: {e.response.text}",
        )
    except httpx.RequestError as e:
        raise HTTPException(502, f"Impossible de contacter l'API Mistral AI: {e}")

    return {
        "status": "ok",
        "model": settings.mistral_model,
        "reponse": data["choices"][0]["message"]["content"],
    }