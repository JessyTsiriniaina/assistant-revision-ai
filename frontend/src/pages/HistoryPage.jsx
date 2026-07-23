import { useState } from 'react';
import {
    Clock, BookOpen, FileText, BookMarked, Brain,
    Trophy, Play, ChevronRight, TrendingUp, Calendar, Filter
} from 'lucide-react';
import { mockHistory, colorMap } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

function HistoryCard({ item }) {
    const navigate = useNavigate();
    const c = colorMap[item.color] || colorMap.blue;
    const scoreColor = item.lastScore >= 80 ? 'text-emerald-600 bg-emerald-100' :
        item.lastScore >= 60 ? 'text-amber-600 bg-amber-100' :
            'text-red-600 bg-red-100';

    return (
        <div className="card-hover animate-slide-up">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Icon & subject */}
                <div className={`w-14 h-14 rounded-2xl ${c.bg} flex items-center justify-center flex-shrink-0 text-2xl`}>
                    {item.progress >= 80 ? '🏆' : item.progress >= 50 ? '📖' : '📝'}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                            <h3 className="font-bold text-gray-900 leading-tight">{item.documentName}</h3>
                            <p className={`text-sm font-medium mt-1 ${c.text}`}>{item.subject}</p>
                        </div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold ${scoreColor} flex-shrink-0`}>
                            <Trophy className="w-3.5 h-3.5" />
                            {item.lastScore}%
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                        {[
                            { icon: Clock, label: 'Révisions', value: item.totalRevisions },
                            { icon: FileText, label: 'Résumé', value: item.summaryGenerated ? 'Généré' : 'Non créé', ok: item.summaryGenerated },
                            { icon: BookMarked, label: 'Fiches', value: item.flashcardsCount },
                            { icon: Brain, label: 'Quiz', value: item.quizzesCompleted },
                        ].map(({ icon: Icon, label, value, ok }) => (
                            <div key={label} className="bg-gray-50 rounded-xl px-3 py-2 text-center">
                                <Icon className={`w-4 h-4 mx-auto mb-1 ${ok === false ? 'text-gray-300' : ok === true ? 'text-emerald-500' : 'text-gray-400'}`} />
                                <p className="text-sm font-bold text-gray-900">{value}</p>
                                <p className="text-xs text-gray-500">{label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-gray-500">Progression du cours</span>
                            <span className="text-xs font-bold text-gray-700">{item.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full progress-bar ${item.progress >= 80 ? 'bg-emerald-500' : item.progress >= 50 ? 'bg-primary-500' : 'bg-amber-500'}`}
                                style={{ width: `${item.progress}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Calendar className="w-3.5 h-3.5" />
                            Dernière révision : <strong className="text-gray-600">{item.lastRevision}</strong>
                        </div>
                        <button
                            onClick={() => navigate('/app/assistant')}
                            className="btn-primary text-xs py-2 px-4"
                        >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            Reprendre
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function HistoryPage() {
    const [filter, setFilter] = useState('Tous');
    const [sortBy, setSortBy] = useState('recent');

    const filters = ['Tous', 'En cours', 'Complété'];

    const filtered = mockHistory
        .filter(h => {
            if (filter === 'En cours') return h.progress < 80;
            if (filter === 'Complété') return h.progress >= 80;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'recent') return new Date(b.lastRevision) - new Date(a.lastRevision);
            if (sortBy === 'score') return b.lastScore - a.lastScore;
            if (sortBy === 'progress') return b.progress - a.progress;
            return 0;
        });

    const avgScore = Math.round(mockHistory.reduce((s, h) => s + h.lastScore, 0) / mockHistory.length);

    return (
        <div className="p-6 lg:p-8 max-w-5xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Clock className="w-6 h-6 text-gray-600" />
                        Historique de révision
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">{mockHistory.length} cours revisités</p>
                </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Cours révisés', value: mockHistory.length, color: 'text-primary-600 bg-primary-50', icon: BookOpen },
                    { label: 'Score moyen', value: `${avgScore}%`, color: 'text-emerald-600 bg-emerald-50', icon: Trophy },
                    { label: 'Quiz effectués', value: mockHistory.reduce((s, h) => s + h.quizzesCompleted, 0), color: 'text-amber-600 bg-amber-50', icon: Brain },
                    { label: 'Fiches créées', value: mockHistory.reduce((s, h) => s + h.flashcardsCount, 0), color: 'text-purple-600 bg-purple-50', icon: BookMarked },
                ].map(({ label, value, color, icon: Icon }) => (
                    <div key={label} className="card text-center p-4">
                        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mx-auto mb-2`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <p className="text-xl font-black text-gray-900">{value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                    </div>
                ))}
            </div>

            {/* Filters & sort */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                    {filters.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="input-field py-2 text-sm max-w-48"
                >
                    <option value="recent">Plus récent</option>
                    <option value="score">Meilleur score</option>
                    <option value="progress">Progression</option>
                </select>
            </div>

            {/* History list */}
            <div className="space-y-4">
                {filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun historique</h3>
                        <p className="text-sm text-gray-400">Commencez à réviser pour voir votre historique</p>
                    </div>
                ) : (
                    filtered.map(item => <HistoryCard key={item.id} item={item} />)
                )}
            </div>
        </div>
    );
}
