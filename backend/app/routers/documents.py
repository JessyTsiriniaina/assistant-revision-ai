import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import Document, DocumentStatus
from app.schemas import DocumentOut
from app.config import settings
from app.services.ingestion import process_document
from app.services.embeddings import embedding_service
from app.services.vectorstore import vector_store

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/upload", response_model=DocumentOut)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in settings.allowed_extensions:
        raise HTTPException(400, f"Format non supporté: {ext}. Formats acceptés: {settings.allowed_extensions}")

    os.makedirs(settings.upload_dir, exist_ok=True)
    filepath = os.path.join(settings.upload_dir, file.filename)
    with open(filepath, "wb") as f:
        shutil.copyfileobj(file.file, f)

    doc = Document(filename=file.filename, filepath=filepath, status=DocumentStatus.pending)
    db.add(doc)
    await db.commit()
    await db.refresh(doc)

    background_tasks.add_task(index_document_task, doc.id, filepath, file.filename)
    return doc


async def index_document_task(document_id: int, filepath: str, filename: str):
    from app.database import AsyncSessionLocal

    async with AsyncSessionLocal() as db:
        doc = await db.get(Document, document_id)
        doc.status = DocumentStatus.processing
        await db.commit()

        try:
            chunks = process_document(filepath, filename)
            if not chunks:
                raise ValueError("Aucun texte extrait du document.")

            texts = [c["text"] for c in chunks]
            embeddings = await embedding_service.embed_texts(texts)
            ids = [c["id"] for c in chunks]
            metadatas = [
                {"document_id": document_id, "filename": filename, "page": c["page"]}
                for c in chunks
            ]
            vector_store.add_chunks(ids, embeddings, texts, metadatas)

            doc.status = DocumentStatus.indexed
            doc.num_chunks = len(chunks)
        except Exception as e:
            doc.status = DocumentStatus.failed
            doc.error_message = str(e)
        await db.commit()


@router.get("", response_model=list[DocumentOut])
async def list_documents(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Document).order_by(Document.created_at.desc()))
    return result.scalars().all()


@router.get("/{document_id}", response_model=DocumentOut)
async def get_document(document_id: int, db: AsyncSession = Depends(get_db)):
    doc = await db.get(Document, document_id)
    if not doc:
        raise HTTPException(404, "Document introuvable")
    return doc


@router.delete("/{document_id}")
async def delete_document(document_id: int, db: AsyncSession = Depends(get_db)):
    doc = await db.get(Document, document_id)
    if not doc:
        raise HTTPException(404, "Document introuvable")
    vector_store.delete_document(document_id)
    if os.path.exists(doc.filepath):
        os.remove(doc.filepath)
    await db.delete(doc)
    await db.commit()
    return {"detail": "Document supprimé"}