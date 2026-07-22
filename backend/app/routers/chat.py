import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import Conversation, Message, MessageRole
from app.schemas import ChatRequest, ChatResponse, SourceChunk
from app.services.agent import agent
from app.services.embeddings import embedding_service
from app.services.vectorstore import vector_store

router = APIRouter(tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest, db: AsyncSession = Depends(get_db)):
    if request.conversation_id:
        conversation = await db.get(Conversation, request.conversation_id)
        if not conversation:
            raise HTTPException(404, "Conversation introuvable")
    else:
        conversation = Conversation(title=request.message[:50])
        db.add(conversation)
        await db.commit()
        await db.refresh(conversation)

    user_msg = Message(conversation_id=conversation.id, role=MessageRole.user, content=request.message)
    db.add(user_msg)
    await db.commit()

    result = await db.execute(
        select(Message).where(Message.conversation_id == conversation.id).order_by(Message.created_at)
    )
    history = result.scalars().all()
    lc_messages = [{"role": m.role.value, "content": m.content} for m in history]

    config = {"configurable": {"thread_id": str(conversation.id)}}
    agent_response = await agent.ainvoke({"messages": lc_messages}, config=config)
    answer = agent_response["messages"][-1].content

    sources: list[SourceChunk] = []
    document_filter = {"document_id": request.document_ids[0]} if request.document_ids else None
    query_embedding = await embedding_service.embed_query(request.message)
    results = vector_store.query(query_embedding, top_k=3, where=document_filter)
    for text, meta, dist in zip(
        results.get("documents", [[]])[0],
        results.get("metadatas", [[]])[0],
        results.get("distances", [[]])[0],
    ):
        sources.append(SourceChunk(
            document_id=meta.get("document_id"), filename=meta.get("filename"),
            chunk_text=text[:300], score=1 - dist,
        ))

    assistant_msg = Message(
        conversation_id=conversation.id, role=MessageRole.assistant, content=answer,
        sources=json.dumps([s.model_dump() for s in sources]),
    )
    db.add(assistant_msg)
    await db.commit()

    return ChatResponse(conversation_id=conversation.id, answer=answer, sources=sources)