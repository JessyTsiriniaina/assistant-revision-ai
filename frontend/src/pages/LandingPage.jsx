import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    GraduationCap,
    Upload, MessageCircle,
    FileText, BookMarked, Brain, BarChart3, CheckCircle,
    ChevronRight, Sun, Moon, Sparkles, LayoutGrid, ChevronDown
} from 'lucide-react';
import hero1 from '../assets/hero1.jpg';
import hero2 from '../assets/hero2.jpg';

const features = [
    { icon: Upload, title: 'Importation des documents', desc: 'Importez vos documents au format PDF, DOCX ou TXT en quelques secondes.', color: 'bg-blue-100 text-blue-600' },
    { icon: MessageCircle, title: 'Assistant IA', desc: 'Posez vos questions et obtenez des réponses basées uniquement sur vos documents.', color: 'bg-indigo-100 text-indigo-600' },
    { icon: FileText, title: 'Résumés intelligents', desc: 'Transformez automatiquement un document long en résumé clair et structuré.', color: 'bg-purple-100 text-purple-600' },
    { icon: BookMarked, title: 'Fiches de révision', desc: 'Générez des fiches synthétiques pour mémoriser rapidement les notions importantes.', color: 'bg-emerald-100 text-emerald-600' },
    { icon: Brain, title: 'Quiz personnalisés', desc: 'Évaluez votre compréhension grâce à des quiz générés automatiquement.', color: 'bg-amber-100 text-amber-600' },
    { icon: BarChart3, title: 'Suivi des révisions', desc: 'Visualisez votre progression et votre historique de révision.', color: 'bg-rose-100 text-rose-600' },
];

/* ─── Toggle Jour / Nuit ─── */
function DarkModeToggle({ dark, toggle }) {
    return (
        <button
            onClick={toggle}
            aria-label={dark ? 'Mode jour' : 'Mode nuit'}
            style={{
                width: '52px', height: '28px', borderRadius: '14px',
                padding: '3px', border: 'none', cursor: 'pointer',
                position: 'relative', display: 'flex', alignItems: 'center',
                background: dark
                    ? 'linear-gradient(135deg,#1e3a8a,#312e81)'
                    : 'linear-gradient(135deg,#f59e0b,#fbbf24)',
                boxShadow: dark
                    ? '0 0 12px rgba(99,102,241,.5)'
                    : '0 0 12px rgba(251,191,36,.5)',
                transition: 'all .35s cubic-bezier(.4,0,.2,1)',
            }}
        >
            <span style={{ position: 'absolute', left: '5px', opacity: dark ? 0 : 1, transition: 'opacity .3s', fontSize: '11px' }}>☀️</span>
            <span style={{ position: 'absolute', right: '5px', opacity: dark ? 1 : 0, transition: 'opacity .3s', fontSize: '11px' }}>🌙</span>
            <span style={{
                width: '22px', height: '22px', borderRadius: '50%',
                background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: dark ? 'translateX(24px)' : 'translateX(0px)',
                transition: 'transform .35s cubic-bezier(.4,0,.2,1)',
                flexShrink: 0, zIndex: 1,
            }}>
                {dark
                    ? <Moon style={{ width: '12px', height: '12px', color: '#4338ca' }} />
                    : <Sun style={{ width: '12px', height: '12px', color: '#fef9e7' }} />
                }
            </span>
        </button>
    );
}

