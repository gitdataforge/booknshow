import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAppStore } from './store/useStore';

import Onboarding from './components/Onboarding';
import LocationToast from './components/LocationToast';
import Header from './components/Header';
import ExploreHeader from './components/ExploreHeader';
import Footer from './components/Footer';
import Home from './pages/Home';
import Maintenance from './pages/Maintenance';

// Dynamic module imports for high-performance routing
const pages = import.meta.glob('./pages/*/index.jsx', { eager: true });
const routes = Object.keys(pages).map((path) => {
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
            
            <main className={`flex-1 w-full mx-auto ${isIsolatedPage ? '' : 'max-w-[1400px] p-4 md:p-8'}`}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    {routes.map(({ name, Component }) => {
                        if (name === 'Home' || name === 'Maintenance') return null;
                        
                        if (name === 'Performer') {
                            return <Route key={name} path={`/performer/:id`} element={<Component />} />;
                        }

                        // Protect Dashboard: Redirect to standalone login if unauthorized
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
    const { hasOnboarded, setAuth, setWallet, user: storeUser } = useAppStore();
    const [loading, setLoading] = useState(true);
    const [localUser, setLocalUser] = useState(null);
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

    /**
     * EFFECT 1: Master Auth Listener
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
     * EFFECT 2: Private Data Guardian
     * Securely syncs wallet and balance ONLY when user is present.
     * Path: /artifacts/{appId}/users/{userId}/profile/data
     */
    useEffect(() => {
        if (!localUser || isMaintenance) return;

        // Mandated 6-segment path for private artifacts data
        const userRef = doc(db, 'artifacts', appId, 'users', localUser.uid, 'profile', 'data');
        
        const unsubscribeData = onSnapshot(userRef, 
            (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setWallet(data.balance || 0, 0);
                }
            },
            (error) => {
                // Intercept permission-denied errors gracefully during token refresh/auth transitions
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

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#114C2A] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }
    
    return (
        <BrowserRouter>
            {!hasOnboarded ? <Onboarding /> : <MainLayout />}
        </BrowserRouter>
    );
}