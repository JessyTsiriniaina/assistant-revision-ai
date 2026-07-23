import { Link } from 'react-router-dom';
import { useState } from 'react';
import { GraduationCap, User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function RegisterPage() {
    const { register, isLoading } = useAuth();
    const { addToast } = useToast();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', level: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Nom requis';
        if (!form.email) e.email = 'Email requis';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide';
        if (!form.password) e.password = 'Mot de passe requis';
        else if (form.password.length < 8) e.password = 'Min. 8 caractères';
        if (form.password !== form.confirm) e.confirm = 'Les mots de passe ne correspondent pas';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        const result = await register(form.name, form.email, form.password);
        if (result.success) {
            addToast('Compte créé avec succès ! Bienvenue 🎉', 'success');
        }
    };

    const passwordStrength = () => {
        const p = form.password;
        if (!p) return 0;
        let s = 0;
        if (p.length >= 8) s++;
        if (/[A-Z]/.test(p)) s++;
        if (/[0-9]/.test(p)) s++;
        if (/[^A-Za-z0-9]/.test(p)) s++;
        return s;
    };

    const strength = passwordStrength();
    const strengthLabel = ['', 'Faible', 'Moyen', 'Bon', 'Fort'];
    const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-emerald-400'];

    return (
        <div className="min-h-screen bg-hero flex items-center justify-center p-6 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center justify-center gap-2.5 group mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-blue flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Créer un compte</h1>
                    <p className="text-gray-500 text-sm">Commencez à réviser intelligemment, gratuitement</p>
                </div>

                <div className="card shadow-soft p-8 animate-slide-up">
                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Nom complet</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                    className={`input-field pl-10 ${errors.name ? 'border-red-400' : ''}`}
                                    placeholder="Sophie Martin"
                                />
                            </div>
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                    className={`input-field pl-10 ${errors.email ? 'border-red-400' : ''}`}
                                    placeholder="vous@example.com"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        {/* Level */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Niveau d'étude</label>
                            <select
                                value={form.level}
                                onChange={e => setForm(p => ({ ...p, level: e.target.value }))}
                                className="input-field"
                            >
                                <option value="">Sélectionner votre niveau...</option>
                                <option>Lycée</option>
                                <option>Licence 1</option>
                                <option>Licence 2</option>
                                <option>Licence 3</option>
                                <option>Master 1</option>
                                <option>Master 2</option>
                                <option>Doctorat</option>
                                <option>Autre</option>
                            </select>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                    className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-400' : ''}`}
                                    placeholder="Min. 8 caractères"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {form.password && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor[strength] : 'bg-gray-200'}`} />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500">Force : <span className="font-medium">{strengthLabel[strength]}</span></p>
                                </div>
                            )}
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        {/* Confirm */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmer le mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                <input
                                    type="password"
                                    value={form.confirm}
                                    onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                                    className={`input-field pl-10 ${errors.confirm ? 'border-red-400' : ''}`}
                                    placeholder="••••••••"
                                />
                                {form.confirm && form.password === form.confirm && (
                                    <CheckCircle className="absolute right-3 top-3.5 w-4 h-4 text-emerald-500" />
                                )}
                            </div>
                            {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
                        </div>

                        <div className="flex items-start gap-2 pt-1">
                            <input type="checkbox" id="terms" className="mt-0.5 accent-primary-600" required />
                            <label htmlFor="terms" className="text-xs text-gray-500">
                                J'accepte les{' '}
                                <a href="#" className="text-primary-600 hover:underline">Conditions d'utilisation</a>{' '}
                                et la{' '}
                                <a href="#" className="text-primary-600 hover:underline">Politique de confidentialité</a>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary justify-center py-3.5 text-base mt-2 disabled:opacity-60"
                        >
                            {isLoading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Création du compte...</>
                            ) : (
                                <>Créer mon compte<ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Déjà un compte ?{' '}
                    <Link to="/login" className="text-primary-600 font-semibold hover:underline">
                        Se connecter
                    </Link>
                </p>
            </div>
        </div>
    );
}
