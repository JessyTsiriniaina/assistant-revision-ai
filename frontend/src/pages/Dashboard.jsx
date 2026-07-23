import { useState } from 'react';
import { FileText, BookMarked, Brain, Plus, Zap } from 'lucide-react';
import UploadZone from '../components/upload/UploadZone';
import { useNavigate } from 'react-router-dom';


export default function Dashboard() {
    const navigate = useNavigate();
    const [showUpload, setShowUpload] = useState(false);

    return (
        <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
            {/* Welcome */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                        Bonjour
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        Continuez votre progression — vous avancez très bien !
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowUpload(!showUpload)}
                        className="btn-primary text-sm py-2.5"
                    >
                        <Plus className="w-4 h-4" />
                        Importer un document
                    </button>
                </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Nouveau résumé', icon: FileText, to: '/app/summaries', color: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-100' },
                    { label: 'Créer des fiches', icon: BookMarked, to: '/app/flashcards', color: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-100' },
                    { label: 'Lancer un quiz', icon: Brain, to: '/app/quiz', color: 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-100' },
                    { label: 'Poser une question', icon: Zap, to: '/app/assistant', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-100' },
                ].map(({ label, icon: Icon, to, color }) => (
                    <button
                        key={to}
                        onClick={() => navigate(to)}
                        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-200 text-center group hover:shadow-sm active:scale-95 ${color}`}
                    >
                        <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-semibold leading-tight">{label}</span>
                    </button>
                ))}
            </div>

            {/* Upload zone (collapsible) */}
            {showUpload && (
                <div className="card animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Importer un nouveau document</h2>
                        <button onClick={() => setShowUpload(false)} className="text-sm text-gray-400 hover:text-gray-600">Fermer</button>
                    </div>
                    <UploadZone compact />
                </div>
            )}
        </div>
    );
}
