from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import Document, Quiz, QuizAttempt
from app.schemas import ProgressOut, DocumentProgress

router = APIRouter(tags=["progress"])


@router.get("/progress", response_model=ProgressOut)
async def get_progress(db: AsyncSession = Depends(get_db)):
    docs_result = await db.execute(select(Document))
    documents = docs_result.scalars().all()

    by_document, all_scores = [], []
    for doc in documents:
        attempts_result = await db.execute(
            select(QuizAttempt.score).join(Quiz, QuizAttempt.quiz_id == Quiz.id).where(Quiz.document_id == doc.id)
        )
        scores = [row[0] for row in attempts_result.all()]
        all_scores.extend(scores)
        by_document.append(DocumentProgress(
            document_id=doc.id, filename=doc.filename, quizzes_taken=len(scores),
            average_score=round(sum(scores) / len(scores), 1) if scores else 0.0,
        ))

    global_avg = round(sum(all_scores) / len(all_scores), 1) if all_scores else 0.0
    return ProgressOut(
        total_documents=len(documents), total_quizzes_taken=len(all_scores),
        global_average_score=global_avg, by_document=by_document,
    )