import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from './lib/firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAppStore } from './store/useStore';
import { Home as IconHome, BarChart2, MessageCircle, Settings as IconSettings, Wallet, LayoutDashboard } from 'lucide-react';

import Onboarding from './components/Onboarding';
import Home from './pages/Home';
import Discovery from './pages/Discovery';
import TeamFocus from './pages/TeamFocus';

const pages = import.meta.glob('./pages/*/index.jsx', { eager: true });
const routes = Object.keys(pages).map((path) => {
  const name = path.match(/\.\/pages\/(.*)\/index\.jsx$/)[1];
  return { name, Component: pages[path].default };
});

function DesktopSidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const navItems = [
        { path: '/', icon: <IconHome size={20}/>, label: 'Dashboard' },
        { path: '/discovery', icon: <BarChart2 size={20}/>, label: 'Statistics' },
        { path: '/wallet', icon: <Wallet size={20}/>, label: 'Wallet' },
        { path: '/settings', icon: <IconSettings size={20}/>, label: 'Settings' },
    ];

    return (
        <div className="hidden md:flex w-64 h-full bg-brand-bg border-r border-white/5 flex-col p-6 shrink-0">
            <div className="flex items-center space-x-3 mb-12">
                <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center"><LayoutDashboard size={18} className="text-white"/></div>
                <h1 className="text-xl font-bold tracking-wider">PARBET</h1>
            </div>
            <nav className="flex-1 space-y-2">
                {navItems.map(item => (
                    <button key={item.label} onClick={() => navigate(item.path)} className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all ${location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)) ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-brand-muted hover:bg-brand-card hover:text-white'}`}>
                        {item.icon}
                        <span className="font-medium text-sm">{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
}

function MobileNav() {
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-bg border-t border-white/5 flex justify-around p-4 pb-6 z-50">
             <button onClick={() => navigate('/')} className={`flex flex-col items-center space-y-1 ${location.pathname === '/' ? 'text-brand-primary' : 'text-brand-muted'}`}><IconHome size={22}/><span className="text-[10px]">Home</span></button>
             <button onClick={() => navigate('/discovery')} className={`flex flex-col items-center space-y-1 ${location.pathname === '/discovery' ? 'text-brand-primary' : 'text-brand-muted'}`}><BarChart2 size={22}/><span className="text-[10px]">Stats</span></button>
             <button onClick={() => navigate('/chat')} className={`flex flex-col items-center space-y-1 ${location.pathname === '/chat' ? 'text-brand-primary' : 'text-brand-muted'}`}><MessageCircle size={22}/><span className="text-[10px]">Chat</span></button>
             <button onClick={() => navigate('/settings')} className={`flex flex-col items-center space-y-1 ${location.pathname.startsWith('/settings') ? 'text-brand-primary' : 'text-brand-muted'}`}><IconSettings size={22}/><span className="text-[10px]">Settings</span></button>
        </div>
    );
}

function MainLayout() {
    return (
        <div className="flex w-full h-full md:h-screen bg-brand-bg text-white overflow-hidden">
            <DesktopSidebar />
            <main className="flex-1 h-full overflow-y-auto relative pb-24 md:pb-0 w-full max-w-7xl mx-auto">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/discovery" element={<Discovery />} />
                    <Route path="/team" element={<TeamFocus />} />
                    {routes.map(({ name, Component }) => (
                        name !== 'Home' && name !== 'Discovery' && name !== 'TeamFocus' &&
                        <Route key={name} path={`/${name.toLowerCase()}`} element={<Component />} />
                    ))}
                </Routes>
            </main>
            <MobileNav />
        </div>
    );
}

export default function App() {
    const { hasOnboarded, setUser, setWallet } = useAppStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try { await signInAnonymously(auth); } catch (e) { console.error("Auth failed", e); }
        };
        initAuth();
        const unsubAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                setWallet(7890.78, 240); // Mock sync for layout
                setLoading(false);
            }
        });
        return () => unsubAuth();
    }, []);

    if (loading) return <div className="min-h-screen bg-brand-bg text-brand-primary flex items-center justify-center font-bold animate-pulse-slow">Loading Environment...</div>;
    
    return (
        <BrowserRouter>
            {!hasOnboarded ? <Onboarding /> : <MainLayout />}
        </BrowserRouter>
    );
}