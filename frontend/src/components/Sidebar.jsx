import { MessageSquare, FileText, ListChecks, Upload } from "lucide-react";
import DocumentItem from "./DocumentItem";
import { documents } from "../data/documents";

export default function Sidebar({ selectedDoc, setSelectedDoc, view, setView }) {
  const tabs = [
    { id: "chat", label: "Discussion", icon: MessageSquare },
    { id: "summary", label: "Résumé", icon: FileText },
    { id: "quiz", label: "Quiz", icon: ListChecks },
  ];

  return (
    <aside className="w-72 border-r border-gray-200 bg-white flex flex-col">
      <div className="p-5 flex-1 overflow-y-auto">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
          Mes documents
        </h2>
        <div className="space-y-1">
          {documents.map((doc) => (
            <DocumentItem
              key={doc.id}
              document={doc}
              selected={selectedDoc === doc.id}
              onSelect={() => setSelectedDoc(doc.id)}
            />
          ))}
        </div>

        <button className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
          <Upload size={16} />
          Ajouter un document
        </button>
      </div>

      <div className="p-4 border-t border-gray-200 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = view === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors " +
                (active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100")
              }
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
