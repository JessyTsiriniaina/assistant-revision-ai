import { Outlet, NavLink } from 'react-router-dom';
import { useState } from 'react';
import {
    LayoutDashboard, MessageCircle, FileText,
    BookMarked, Brain, GraduationCap,
    ChevronLeft, Menu
} from 'lucide-react';

const navItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', to: '/app/dashboard' },
    { icon: MessageCircle, label: 'Assistant IA', to: '/app/assistant' },
    { icon: FileText, label: 'Résumés', to: '/app/summaries' },
    { icon: BookMarked, label: 'Fiches', to: '/app/flashcards' },
    { icon: Brain, label: 'Quiz', to: '/app/quiz' },
];

export default function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

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
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