export default function LandingPage() {
    const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
        const root = document.documentElement;
        dark ? root.classList.add('dark') : root.classList.remove('dark');
        localStorage.setItem('theme', dark ? 'dark' : 'light');
    }, [dark]);

    return (
        <div className="min-h-screen bg-white">

            {/* ════════ NAVBAR ════════ */}
            <nav
                style={{ background: 'linear-gradient(90deg,#0a1628 0%,#0f2860 100%)' }}
                className="fixed top-0 left-0 right-0 z-50 shadow-lg"
            >
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg,#2563eb,#6366f1)' }}>
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-extrabold text-white text-xl tracking-wide">ReviseAI</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        <div className="relative group hidden md:block">
                            <button className="flex items-center gap-1.5 text-sm text-blue-200 hover:text-white transition-colors font-medium py-2">
                                <LayoutGrid className="w-4 h-4" />
                                Fonctionnalités
                                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
                            </button>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-64 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                                <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden">
                                    {features.map((f, i) => (
                                        <a
                                            key={i}
                                            href="#features"
                                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className={`w-8 h-8 rounded-lg ${f.color} flex items-center justify-center flex-shrink-0`}>
                                                <f.icon className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm text-gray-700 font-medium">{f.title}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <DarkModeToggle dark={dark} toggle={() => setDark(d => !d)} />
                            <Link
                                to="/app/dashboard"
                                className="flex items-center gap-1.5 text-sm font-semibold text-white px-4 py-2 rounded-xl transition-transform hover:scale-105"
                                style={{ background: 'linear-gradient(135deg,#2563eb,#4f46e5)', boxShadow: '0 4px 14px rgba(37,99,235,.35)' }}
                            >
                                Accéder au tableau de bord
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ════════ HERO – fond bleu marine ════════ */}
            <section
                className="pt-24 pb-0 px-0 overflow-hidden relative"
                style={{ background: 'linear-gradient(160deg,#0a1628 0%,#0f2860 55%,#1a3a8f 100%)', minHeight: '520px' }}
            >
                {/* Halos décoratifs */}
                <div style={{
                    position: 'absolute', top: '-80px', left: '-80px',
                    width: '400px', height: '400px', borderRadius: '50%',
                    background: 'radial-gradient(circle,rgba(99,102,241,.18) 0%,transparent 70%)',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: '300px', height: '300px', borderRadius: '50%',
                    background: 'radial-gradient(circle,rgba(37,99,235,.15) 0%,transparent 70%)',
                    pointerEvents: 'none',
                }} />

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-10 items-end">

                        {/* ── Texte gauche ── */}
                        <div className="animate-slide-up pb-14 pt-6">
                            <h1 style={{ fontSize: 'clamp(1.6rem,3.5vw,2.6rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>
                                <span style={{ color: '#e2e8f0' }}>Révisez plus </span>
                                <span style={{
                                    background: 'linear-gradient(90deg,#60a5fa,#818cf8)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>efficacement</span>
                                <span style={{ color: '#e2e8f0' }}> grâce à<br />l'intelligence artificielle.</span>
                            </h1>

                            <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.7, maxWidth: '440px' }}>
                                Importez vos documents, posez vos questions, générez des fiches, résumés et quiz — tout en un seul endroit.
                            </p>

                            <Link
                                to="/app/dashboard"
                                className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-white px-6 py-3 rounded-xl transition-transform hover:scale-105"
                                style={{ background: 'linear-gradient(135deg,#2563eb,#4f46e5)', boxShadow: '0 4px 20px rgba(37,99,235,.4)' }}
                            >
                                Accéder au tableau de bord
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* ── Photos droite ── */}
                        {/* Ordre : stressée (gauche/petite) → groupe ReviseAI (droite/grande) */}
                        <div className="hidden lg:flex gap-3 items-end justify-end">

                            {/* Photo gauche – étudiante stressée (moins haute) */}
                            <div className="relative rounded-t-2xl overflow-hidden animate-bounce-soft flex-shrink-0"
                                style={{ width: '210px', height: '255px', animationDelay: '1s', boxShadow: '0 20px 60px rgba(0,0,0,.4)', border: '2px solid rgba(255,255,255,.1)' }}>
                                <img src={hero2} alt="Étudiante stressée avant ReviseAI" className="w-full h-full object-cover object-top" />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(10,22,40,.6) 0%,transparent 60%)' }} />
                            </div>

                            {/* Photo droite – groupe ReviseAI (AGRANDIE pour voir l'écran) */}
                            <div className="relative rounded-t-2xl overflow-hidden animate-float flex-shrink-0"
                                style={{ width: '320px', height: '385px', boxShadow: '0 24px 70px rgba(0,0,0,.5)', border: '2px solid rgba(255,255,255,.15)' }}>
                                <img
                                    src={hero1}
                                    alt="Groupe d'étudiants avec ReviseAI"
                                    className="w-full h-full object-cover"
                                    style={{ objectPosition: 'center 18%' }}
                                />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(10,22,40,.35) 0%,transparent 45%)' }} />
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* ════════ ZONE UPLOAD ════════ */}
            <section className="py-10 px-6 bg-white">
                <div className="max-w-2xl mx-auto">
                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={(e) => { e.preventDefault(); setDragging(false); }}
                        style={{
                            border: `2px dashed ${dragging ? '#2563eb' : '#93c5fd'}`,
                            background: dragging ? '#eff6ff' : 'linear-gradient(145deg,#f8faff,#eef2ff)',
                            borderRadius: '20px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            justifyContent: 'center', gap: '16px',
                            padding: '44px 24px',
                            transition: 'all .2s ease',
                            cursor: 'pointer',
                        }}
                    >
                        <div style={{
                            width: '72px', height: '72px', borderRadius: '20px',
                            background: 'linear-gradient(135deg,#dbeafe,#e0e7ff)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 20px rgba(37,99,235,.2)',
                        }}>
                            <Upload style={{ width: '32px', height: '32px', color: '#2563eb' }} />
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '4px' }}>
                                Glisse ton fichier ici
                            </p>
                            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                PDF, DOCX ou TXT · Jusqu'à 20 Mo
                            </p>
                        </div>

                        <label style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '10px 22px',
                            background: 'linear-gradient(135deg,#2563eb,#4f46e5)',
                            color: '#fff', fontSize: '0.85rem', fontWeight: 600,
                            borderRadius: '12px', cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(37,99,235,.35)',
                        }}>
                            <Upload style={{ width: '16px', height: '16px' }} />
                            Parcourir les fichiers
                            <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" />
                        </label>
                    </div>
                </div>
            </section>

            {/* ════════ FEATURES ════════ */}
            <section id="features" className="py-20 px-6 bg-surface">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 rounded-full px-4 py-1.5 mb-4">
                            <Sparkles className="w-3.5 h-3.5 text-primary-600" />
                            <span className="text-xs font-semibold text-primary-700">Tout ce dont vous avez besoin</span>
                        </div>
                        <h2 className="section-title">Des outils pensés pour tous</h2>
                        <p className="section-subtitle max-w-2xl mx-auto">
                            De l'importation à l'évaluation, chaque fonctionnalité est conçue pour maximiser votre efficacité de révision.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className="card-hover group cursor-pointer" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                                    <f.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
                                <div className="mt-4 flex items-center gap-1 text-primary-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                    En savoir plus <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════ HOW IT WORKS ════════ */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="section-title">Comment ça fonctionne ?</h2>
                        <p className="section-subtitle">Trois étapes simples pour transformer votre façon de réviser</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: '01', icon: Upload, title: 'Importez votre document', desc: "Glissez-déposez votre PDF, DOCX ou TXT. Notre IA analyse et indexe le contenu en quelques secondes.", color: 'bg-blue-500' },
                            { step: '02', icon: Brain, title: "L'IA génère vos ressources", desc: "Résumés, fiches de révision et quiz sont créés automatiquement à partir de vos documents.", color: 'bg-indigo-500' },
                            { step: '03', icon: CheckCircle, title: 'Révisez et progressez', desc: "Utilisez l'assistant pour vos questions, testez-vous avec les quiz et suivez votre progression.", color: 'bg-emerald-500' },
                        ].map((item, i) => (
                            <div key={i} className="text-center group">
                                <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-6 shadow-soft group-hover:shadow-glow transition-all duration-300 group-hover:scale-105`}>
                                    <item.icon className="w-8 h-8 text-white" />
                                </div>
                                <div className="inline-block bg-gray-100 text-gray-400 text-xs font-bold px-2 py-0.5 rounded-full mb-3">{item.step}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════ CTA – bleu marine ════════ */}
            <section className="py-20 px-6 bg-gradient-blue">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
                        Prêt à révolutionner vos révisions ?
                    </h2>
                    <p className="text-blue-300 text-lg">
                        Rejoignez des milliers d'utilisateurs qui révisent plus intelligemment avec l'IA.
                    </p>
                </div>
            </section>

            {/* ════════ FOOTER – gris argenté ════════ */}
            <footer
                style={{
                    background: 'linear-gradient(135deg,#b0b8c1 0%,#d9dde2 40%,#c8cdd4 70%,#9da5ae 100%)',
                    borderTop: '1px solid #a8b2bb',
                }}
                className="py-12 px-6"
            >
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow"
                                style={{ background: 'linear-gradient(135deg,#2563eb,#4f46e5)' }}>
                                <GraduationCap className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-gray-800">ReviseAI</span>
                        </div>
                        <div className="flex gap-6 text-sm">
                            <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">Conditions</a>
                            <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">Confidentialité</a>
                            <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">Contact</a>
                        </div>
                        <p className="text-sm text-gray-700">© 2026 ReviseAI. Tous droits réservés.</p>
                    </div>
                </div>
            </footer>

        </div>
    );
}
