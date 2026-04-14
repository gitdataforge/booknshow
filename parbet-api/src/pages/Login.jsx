import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { Mail, Lock, Eye, EyeOff, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function Login() {
    // FEATURE 1: Smart Route Redirect Engine
    const navigate = useNavigate();
    const location = useLocation();
    
    // FEATURE 2: Secure Global State Access
    const { login, error: storeError, clearError, loading, user, isAdmin } = useAuthStore();

    // FEATURE 3: Controlled Form State Management
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');
    
    // FEATURE 4: Password Visibility Toggle Logic
    const [showPassword, setShowPassword] = useState(false);

    // FEATURE 5: Guarded Redirect on Authenticated State
    useEffect(() => {
        if (user && isAdmin) {
            const origin = location.state?.from?.pathname || '/';
            navigate(origin, { replace: true });
        }
        // Cleanup errors on mount
        clearError();
    }, [user, isAdmin, navigate, location, clearError]);

    // FEATURE 6: AdminGuard Security Warning Interception
    useEffect(() => {
        if (location.state?.error) {
            setLocalError(location.state.error);
        }
    }, [location.state]);

    // FEATURE 7: Client-to-Server Authentication Pipeline
    const handleSecureLogin = async (e) => {
        e.preventDefault();
        setLocalError('');
        clearError();

        // Local UI Validation
        if (!email || !password) {
            setLocalError('Please provide both administrative email and password.');
            return;
        }

        try {
            // Secure dispatch to Firebase via Zustand
            await login(email, password);
            // Redirection is handled automatically by the useEffect above
        } catch (err) {
            // Errors are caught and handled strictly by the store UI
            console.error("Login attempt failed.");
        }
    };

    // Determine the active error to display (Local Validation vs Global Firebase Error)
    const activeError = localError || storeError;

    return (
        <div className="min-h-screen w-full bg-[#f8f9fa] flex items-center justify-center p-4 font-sans">
            {/* FEATURE 8: Hardware-Accelerated Entrance Animation */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-[420px] w-full bg-white border border-[#e2e2e2] rounded-[8px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden"
            >
                {/* Header Branding */}
                <div className="px-8 pt-10 pb-6 text-center border-b border-[#e2e2e2] bg-white">
                    <div className="flex items-center justify-center text-[36px] font-black tracking-[-1.5px] leading-none mb-3 cursor-default">
                        <span className="text-[#54626c]">par</span><span className="text-[#8cc63f]">bet</span>
                        <span className="ml-2 mt-1.5 px-1.5 py-0.5 bg-[#f8f9fa] border border-[#e2e2e2] rounded-[4px] text-[13px] font-mono font-bold text-[#54626c] tracking-normal leading-none">
                            / admin
                        </span>
                    </div>
                    <h1 className="text-[20px] font-bold text-[#1a1a1a] tracking-[-0.5px]">API Gateway Restricted</h1>
                    <p className="text-[14px] text-[#54626c] font-medium mt-1">Authorized engineering access only.</p>
                </div>

                <div className="p-8">
                    {/* FEATURE 9: Dynamic Error Rendering with Physics */}
                    <AnimatePresence>
                        {activeError && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="bg-[#fdf2f2] border border-[#fecaca] border-l-4 border-l-[#c21c3a] p-4 rounded-[4px] flex items-start gap-3">
                                    <ShieldAlert className="text-[#c21c3a] shrink-0 mt-0.5" size={18} />
                                    <span className="text-[13.5px] font-bold text-[#c21c3a] leading-tight">
                                        {activeError}
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSecureLogin} className="flex flex-col gap-5">
                        
                        {/* Email Input */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-bold text-[#1a1a1a] uppercase tracking-[0.5px]">Admin Email</label>
                            <div className="relative flex items-center">
                                <div className="absolute left-3 text-[#54626c]">
                                    <Mail size={18} />
                                </div>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="engineering@parbet.com"
                                    className="w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border border-[#e2e2e2] rounded-[4px] text-[15px] font-medium text-[#1a1a1a] outline-none focus:border-[#8cc63f] focus:bg-white transition-colors"
                                    disabled={loading}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-[13px] font-bold text-[#1a1a1a] uppercase tracking-[0.5px]">Password</label>
                                <button type="button" className="text-[13px] font-bold text-[#8cc63f] hover:text-[#458731] transition-colors outline-none">
                                    Forgot Password?
                                </button>
                            </div>
                            <div className="relative flex items-center">
                                <div className="absolute left-3 text-[#54626c]">
                                    <Lock size={18} />
                                </div>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full pl-10 pr-12 py-3 bg-[#f8f9fa] border border-[#e2e2e2] rounded-[4px] text-[15px] font-medium text-[#1a1a1a] outline-none focus:border-[#8cc63f] focus:bg-white transition-colors"
                                    disabled={loading}
                                    autoComplete="current-password"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 text-[#54626c] hover:text-[#1a1a1a] transition-colors outline-none"
                                    disabled={loading}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submission Engine */}
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`mt-2 w-full flex items-center justify-center gap-2 py-3.5 rounded-[4px] text-[15px] font-bold text-white transition-all ${loading ? 'bg-[#458731] opacity-80 cursor-not-allowed' : 'bg-[#8cc63f] hover:bg-[#458731] active:scale-[0.98]'}`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Authenticating...
                                </>
                            ) : (
                                'Access Gateway'
                            )}
                        </button>
                    </form>
                </div>
                
                {/* Security Footer Context */}
                <div className="px-8 py-4 bg-[#f8f9fa] border-t border-[#e2e2e2] flex items-center justify-center gap-2">
                    <AlertTriangle size={14} className="text-[#54626c]" />
                    <span className="text-[12px] font-bold text-[#54626c]">Protected by Parbet Enterprise Security</span>
                </div>
            </motion.div>
        </div>
    );
}