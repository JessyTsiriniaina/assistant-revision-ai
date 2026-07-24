import { User, Sparkles } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={"flex gap-3 " + (isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
          <Sparkles size={16} />
        </div>
      )}
      <div
        className={
          "max-w-2xl rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm " +
          (isUser
            ? "bg-blue-600 text-white rounded-br-sm"
            : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm")
        }
      >
        <div className="markdown-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.text || message.content}
          </ReactMarkdown>
        </div>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center flex-shrink-0">
          <User size={16} />
        </div>
      )}
    </div>
  );
}
