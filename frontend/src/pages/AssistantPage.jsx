import { useState, useRef, useEffect } from 'react';
import {
    Send, Plus, MessageCircle,
    Loader2, GraduationCap, ChevronRight, Trash2, Bot, User
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import {
    fetchConversations, fetchConversation, deleteConversation, sendChatMessage
} from '../services/api';

function MessageBubble({ msg }) {
    const isUser = msg.role === 'user';
    return (
        <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-slide-up`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-primary-600' : 'bg-gradient-to-br from-indigo-500 to-primary-600'}`}>
                {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
            </div>
            <div className={`max-w-xs sm:max-w-lg lg:max-w-2xl ${isUser ? 'chat-user' : 'chat-ai'}`}>
                {msg.content.split('\n').map((line, i) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={i} className="font-bold mb-1">{line.slice(2, -2)}</p>;
                    }
                    if (line.startsWith('- ')) {
                        return <li key={i} className="ml-4 list-disc text-sm">{line.slice(2)}</li>;
                    }
                    const parts = line.split(/(\*\*[^*]+\*\*)/g);
                    return (
                        <p key={i} className="text-sm leading-relaxed mb-1">
                            {parts.map((part, j) =>
                                part.startsWith('**') && part.endsWith('**')
                                    ? <strong key={j}>{part.slice(2, -2)}</strong>
                                    : part
                            )}
                        </p>
                    );
                })}
                <p className={`text-xs mt-2 ${isUser ? 'text-blue-200' : 'text-gray-400'}`}>
                    {new Date(msg.created_at || msg.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
        </div>
    );
}

function TypingIndicator() {
    return (
        <div className="flex items-center gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-primary-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="chat-ai flex items-center gap-1 py-4 px-5">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
        </div>
    );
}

export default function AssistantPage() {
    const { addToast } = useToast();
    const [conversations, setConversations] = useState([]);
    const [activeConvId, setActiveConvId] = useState(null);
    const [activeConv, setActiveConv] = useState(null);
    const [loadingConv, setLoadingConv] = useState(false);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loadingInit, setLoadingInit] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchConversations()
            .then(list => {
                setConversations(list);
                if (list.length > 0) setActiveConvId(list[0].id);
            })
            .catch(() => addToast('Impossible de charger les conversations', 'error'))
            .finally(() => setLoadingInit(false));
    }, []);

    useEffect(() => {
        if (!activeConvId) { setActiveConv(null); return; }
        setLoadingConv(true);
        fetchConversation(activeConvId)
            .then(conv => setActiveConv(conv))
            .catch(() => addToast('Erreur lors du chargement de la conversation', 'error'))
            .finally(() => setLoadingConv(false));
    }, [activeConvId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeConv?.messages, isTyping]);

    const sendMessage = async () => {
        if (!input.trim() || isTyping) return;
        const text = input.trim();
        setInput('');
        setIsTyping(true);

        const backendId = typeof activeConvId === 'number' ? activeConvId : null;

        try {
            const result = await sendChatMessage(backendId, text);

            if (!backendId) {
                setConversations(prev => {
                    const exists = prev.find(c => c.id === result.conversation_id);
                    if (exists) return prev;
                    return [{ id: result.conversation_id, title: text.slice(0, 50) }, ...prev];
                });
                setActiveConvId(result.conversation_id);
            } else {
                const full = await fetchConversation(result.conversation_id);
                setActiveConv(full);
            }
        } catch {
            addToast('Erreur lors de l\'envoi du message', 'error');
        }
        setIsTyping(false);
    };

    const newConversation = () => {
        setActiveConvId(null);
        setActiveConv(null);
        addToast('Nouvelle conversation démarrée', 'success');
    };

    const deleteConv = async (id, e) => {
        e.stopPropagation();
        try {
            await deleteConversation(id);
            setConversations(prev => prev.filter(c => c.id !== id));
            if (activeConvId === id) {
                const next = conversations.find(c => c.id !== id);
                setActiveConvId(next ? next.id : null);
            }
            addToast('Conversation supprimée', 'info');
        } catch {
            addToast('Erreur lors de la suppression', 'error');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const displayConv = activeConv || {
        id: null, title: 'Nouvelle conversation',
        messages: [{
            id: 'm-init', role: 'assistant',
            content: 'Bonjour ! Je suis votre assistant IA. Posez-moi vos questions et je vous répondrai en me basant uniquement sur l\'ensemble des documents de votre base de connaissances. 📚',
            created_at: new Date().toISOString(),
        }]
    };

    const suggestedQuestions = [
        'Explique-moi les concepts principaux de mes documents',
        'Quelles sont les notions importantes à retenir ?',
        'Fais-moi un résumé des points clés',
        'Donne-moi un exemple concret',
    ];

    return (
        <div className="flex h-full animate-fade-in overflow-hidden">
            <div className={`${sidebarOpen ? 'w-72' : 'w-0'} flex-shrink-0 border-r border-gray-100 bg-white flex flex-col transition-all duration-300 overflow-hidden`}>
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-bold text-gray-900 text-sm">Conversations</h2>
                        <button
                            onClick={newConversation}
                            className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center hover:bg-primary-700 transition-colors"
                            title="Nouvelle conversation"
                        >
                            <Plus className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                    {loadingInit ? (
                        <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>
                    ) : conversations.map(conv => (
                        <div
                            key={conv.id}
                            onClick={() => setActiveConvId(conv.id)}
                            className={`p-3 rounded-xl cursor-pointer transition-all duration-150 group relative
                ${activeConvId === conv.id ? 'bg-primary-50 border border-primary-100' : 'hover:bg-gray-50'}`}
                        >
                            <div className="flex items-start gap-2">
                                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <MessageCircle className="w-4 h-4 text-primary-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-xs font-semibold truncate ${activeConvId === conv.id ? 'text-primary-700' : 'text-gray-800'}`}>
                                        {conv.title}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => deleteConv(conv.id, e)}
                                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all flex-shrink-0"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-3 border-t border-gray-100">
                    <button onClick={newConversation} className="w-full btn-primary text-xs py-2.5 justify-center">
                        <Plus className="w-3.5 h-3.5" />
                        Nouvelle conversation
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0">
                <div className="px-6 py-4 border-b border-gray-100 bg-white shadow-sm flex items-center gap-3">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
                    >
                        <ChevronRight className={`w-4 h-4 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-primary-600 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm">AI Study Assistant</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">Basé sur toute votre base de connaissances</p>
                    </div>
                    <span className="badge-blue hidden sm:flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        En ligne
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {activeConvId === null ? (
                        <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-primary-600 flex items-center justify-center mb-4 shadow-glow animate-float">
                                <GraduationCap className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Bienvenue dans l'Assistant IA</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Posez vos questions et obtenez des réponses précises basées uniquement sur l'ensemble des documents de votre base de connaissances.
                            </p>
                            <div className="w-full space-y-2">
                                {suggestedQuestions.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setInput(q)}
                                        className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 text-sm text-gray-700 transition-all"
                                    >
                                        💡 {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : loadingConv ? (
                        <div className="h-full flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    ) : (
                        <>
                            {displayConv.messages.map(msg => (
                                <MessageBubble key={msg.id} msg={msg} />
                            ))}
                            {isTyping && <TypingIndicator />}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                <div className="p-4 border-t border-gray-100 bg-white">
                    <div className="flex items-end gap-3">
                        <div className="flex-1 relative">
                            <textarea
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Posez votre question sur vos documents..."
                                rows={1}
                                className="input-field resize-none pr-12 py-3 text-sm max-h-32 overflow-y-auto"
                                style={{ minHeight: '48px' }}
                            />
                        </div>
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || isTyping}
                            className="p-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white transition-colors flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:shadow-glow active:scale-95"
                        >
                            {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-2">Entrée pour envoyer · Maj+Entrée pour une nouvelle ligne</p>
                </div>
            </div>
        </div>
    );
}
