import { useState, useEffect } from 'react';
import {
    FileText, Clock, User, Calendar, Copy, Download,
    RefreshCw, ChevronDown, ChevronUp, Lightbulb, Hash,
    BookOpen, CheckCircle, Zap, FlaskConical, Eye, Star, Loader2
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { fetchDocuments, generateSummary } from '../services/api';

const TABS = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Eye },
    { id: 'concepts', label: 'Concepts essentiels', icon: Lightbulb },
    { id: 'definitions', label: 'Définitions', icon: Hash },
    { id: 'formulas', label: 'Formules', icon: FlaskConical },
    { id: 'examples', label: 'Exemples', icon: BookOpen },
    { id: 'keypoints', label: 'Points clés', icon: CheckCircle },
];

function SummaryContent({ tab, summary }) {
    switch (tab) {
        case 'overview':
            return (
                <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed text-base">{summary.overview}</p>
                    <div className="grid sm:grid-cols-3 gap-4 pt-2">
                        {[
                            { label: 'Concepts', value: summary.concepts?.length || 0, color: 'text-blue-600 bg-blue-50' },
                            { label: 'Définitions', value: summary.definitions?.length || 0, color: 'text-purple-600 bg-purple-50' },
                            { label: 'Formules', value: summary.formulas?.length || 0, color: 'text-emerald-600 bg-emerald-50' },
                        ].map(s => (
                            <div key={s.label} className={`${s.color} rounded-xl p-4 text-center`}>
                                <p className={`text-3xl font-black ${s.color.split(' ')[0]}`}>{s.value}</p>
                                <p className="text-sm font-medium mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 'concepts':
            return (
                <ul className="space-y-3">
                    {(summary.concepts || []).map((c, i) => (
                        <li key={i} className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs font-bold">{i + 1}</span>
                            </div>
                            <span className="text-gray-800 font-medium text-sm leading-relaxed">{c}</span>
                        </li>
                    ))}
                </ul>
            );
        case 'definitions':
            return (
                <div className="space-y-3">
                    {(summary.definitions || []).map((d, i) => (
                        <div key={i} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <Hash className="w-4 h-4 text-purple-500" />
                                <span className="font-bold text-gray-900 text-sm">{d.term}</span>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed pl-6">{d.definition}</p>
                        </div>
                    ))}
                </div>
            );
        case 'formulas':
            return (
                <div className="space-y-3">
                    {(summary.formulas || []).map((f, i) => (
                        <div key={i} className="p-4 bg-gray-900 rounded-xl">
                            <p className="text-gray-400 text-xs mb-2 font-medium">{f.name}</p>
                            <p className="text-emerald-400 font-mono text-base font-bold">{f.formula}</p>
                        </div>
                    ))}
                </div>
            );
        case 'examples':
            return (
                <ul className="space-y-3">
                    {(summary.examples || []).map((ex, i) => (
                        <li key={i} className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                            <Zap className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-800 text-sm">{ex}</span>
                        </li>
                    ))}
                </ul>
            );
        case 'keypoints':
            return (
                <ul className="space-y-3">
                    {(summary.keyPoints || []).map((kp, i) => (
                        <li key={i} className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-800 text-sm font-medium">{kp}</span>
                        </li>
                    ))}
                </ul>
            );
        default:
            return null;
    }
}

export default function SummaryPage() {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('overview');
    const [documents, setDocuments] = useState([]);
    const [selectedDocId, setSelectedDocId] = useState(null);
    const [summary, setSummary] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [loadingDocs, setLoadingDocs] = useState(true);

    useEffect(() => {
        fetchDocuments()
            .then(list => {
                setDocuments(list);
                if (list.length > 0) setSelectedDocId(list[0].id);
            })
            .catch(() => addToast('Impossible de charger les documents', 'error'))
            .finally(() => setLoadingDocs(false));
    }, []);

    const loadSummary = async (docId) => {
        if (!docId) return;
        setIsGenerating(true);
        try {
            const result = await generateSummary(docId);
            setSummary(result);
        } catch {
            addToast('Erreur lors de la génération du résumé', 'error');
        }
        setIsGenerating(false);
    };

    useEffect(() => {
        if (selectedDocId) loadSummary(selectedDocId);
    }, [selectedDocId]);

    const handleRegenerate = () => {
        if (selectedDocId) loadSummary(selectedDocId);
    };

    const selectedDoc = documents.find(d => d.id === selectedDocId);

    return (
        <div className="p-6 lg:p-8 max-w-5xl mx-auto animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-purple-600" />
                        Résumé intelligent
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Généré automatiquement par IA</p>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={handleRegenerate} disabled={isGenerating || !selectedDocId} className="btn-primary text-sm py-2">
                        <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                        {isGenerating ? 'Génération...' : 'Régénérer'}
                    </button>
                </div>
            </div>

            <div className="flex gap-3 mb-6 flex-wrap">
                {loadingDocs ? (
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                ) : documents.map(doc => (
                    <button
                        key={doc.id}
                        onClick={() => setSelectedDocId(doc.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border
              ${selectedDocId === doc.id
                                ? 'bg-primary-600 text-white border-primary-600 shadow-glow'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                            }`}
                    >
                        <span>📄</span>
                        <span className="hidden sm:block">{doc.filename.replace(/\.[^/.]+$/, '').split(' ').slice(0, 3).join(' ')}</span>
                    </button>
                ))}
            </div>

            <div className="card mb-6">
                <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{selectedDoc ? selectedDoc.filename.replace(/\.[^/.]+$/, '') : 'Sélectionnez un document'}</h2>
                        <p className="text-primary-600 font-medium text-sm mt-1">{selectedDoc ? selectedDoc.status : ''}</p>
                    </div>
                    <div className="flex items-center gap-4 ml-auto text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            <span>{summary?.author || 'Assistant IA'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{summary?.date || new Date().toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{summary?.readingTime || '5 min'} de lecture</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-1 flex-wrap mb-6 bg-gray-50 p-1 rounded-xl">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all
                ${activeTab === id ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            <span className="hidden sm:block">{label}</span>
                        </button>
                    ))}
                </div>

                <div className="animate-fade-in">
                    {isGenerating ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                        </div>
                    ) : summary ? (
                        <SummaryContent tab={activeTab} summary={summary} />
                    ) : (
                        <p className="text-center text-gray-400 py-16">Sélectionnez un document pour générer un résumé</p>
                    )}
                </div>
            </div>

            <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4">
                <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-semibold text-amber-800 mb-1">Conseil de révision</p>
                    <p className="text-sm text-amber-700">Après avoir lu ce résumé, testez vos connaissances avec un quiz généré automatiquement ou créez des fiches de révision pour mémoriser les points clés.</p>
                </div>
            </div>
        </div>
    );
}
