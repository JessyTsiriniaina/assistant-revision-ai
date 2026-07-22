import json
from app.services.llm import llm_service
from app.services.vectorstore import vector_store


async def generate_quiz(document_id: int, num_questions: int = 5, difficulty: str = "moyen") -> list[dict]:
    context_chunks = vector_store.get_document_chunks(document_id, limit=25)
    if not context_chunks:
        raise ValueError("Aucun contenu indexé pour ce document.")
    context = "\n\n".join(context_chunks)

    prompt = f"""À partir du contenu de cours ci-dessous, génère exactement {num_questions} questions \
de niveau "{difficulty}" pour évaluer la compréhension d'un étudiant.

Réponds STRICTEMENT avec un tableau JSON valide, sans texte avant ni après, au format exact :
[
  {{
    "question": "texte de la question",
    "type": "qcm",
    "choices": ["option A", "option B", "option C", "option D"],
    "correct_answer": "option correcte",
    "explanation": "courte explication"
  }}
]
Pour une question ouverte, "type": "ouverte" et omets "choices".

Contenu du cours :
{context}
"""

    response = await llm_service.chat([
        {"role": "system", "content": "Tu es un générateur de quiz pédagogiques. Réponds en JSON valide strict, sans markdown."},
        {"role": "user", "content": prompt},
    ])

    content = response["message"]["content"].strip()
    if content.startswith("```"):
        content = content.strip("`")
        if content.startswith("json"):
            content = content[4:]
        content = content.strip()

    try:
        questions = json.loads(content)
    except json.JSONDecodeError as e:
        raise ValueError(f"Le LLM n'a pas retourné un JSON valide: {e}")

    if not isinstance(questions, list):
        raise ValueError("Format du quiz invalide.")

    return questions