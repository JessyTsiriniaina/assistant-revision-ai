import { BookOpen } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white px-8 py-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
        <BookOpen size={20} />
      </div>
      <div>
        <h1 className="text-lg font-semibold text-gray-900">
          Assistant de Révision IA
        </h1>
        <p className="text-sm text-gray-500">
          Révisez plus efficacement grâce à vos propres documents.
        </p>
      </div>
    </header>
  );
}
