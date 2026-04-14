import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { Mail, Lock, Eye, EyeOff, ShieldAlert, CheckCircle2 } from 'lucide-react';

/**
 * FEATURE: High-Fidelity Enterprise Login Portal
 * Strictly matching image_8d2c48.png design aesthetics for the parbet-api.
 * Implements a permanent fix for overlapping icons and layout inconsistencies.
 */
export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // FEATURE 1: Secure Global State Access
    const { login, error: storeError, clearError, loading, user, isAdmin } = useAuthStore();

    // FEATURE 2: Controlled Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [stayLoggedIn, setStayLoggedIn] = useState(true);

    // FEATURE 3: Smart Security Redirect Engine
    useEffect(() => {
        if (user && isAdmin) {
            const origin = location.state?.from?.pathname || '/';
            navigate(origin, { replace: true });
        }
        clearError();
    }, [user, isAdmin, navigate, location, clearError]);

    // FEATURE 4: Security Warning Interception
    useEffect(() => {
        if (location.state?.error) {
            setLocalError(location.state.error);
        }
    }, [location.state]);

    // FEATURE 5: Client-to-Server Authentication Pipeline
    const handleSecureLogin = async (e) => {
        e.preventDefault();
        setLocalError('');
        clearError();

        if (!email || !password) {
            setLocalError('Required: Provide administrative credentials.');
            return;
        }

        try {
            await login(email, password);
        } catch (err) {
            console.error("Authentication process halted by administrative security firewall.");
        }
    };

    const activeError = localError || storeError;

    return (
        <div className="min-h-screen w-full bg-white flex flex-col items-center justify-start pt-16 md:pt-24 px-6 font-sans antialiased text-[#1a1a1a]">
            {/* FEATURE 6: Centered Brand Logo */}
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center text-[42px] font-black tracking-[-2.5px] leading-none mb-6 select-none cursor-default"
            >
                <span className="text-[#54626c]">par</span><span className="text-[#8cc63f]">bet</span>
            </motion.div>

            {/* Portal Title */}
            <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[28px] md:text-[32px] font-bold text-[#1a1a1a] tracking-[-0.8px] mb-10"
            >
                Sign in to parbet
            </motion.h1>

            {/* FEATURE 7: Main Authentication Surface */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[400px]"
            >
                <AnimatePresence mode="wait">
                    {activeError && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-8 overflow-hidden"
                        >
                            <div className="bg-[#fdf2f2] border border-[#fecaca] border-l-4 border-l-[#c21c3a] p-4 rounded-[6px] flex items-start gap-3 shadow-sm">
                                <ShieldAlert className="text-[#c21c3a] shrink-0 mt-0.5" size={18} />
                                <span className="text-[13px] font-bold text-[#c21c3a] leading-tight">
                                    {activeError}
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSecureLogin} className="flex flex-col gap-6">
                    {/* Admin Email Input Group */}
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af] group-focus-within:text-[#8cc63f] transition-colors duration-200">
                            <Mail size={18} />
                        </div>
                        <input 
                            type="email" 
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#e2e2e2] rounded-[6px] text-[16px] font-medium text-[#1a1a1a] placeholder:text-[#9ca3af] outline-none focus:border-[#8cc63f] focus:ring-4 focus:ring-[#8cc63f]/5 transition-all duration-200"
                            disabled={loading}
                            autoComplete="email"
                        />
                    </div>

                    {/* Admin Password Input Group */}
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af] group-focus-within:text-[#8cc63f] transition-colors duration-200">
                            <Lock size={18} />
                        </div>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-12 py-3.5 bg-white border border-[#e2e2e2] rounded-[6px] text-[16px] font-medium text-[#1a1a1a] placeholder:text-[#9ca3af] outline-none focus:border-[#8cc63f] focus:ring-4 focus:ring-[#8cc63f]/5 transition-all duration-200"
                            disabled={loading}
                            autoComplete="current-password"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#1a1a1a] transition-colors outline-none"
                            disabled={loading}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* FEATURE 8: Session Persistence Toggle */}
                    <div 
                        className="flex items-center gap-3 px-1 cursor-pointer select-none"
                        onClick={() => setStayLoggedIn(!stayLoggedIn)}
                    >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-200 ${stayLoggedIn ? 'bg-[#8cc63f] border-[#8cc63f]' : 'border-[#e2e2e2] bg-white'}`}>
                            {stayLoggedIn && <CheckCircle2 size={14} className="text-white" />}
                        </div>
                        <span className="text-[14px] font-semibold text-[#1a1a1a]">Stay logged in</span>
                    </div>

                    {/* Primary Submission Engine */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`mt-4 w-full py-4 rounded-[6px] text-[16px] font-bold text-[#54626c] bg-[#e2e2e2] transition-all duration-300 shadow-sm ${loading ? 'opacity-80 cursor-wait' : 'hover:bg-[#8cc63f] hover:text-white hover:shadow-md active:scale-[0.98]'}`}
                    >
                        {loading ? 'Processing...' : 'Continue'}
                    </button>
                </form>

                {/* FEATURE 9: Policy & Navigation Links */}
                <div className="mt-8 text-center text-[12px] leading-relaxed text-[#54626c] font-medium px-4">
                    By signing in to the API Gateway, you agree to the verified 
                    <span className="text-[#0064d2] cursor-pointer hover:underline mx-1">security agreement</span> 
                    and acknowledge our 
                    <span className="text-[#0064d2] cursor-pointer hover:underline mx-1">privacy policy</span>.
                </div>

                <div className="mt-10 flex flex-col gap-4">
                    <button className="w-full py-3.5 border-2 border-[#8cc63f] text-[#8cc63f] rounded-[6px] font-bold text-[15px] hover:bg-[#8cc63f]/5 transition-all duration-200">
                        Guest seller? Find your listing
                    </button>
                    <button className="w-full py-3.5 border-2 border-[#e2e2e2] text-[#1a1a1a] rounded-[6px] font-bold text-[15px] flex items-center justify-center gap-3 hover:bg-[#f8f9fa] transition-all duration-200">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Log In with Google
                    </button>
                </div>

                <div className="mt-10 mb-20 text-center text-[14px]">
                    <span className="font-medium text-[#54626c]">New to Parbet? </span>
                    <button className="font-bold text-[#8cc63f] hover:underline transition-colors outline-none">Create an account</button>
                </div>
            </motion.div>
        </div>
    );
}