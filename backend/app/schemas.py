from datetime import datetime
from pydantic import BaseModel, Field
from app.models import DocumentStatus, MessageRole


class DocumentOut(BaseModel):
    id: int
    filename: str
    status: DocumentStatus
    num_chunks: int
    error_message: str | None = None
    created_at: datetime
    model_config = {"from_attributes": True}


class ChatRequest(BaseModel):
    conversation_id: int | None = None
    message: str = Field(..., min_length=1)
    document_ids: list[int] | None = None


class SourceChunk(BaseModel):
    document_id: int
    filename: str
    chunk_text: str
    score: float


class ChatResponse(BaseModel):
    conversation_id: int
    answer: str
    sources: list[SourceChunk]


class SummaryRequest(BaseModel):
    document_id: int


class SummaryOut(BaseModel):
    document_id: int
    filename: str
    summary: str


class QuizQuestion(BaseModel):
    question: str
    type: str
    choices: list[str] | None = None
    correct_answer: str
    explanation: str | None = None


class QuizGenerateRequest(BaseModel):
    document_id: int
    num_questions: int = Field(default=5, ge=1, le=20)
    difficulty: str = "moyen"


class QuizOut(BaseModel):
    id: int
    document_id: int
    title: str
    questions: list[QuizQuestion]
    created_at: datetime


class QuizSubmitRequest(BaseModel):
    quiz_id: int
    answers: list[str]


class QuizResultOut(BaseModel):
    quiz_id: int
    attempt_id: int
    score: float
    correct_count: int
    total_questions: int
    details: list[dict]


class DocumentProgress(BaseModel):
    document_id: int
    filename: str
    quizzes_taken: int
    average_score: float


class ProgressOut(BaseModel):
    total_documents: int
    total_quizzes_taken: int
    global_average_score: float
    by_document: list[DocumentProgress]