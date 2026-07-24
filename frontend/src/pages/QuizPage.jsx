import { useState, useEffect } from 'react';
import {
    Brain, Clock, CheckCircle, XCircle, ChevronRight,
    RotateCcw, TrendingUp, Lightbulb, Play,
    Timer, Target, Loader2
} from 'lucide-react';
import { useToast } from '../context/useToast';
import { generateQuiz, submitQuiz, fetchDocuments } from '../services/api';

function QuizStart({ quiz, onStart }) {
    return (
        <div className="card max-w-2xl mx-auto text-center shadow-soft animate-slide-up">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-6 shadow-soft">
                <Brain className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">{quiz.title}</h2>
            <p className="text-primary-600 font-medium mb-6">{quiz.documentName}</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                    { icon: Brain, label: 'Questions', value: quiz.totalQuestions },
                    { icon: Timer, label: 'Temps limite', value: `${Math.floor(quiz.timeLimit / 60)} min` },
                    { icon: Target, label: 'Difficulté', value: quiz.difficulty },
                ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-4">
                        <Icon className="w-5 h-5 text-primary-600 mx-auto mb-2" />
                        <p className="text-lg font-bold text-gray-900">{value}</p>
                        <p className="text-xs text-gray-500">{label}</p>
                    </div>
                ))}
            </div>

            <button onClick={onStart} className="btn-primary w-full justify-center py-4 text-base shadow-glow">
                <Play className="w-5 h-5 fill-white" />
                Lancer le quiz
            </button>
        </div>
    );
}

