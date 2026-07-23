import { useState } from 'react';
import {
    BookMarked, Star, Download, Printer, ChevronLeft,
    ChevronRight, Filter, Search, RotateCcw, Lightbulb,
    BookOpen, Zap, Eye
} from 'lucide-react';
import { mockFlashcards, colorMap } from '../data/mockData';
import { useToast } from '../context/ToastContext';

function FlashCard({ card, isFlipped, onFlip, onFavorite }) {
    const c = colorMap[card.color] || colorMap.blue;
    const diffColors = {
        Facile: 'badge-green',
        Moyen: 'badge-yellow',
        Difficile: 'bg-red-100 text-red-700 badge',
    };

    return (
        <div className="flip-card w-full max-w-2xl mx-auto" style={{ height: '340px' }}>
            <div className={`flip-card-inner w-full h-full ${isFlipped ? 'flipped' : ''}`}>
                {/* Front */}
                <div className="flip-card-front w-full h-full">
                    <div className={`w-full h-full card flex flex-col border-2 ${c.border} cursor-pointer shadow-card hover:shadow-soft`} onClick={onFlip}>
                        <div className={`h-1.5 rounded-t-2xl -mx-6 -mt-6 mb-4 ${c.dot}`} />
                        <div className="flex items-start justify-between mb-4">
                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${c.bg} ${c.text}`}>
                                {card.subject}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={diffColors[card.difficulty]}>{card.difficulty}</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onFavorite(card.id); }}
                                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <Star className={`w-4 h-4 ${card.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-gray-400'}`} />
                                </button>
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

                {/* Back */}
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
    const [cards, setCards] = useState(mockFlashcards);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [filterSubject, setFilterSubject] = useState('Tous');
    const [showFavOnly, setShowFavOnly] = useState(false);
    const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'grid'

    const subjects = ['Tous', ...new Set(mockFlashcards.map(c => c.subject))];

    const filtered = cards.filter(c => {
        const matchSub = filterSubject === 'Tous' || c.subject === filterSubject;
        const matchFav = !showFavOnly || c.isFavorite;
        return matchSub && matchFav;
    });

    const current = filtered[currentIndex];

    const goNext = () => {
        setIsFlipped(false);
        setTimeout(() => setCurrentIndex(i => Math.min(i + 1, filtered.length - 1)), 150);
    };

    const goPrev = () => {
        setIsFlipped(false);
        setTimeout(() => setCurrentIndex(i => Math.max(i - 1, 0)), 150);
    };

    const toggleFavorite = (id) => {
        setCards(prev => prev.map(c => c.id === id ? { ...c, isFavorite: !c.isFavorite } : c));
        addToast(cards.find(c => c.id === id)?.isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris ⭐', 'success');
    };

    return (
        <div className="p-6 lg:p-8 max-w-5xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <BookMarked className="w-6 h-6 text-emerald-600" />
                        Fiches de révision
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">{filtered.length} fiche{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => { setShowFavOnly(!showFavOnly); setCurrentIndex(0); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all
              ${showFavOnly ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                    >
                        <Star className={`w-4 h-4 ${showFavOnly ? 'text-amber-500 fill-amber-500' : ''}`} />
                        Favoris
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

            {/* Subject filter */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {subjects.map(s => (
                    <button
                        key={s}
                        onClick={() => { setFilterSubject(s); setCurrentIndex(0); setIsFlipped(false); }}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all
              ${filterSubject === s ? 'bg-primary-600 text-white border-primary-600 shadow-glow' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'}`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-20">
                    <BookMarked className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucune fiche trouvée</h3>
                    <p className="text-sm text-gray-400">Ajustez vos filtres pour voir plus de fiches</p>
                </div>
            ) : viewMode === 'cards' ? (
                <div className="space-y-6">
                    {/* Progress indicator */}
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

                    {/* Progress bar */}
                    <div className="w-full max-w-2xl mx-auto bg-gray-100 rounded-full h-1.5">
                        <div
                            className="bg-primary-600 h-1.5 rounded-full progress-bar"
                            style={{ width: `${((currentIndex + 1) / filtered.length) * 100}%` }}
                        />
                    </div>

                    {/* The card */}
                    {current && (
                        <FlashCard
                            card={current}
                            isFlipped={isFlipped}
                            onFlip={() => setIsFlipped(!isFlipped)}
                            onFavorite={toggleFavorite}
                        />
                    )}

                    {/* Navigation buttons */}
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
                            onClick={() => { setIsFlipped(false); setCurrentIndex(Math.floor(Math.random() * filtered.length)); }}
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
                // Grid view
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map(card => {
                        const c = colorMap[card.color] || colorMap.blue;
                        return (
                            <div key={card.id} className="card-hover cursor-pointer" onClick={() => { setCurrentIndex(filtered.indexOf(card)); setViewMode('cards'); setIsFlipped(false); }}>
                                <div className="flex items-start justify-between mb-3">
                                    <span className={`badge ${c.bg} ${c.text} text-xs`}>{card.subject}</span>
                                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(card.id); }} className="p-1 hover:bg-gray-100 rounded-lg">
                                        <Star className={`w-4 h-4 ${card.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                                    </button>
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
