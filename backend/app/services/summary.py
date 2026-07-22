from app.services.llm import llm_service
from app.services.vectorstore import vector_store


async def build_summary(document_id: int) -> str:
    """Génère une fiche de révision structurée à partir du contenu indexé d'un document."""
    chunks = vector_store.get_document_chunks(document_id, limit=30)
    if not chunks:
        raise ValueError("Aucun contenu indexé pour ce document.")
    context = "\n\n".join(chunks)

    prompt = f"""À partir du contenu de cours suivant, rédige une fiche de révision structurée en Markdown avec :
- Un titre
- Les définitions et concepts clés (liste à puces)
- Les points essentiels à retenir
- Les formules importantes, si présentes

Contenu du cours :
{context}
"""
    response = await llm_service.chat([
        {"role": "system", "content": "Tu es un assistant pédagogique qui rédige des fiches de révision claires et concises."},
        {"role": "user", "content": prompt},
    ])
    return response["message"]["content"]