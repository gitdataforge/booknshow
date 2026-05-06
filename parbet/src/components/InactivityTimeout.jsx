import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, LogOut, MousePointerClick } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAppStore } from '../store/useStore';

/**
 * FEATURE 1: Dynamic Global Inactivity Tracker (Defaults to 5 Minutes)
 * FEATURE 2: Omnipresent Event Listeners (Mouse, Keyboard, Touch, Scroll)
 * FEATURE 3: Graceful Pre-Logout Warning Modal (15 Second Countdown)
 * FEATURE 4: Hardware-Accelerated Framer Motion Animations
 * FEATURE 5: Absolute Firebase Auth Severance & Local State Purge
 * FEATURE 6: Route-Aware Execution (Ignores public pages when logged out)
 * FEATURE 7: User-Configurable Timeout Integration (via LocalStorage)
 */

const WARNING_DURATION_MS = 15000; // Final 15 seconds will show the warning

// Helper to fetch the dynamic limit set by the user in Settings.jsx (Defaults to 5 mins)
const getTimeoutDuration = () => {
    const stored = localStorage.getItem('parbet_session_timeout');
    if (stored) {
        return parseInt(stored, 10) * 60 * 1000; // Convert minutes to MS
    }
    return 5 * 60 * 1000; // Default: 5 minutes
};

export default function InactivityTimeout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user } = useAppStore();

    const [isWarningVisible, setIsWarningVisible] = useState(false);
    const [countdown, setCountdown] = useState(15);
    
    const warningTimerRef = useRef(null);
    const logoutTimerRef = useRef(null);
    const countdownIntervalRef = useRef(null);

    // FEATURE 5: Absolute Auth Severance
    const executeForceLogout = useCallback(async () => {
        try {
            await signOut(auth);
            // Local state will naturally clear via the onAuthStateChanged listener in useStore
            setIsWarningVisible(false);
            
            // Redirect to login only if not already on a public auth route to prevent looping
            if (location.pathname !== '/login' && location.pathname !== '/register') {
                navigate('/login?reason=inactivity_timeout');
            }
        } catch (error) {
            console.error("[Security] Force logout execution failed:", error);
        }
    }, [navigate, location.pathname]);

    // FEATURE 1 & 2: Omnipresent Tracker Engine
    const resetTimers = useCallback(() => {
        // Do not track inactivity if the user is not authenticated
        if (!isAuthenticated) return;

        // Clear existing timers
        if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
        if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

        // Hide warning if user becomes active again
        setIsWarningVisible(false);
        setCountdown(WARNING_DURATION_MS / 1000);

        const currentLimitMs = getTimeoutDuration();
        const warningThresholdMs = currentLimitMs - WARNING_DURATION_MS;

        // Set Warning Timer
        warningTimerRef.current = setTimeout(() => {
            setIsWarningVisible(true);
            
            // Start visual countdown for the remaining 15 seconds
            countdownIntervalRef.current = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdownIntervalRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }, warningThresholdMs);

        // Set Hard Logout Timer
        logoutTimerRef.current = setTimeout(() => {
            executeForceLogout();
        }, currentLimitMs);
        
    }, [isAuthenticated, executeForceLogout]);

    useEffect(() => {
        if (!isAuthenticated) {
            // Clean up all timers if user logs out manually
            if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
            if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
            setIsWarningVisible(false);
            return;
        }

        const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
        
        // Throttled event listener to prevent extreme CPU overload from rapid mouse movements
        let throttleTimer;
        const handleActivity = () => {
            if (throttleTimer) return;
            throttleTimer = setTimeout(() => {
                resetTimers();
                throttleTimer = null;
            }, 500); // Only reset timers max twice per second
        };

        // Attach listeners
        events.forEach(event => window.addEventListener(event, handleActivity));

        // Initial timer start
        resetTimers();

        // Listen for timeout preference changes from Settings.jsx
        const handleStorageChange = (e) => {
            if (e.key === 'parbet_session_timeout') {
                resetTimers();
            }
        };
        window.addEventListener('storage', handleStorageChange);

        // Cleanup on unmount
        return () => {
            events.forEach(event => window.removeEventListener(event, handleActivity));
            window.removeEventListener('storage', handleStorageChange);
            if (throttleTimer) clearTimeout(throttleTimer);
            if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
            if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        };
    }, [isAuthenticated, resetTimers]);

    // Explicit manual extension handler
    const handleStayLoggedIn = () => {
        resetTimers();
    };

    return (
        <>
            {children}

            {/* FEATURE 3 & 4: Hardware-Accelerated Graceful Warning Modal */}
            <AnimatePresence>
                {isWarningVisible && isAuthenticated && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#333333]/80 backdrop-blur-md p-4 font-sans">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }} 
                            exit={{ scale: 0.9, opacity: 0, y: 20 }} 
                            className="bg-[#FFFFFF] rounded-[24px] p-8 max-w-md w-full shadow-2xl border border-[#E7364D]/20 text-center relative overflow-hidden"
                        >
                            {/* Animated background progress bar */}
                            <motion.div 
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 15, ease: "linear" }}
                                className="absolute top-0 left-0 h-1.5 bg-[#E7364D] z-10"
                            />
                            
                            <div className="w-20 h-20 bg-[#FAD8DC]/30 rounded-full flex items-center justify-center mx-auto mb-6 relative border border-[#E7364D]/20">
                                <ShieldAlert className="text-[#E7364D]" size={40} />
                                <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#E7364D] text-[#FFFFFF] rounded-full flex items-center justify-center font-black text-[14px] shadow-lg border-2 border-[#FFFFFF]">
                                    {countdown}
                                </div>
                            </div>
                            
                            <h2 className="text-[24px] font-black text-[#333333] mb-3 leading-tight">Session Expiring</h2>
                            <p className="text-[#626262] font-medium mb-8 leading-relaxed">
                                For your security, you will be logged out automatically in <strong className="text-[#E7364D]">{countdown} seconds</strong> due to inactivity.
                            </p>
                            
                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={handleStayLoggedIn} 
                                    className="w-full bg-[#333333] text-[#FFFFFF] font-black py-4 rounded-[14px] shadow-lg hover:bg-[#E7364D] transition-colors flex items-center justify-center gap-2"
                                >
                                    <MousePointerClick size={18} /> Keep Me Logged In
                                </button>
                                <button 
                                    onClick={executeForceLogout} 
                                    className="w-full bg-[#FFFFFF] text-[#A3A3A3] font-bold py-4 rounded-[14px] hover:bg-[#F5F5F5] hover:text-[#333333] transition-colors flex items-center justify-center gap-2 border border-[#A3A3A3]/20"
                                >
                                    <LogOut size={18} /> Log Out Now
                                </button>
                            </div>
                            
                            <p className="text-[11px] text-[#A3A3A3] mt-6 font-bold uppercase tracking-widest">
                                Booknshow Security Infrastructure
                            </p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}