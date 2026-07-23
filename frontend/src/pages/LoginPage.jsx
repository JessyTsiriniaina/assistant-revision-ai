import { Link } from 'react-router-dom';
import { useState } from 'react';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
    const { login, isLoading } = useAuth();
    const { addToast } = useToast();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!form.email) e.email = 'Email requis';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide';
        if (!form.password) e.password = 'Mot de passe requis';
        else if (form.password.length < 6) e.password = 'Min. 6 caractères';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        const result = await login(form.email, form.password);
        if (result.success) {
            addToast('Bienvenue ! Connexion réussie 🎉', 'success');
        } else {
            addToast('Identifiants incorrects', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-hero flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center justify-center gap-2.5 group mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-blue flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Bon retour !</h1>
                    <p className="text-gray-500 text-sm">Connectez-vous à votre espace de révision</p>
                </div>

                {/* Card */}
                <div className="card shadow-soft p-8 animate-slide-up">
                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 w-4.5 h-4.5 text-gray-400 w-4 h-4" />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                    className={`input-field pl-10 ${errors.email ? 'border-red-400 ring-2 ring-red-200' : ''}`}
                                    placeholder="vous@example.com"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-semibold text-gray-700">Mot de passe</label>
                                <a href="#" className="text-xs text-primary-600 hover:underline font-medium">Mot de passe oublié ?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                    className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-400 ring-2 ring-red-200' : ''}`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary justify-center py-3.5 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Connexion en cours...
                                </>
                            ) : (
                                <>
                                    Se connecter
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        {/* Demo */}
                        <div className="relative my-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-white px-3 text-xs text-gray-400">ou</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setForm({ email: 'demo@example.com', password: 'demo123' })}
                            className="w-full btn-ghost border border-gray-200 justify-center py-2.5 text-sm"
                        >
                            📚 Connexion avec le compte démo
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Pas encore de compte ?{' '}
                    <Link to="/register" className="text-primary-600 font-semibold hover:underline">
                        Créer un compte gratuit
                    </Link>
                </p>
            </div>
        </div>
    );
}
