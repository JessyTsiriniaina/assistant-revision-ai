import { Outlet, NavLink } from 'react-router-dom';
import { useState } from 'react';
import {
    LayoutDashboard, BookOpen, MessageCircle, FileText,
    BookMarked, Brain, Clock, User, GraduationCap,
    ChevronLeft, Menu, Bell, Search
} from 'lucide-react';
import { mockUser } from '../data/mockData';

const navItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', to: '/app/dashboard' },
    { icon: BookOpen, label: 'Mes cours', to: '/app/courses' },
    { icon: MessageCircle, label: 'Assistant IA', to: '/app/assistant' },
    { icon: FileText, label: 'Résumés', to: '/app/summaries' },
    { icon: BookMarked, label: 'Fiches', to: '/app/flashcards' },
    { icon: Brain, label: 'Quiz', to: '/app/quiz' },
    { icon: Clock, label: 'Historique', to: '/app/history' },
    { icon: User, label: 'Profil', to: '/app/profile' },
];

export default function AppLayout() {
    const user = mockUser;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

    return (
        <div className="flex h-screen bg-surface overflow-hidden">
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-20 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:relative z-30 h-full flex flex-col bg-white border-r border-gray-100 shadow-soft
        transition-all duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${sidebarOpen ? 'w-64' : 'w-20'}
      `}>
                {/* Logo */}
                <div className={`flex items-center gap-3 p-5 border-b border-gray-100 ${!sidebarOpen && 'justify-center'}`}>
                    <div className="w-9 h-9 rounded-xl bg-gradient-blue flex items-center justify-center flex-shrink-0 shadow-glow">
                        <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    {sidebarOpen && (
                        <div className="overflow-hidden">
                            <h1 className="font-bold text-gray-900 text-sm leading-tight">AI Study</h1>
                            <p className="text-xs text-primary-600 font-medium">Assistant</p>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="ml-auto p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hidden lg:flex"
                    >
                        <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${!sidebarOpen && 'rotate-180'}`} />
                    </button>
                </div>

                {/* Nav items */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {navItems.map(({ icon: Icon, label, to }) => (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) =>
                                isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'
                            }
                            title={!sidebarOpen ? label : undefined}
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                                    {sidebarOpen && <span className="truncate">{label}</span>}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User section */}
                <div className={`p-3 border-t border-gray-100 space-y-1`}>
                    <NavLink
                        to="/app/profile"
                        className={`flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer ${!sidebarOpen && 'justify-center'}`}
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-blue flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">{initials}</span>
                        </div>
                        {sidebarOpen && (
                            <div className="overflow-hidden">
                                <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                                <p className="text-xs text-gray-400 truncate">{user?.level}</p>
                            </div>
                        )}
                    </NavLink>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="flex items-center gap-4 px-6 py-4 bg-white border-b border-gray-100 shadow-sm flex-shrink-0">
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 lg:hidden"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher un cours, une fiche..."
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 ml-auto">
                        <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-600 rounded-full" />
                        </button>
                        <NavLink to="/app/profile">
                            <div className="w-9 h-9 rounded-full bg-gradient-blue flex items-center justify-center cursor-pointer hover:shadow-glow transition-shadow">
                                <span className="text-white text-xs font-bold">{initials}</span>
                            </div>
                        </NavLink>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
