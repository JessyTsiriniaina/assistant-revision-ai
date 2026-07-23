import { useState } from 'react';
import {
    User, Mail, GraduationCap, Globe, Camera, Edit3,
    Save, X, Shield, Bell, Trash2, LogOut, CheckCircle, Key
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const LEVELS = ['Lycée', 'Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2', 'Doctorat', 'Autre'];
const LANGUAGES = ['Français', 'English', 'Español', 'Deutsch', 'Italiano'];

export default function ProfilePage() {
    const { user, updateProfile, logout } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        level: user?.level || '',
        language: user?.language || '',
    });
    const [activeTab, setActiveTab] = useState('profile');

    const handleSave = () => {
        updateProfile(form);
        setEditing(false);
        addToast('Profil mis à jour avec succès !', 'success');
    };

    const handleCancel = () => {
        setForm({ name: user?.name, email: user?.email, level: user?.level, language: user?.language });
        setEditing(false);
    };

    const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

    const tabs = [
        { id: 'profile', label: 'Profil', icon: User },
        { id: 'security', label: 'Sécurité', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    return (
        <div className="p-6 lg:p-8 max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                <User className="w-6 h-6 text-primary-600" />
                Mon profil
            </h1>

            {/* Profile banner */}
            <div className="relative bg-gradient-blue rounded-2xl p-6 mb-6 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute right-8 top-4 w-32 h-32 rounded-full bg-white" />
                    <div className="absolute right-24 bottom-2 w-20 h-20 rounded-full bg-white" />
                </div>
                <div className="relative flex items-center gap-5">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center border-2 border-white/30">
                            <span className="text-white text-2xl font-black">{initials}</span>
                        </div>
                        <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white text-primary-600 flex items-center justify-center shadow-soft hover:shadow-card transition-shadow">
                            <Camera className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <div className="text-white">
                        <h2 className="text-xl font-black">{user?.name}</h2>
                        <p className="text-blue-100 text-sm">{user?.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium border border-white/30">
                                {user?.level}
                            </span>
                            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium border border-white/30">
                                🌐 {user?.language}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats summary */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                {[
                    { label: 'Documents', value: user?.stats?.documentsImported, color: 'text-blue-600' },
                    { label: 'Résumés', value: user?.stats?.summariesCreated, color: 'text-purple-600' },
                    { label: 'Fiches', value: user?.stats?.flashcardsGenerated, color: 'text-emerald-600' },
                    { label: 'Quiz', value: user?.stats?.quizzesCompleted, color: 'text-amber-600' },
                    { label: 'Réussite', value: `${user?.stats?.successRate}%`, color: 'text-primary-600' },
                ].map(s => (
                    <div key={s.label} className="card text-center p-3">
                        <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
                {tabs.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${activeTab === id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Icon className="w-4 h-4" />
                        {label}
                    </button>
                ))}
            </div>

            {/* Profile tab */}
            {activeTab === 'profile' && (
                <div className="card shadow-soft animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-900">Informations personnelles</h3>
                        {!editing ? (
                            <button onClick={() => setEditing(true)} className="btn-ghost border border-gray-200 text-sm">
                                <Edit3 className="w-4 h-4" />
                                Modifier
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button onClick={handleCancel} className="btn-ghost border border-gray-200 text-sm">
                                    <X className="w-4 h-4" />
                                    Annuler
                                </button>
                                <button onClick={handleSave} className="btn-primary text-sm">
                                    <Save className="w-4 h-4" />
                                    Enregistrer
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                Nom complet
                            </label>
                            {editing ? (
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                    className="input-field"
                                />
                            ) : (
                                <p className="text-sm text-gray-800 bg-gray-50 rounded-xl px-4 py-3 font-medium">{user?.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                Adresse email
                            </label>
                            {editing ? (
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                    className="input-field"
                                />
                            ) : (
                                <p className="text-sm text-gray-800 bg-gray-50 rounded-xl px-4 py-3 font-medium">{user?.email}</p>
                            )}
                        </div>

                        {/* Level */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-gray-400" />
                                Niveau d'étude
                            </label>
                            {editing ? (
                                <select
                                    value={form.level}
                                    onChange={e => setForm(p => ({ ...p, level: e.target.value }))}
                                    className="input-field"
                                >
                                    {LEVELS.map(l => <option key={l}>{l}</option>)}
                                </select>
                            ) : (
                                <p className="text-sm text-gray-800 bg-gray-50 rounded-xl px-4 py-3 font-medium">{user?.level}</p>
                            )}
                        </div>

                        {/* Language */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Globe className="w-4 h-4 text-gray-400" />
                                Langue préférée
                            </label>
                            {editing ? (
                                <select
                                    value={form.language}
                                    onChange={e => setForm(p => ({ ...p, language: e.target.value }))}
                                    className="input-field"
                                >
                                    {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                                </select>
                            ) : (
                                <p className="text-sm text-gray-800 bg-gray-50 rounded-xl px-4 py-3 font-medium">{user?.language}</p>
                            )}
                        </div>
                    </div>

                    {/* Joined */}
                    <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        Membre depuis le {new Date(user?.joinedAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            )}

            {/* Security tab */}
            {activeTab === 'security' && (
                <div className="card shadow-soft animate-fade-in space-y-4">
                    <h3 className="font-bold text-gray-900 mb-2">Sécurité du compte</h3>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <Key className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="text-sm font-semibold text-gray-800">Mot de passe</p>
                                <p className="text-xs text-gray-500">Dernière modification : il y a 30 jours</p>
                            </div>
                        </div>
                        <button className="btn-ghost border border-gray-200 text-sm">Modifier</button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-emerald-500" />
                            <div>
                                <p className="text-sm font-semibold text-gray-800">Authentification à deux facteurs</p>
                                <p className="text-xs text-gray-500">Non activée</p>
                            </div>
                        </div>
                        <button className="btn-primary text-sm py-2">Activer</button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-red-100">
                        <h4 className="text-sm font-bold text-red-600 mb-3">Zone dangereuse</h4>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => { logout(); addToast('Déconnecté avec succès', 'info'); navigate('/'); }}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Se déconnecter
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium transition-colors">
                                <Trash2 className="w-4 h-4" />
                                Supprimer le compte
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notifications tab */}
            {activeTab === 'notifications' && (
                <div className="card shadow-soft animate-fade-in space-y-4">
                    <h3 className="font-bold text-gray-900 mb-2">Préférences de notification</h3>
                    {[
                        { label: 'Rappels de révision', desc: 'Recevez des rappels quotidiens pour réviser vos cours', defaultOn: true },
                        { label: 'Nouvelles fonctionnalités', desc: 'Soyez informé des nouvelles fonctionnalités disponibles', defaultOn: true },
                        { label: 'Résultats des quiz', desc: 'Notification après chaque quiz terminé', defaultOn: false },
                        { label: 'Conseils de révision', desc: 'Recevez des conseils personnalisés basés sur vos révisions', defaultOn: true },
                    ].map(item => (
                        <NotificationToggle key={item.label} {...item} />
                    ))}
                </div>
            )}
        </div>
    );
}

function NotificationToggle({ label, desc, defaultOn }) {
    const [enabled, setEnabled] = useState(defaultOn);
    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
                <p className="text-sm font-semibold text-gray-800">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
            </div>
            <button
                onClick={() => setEnabled(!enabled)}
                className={`relative w-11 h-6 rounded-full transition-all duration-200 ${enabled ? 'bg-primary-600' : 'bg-gray-200'}`}
            >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
        </div>
    );
}
