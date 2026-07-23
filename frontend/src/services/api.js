import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export default API;

// Analytics & Data Management
export const getMetrics = () => API.get('/dashboard/metrics');
export const createCustomer = (data) => API.post('/dashboard/customers', data);
export const createOrder = (data) => API.post('/dashboard/orders', data);
export const getAgentAdvice = () => API.post('/agent/advise');

// Chatbot
export const sendChatMessage = (message, sessionId = null) => API.post('/chat', { message, session_id: sessionId });
export const getChatSessions = () => API.get('/chat/sessions');
export const getChatSessionMessages = (sessionId) => API.get(`/chat/sessions/${sessionId}`);

// --- Module RAG & Étude ---
export const uploadStudyDocument = (formData) => 
  API.post('/rag/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const generateCourse = (topic = "Général") => 
  API.get(`/rag/generate-course?topic=${encodeURIComponent(topic)}`);

export const generateQuiz = (count = 5) => 
  API.get(`/rag/generate-quiz?questions_count=${count}`);

export const generatePlan = (days = 5) => 
  API.get(`/rag/generate-plan?days=${days}`);