function QuizResults({ quiz, answers, timeSpent, onRestart }) {
    const totalCorrect = answers.filter((a, i) => a === quiz.questions[i].correctIndex).length;
    const score = Math.round((totalCorrect / quiz.totalQuestions) * 100);

    const getScoreColor = () => {
        if (score >= 80) return { text: 'text-emerald-600', bg: 'bg-emerald-100', msg: 'Excellent travail ! 🎉', sub: 'Vous maîtrisez très bien ce sujet.' };
        if (score >= 60) return { text: 'text-amber-600', bg: 'bg-amber-100', msg: 'Bon travail ! 👍', sub: 'Quelques points à retravailler.' };
        return { text: 'text-red-600', bg: 'bg-red-100', msg: 'Continuez à réviser ! 💪', sub: 'Ce sujet nécessite plus de révision.' };
    };

    const { text, bg, msg, sub } = getScoreColor();
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
            <div className="card text-center shadow-soft">
                <div className={`w-24 h-24 ${bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <span className={`text-3xl font-black ${text}`}>{score}%</span>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-1">{msg}</h2>
                <p className="text-gray-500 mb-6">{sub}</p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                        { label: 'Correctes', value: totalCorrect, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Incorrectes', value: quiz.totalQuestions - totalCorrect, color: 'text-red-500', bg: 'bg-red-50' },
                        { label: 'Temps', value: `${minutes}:${String(seconds).padStart(2, '0')}`, color: 'text-blue-600', bg: 'bg-blue-50' },
                    ].map(s => (
                        <div key={s.label} className={`${s.bg} rounded-xl p-3`}>
                            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>

                <div className="flex gap-3">
                    <button onClick={onRestart} className="flex-1 btn-secondary justify-center">
                        <RotateCcw className="w-4 h-4" />
                        Recommencer
                    </button>
                </div>
            </div>

            <div className="card shadow-soft">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    Révision des réponses
                </h3>
                <div className="space-y-4">
                    {quiz.questions.map((q, i) => {
                        const isCorrect = answers[i] === q.correctIndex;
                        return (
                            <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                                <div className="flex items-start gap-3 mb-3">
                                    {isCorrect ? (
                                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                    )}
                                    <p className="text-sm font-semibold text-gray-800">{q.question}</p>
                                </div>
                                {!isCorrect && <p className="text-xs text-emerald-700 ml-8 mb-1">✓ Bonne réponse : <strong>{q.options[q.correctIndex]}</strong></p>}
                                <p className="text-xs text-gray-600 ml-8 bg-white/60 rounded-lg px-3 py-2 border border-gray-100">
                                    💡 {q.explanation}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default function QuizPage() {
    const { addToast } = useToast();
    const [quiz, setQuiz] = useState(null);
    const [phase, setPhase] = useState('select');
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [selected, setSelected] = useState(null);
    const [revealed, setRevealed] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600);
    const [timeSpent, setTimeSpent] = useState(0);
    const [docs, setDocs] = useState([]);
    const [selectedDocId, setSelectedDocId] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchDocuments()
            .then(list => {
                const indexed = list.filter(d => d.status === 'indexed');
                setDocs(indexed);
                if (indexed.length > 0) setSelectedDocId(indexed[0].id);
            })
            .catch(() => {});
    }, []);

    const handleEndQuiz = async () => {
        if (submitting) return;
        setSubmitting(true);
        try {
            await submitQuiz(quiz.id, [...answers, selected]);
            setPhase('results');
        } catch {
            addToast('Erreur lors de la soumission du quiz', 'error');
            setPhase('results');
        }
        setSubmitting(false);
    };

    useEffect(() => {
        if (phase !== 'quiz' || !quiz) return;
        const interval = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(interval);
                    handleEndQuiz();
                    return 0;
                }
                return t - 1;
            });
            setTimeSpent(s => s + 1);
        }, 1000);
        return () => clearInterval(interval);
 }, [phase, quiz, handleEndQuiz]);

    const handleStart = async () => {
        if (!selectedDocId) {
            addToast('Sélectionnez un document', 'warning');
            return;
        }
        setGenerating(true);
        try {
            const q = await generateQuiz(selectedDocId, 5, 'moyen');
            setQuiz(q);
            setPhase('start');
            setTimeLeft(q.timeLimit || 600);
            setCurrentQ(0);
            setAnswers([]);
            setSelected(null);
            setRevealed(false);
            setTimeSpent(0);
        } catch {
            addToast('Erreur lors de la génération du quiz', 'error');
        }
        setGenerating(false);
    };

    const handleSelect = (idx) => {
        if (revealed) return;
        setSelected(idx);
    };

    const handleValidate = () => {
        if (selected === null) return;
        setRevealed(true);
        const isCorrect = selected === quiz.questions[currentQ].correctIndex;
        if (isCorrect) addToast('Bonne réponse ! ✨', 'success');
        else addToast('Incorrect. Lisez l\'explication.', 'error');
    };

    const handleNext = () => {
        const newAnswers = [...answers, selected];
        setAnswers(newAnswers);
        setSelected(null);
        setRevealed(false);

        if (currentQ + 1 >= quiz.totalQuestions) {
            handleEndQuiz();
        } else {
            setCurrentQ(currentQ + 1);
        }
    };

    const handleRestart = () => {
        setPhase('select');
        setQuiz(null);
        setCurrentQ(0);
        setAnswers([]);
        setSelected(null);
        setRevealed(false);
        setTimeLeft(600);
        setTimeSpent(0);
    };

    const progress = quiz ? ((currentQ) / quiz.totalQuestions) * 100 : 0;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const q = quiz?.questions?.[currentQ];

    if (generating) {
        return (
            <div className="p-6 lg:p-8 max-w-4xl mx-auto animate-fade-in">
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                </div>
            </div>
        );
    }

    if (phase === 'select') {
        return (
            <div className="p-6 lg:p-8 max-w-4xl mx-auto animate-fade-in">
                <div className="flex items-center gap-2 mb-6">
                    <Brain className="w-6 h-6 text-amber-600" />
                    <h1 className="text-2xl font-bold text-gray-900">Quiz</h1>
                </div>
                <div className="card max-w-2xl mx-auto text-center py-10 shadow-soft">
                    <Brain className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Générer un quiz</h2>
                    <p className="text-gray-500 mb-6">Choisissez un document puis générez le quiz</p>

                    {docs.length === 0 ? (
                        <p className="text-sm text-gray-400 mb-6">Aucun document indexé disponible.</p>
                    ) : (
                        <div className="flex flex-wrap justify-center gap-3 mb-8">
                            {docs.map(doc => (
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
                                    <span>{doc.filename.replace(/\.[^/.]+$/, '').split(' ').slice(0, 3).join(' ')}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    <button onClick={handleStart} disabled={!selectedDocId || generating} className="btn-primary mx-auto justify-center shadow-glow disabled:opacity-40">
                        {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
                        {generating ? 'Génération...' : 'Générer le quiz'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center gap-2 mb-6">
                <Brain className="w-6 h-6 text-amber-600" />
                <h1 className="text-2xl font-bold text-gray-900">Quiz</h1>
            </div>

            {phase === 'start' && quiz && <QuizStart quiz={quiz} onStart={() => setPhase('quiz')} />}

            {phase === 'quiz' && q && (
                <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
                    <div className="card shadow-soft">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-bold text-gray-600">
                                Question {currentQ + 1} / {quiz.totalQuestions}
                            </span>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold ${timeLeft < 60 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-700'}`}>
                                <Clock className="w-4 h-4" />
                                {minutes}:{String(seconds).padStart(2, '0')}
                            </div>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                            <div className="bg-primary-600 h-2 rounded-full progress-bar" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>{answers.filter((a, i) => a === quiz.questions[i]?.correctIndex).length} correctes</span>
                            <span>{Math.round(progress)}% complété</span>
                        </div>
                    </div>

                    <div className="card shadow-soft">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 leading-relaxed">{q.question}</h2>

                        <div className="space-y-3 mb-6">
                            {q.options.map((opt, idx) => {
                                let style = 'bg-white border-gray-200 hover:border-primary-300 hover:bg-primary-50 cursor-pointer';
                                if (selected === idx && !revealed) style = 'bg-primary-50 border-primary-500';
                                if (revealed && idx === q.correctIndex) style = 'bg-emerald-50 border-emerald-500';
                                if (revealed && selected === idx && idx !== q.correctIndex) style = 'bg-red-50 border-red-400';

                                return (
                                    <div
                                        key={idx}
                                        onClick={() => handleSelect(idx)}
                                        className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-150 ${style}`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold border-2 transition-all
                      ${selected === idx && !revealed ? 'bg-primary-600 text-white border-primary-600' :
                                                revealed && idx === q.correctIndex ? 'bg-emerald-500 text-white border-emerald-500' :
                                                    revealed && selected === idx ? 'bg-red-400 text-white border-red-400' :
                                                        'border-gray-300 text-gray-500'}`}>
                                            {revealed && idx === q.correctIndex ? <CheckCircle className="w-5 h-5" /> :
                                                revealed && selected === idx ? <XCircle className="w-5 h-5" /> :
                                                    String.fromCharCode(65 + idx)}
                                        </div>
                                        <span className="text-sm font-medium text-gray-800">{opt}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {revealed && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 animate-slide-up">
                                <div className="flex items-center gap-2 mb-2">
                                    <Lightbulb className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-bold text-blue-700">Explication</span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">{q.explanation}</p>
                            </div>
                        )}

                        <div className="flex gap-3">
                            {!revealed ? (
                                <button onClick={handleValidate} disabled={selected === null} className="flex-1 btn-primary justify-center disabled:opacity-40">
                                    <CheckCircle className="w-4 h-4" />
                                    Valider
                                </button>
                            ) : (
                                <button onClick={handleNext} disabled={submitting} className="flex-1 btn-primary justify-center disabled:opacity-40">
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> :
                                        currentQ + 1 >= quiz.totalQuestions ? 'Voir les résultats' : 'Question suivante'}
                                    {!submitting && <ChevronRight className="w-4 h-4" />}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {phase === 'results' && quiz && (
                <QuizResults quiz={quiz} answers={answers} timeSpent={timeSpent} onRestart={handleRestart} />
            )}
        </div>
    );
}
