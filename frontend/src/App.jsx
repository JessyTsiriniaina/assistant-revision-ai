import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import LandingPage from './pages/LandingPage';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import CoursesPage from './pages/CoursesPage';
import AssistantPage from './pages/AssistantPage';
import SummaryPage from './pages/SummaryPage';
import FlashcardsPage from './pages/FlashcardsPage';
import QuizPage from './pages/QuizPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="assistant" element={<AssistantPage />} />
        <Route path="summaries" element={<SummaryPage />} />
        <Route path="flashcards" element={<FlashcardsPage />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </BrowserRouter>
  );
}
