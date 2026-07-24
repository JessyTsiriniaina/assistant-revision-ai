import { useState, useCallback, useEffect } from 'react';
import { Upload, File, X, CheckCircle, Loader2, Plus } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { colorMap } from '../../data/mockData';
import { fetchDocuments, uploadDocument, deleteDocument } from '../../services/api';

const ACCEPTED_FORMATS = ['.pdf', '.docx', '.txt'];
const FORMAT_COLORS = {
    PDF: 'bg-red-100 text-red-700',
    DOCX: 'bg-blue-100 text-blue-700',
    TXT: 'bg-gray-100 text-gray-700',
};

function formatExt(filename) {
    const ext = filename.split('.').pop().toUpperCase();
    return ext === 'MD' ? 'TXT' : ext;
}

function statusProgress(status) {
    if (status === 'indexed') return 100;
    if (status === 'processing') return 50;
    if (status === 'failed') return 0;
    return 20;
}

function statusLoading(status) {
    return status === 'pending' || status === 'processing';
}

function UploadedFileRow({ doc, onRemove }) {
    const progress = statusProgress(doc.status);
    const loading = statusLoading(doc.status);
    const fmt = formatExt(doc.filename);
    const name = doc.filename.replace(/\.[^/.]+$/, '');
    const icon = fmt === 'PDF' ? '📄' : fmt === 'DOCX' ? '📝' : '📃';
    const colors = colorMap[doc.color] || colorMap.blue;
    return (
        <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-card transition-shadow">
            <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center text-xl flex-shrink-0`}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{name}</p>
                <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${FORMAT_COLORS[fmt] || FORMAT_COLORS.TXT}`}>{fmt}</span>
                    <span className="text-xs text-gray-400">{doc.num_chunks || 0} passages</span>
                </div>
                <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                    <div
                        className="bg-primary-600 h-1.5 rounded-full progress-bar"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-xs text-gray-400 mt-1">{progress}% analysé</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                {!loading ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                    <Loader2 className="w-4 h-4 text-primary-500 animate-spin" />
                )}
                <button
                    onClick={() => onRemove(doc.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default function UploadZone({ compact = false }) {
    const { addToast } = useToast();
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    const loadFiles = useCallback(async () => {
        try {
            const data = await fetchDocuments();
            setFiles(data);
        } catch {
            addToast('Impossible de charger les documents', 'error');
        }
    }, []);

    useEffect(() => { loadFiles(); }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback(() => setIsDragging(false), []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        processFiles(droppedFiles);
    }, []);

    const handleFileInput = (e) => {
        const selectedFiles = Array.from(e.target.files);
        processFiles(selectedFiles);
    };

    const processFiles = async (newFiles) => {
        const valid = newFiles.filter(f => {
            const ext = '.' + f.name.split('.').pop().toLowerCase();
            return ACCEPTED_FORMATS.includes(ext);
        });
        if (valid.length < newFiles.length) {
            addToast('Certains fichiers ont un format non supporté', 'warning');
        }
        if (valid.length === 0) return;

        setUploading(true);
        try {
            for (const file of valid) {
                await uploadDocument(file);
                addToast(`"${file.name}" importé avec succès !`, 'success');
            }
            await loadFiles();
        } catch {
            addToast('Erreur lors de l\'import des documents', 'error');
        }
        setUploading(false);
    };

    const removeFile = async (id) => {
        try {
            await deleteDocument(id);
            setFiles(prev => prev.filter(f => f.id !== id));
            addToast('Document supprimé', 'info');
        } catch {
            addToast('Erreur lors de la suppression', 'error');
        }
    };

    return (
        <div className="space-y-4">
            {/* Drop zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          relative border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer
          ${isDragging
                        ? 'border-primary-500 bg-primary-50 scale-[1.01]'
                        : 'border-gray-200 bg-gray-50 hover:border-primary-300 hover:bg-primary-50/30'
                    }
          ${compact ? 'py-8' : 'py-14'}
        `}
            >
                <input
                    type="file"
                    multiple
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center pointer-events-none">
                    <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-all duration-200
            ${isDragging ? 'bg-primary-100' : 'bg-white border border-gray-200 shadow-sm'}`}>
                        <Upload className={`w-7 h-7 ${isDragging ? 'text-primary-600' : 'text-gray-400'}`} />
                    </div>
                    <p className="text-base font-semibold text-gray-700 mb-1">
                        {isDragging ? 'Déposez vos fichiers ici !' : 'Glissez-déposez vos documents ici'}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">ou cliquez pour parcourir vos fichiers</p>
                    <div className="flex items-center justify-center gap-2">
                        {['PDF', 'DOCX', 'TXT'].map(fmt => (
                            <span key={fmt} className={`text-xs px-2.5 py-1 rounded-full font-medium ${FORMAT_COLORS[fmt]}`}>{fmt}</span>
                        ))}
                    </div>
                    {!compact && (
                        <p className="text-xs text-gray-400 mt-3">Taille maximale : 50 MB par fichier</p>
                    )}
                </div>
            </div>

            {/* Uploaded files */}
            {files.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-700">Documents importés ({files.length})</h3>
                    </div>
                    {files.map(doc => (
                        <UploadedFileRow key={doc.id} doc={doc} onRemove={removeFile} />
                    ))}
                </div>
            )}
        </div>
    );
}
