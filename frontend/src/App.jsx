import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import SummaryPanel from "./components/SummaryPanel";
import QuizPanel from "./components/QuizPanel";

export default function App() {
  const [view, setView] = useState("chat");
  const [selectedDoc, setSelectedDoc] = useState(1);

  return (
    <div className="h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          selectedDoc={selectedDoc}
          setSelectedDoc={setSelectedDoc}
          view={view}
          setView={setView}
        />
        <main className="flex-1 overflow-hidden">
          {view === "chat" && <ChatArea />}
          {view === "summary" && <SummaryPanel />}
          {view === "quiz" && <QuizPanel />}
        </main>
      </div>
    </div>
  );
}
