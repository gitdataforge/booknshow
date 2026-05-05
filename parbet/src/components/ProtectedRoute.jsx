import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Loader2, Home, Lock } from 'lucide-react';
import { useAppStore } from '../store/useStore';

/**
 * GLOBAL REBRAND: Booknshow Identity Application (Phase 13 Protected Route)
 * Enforced Colors: #FFFFFF, #E7364D, #333333, #EB5B6E, #FAD8DC, #A3A3A3, #626262
 * 
 * FEATURE 1: Strict RBAC Interception
 * FEATURE 2: High-End Asynchronous State Resolution (Waits for Firestore Payload)
 * FEATURE 3: Animated Access Denied Bouncer
 * FEATURE 4: Contextual Login Redirection (Saves intended destination)
 */

// SECTION 1: Ambient Background
const AmbientBackground = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
            className="absolute top-[-5%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#FAD8DC] opacity-20 blur-[120px]"
            animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
            className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#EB5B6E] opacity-10 blur-[100px]"
            animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
    </div>
);

// High-Fidelity Inline SVG Replica of Official Booknshow Logo
const BooknshowLogo = ({ className = "", textColor = "#333333" }) => {
    const fillHex = textColor.includes('#') ? textColor.match(/#(?:[0-9a-fA-F]{3,8})/)[0] : "#333333";
    return (
        <div className={`flex items-center justify-center select-none relative z-10 ${className}`}>
            <svg viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[40px] transform hover:scale-[1.02] transition-transform duration-300">
                <text x="10" y="70" fontFamily="Inter, sans-serif" fontSize="64" fontWeight="800" fill={fillHex} letterSpacing="-2">book</text>
                <g transform="translate(170, 10) rotate(-12)">
                    <path d="M0,0 L16,10 L32,0 L48,10 L64,0 L80,10 L80,95 L60,95 A20,20 0 0,0 20,95 L0,95 Z" fill="#E7364D" />
                    <text x="21" y="72" fontFamily="Inter, sans-serif" fontSize="60" fontWeight="900" fill="#FFFFFF">n</text>
                </g>
                <text x="250" y="70" fontFamily="Inter, sans-serif" fontSize="64" fontWeight="800" fill={fillHex} letterSpacing="-2">show</text>
            </svg>
        </div>
    );
};

export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const { isAuthenticated, userRole, user } = useAppStore();
    const location = useLocation();
    const navigate = useNavigate();
    
    // FEATURE 2: Async Buffer State
    // Because Firebase auth resolves before the Firestore user document (which holds the role) does, 
    // we need a brief loading buffer to prevent false-positive kicks.
    const [isResolving, setIsResolving] = useState(true);

    useEffect(() => {
        // If there's no user at all, stop resolving immediately so it redirects to login
        if (!user) {
            const timer = setTimeout(() => setIsResolving(false), 500);
            return () => clearTimeout(timer);
        }
        
        // If a user exists, give the store 1.2 seconds to fetch the userRole from Firestore
        const timer = setTimeout(() => {
            setIsResolving(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, [user, userRole]);

    // STATE A: Resolving Authentication & Role Payloads
    if (isResolving) {
        return (
            <div className="min-h-screen bg-[#F5F5F5] font-sans flex flex-col items-center justify-center relative overflow-hidden">
                <AmbientBackground />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 flex flex-col items-center"
                >
                    <BooknshowLogo className="mb-8 scale-110" />
                    <div className="w-16 h-16 bg-[#FFFFFF] rounded-[16px] shadow-[0_10px_30px_rgba(51,51,51,0.05)] border border-[#A3A3A3]/20 flex items-center justify-center mb-6 relative">
                        <Loader2 size={32} className="text-[#E7364D] animate-spin" />
                        <div className="absolute inset-0 border-2 border-[#E7364D]/20 rounded-[16px] animate-pulse"></div>
                    </div>
                    <h3 className="text-[14px] font-black text-[#333333] uppercase tracking-widest text-center">Authenticating Identity</h3>
                    <p className="text-[12px] text-[#A3A3A3] font-bold mt-2 text-center max-w-[250px]">Securely verifying cryptographic tokens and role permissions...</p>
                </motion.div>
            </div>
        );
    }

    // STATE B: Unauthenticated User
    if (!isAuthenticated) {
        // Pass the intended destination to the login router so it can bounce them back after auth
        return <Navigate to="/login" state={{ returnTo: location.pathname }} replace />;
    }

    // STATE C: Authenticated, but Unauthorized Role (The Bouncer)
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        return (
            <div className="min-h-screen bg-[#F5F5F5] font-sans flex flex-col items-center justify-center relative overflow-hidden p-6">
                <AmbientBackground />
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[24px] p-10 max-w-md w-full shadow-[0_20px_60px_rgba(51,51,51,0.1)] relative z-10 text-center"
                >
                    <div className="w-20 h-20 bg-[#FAD8DC]/30 border border-[#E7364D]/30 rounded-[16px] flex items-center justify-center mx-auto mb-6 relative">
                        <ShieldAlert size={40} className="text-[#E7364D]" />
                        <div className="absolute -bottom-2 -right-2 bg-[#333333] w-8 h-8 rounded-full border-2 border-[#FFFFFF] flex items-center justify-center shadow-sm">
                            <Lock size={14} className="text-[#FFFFFF]" />
                        </div>
                    </div>
                    
                    <h2 className="text-[28px] font-black text-[#333333] leading-tight mb-3">Access Denied</h2>
                    
                    <div className="bg-[#FAFAFA] border border-[#A3A3A3]/20 rounded-[8px] p-4 mb-8">
                        <p className="text-[13px] text-[#626262] font-medium leading-relaxed mb-2">
                            Your current identity token does not possess the cryptographic permissions required to access the <span className="font-black text-[#333333]">{location.pathname}</span> sector.
                        </p>
                        <p className="text-[11px] font-mono text-[#A3A3A3] font-bold">DETECTED ROLE: {userRole.toUpperCase()}</p>
                    </div>

                    <button 
                        onClick={() => navigate('/', { replace: true })}
                        className="w-full bg-[#333333] text-[#FFFFFF] font-black text-[15px] py-4 rounded-[12px] hover:bg-[#E7364D] transition-colors shadow-[0_4px_15px_rgba(51,51,51,0.2)] flex items-center justify-center gap-2"
                    >
                        <Home size={18} /> Return to Public Sector
                    </button>
                    
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-full bg-transparent text-[#626262] font-bold text-[14px] py-4 rounded-[12px] hover:text-[#333333] hover:bg-[#F5F5F5] transition-colors mt-3"
                    >
                        Go Back
                    </button>
                </motion.div>
                
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
                    <BooknshowLogo className="scale-75 opacity-50" />
                </div>
            </div>
        );
    }

    // STATE D: Authorized Access Granted
    return children;
}