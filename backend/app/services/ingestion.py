import uuid
from pypdf import PdfReader
from app.config import settings


def extract_text_from_pdf(filepath: str) -> list[tuple[int, str]]:
    reader = PdfReader(filepath)
    pages = []
    for i, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        if text.strip():
            pages.append((i + 1, text))
    return pages


def extract_text_from_txt(filepath: str) -> list[tuple[int, str]]:
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        return [(1, f.read())]


def chunk_text(text: str, chunk_size: int, overlap: int) -> list[str]:
    words = text.split()
    if not words:
        return []
    chunks = []
    step = max(chunk_size - overlap, 1)
    for start in range(0, len(words), step):
        chunk_words = words[start:start + chunk_size]
        if chunk_words:
            chunks.append(" ".join(chunk_words))
        if start + chunk_size >= len(words):
            break
    return chunks


def process_document(filepath: str, filename: str) -> list[dict]:
    lower = filename.lower()
    if lower.endswith(".pdf"):
        pages = extract_text_from_pdf(filepath)
    elif lower.endswith((".txt", ".md")):
        pages = extract_text_from_txt(filepath)
    else:
        raise ValueError(f"Format non supporté: {filename}")

    if not pages:
        raise ValueError("Aucun texte n'a pu être extrait (document vide ou scanné sans OCR).")

    all_chunks = []
    for page_num, page_text in pages:
        for chunk in chunk_text(page_text, settings.chunk_size, settings.chunk_overlap):
            all_chunks.append({"id": str(uuid.uuid4()), "text": chunk, "page": page_num})
    return all_chunks