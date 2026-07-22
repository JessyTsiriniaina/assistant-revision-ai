from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import Document, DocumentStatus
from app.schemas import SummaryRequest, SummaryOut
from app.services.summary import build_summary

router = APIRouter(tags=["summary"])


@router.post("/summary", response_model=SummaryOut)
async def generate_summary(request: SummaryRequest, db: AsyncSession = Depends(get_db)):
    doc = await db.get(Document, request.document_id)
    if not doc:
        raise HTTPException(404, "Document introuvable")
    if doc.status != DocumentStatus.indexed:
        raise HTTPException(400, f"Document non indexé (statut: {doc.status.value})")

    summary_text = await build_summary(request.document_id)
    return SummaryOut(document_id=doc.id, filename=doc.filename, summary=summary_text)