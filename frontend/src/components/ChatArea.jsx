import { Send } from "lucide-react";
import ChatMessage from "./ChatMessage";
import { messages } from "../data/messages";

export default function ChatArea() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
      </div>
      <div className="border-t border-gray-200 bg-white px-8 py-4">
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200 focus-within:border-blue-400 transition-colors">
          <input
            type="text"
            placeholder="Posez une question sur vos documents..."
            className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 py-2"
          />
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <Send size={16} />
            Envoyer
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          L'assistant répond uniquement à partir de vos documents.
        </p>
      </div>
    </div>
  );
}
