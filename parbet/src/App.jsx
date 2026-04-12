import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

// Store Imports
import { useAppStore } from './store/useStore';
import { useMainStore } from './store/useMainStore'; // CRITICAL: Real-time buyer data engine

// Structural & Layout Components
import Onboarding from './components/Onboarding';
import LocationToast from './components/LocationToast';
import Header from './components/Header';
import ExploreHeader from './components/ExploreHeader';
import Footer from './components/Footer';
import ProfileLayout from './layouts/ProfileLayout'; // Master Profile Wrapper

// Page Components
import Home from './pages/Home';
import Maintenance from './pages/Maintenance';

// Profile Standalone Nodes (Real-Time Functional Components)
import Profile from './pages/Profile';
import Orders from './pages/Profile/Orders';
import Listings from './pages/Profile/Listings';
import Sales from './pages/Profile/Sales';
import Payments from './pages/Profile/Payments';
import Settings from './pages/Profile/Settings';
import Wallet from './pages/Profile/Wallet';

// Dynamic module imports for high-performance routing
const pages = import.meta.glob('./pages/*/index.jsx', { eager: true });
const dynamicRoutes = Object.keys(pages).map((path) => {
    const name = path.match(/\.\/pages\/(.*)\/index\.jsx$/)[1];
    return { name, Component: pages[path].default };
});

function MainLayout() {
    const location = useLocation();
    const { isAuthenticated } = useAppStore();
    
    // Detect immersive/standalone pages that require global Header/Footer suppression
    const isIsolatedPage = ['/event', '/login', '/signup'].some(path => 
        location.pathname.toLowerCase().startsWith(path)
    );

    return (
        <div className="flex flex-col w-full min-h-screen bg-white text-brand-text relative">
            {!isIsolatedPage && (
                location.pathname === '/explore' ? <ExploreHeader /> : <Header />
            )}
            
            <main className={`flex-1 w-full mx-auto ${isIsolatedPage ? '' : 'max-w-[1400px] p-0'}`}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    
                    {/* 1:1 REPLICA: Nested Profile Architecture (Strictly Zero Modals) */}
                    <Route path="/profile" element={isAuthenticated ? <ProfileLayout /> : <Navigate to="/login" replace />}>
                        <Route index element={<Profile />} />
                        <Route path="orders" element={<Orders />} />
                        <Route path="listings" element={<Listings />} />
                        <Route path="sales" element={<Sales />} />
                        <Route path="payments" element={<Payments />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="wallet" element={<Wallet />} />
                    </Route>

                    {dynamicRoutes.map(({ name, Component }) => {
                        // Skip pages already handled by static routes or excluded
                        if (['Home', 'Maintenance', 'Profile', 'Dashboard'].includes(name)) return null;
                        
                        if (name === 'Performer') {
                            return <Route key={name} path={`/performer/:id`} element={<Component />} />;
                        }

                        // Protect Legacy Dashboard: Redirect to standalone login if unauthorized
                        if (name === 'Dashboard') {
                            return <Route key={name} path={`/dashboard`} element={isAuthenticated ? <Component /> : <Navigate to="/login" replace />} />;
                        }
                        
                        return <Route key={name} path={`/${name.toLowerCase()}`} element={<Component />} />;
                    })}

                    {/* Fallback to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
            
            {!isIsolatedPage && <Footer />}
            <LocationToast />
        </div>
    );
}

export default function App() {
    const isMaintenance = false; 
    const { hasOnboarded, setAuth, setWallet } = useAppStore();
    const { initAuth, authLoading } = useMainStore(); // Real-time state
    const [loading, setLoading] = useState(true);
    const [localUser, setLocalUser] = useState(null);
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

    /**
     * FEATURE 1: Master Authentication & Data Link
     * Triggers the useMainStore engine to establish secure websocket listeners.
     */
    useEffect(() => {
        if (!isMaintenance) {
            initAuth();
        }
    }, [isMaintenance, initAuth]);

    /**
     * EFFECT 1: Master Auth Listener (Legacy Preservation)
     * Tracks the Firebase Auth state and hydrates the global store.
     */
    useEffect(() => {
        if (isMaintenance) return;

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setLocalUser(user);
            if (user) {
                setAuth({
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName || user.email?.split('@')[0],
                    photo: user.photoURL
                });
            } else {
                setAuth(false);
            }
            setLoading(false);
        });

        return () => unsubscribeAuth();
    }, [isMaintenance, setAuth]);

    /**
     * EFFECT 2: Private Data Guardian (Legacy Preservation)
     */
    useEffect(() => {
        if (!localUser || isMaintenance) return;

        const userRef = doc(db, 'artifacts', appId, 'users', localUser.uid, 'profile', 'data');
        
        const unsubscribeData = onSnapshot(userRef, 
            (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setWallet(data.balance || 0, 0);
                }
            },
            (error) => {
                if (error.code === 'permission-denied') {
                    console.warn("Firestore sync delayed: waiting for auth handshake.");
                } else {
                    console.error("Firestore critical error:", error);
                }
            }
        );

        return () => unsubscribeData();
    }, [localUser, isMaintenance, appId, setWallet]);

    if (isMaintenance) return <Maintenance />;

    // Combined loading state: ensures both auth systems are ready before rendering
    if (loading || authLoading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#114C2A] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-[#54626c] font-bold text-[12px] uppercase tracking-widest">Securing Connection...</p>
            </div>
        );
    }
    
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            {!hasOnboarded ? <Onboarding /> : <MainLayout />}
        </BrowserRouter>
    );
}