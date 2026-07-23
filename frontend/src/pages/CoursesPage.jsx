import { useState } from 'react';
import { Search, Filter, Grid, List, Plus, BookOpen, FileText, BookMarked, Brain, ChevronRight, MoreVertical, Eye } from 'lucide-react';
import { mockDocuments, colorMap } from '../data/mockData';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import UploadZone from '../components/upload/UploadZone';

const FORMAT_COLORS = {
    PDF: 'badge-blue',
    DOCX: 'bg-indigo-100 text-indigo-700 badge',
    TXT: 'bg-gray-100 text-gray-600 badge',
};

function DocumentCard({ doc, view }) {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const c = colorMap[doc.color] || colorMap.blue;

    const actions = [
        { icon: Brain, label: 'Poser une question', to: '/app/assistant', color: 'text-primary-600' },
        { icon: FileText, label: 'Générer résumé', to: '/app/summaries', color: 'text-purple-600' },
        { icon: BookMarked, label: 'Créer des fiches', to: '/app/flashcards', color: 'text-emerald-600' },
        { icon: Brain, label: 'Lancer un quiz', to: '/app/quiz', color: 'text-amber-600' },
    ];

    if (view === 'list') {
        return (
            <div className="card-hover flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center text-2xl flex-shrink-0`}>
                    {doc.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-800 truncate">{doc.name}</h3>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className={doc.format === 'PDF' ? 'badge-blue' : 'badge bg-gray-100 text-gray-700'}>{doc.format}</span>
                        <span className="text-xs text-gray-400">{doc.pages} pages · {doc.size}</span>
                        <span className={`text-xs font-medium ${c.text}`}>{doc.subject}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-24 bg-gray-100 rounded-full h-1.5 hidden sm:block">
                        <div className={`${c.dot} h-1.5 rounded-full`} style={{ width: `${doc.progress}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 hidden sm:block">{doc.progress}%</span>
                    <button
                        onClick={() => navigate('/app/assistant')}
                        className="btn-ghost text-xs py-1.5 px-3 border border-gray-200"
                    >
                        <Eye className="w-3.5 h-3.5" />
                        Ouvrir
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="card group hover:shadow-soft hover:-translate-y-1 transition-all duration-200 flex flex-col">
            {/* Header */}
            <div className={`h-2 rounded-t-xl -mx-6 -mt-6 mb-5 ${c.dot}`} />
            <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center text-2xl`}>
                    {doc.icon}
                </div>
                <span className={`badge ${FORMAT_COLORS[doc.format] || 'badge-blue'}`}>{doc.format}</span>
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1 leading-tight">{doc.name}</h3>
            <p className={`text-xs font-medium mb-2 ${c.text}`}>{doc.subject}</p>
            <div className="flex gap-1 flex-wrap mb-3">
                {doc.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
                ))}
            </div>
            <div className="text-xs text-gray-400 mb-3">{doc.pages} pages · {doc.size}</div>
            {/* Progress */}
            <div className="mt-auto">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-500">Progression</span>
                    <span className="text-xs font-bold text-gray-700">{doc.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                    <div className={`${c.dot} h-1.5 rounded-full progress-bar`} style={{ width: `${doc.progress}%` }} />
                </div>
                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                    {actions.slice(0, 2).map(({ icon: Icon, label, to, color }) => (
                        <button
                            key={label}
                            onClick={() => navigate(to)}
                            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg px-2 py-2 transition-colors"
                        >
                            <Icon className={`w-3.5 h-3.5 ${color}`} />
                            <span className="truncate">{label.split(' ')[0]}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function CoursesPage() {
    const [view, setView] = useState('grid');
    const [search, setSearch] = useState('');
    const [showUpload, setShowUpload] = useState(false);
    const [filterFormat, setFilterFormat] = useState('Tous');

    const formats = ['Tous', 'PDF', 'DOCX', 'TXT'];
    const filtered = mockDocuments.filter(d => {
        const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.subject.toLowerCase().includes(search.toLowerCase());
        const matchFormat = filterFormat === 'Tous' || d.format === filterFormat;
        return matchSearch && matchFormat;
    });

    return (
        <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-primary-600" />
                        Mes cours
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">{mockDocuments.length} documents importés</p>
                </div>
                <button
                    onClick={() => setShowUpload(!showUpload)}
                    className="btn-primary text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Importer un cours
                </button>
            </div>

            {/* Upload zone */}
            {showUpload && (
                <div className="card mb-6 animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-gray-900">Importer un nouveau cours</h2>
                        <button onClick={() => setShowUpload(false)} className="text-sm text-gray-400 hover:text-gray-600">Fermer</button>
                    </div>
                    <UploadZone compact />
                </div>
            )}

            {/* Search + filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Rechercher un cours..."
                        className="input-field pl-9"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                        {formats.map(f => (
                            <button
                                key={f}
                                onClick={() => setFilterFormat(f)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterFormat === f ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                        <button onClick={() => setView('grid')} className={`p-1.5 rounded-lg transition-all ${view === 'grid' ? 'bg-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                            <Grid className="w-4 h-4" />
                        </button>
                        <button onClick={() => setView('list')} className={`p-1.5 rounded-lg transition-all ${view === 'list' ? 'bg-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Documents */}
            {filtered.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun cours trouvé</h3>
                    <p className="text-sm text-gray-400 mb-4">Essayez un autre terme de recherche ou importez un cours</p>
                    <button onClick={() => setShowUpload(true)} className="btn-primary text-sm">
                        <Plus className="w-4 h-4" /> Importer un cours
                    </button>
                </div>
            ) : view === 'grid' ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filtered.map(doc => <DocumentCard key={doc.id} doc={doc} view="grid" />)}
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(doc => <DocumentCard key={doc.id} doc={doc} view="list" />)}
                </div>
            )}
        </div>
    );
}
