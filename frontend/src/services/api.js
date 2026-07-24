import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export default API;

// ─── Documents ───────────────────────────────────────────────
export async function fetchDocuments() {
  const { data } = await API.get('/documents');
  return data;
}

export async function uploadDocument(file) {
  const form = new FormData();
  form.append('file', file);
  const { data } = await API.post('/documents/upload', form);
  return data;
}

export async function deleteDocument(id) {
  const { data } = await API.delete(`/documents/${id}`);
  return data;
}

// ─── Chat / Conversations ────────────────────────────────────
export async function fetchConversations() {
  const { data } = await API.get('/conversations');
  return data;
}

export async function fetchConversation(id) {
  const { data } = await API.get(`/conversations/${id}`);
  return data;
}

export async function deleteConversation(id) {
  const { data } = await API.delete(`/conversations/${id}`);
  return data;
}

export async function sendChatMessage(conversation_id, message) {
  const { data } = await API.post('/chat', { conversation_id, message });
  return data;
}

// ─── Quiz ────────────────────────────────────────────────────
export async function generateQuiz(document_id, num_questions = 5, difficulty = 'moyen') {
  const { data } = await API.post('/quiz', { document_id, num_questions, difficulty });
  return data;
}

export async function submitQuiz(quiz_id, answers) {
  const { data } = await API.post('/quiz/submit', { quiz_id, answers });
  return data;
}

export async function getQuizResult(quiz_id) {
  const { data } = await API.get(`/quiz/${quiz_id}/result`);
  return data;
}

// ─── Summary ─────────────────────────────────────────────────
export async function generateSummary(document_id) {
  const { data } = await API.post('/summary', { document_id });
  return data;
}

// ─── Flashcards ──────────────────────────────────────────────
export async function fetchFlashcards(document_id) {
  const params = document_id ? { document_id } : {};
  const { data } = await API.get('/flashcards', { params });
  return data;
}

export async function generateFlashcards(document_id, num_cards = 5) {
  const { data } = await API.post('/flashcards/generate', { document_id, num_cards });
  return data;
}

// ─── Progress ────────────────────────────────────────────────
export async function fetchProgress() {
  const { data } = await API.get('/progress');
  return data;
}