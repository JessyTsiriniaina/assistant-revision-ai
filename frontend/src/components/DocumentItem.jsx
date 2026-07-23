import { FileText } from "lucide-react";

export default function DocumentItem({ document, selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={
        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors " +
        (selected
          ? "bg-blue-50 text-blue-700"
          : "text-gray-700 hover:bg-gray-100")
      }
    >
      <FileText size={18} className={selected ? "text-blue-600" : "text-gray-400"} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{document.name}</div>
        <div className="text-xs text-gray-400">{document.size}</div>
      </div>
    </button>
  );
}
