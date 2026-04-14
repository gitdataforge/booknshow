import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { Mail, Lock, Eye, EyeOff, ShieldAlert } from 'lucide-react';

/**
 * FEATURE: Enterprise Admin Login Portal
 * Strictly matching design tokens from image_6188a6.png and image_6188e9.png.
 * Resolves spacing, icon overlapping, and JSX syntax errors permanently.
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

    // FEATURE 3: Smart Security Redirects
    useEffect(() => {
        if (user && isAdmin) {
            const origin = location.state?.from?.pathname || '/';
            navigate(origin, { replace: true });
        }
        clearError();
    }, [user, isAdmin, navigate, location, clearError]);

    // Handle incoming error states from the AdminGuard
    useEffect(() => {
        if (location.state?.error) {
            setLocalError(location.state.error);
        }
    }, [location.state]);

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
            console.error("Authentication halted: Security credentials invalid.");
        }
    };

    const activeError = localError || storeError;

    return (
        <div className="min-h-screen w-full bg-[#f8f9fa] flex items-center justify-center p-4 md:p-8 font-sans antialiased text-[#1a1a1a]">
            {/* FEATURE 4: Hardware-Accelerated Card Entrance */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-[440px] w-full bg-white border border-[#e2e2e2] rounded-[12px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden"
            >
                {/* Branding Section: Exact Brand Reproduction */}
                <div className="px-8 md:px-10 pt-12 pb-8 text-center border-b border-[#f3f4f6]">
                    <div className="flex items-center justify-center text-[40px] font-black tracking-[-2px] leading-none mb-4 cursor-default select-none">
                        <span className="text-[#54626c]">par</span><span className="text-[#8cc63f]">bet</span>
                        <span className="ml-3 mt-1 px-2 py-0.5 bg-[#f8f9fa] border border-[#e2e2e2] rounded-[4px] text-[12px] font-mono font-bold text-[#54626c] tracking-normal uppercase">
                            admin
                        </span>
                    </div>
                    <h1 className="text-[22px] font-extrabold text-[#1a1a1a] tracking-[-0.5px]">API Gateway Restricted</h1>
                    <p className="text-[14px] text-[#54626c] font-medium mt-1">Authorized engineering credentials required.</p>
                </div>

                <div className="p-8 md:p-10">
                    {/* FEATURE 5: Dynamic Security Alerts */}
                    <AnimatePresence mode="wait">
                        {activeError && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-8 overflow-hidden"
                            >
                                <div className="bg-[#fdf2f2] border border-[#fecaca] border-l-4 border-l-[#c21c3a] p-4 rounded-[6px] flex items-start gap-3">
                                    <ShieldAlert className="text-[#c21c3a] shrink-0 mt-0.5" size={18} />
                                    <span className="text-[13px] font-bold text-[#c21c3a] leading-tight">
                                        {activeError}
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSecureLogin} className="flex flex-col gap-7">
                        
                        {/* FEATURE 6: Email Input Group with Absolute Positioning */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[12px] font-black text-[#1a1a1a] uppercase tracking-[1px]">Admin Email</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af] group-focus-within:text-[#8cc63f] transition-colors duration-200">
                                    <Mail size={18} />
                                </div>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="engineering@parbet.com"
                                    className="w-full pl-12 pr-4 py-3.5 bg-[#f8f9fa] border border-[#e2e2e2] rounded-[6px] text-[15px] font-medium text-[#1a1a1a] outline-none focus:border-[#8cc63f] focus:bg-white focus:ring-4 focus:ring-[#8cc63f]/5 transition-all duration-200"
                                    disabled={loading}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* FEATURE 7: Password Input Group with Privacy Toggle */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center mb-0.5">
                                <label className="text-[12px] font-black text-[#1a1a1a] uppercase tracking-[1px]">Password</label>
                                <button type="button" className="text-[12px] font-bold text-[#8cc63f] hover:text-[#458731] transition-colors outline-none">
                                    Forgot Password?
                                </button>
                            </div>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af] group-focus-within:text-[#8cc63f] transition-colors duration-200">
                                    <Lock size={18} />
                                </div>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full pl-12 pr-12 py-3.5 bg-[#f8f9fa] border border-[#e2e2e2] rounded-[6px] text-[15px] font-medium text-[#1a1a1a] outline-none focus:border-[#8cc63f] focus:bg-white focus:ring-4 focus:ring-[#8cc63f]/5 transition-all duration-200"
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
                        </div>

                        {/* FEATURE 8: Secure Submission Dispatcher */}
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`mt-4 w-full flex items-center justify-center gap-2 py-4 rounded-[6px] text-[15px] font-bold text-white transition-all duration-300 shadow-md ${loading ? 'bg-[#458731] opacity-80 cursor-not-allowed' : 'bg-[#8cc63f] hover:bg-[#458731] active:scale-[0.98] hover:shadow-lg'}`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Authenticating...
                                </>
                            ) : (
                                'Access Gateway'
                            )}
                        </button>
                    </form>
                </div>
                
                {/* Security Perimeter Footer */}
                <div className="px-8 py-5 bg-[#f8f9fa] border-t border-[#e2e2e2] flex items-center justify-center gap-3">
                    <ShieldAlert size={14} className="text-[#64748b]" />
                    <span className="text-[12px] font-bold text-[#64748b] uppercase tracking-[0.5px]">Protected by Parbet Enterprise Security</span>
                </div>
            </motion.div>
        </div>
    );
}