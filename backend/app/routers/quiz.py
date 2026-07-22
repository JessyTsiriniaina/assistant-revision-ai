import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import Document, DocumentStatus, Quiz, QuizAttempt
from app.schemas import (
    QuizGenerateRequest, QuizOut, QuizQuestion,
    QuizSubmitRequest, QuizResultOut,
)
from app.services.quiz import generate_quiz as generate_quiz_service

router = APIRouter(tags=["quiz"])


@router.post("/quiz", response_model=QuizOut)
async def generate_quiz(request: QuizGenerateRequest, db: AsyncSession = Depends(get_db)):
    doc = await db.get(Document, request.document_id)
    if not doc:
        raise HTTPException(404, "Document introuvable")
    if doc.status != DocumentStatus.indexed:
        raise HTTPException(400, f"Document non indexé (statut: {doc.status.value})")

    questions = await generate_quiz_service(doc.id, request.num_questions, request.difficulty)

    quiz = Quiz(
        document_id=doc.id, title=f"Quiz - {doc.filename}",
        questions_json=json.dumps(questions, ensure_ascii=False),
    )
    db.add(quiz)
    await db.commit()
    await db.refresh(quiz)

    return QuizOut(
        id=quiz.id, document_id=quiz.document_id, title=quiz.title,
        questions=[QuizQuestion(**q) for q in questions], created_at=quiz.created_at,
    )


@router.post("/quiz/submit", response_model=QuizResultOut)
async def submit_quiz(request: QuizSubmitRequest, db: AsyncSession = Depends(get_db)):
    quiz = await db.get(Quiz, request.quiz_id)
    if not quiz:
        raise HTTPException(404, "Quiz introuvable")

    questions = json.loads(quiz.questions_json)
    if len(request.answers) != len(questions):
        raise HTTPException(400, f"{len(questions)} réponses attendues, {len(request.answers)} reçues.")

    details, correct_count = [], 0
    for q, given in zip(questions, request.answers):
        is_correct = given.strip().lower() == q["correct_answer"].strip().lower()
        correct_count += int(is_correct)
        details.append({
            "question": q["question"], "given_answer": given,
            "correct_answer": q["correct_answer"], "is_correct": is_correct,
            "explanation": q.get("explanation"),
        })

    score = round((correct_count / len(questions)) * 100, 1) if questions else 0.0

    attempt = QuizAttempt(
        quiz_id=quiz.id, answers_json=json.dumps(request.answers, ensure_ascii=False),
        score=score, total_questions=len(questions), correct_count=correct_count,
    )
    db.add(attempt)
    await db.commit()
    await db.refresh(attempt)

    return QuizResultOut(
        quiz_id=quiz.id, attempt_id=attempt.id, score=score,
        correct_count=correct_count, total_questions=len(questions), details=details,
    )


@router.get("/quiz/{quiz_id}/result", response_model=QuizResultOut)
async def get_result(quiz_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(QuizAttempt).where(QuizAttempt.quiz_id == quiz_id).order_by(QuizAttempt.created_at.desc())
    )
    attempt = result.scalars().first()
    if not attempt:
        raise HTTPException(404, "Aucune tentative trouvée pour ce quiz.")

    quiz = await db.get(Quiz, quiz_id)
    questions = json.loads(quiz.questions_json)
    answers = json.loads(attempt.answers_json)

    details = []
    for q, given in zip(questions, answers):
        is_correct = given.strip().lower() == q["correct_answer"].strip().lower()
        details.append({
            "question": q["question"], "given_answer": given,
            "correct_answer": q["correct_answer"], "is_correct": is_correct,
            "explanation": q.get("explanation"),
        })

    return QuizResultOut(
        quiz_id=quiz_id, attempt_id=attempt.id, score=attempt.score,
        correct_count=attempt.correct_count, total_questions=attempt.total_questions, details=details,
    )