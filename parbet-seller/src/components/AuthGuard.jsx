import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ShieldCheck, Lock, AlertCircle } from 'lucide-react';
import { useSellerStore } from '../store/useSellerStore';

export default function AuthGuard() {
    const location = useLocation();
    
    // FEATURE 1: Secure State Interception from Global Store
    const { isAuthenticated, isLoading, user, authStatus } = useSellerStore();

    // FEATURE 2: Failsafe Timeout Engine
    const [timeoutTriggered, setTimeoutTriggered] = useState(false);

    // FEATURE 3: 10-Second Infinite-Load Breaker
    // Prevents the user from being stuck on a blank loading screen if Firebase drops the websocket
    useEffect(() => {
        let timer;
        if (isLoading) {
            timer = setTimeout(() => {
                setTimeoutTriggered(true);
            }, 10000); // 10 seconds maximum wait time
        }
        return () => clearTimeout(timer);
    }, [isLoading]);

    // FEATURE 4: Framer Motion Animation Physics
    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
        exit: { opacity: 0, scale: 1.05, transition: { duration: 0.2 } }
    };

    // FEATURE 5: Anti-Flash Pre-Flight Loader
    if (isLoading && !timeoutTriggered) {
        return (
            <AnimatePresence mode="wait">
                <motion.div 
                    key="auth-loader"
                    initial="hidden" 
                    animate="visible" 
                    exit="exit"
                    variants={containerVariants}
                    className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center font-sans relative overflow-hidden"
                >
                    {/* Background Topography */}
                    <div className="absolute inset-0 flex justify-center items-center opacity-[0.03] pointer-events-none">
                        <Lock size={400} />
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        {/* FEATURE 6: Cryptographic Lock UI */}
                        <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mb-6 relative border border-[#e2e2e2]">
                            <ShieldCheck size={32} className="text-[#458731]" />
                            {/* FEATURE 7: Infinite Orbit Animation */}
                            <motion.div 
                                animate={{ rotate: 360 }} 
                                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }} 
                                className="absolute inset-0 border-2 border-dashed border-[#458731]/40 rounded-full" 
                            />
                        </div>
                        
                        <div className="flex items-center gap-3 mb-2">
                            <Loader2 className="w-5 h-5 animate-spin text-[#1a1a1a]" />
                            <h2 className="text-[18px] font-black text-[#1a1a1a] tracking-tight">Securing Connection</h2>
                        </div>
                        
                        <p className="text-[13px] font-bold text-[#54626c] tracking-widest uppercase mt-2">
                            Verifying Seller Identity...
                        </p>
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    // FEATURE 8: Graceful Timeout Degradation
    if (timeoutTriggered && isLoading) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center font-sans p-4 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 border border-red-100">
                    <AlertCircle size={28} className="text-red-500" />
                </div>
                <h2 className="text-[20px] font-black text-[#1a1a1a] mb-2">Connection Timeout</h2>
                <p className="text-[14px] text-[#54626c] max-w-md mb-6">
                    We couldn't verify your secure session. Please check your internet connection and try logging in again.
                </p>
                <button 
                    onClick={() => window.location.href = '/auth/login'}
                    className="bg-[#1a1a1a] text-white px-8 py-3 rounded-[4px] font-bold text-[14px] hover:bg-[#333333] transition-colors"
                >
                    Return to Login
                </button>
            </div>
        );
    }

    // FEATURE 9: Hard Redirect with Deep-Link Memory
    // Vaults unverified users to login, but captures their exact URL path and query parameters
    if (!isAuthenticated || !user) {
        const currentPath = location.pathname + location.search;
        return <Navigate to={`/auth/login?redirect=${encodeURIComponent(currentPath)}`} replace />;
    }

    // FEATURE 10: Multi-Tier Verification Guard
    // If the user managed to create a Firebase account but bypassed the EmailJS OTP, bounce them
    // (This is an extra security layer alongside the frontend checks)
    if (authStatus === 'unverified' || authStatus === 'code_sent') {
        return <Navigate to="/auth/signup" replace />;
    }

    // FEATURE 11: Secure Passthrough
    // If all cryptographic and state checks pass, render the protected child components
    return <Outlet />;
}