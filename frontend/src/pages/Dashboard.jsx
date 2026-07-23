import { useState } from 'react';
import {
    BookOpen, FileText, BookMarked, Brain, BarChart3,
    TrendingUp, Clock, Plus, Search, ChevronRight,
    Zap, Target, Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockDocuments, mockHistory } from '../data/mockData';
import UploadZone from '../components/upload/UploadZone';
import { useNavigate } from 'react-router-dom';

function StatCard({ icon: Icon, label, value, color, trend, sub }) {
    const colorMap = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        purple: 'bg-purple-50 text-purple-600 border-purple-100',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
        indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    };
    return (
        <div className="card-hover group">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${colorMap[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
                {trend && (
                    <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-medium">
                        <TrendingUp className="w-3 h-3" />
                        {trend}
                    </span>
                )}
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-0.5">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
            {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
    );
}

function CourseCard({ doc }) {
    const navigate = useNavigate();
    const colorMap = {
        blue: { bg: 'bg-blue-100', text: 'text-blue-700', bar: 'bg-blue-500' },
        purple: { bg: 'bg-purple-100', text: 'text-purple-700', bar: 'bg-purple-500' },
        emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', bar: 'bg-emerald-500' },
        amber: { bg: 'bg-amber-100', text: 'text-amber-700', bar: 'bg-amber-500' },
        indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700', bar: 'bg-indigo-500' },
    };
    const c = colorMap[doc.color] || colorMap.blue;

    return (
        <div
            className="card-hover cursor-pointer group"
            onClick={() => navigate('/app/assistant')}
        >
            <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center text-2xl flex-shrink-0`}>
                    {doc.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-800 truncate">{doc.name}</h4>
                    <p className={`text-xs font-medium mt-1 ${c.text}`}>{doc.subject}</p>
                    <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">Progression</span>
                            <span className="text-xs font-semibold text-gray-700">{doc.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div className={`${c.bar} h-1.5 rounded-full progress-bar`} style={{ width: `${doc.progress}%` }} />
                        </div>
                    </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showUpload, setShowUpload] = useState(false);

    const stats = [
        { icon: BookOpen, label: 'Documents importés', value: user?.stats?.documentsImported || 0, color: 'blue', trend: '+2 ce mois', sub: 'PDF, DOCX, TXT' },
        { icon: FileText, label: 'Résumés créés', value: user?.stats?.summariesCreated || 0, color: 'purple', trend: '+3 ce mois', sub: 'Auto-générés' },
        { icon: BookMarked, label: 'Fiches générées', value: user?.stats?.flashcardsGenerated || 0, color: 'emerald', trend: '+8 ce mois', sub: 'En mémorisation' },
        { icon: Brain, label: 'Quiz réalisés', value: user?.stats?.quizzesCompleted || 0, color: 'amber', trend: '+5 ce mois', sub: 'Tests effectués' },
        { icon: Target, label: 'Taux de réussite', value: `${user?.stats?.successRate || 0}%`, color: 'indigo', sub: 'Moyenne globale' },
    ];

    const firstName = user?.name?.split(' ')[0] || 'Étudiant';

    return (
        <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
            {/* Welcome */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                        Bonjour, {firstName} 👋
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
                        Importer un cours
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
                        <h2 className="text-lg font-bold text-gray-900">Importer un nouveau cours</h2>
                        <button onClick={() => setShowUpload(false)} className="text-sm text-gray-400 hover:text-gray-600">Fermer</button>
                    </div>
                    <UploadZone compact />
                </div>
            )}

            {/* Stats Grid */}
            <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary-600" />
                    Mes statistiques
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {stats.map((s, i) => <StatCard key={i} {...s} />)}
                </div>
            </div>

            {/* Recent courses + Activity */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent courses */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary-600" />
                            Continuer ma révision
                        </h2>
                        <button
                            onClick={() => navigate('/app/courses')}
                            className="text-sm text-primary-600 font-semibold hover:underline flex items-center gap-1"
                        >
                            Voir tout <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {mockDocuments.slice(0, 4).map(doc => (
                            <CourseCard key={doc.id} doc={doc} />
                        ))}
                    </div>
                </div>

                {/* Progress summary */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary-600" />
                        Progression récente
                    </h2>
                    <div className="card space-y-4">
                        {mockHistory.slice(0, 3).map(h => (
                            <div key={h.id} className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-gray-700 truncate max-w-36">{h.documentName.split(' ').slice(0, 3).join(' ')}</span>
                                    <span className="text-xs text-gray-500">{h.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full progress-bar ${h.progress >= 80 ? 'bg-emerald-500' : h.progress >= 50 ? 'bg-primary-500' : 'bg-amber-500'}`}
                                        style={{ width: `${h.progress}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400">Dernier score : {h.lastScore}%</span>
                                    <span className="text-xs text-gray-400">{h.lastRevision}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Motivational tip */}
                    <div className="bg-gradient-to-br from-primary-50 to-indigo-50 border border-primary-100 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-4 h-4 text-primary-600" />
                            <span className="text-xs font-bold text-primary-700">Conseil du jour</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Les révisions courtes et régulières sont 3x plus efficaces que les longues sessions mémorisation. Révisez 20 minutes par jour !
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
