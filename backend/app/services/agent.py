import json
from langchain_mistralai import ChatMistralAI
from langchain_core.tools import tool
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
from sqlalchemy import select

from app.config import settings
from app.database import AsyncSessionLocal
from app.models import Document, DocumentStatus, Quiz
from app.services.vectorstore import vector_store
from app.services.embeddings import embedding_service


@tool
async def vector_search_tool(query: str, document_id: int | None = None) -> str:
    """Recherche les passages les plus pertinents dans les cours indexés pour répondre à
    une question précise. Utilise systématiquement cet outil avant de répondre à une
    question de cours — ne réponds jamais de mémoire."""
    query_embedding = await embedding_service.embed_query(query)
    where = {"document_id": document_id} if document_id else None
    results = vector_store.query(query_embedding, top_k=settings.top_k_retrieval, where=where)

    docs = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    if not docs:
        return "Aucun passage pertinent trouvé."

    formatted = [
        f"[Source: {meta.get('filename')}, page {meta.get('page')}]\n{text}"
        for text, meta in zip(docs, metadatas)
    ]
    return "\n\n---\n\n".join(formatted)


@tool
async def list_documents_tool() -> str:
    """Liste les documents de cours disponibles, avec leur statut d'indexation."""
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Document).order_by(Document.created_at.desc()))
        documents = result.scalars().all()

    if not documents:
        return "Aucun document n'a encore été importé."
    return "\n".join(
        f"- id={d.id} | {d.filename} | statut={d.status.value} | {d.num_chunks} chunks" for d in documents
    )


@tool
async def quiz_generator_tool(document_id: int, num_questions: int = 5, difficulty: str = "moyen") -> str:
    """Génère un quiz à partir d'un document indexé et l'enregistre en base."""
    from app.services.quiz import generate_quiz

    async with AsyncSessionLocal() as db:
        doc = await db.get(Document, document_id)
        if not doc:
            return f"Erreur: aucun document avec l'id {document_id}."
        if doc.status != DocumentStatus.indexed:
            return f"Erreur: document non indexé (statut: {doc.status.value})."

        try:
            questions = await generate_quiz(document_id, num_questions, difficulty)
        except ValueError as e:
            return f"Erreur: {e}"

        quiz = Quiz(
            document_id=document_id,
            title=f"Quiz - {doc.filename}",
            questions_json=json.dumps(questions, ensure_ascii=False),
        )
        db.add(quiz)
        await db.commit()
        await db.refresh(quiz)

    return f"Quiz créé (id={quiz.id}, {len(questions)} questions) pour '{doc.filename}'.\n\n" + json.dumps(questions, ensure_ascii=False, indent=2)


SYSTEM_PROMPT = (
    "Tu es un assistant de révision pour étudiants. Tu disposes de trois outils : "
    "list_documents_tool, vector_search_tool et quiz_generator_tool. "
    "Réponds UNIQUEMENT à partir de vector_search_tool pour les questions de cours. "
    "Cite toujours tes sources (fichier + page)."
)


def build_agent():
    llm = ChatMistralAI(
        model=settings.mistral_model,
        temperature=0.3,
        mistral_api_key=settings.mistral_api_key,
    )
    tools = [vector_search_tool, list_documents_tool, quiz_generator_tool]
    checkpointer = MemorySaver()
    return create_react_agent(llm, tools, prompt=SYSTEM_PROMPT, checkpointer=checkpointer)


agent = build_agent()