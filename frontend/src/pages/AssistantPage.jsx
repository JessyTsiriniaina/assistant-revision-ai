import { useState, useRef, useEffect } from 'react';
import {
    Send, Paperclip, Plus, MessageCircle, BookOpen,
    Loader2, GraduationCap, ChevronRight, Trash2, Bot, User
} from 'lucide-react';
import { mockConversations, mockDocuments } from '../data/mockData';
import { useToast } from '../context/ToastContext';

function MessageBubble({ msg }) {
    const isUser = msg.role === 'user';
    return (
        <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-slide-up`}>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-primary-600' : 'bg-gradient-to-br from-indigo-500 to-primary-600'}`}>
                {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
            </div>
            {/* Bubble */}
            <div className={`max-w-xs sm:max-w-lg lg:max-w-2xl ${isUser ? 'chat-user' : 'chat-ai'}`}>
                {msg.content.split('\n').map((line, i) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={i} className="font-bold mb-1">{line.slice(2, -2)}</p>;
                    }
                    if (line.startsWith('- ')) {
                        return <li key={i} className="ml-4 list-disc text-sm">{line.slice(2)}</li>;
                    }
                    // Handle inline bold
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
                    {new Date(msg.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
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
    const [conversations, setConversations] = useState(mockConversations);
    const [activeConvId, setActiveConvId] = useState(mockConversations[0]?.id);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const messagesEndRef = useRef(null);

    const activeConv = conversations.find(c => c.id === activeConvId);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeConv?.messages, isTyping]);

    const sendMessage = async () => {
        if (!input.trim() || isTyping) return;
        const userMsg = {
            id: `m-${Date.now()}`,
            role: 'user',
            content: input.trim(),
            timestamp: new Date().toISOString(),
        };
        setInput('');
        setIsTyping(true);

        setConversations(prev => prev.map(c =>
            c.id === activeConvId
                ? { ...c, messages: [...c.messages, userMsg], lastMessage: userMsg.content }
                : c
        ));

        // Simulate AI response
        await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));

        const responses = [
            "D'après votre cours, ce concept est fondamental. **Voici l'explication :**\n\nL'idée principale repose sur trois piliers essentiels :\n- **Premier principe** : la structure de base\n- **Deuxième principe** : l'application pratique\n- **Troisième principe** : les cas particuliers\n\nVoulez-vous que j'approfondisse l'un de ces points ?",
            "Excellente question ! Selon votre document, on distingue deux approches complémentaires.\n\n**Approche théorique :** Elle définit les concepts fondamentaux qui permettent de modéliser le problème de manière abstraite.\n\n**Approche pratique :** Elle propose des implémentations concrètes, éprouvées en conditions réelles.",
            "Je vous réponds en me basant exclusivement sur votre cours importé. **Points clés :**\n\nCe sujet couvre plusieurs aspects importants que vous devrez maîtriser pour votre examen. La notion centrale à retenir est que tout dépend du contexte d'application.",
        ];

        const aiMsg = {
            id: `m-${Date.now() + 1}`,
            role: 'assistant',
            content: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date().toISOString(),
        };

        setConversations(prev => prev.map(c =>
            c.id === activeConvId
                ? { ...c, messages: [...c.messages, aiMsg] }
                : c
        ));
        setIsTyping(false);
    };

    const newConversation = () => {
        const doc = mockDocuments[Math.floor(Math.random() * mockDocuments.length)];
        const newConv = {
            id: `conv-${Date.now()}`,
            title: 'Nouvelle conversation',
            documentId: doc.id,
            documentName: doc.name,
            lastMessage: '',
            lastMessageAt: new Date().toISOString(),
            messageCount: 0,
            messages: [
                {
                    id: 'm-init',
                    role: 'assistant',
                    content: `Bonjour ! Je suis votre assistant IA pour le cours **"${doc.name}"**. Posez-moi vos questions et je vous répondrai en me basant uniquement sur ce document. 📚`,
                    timestamp: new Date().toISOString(),
                }
            ],
        };
        setConversations(prev => [newConv, ...prev]);
        setActiveConvId(newConv.id);
        addToast('Nouvelle conversation créée', 'success');
    };

    const deleteConv = (id, e) => {
        e.stopPropagation();
        setConversations(prev => prev.filter(c => c.id !== id));
        if (activeConvId === id) setActiveConvId(conversations.find(c => c.id !== id)?.id);
        addToast('Conversation supprimée', 'info');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const suggestedQuestions = [
        'Explique-moi le concept principal de ce cours',
        'Quelles sont les notions importantes à retenir ?',
        'Fais-moi un résumé des points clés',
        'Donne-moi un exemple concret',
    ];

    return (
        <div className="flex h-full animate-fade-in overflow-hidden">
            {/* Sidebar - Conversations */}
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
                    {conversations.map(conv => (
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
                                    <p className="text-xs text-gray-400 truncate mt-0.5">{conv.documentName}</p>
                                    {conv.lastMessage && (
                                        <p className="text-xs text-gray-400 truncate mt-1">{conv.lastMessage.slice(0, 40)}...</p>
                                    )}
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

            {/* Main chat area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Chat header */}
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
                        {activeConv && (
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <BookOpen className="w-3 h-3 text-primary-500" />
                                <p className="text-xs text-primary-600 font-medium truncate">{activeConv.documentName}</p>
                            </div>
                        )}
                    </div>
                    <span className="badge-blue hidden sm:flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        En ligne
                    </span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {activeConv?.messages.length === 0 || !activeConv ? (
                        <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-primary-600 flex items-center justify-center mb-4 shadow-glow animate-float">
                                <GraduationCap className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Bienvenue dans l'Assistant IA</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Posez vos questions sur vos cours et obtenez des réponses précises basées uniquement sur vos documents importés.
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
                    ) : (
                        <>
                            {activeConv.messages.map(msg => (
                                <MessageBubble key={msg.id} msg={msg} />
                            ))}
                            {isTyping && <TypingIndicator />}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-100 bg-white">
                    {activeConv && (
                        <div className="flex items-center gap-2 mb-2 px-1">
                            <BookOpen className="w-3.5 h-3.5 text-primary-500" />
                            <span className="text-xs text-gray-500">Réponses basées sur : <strong className="text-gray-700">{activeConv.documentName}</strong></span>
                        </div>
                    )}
                    <div className="flex items-end gap-3">
                        <button className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0" title="Joindre un document">
                            <Paperclip className="w-4 h-4" />
                        </button>
                        <div className="flex-1 relative">
                            <textarea
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Posez votre question sur le cours..."
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
