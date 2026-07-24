import { useState, useEffect, useReducer } from 'react';
import {
    BookMarked, ChevronLeft,
    ChevronRight, RotateCcw, Lightbulb,
    BookOpen, Zap, Eye, Loader2
} from 'lucide-react';
import { colorMap } from '../data/mockData';
import { useToast } from '../context/useToast';
import { fetchFlashcards, generateFlashcards, fetchDocuments } from '../services/api';

function FlashCard({ card, isFlipped, onFlip }) {
    const c = colorMap[card.color] || colorMap.blue;
    const diffColors = {
        Facile: 'badge-green',
        Moyen: 'badge-yellow',
        Difficile: 'bg-red-100 text-red-700 badge',
    };

    return (
        <div className="flip-card w-full max-w-2xl mx-auto" style={{ height: '340px' }}>
            <div className={`flip-card-inner w-full h-full ${isFlipped ? 'flipped' : ''}`}>
                <div className="flip-card-front w-full h-full">
                    <div className={`w-full h-full card flex flex-col border-2 ${c.border} cursor-pointer shadow-card hover:shadow-soft`} onClick={onFlip}>
                        <div className={`h-1.5 rounded-t-2xl -mx-6 -mt-6 mb-4 ${c.dot}`} />
                        <div className="flex items-start justify-between mb-4">
                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${c.bg} ${c.text}`}>
                                {card.subject}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={diffColors[card.difficulty]}>{card.difficulty}</span>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                            <div className={`w-14 h-14 rounded-2xl ${c.bg} flex items-center justify-center mb-4`}>
                                <BookMarked className={`w-7 h-7 ${c.text}`} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-3">{card.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{card.summary}</p>
                        </div>

                        <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-100">
                            <Eye className="w-4 h-4 text-gray-400" />
                            <p className="text-xs text-gray-400">Cliquez pour voir l'explication</p>
                        </div>
                    </div>
                </div>

                <div className="flip-card-back w-full h-full">
                    <div className={`w-full h-full card flex flex-col bg-gradient-to-br from-white to-${card.color}-50/30 border-2 ${c.border} cursor-pointer overflow-y-auto`} onClick={onFlip}>
                        <div className={`h-1.5 rounded-t-2xl -mx-6 -mt-6 mb-4 bg-gradient-blue`} />

                        <div className="space-y-4 flex-1 overflow-y-auto">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Lightbulb className="w-4 h-4 text-primary-600" />
                                    <span className="text-xs font-bold text-primary-700 uppercase tracking-wide">Explication</span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">{card.explanation}</p>
                            </div>

                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                                    <span className="text-xs font-bold text-amber-700">Exemple</span>
                                </div>
                                <p className="text-sm text-gray-700">{card.example}</p>
                            </div>

                            <div className="bg-purple-50 border border-purple-100 rounded-xl p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap className="w-3.5 h-3.5 text-purple-600" />
                                    <span className="text-xs font-bold text-purple-700">Astuce mémo</span>
                                </div>
                                <p className="text-sm text-gray-700">{card.memoryTip}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-2 pt-3 border-t border-gray-100 mt-3">
                            <RotateCcw className="w-4 h-4 text-gray-400" />
                            <p className="text-xs text-gray-400">Cliquez pour retourner la carte</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function FlashcardsPage() {
    const { addToast } = useToast();
    const [generating, setGenerating] = useState(false);
    const [viewMode, setViewMode] = useState('cards');
    const [docs, setDocs] = useState([]);
    const [selectedDocId, setSelectedDocId] = useState(null);

    const [cardsState, dispatchCards] = useReducer(
        (s, a) => {
            switch (a.type) {
                case 'LOAD': return { ...s, loading: true };
                case 'LOADED': return { loading: false, data: a.data, index: 0, flipped: false };
                case 'ERROR': return { ...s, loading: false };
                case 'SET_INDEX': return { ...s, index: a.index };
                case 'FLIP': return { ...s, flipped: a.flipped };
                default: return s;
            }
        },
        { loading: true, data: [], index: 0, flipped: false }
    );
    const cards = cardsState.data;
    const loading = cardsState.loading;
    const currentIndex = cardsState.index;
    const isFlipped = cardsState.flipped;

    useEffect(() => {
        fetchDocuments()
            .then(list => {
                const indexed = list.filter(d => d.status === 'indexed');
                setDocs(indexed);
                if (!selectedDocId && indexed.length > 0) setSelectedDocId(indexed[0].id);
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        let cancelled = false;
        dispatchCards({ type: 'LOAD' });
        fetchFlashcards(selectedDocId)
            .then(data => { if (!cancelled) dispatchCards({ type: 'LOADED', data }); })
            .catch(() => { if (!cancelled) { addToast('Impossible de charger les fiches', 'error'); dispatchCards({ type: 'ERROR' }); } });
        return () => { cancelled = true; };
    }, [selectedDocId]);

    const filtered = cards;
    const current = filtered[currentIndex];

    const goNext = () => {
        const next = Math.min(currentIndex + 1, filtered.length - 1);
        dispatchCards({ type: 'FLIP', flipped: false });
        setTimeout(() => dispatchCards({ type: 'SET_INDEX', index: next }), 150);
    };

    const goPrev = () => {
        const prev = Math.max(currentIndex - 1, 0);
        dispatchCards({ type: 'FLIP', flipped: false });
        setTimeout(() => dispatchCards({ type: 'SET_INDEX', index: prev }), 150);
    };

    const handleGenerate = async () => {
        if (!selectedDocId) {
            addToast('Sélectionnez un document', 'warning');
            return;
        }
        setGenerating(true);
        try {
            await generateFlashcards(selectedDocId, 5);
            const updated = await fetchFlashcards(selectedDocId);
            dispatchCards({ type: 'LOADED', data: updated });
            addToast('Fiches générées avec succès !', 'success');
        } catch {
            addToast('Erreur lors de la génération', 'error');
        }
        setGenerating(false);
    };

    return (
        <div className="p-6 lg:p-8 max-w-5xl mx-auto animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <BookMarked className="w-6 h-6 text-emerald-600" />
                        Fiches de révision
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">{filtered.length} fiche{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleGenerate} disabled={generating || !selectedDocId} className="btn-primary text-sm py-2 disabled:opacity-40">
                        {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                        {generating ? 'Génération...' : 'Générer'}
                    </button>
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                        <button onClick={() => setViewMode('cards')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'cards' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>
                            Cartes
                        </button>
                        <button onClick={() => setViewMode('grid')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>
                            Grille
                        </button>
                    </div>
                </div>
            </div>

            {docs.length > 0 && (
                <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Document source</p>
                    <div className="flex gap-2 flex-wrap">
                        {docs.map(doc => (
                            <button
                                key={doc.id}
                                onClick={() => setSelectedDocId(doc.id)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border
                  ${selectedDocId === doc.id
                                        ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                                    }`}
                            >
                                <span>📄</span>
                                <span>{doc.filename.replace(/\.[^/.]+$/, '').split(' ').slice(0, 3).join(' ')}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                    <BookMarked className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucune fiche trouvée</h3>
                    <p className="text-sm text-gray-400">Ajustez vos filtres ou générez de nouvelles fiches</p>
                </div>
            ) : viewMode === 'cards' ? (
                <div className="space-y-6">
                    <div className="flex items-center justify-center gap-3">
                        <button onClick={goPrev} disabled={currentIndex === 0} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-colors">
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900">{currentIndex + 1}</span>
                            <span className="text-sm text-gray-400">/ {filtered.length}</span>
                        </div>
                        <button onClick={goNext} disabled={currentIndex === filtered.length - 1} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-colors">
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    <div className="w-full max-w-2xl mx-auto bg-gray-100 rounded-full h-1.5">
                        <div
                            className="bg-primary-600 h-1.5 rounded-full progress-bar"
                            style={{ width: `${((currentIndex + 1) / filtered.length) * 100}%` }}
                        />
                    </div>

                    {current && (
                        <FlashCard
                            card={current}
                            isFlipped={isFlipped}
                            onFlip={() => dispatchCards({ type: 'FLIP', flipped: !isFlipped })}
                        />
                    )}

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={goPrev}
                            disabled={currentIndex === 0}
                            className="btn-secondary text-sm disabled:opacity-30"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Précédent
                        </button>
                        <button
                            onClick={() => { dispatchCards({ type: 'FLIP', flipped: false }); dispatchCards({ type: 'SET_INDEX', index: Math.floor(Math.random() * filtered.length) }); }}
                            className="btn-ghost border border-gray-200 text-sm"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Aléatoire
                        </button>
                        <button
                            onClick={goNext}
                            disabled={currentIndex === filtered.length - 1}
                            className="btn-primary text-sm disabled:opacity-30"
                        >
                            Suivant
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map(card => {
                        const c = colorMap[card.color] || colorMap.blue;
                        return (
                            <div key={card.id} className="card-hover cursor-pointer" onClick={() => { dispatchCards({ type: 'SET_INDEX', index: filtered.indexOf(card) }); setViewMode('cards'); dispatchCards({ type: 'FLIP', flipped: false }); }}>
                                <div className="flex items-start justify-between mb-3">
                                    <span className={`badge ${c.bg} ${c.text} text-xs`}>{card.subject}</span>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">{card.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed mb-4">{card.summary}</p>
                                <div className="flex items-center justify-between">
                                    <span className={`badge ${card.difficulty === 'Facile' ? 'badge-green' : card.difficulty === 'Moyen' ? 'badge-yellow' : 'bg-red-100 text-red-700 badge'}`}>
                                        {card.difficulty}
                                    </span>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <Eye className="w-3.5 h-3.5" /> Voir détails
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
