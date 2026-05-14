import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../../lib/firebase';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { 
    ShieldCheck, 
    Lock, 
    Eye, 
    EyeOff, 
    AlertCircle, 
    CheckCircle2, 
    Loader2, 
    KeyRound, 
    ShieldAlert, 
    RefreshCcw 
} from 'lucide-react';

/**
 * GLOBAL REBRAND: Booknshow Identity Application (Action Landing Page)
 * Enforced Colors: #FFFFFF, #E7364D, #333333, #EB5B6E, #FAD8DC, #A3A3A3, #626262
 * FEATURE 1: Firebase Native OOB Code Verification Engine
 * FEATURE 2: Real-time Password Strength Cryptographic Analyzer
 * FEATURE 3: High-End Hardware Accelerated UI Feedback
 */

// Strict Booknshow SVG Logo (Dark Mode for Light Card)
const BooknshowLogo = ({ className }) => (
    <svg className={className} viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
        <text y="40" fontFamily="Inter, sans-serif" fontSize="35" fontWeight="900" fill="#333333">
            book<tspan fill="#E7364D">n</tspan>show
        </text>
    </svg>
);

export default function ResetAction() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const oobCode = searchParams.get('oobCode');

    // UI & Validation States
    const [status, setStatus] = useState('verifying'); // verifying | valid | invalid | success
    const [userEmail, setUserEmail] = useState('');
    
    // Form States
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // Submission States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // FEATURE 1: Cryptographic Link Validation on Mount
    useEffect(() => {
        if (!oobCode) {
            setStatus('invalid');
            return;
        }

        const validateLink = async () => {
            try {
                // Pre-verify the OOB code before allowing password entry
                const email = await verifyPasswordResetCode(auth, oobCode);
                setUserEmail(email);
                setStatus('valid');
            } catch (err) {
                console.error("Link Verification Failed:", err.code);
                setStatus('invalid');
            }
        };

        validateLink();
    }, [oobCode]);

    // FEATURE 2: Real-time Password Strength Analyzer
    const calculateStrength = (pass) => {
        let score = 0;
        if (!pass) return { score: 0, label: 'None', color: 'bg-[#F5F5F5]' };
        if (pass.length >= 8) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;

        if (score <= 1) return { score, label: 'Weak', color: 'bg-[#E7364D]', w: '25%' };
        if (score === 2) return { score, label: 'Fair', color: 'bg-[#EB5B6E]', w: '50%' };
        if (score === 3) return { score, label: 'Good', color: 'bg-[#8cc63f]', w: '75%' };
        return { score, label: 'Strong', color: 'bg-[#458731]', w: '100%' };
    };

    const strength = calculateStrength(password);
    const passwordsMatch = password && confirmPassword && password === confirmPassword;

    // Form Submission
    const handleResetSubmit = async (e) => {
        e.preventDefault();
        
        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }
        if (!passwordsMatch) {
            setError("Passwords do not match exactly.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await confirmPasswordReset(auth, oobCode, password);
            setStatus('success');
        } catch (err) {
            console.error("Password Update Failed:", err);
            setError("The reset code has expired or was already used. Please request a new link.");
            setStatus('invalid');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center py-12 px-4 relative font-sans overflow-hidden">
            
            {/* Illustrative Background Animation (Hardware Accelerated) */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E7364D" strokeWidth="1"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#gridPattern)" />
                </svg>
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="bg-[#FFFFFF] w-full max-w-[480px] rounded-[12px] shadow-[0_15px_50px_rgba(51,51,51,0.1)] border border-[#A3A3A3]/20 relative z-10 overflow-hidden"
            >
                {/* Dynamic Header */}
                <div className="bg-[#333333] px-10 py-8 flex flex-col items-center justify-center border-b border-[#E7364D]">
                    <BooknshowLogo className="h-[40px] mb-4 filter drop-shadow-md brightness-0 invert" />
                    <h2 className="text-[20px] font-black text-[#FFFFFF] text-center tracking-wide">
                        Secure Vault Access
                    </h2>
                </div>

                <div className="px-10 py-8">
                    <AnimatePresence mode="wait">
                        
                        {/* STATE 1: Verifying OOB Code */}
                        {status === 'verifying' && (
                            <motion.div 
                                key="verifying"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-10 text-center"
                            >
                                <RefreshCcw size={48} className="text-[#E7364D] animate-spin mb-6" strokeWidth={1.5} />
                                <h3 className="text-[18px] font-bold text-[#333333] mb-2">Authenticating Link</h3>
                                <p className="text-[14px] text-[#626262]">Establishing secure connection with identity servers...</p>
                            </motion.div>
                        )}

                        {/* STATE 2: Invalid or Expired Code */}
                        {status === 'invalid' && (
                            <motion.div 
                                key="invalid"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center text-center py-6"
                            >
                                <div className="w-16 h-16 bg-[#FAD8DC] rounded-full flex items-center justify-center mb-6 border border-[#E7364D]/30">
                                    <ShieldAlert size={32} className="text-[#E7364D]" strokeWidth={2} />
                                </div>
                                <h3 className="text-[22px] font-black text-[#333333] mb-3">Link Expired</h3>
                                <p className="text-[15px] text-[#626262] mb-8 leading-relaxed">
                                    For your security, password reset links expire after 60 minutes or immediately after use. This link is no longer valid.
                                </p>
                                <button 
                                    onClick={() => navigate('/login')}
                                    className="w-full bg-[#333333] text-[#FFFFFF] font-bold py-3.5 rounded-[6px] hover:bg-[#E7364D] transition-colors"
                                >
                                    Request New Link
                                </button>
                            </motion.div>
                        )}

                        {/* STATE 3: Success */}
                        {status === 'success' && (
                            <motion.div 
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center text-center py-6"
                            >
                                <div className="w-16 h-16 bg-[#e8f5e9] rounded-full flex items-center justify-center mb-6 border border-[#458731]/30">
                                    <CheckCircle2 size={32} className="text-[#458731]" strokeWidth={2.5} />
                                </div>
                                <h3 className="text-[22px] font-black text-[#333333] mb-3">Password Updated</h3>
                                <p className="text-[15px] text-[#626262] mb-8 leading-relaxed">
                                    Your Booknshow account credentials have been successfully updated and secured.
                                </p>
                                <button 
                                    onClick={() => navigate('/login')}
                                    className="w-full bg-[#E7364D] text-[#FFFFFF] font-bold py-3.5 rounded-[6px] hover:bg-[#EB5B6E] shadow-md transition-colors"
                                >
                                    Proceed to Login
                                </button>
                            </motion.div>
                        )}

                        {/* STATE 4: Valid Link -> Show Form */}
                        {status === 'valid' && (
                            <motion.form 
                                key="form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onSubmit={handleResetSubmit}
                                className="w-full"
                            >
                                <div className="mb-6 flex items-start gap-3 bg-[#F5F5F5] p-4 rounded-[8px] border border-[#A3A3A3]/30">
                                    <ShieldCheck className="text-[#8cc63f] shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <p className="text-[13px] font-bold text-[#333333] mb-1">Secure Session Verified</p>
                                        <p className="text-[12px] text-[#626262]">Updating credentials for <strong className="text-[#333333]">{userEmail}</strong></p>
                                    </div>
                                </div>

                                {error && (
                                    <div className="mb-6 w-full p-3 bg-[#FAD8DC]/30 text-[#E7364D] text-[13px] border border-[#E7364D]/50 rounded-[6px] font-bold text-center flex items-center justify-center gap-2">
                                        <AlertCircle size={16} />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {/* Password Input */}
                                <div className="relative w-full mb-4">
                                    <label className="block text-[13px] font-bold text-[#333333] mb-1.5">New Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <KeyRound size={18} className="text-[#A3A3A3]" />
                                        </div>
                                        <input 
                                            type={showPassword ? "text" : "password"} 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={loading}
                                            autoFocus
                                            className="w-full border border-[#A3A3A3] rounded-[6px] pl-10 pr-10 py-3 text-[15px] text-[#333333] outline-none focus:border-[#E7364D] focus:ring-1 focus:ring-[#E7364D] transition-all bg-[#FFFFFF]"
                                            placeholder="Enter strong password"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#A3A3A3] hover:text-[#E7364D] transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Live Password Strength Meter */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-wider">Security Level</span>
                                        <span className={`text-[11px] font-bold uppercase tracking-wider ${strength.score > 0 ? strength.color.replace('bg-', 'text-') : 'text-[#A3A3A3]'}`}>
                                            {strength.label}
                                        </span>
                                    </div>
                                    <div className="w-full h-1.5 bg-[#F5F5F5] rounded-full overflow-hidden flex">
                                        <div className={`h-full ${strength.color} transition-all duration-300 ease-out`} style={{ width: strength.w }}></div>
                                    </div>
                                </div>

                                {/* Confirm Password Input */}
                                <div className="relative w-full mb-8">
                                    <label className="block text-[13px] font-bold text-[#333333] mb-1.5">Confirm Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock size={18} className="text-[#A3A3A3]" />
                                        </div>
                                        <input 
                                            type={showPassword ? "text" : "password"} 
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            disabled={loading}
                                            className="w-full border border-[#A3A3A3] rounded-[6px] pl-10 pr-3 py-3 text-[15px] text-[#333333] outline-none focus:border-[#E7364D] focus:ring-1 focus:ring-[#E7364D] transition-all bg-[#FFFFFF]"
                                            placeholder="Re-type new password"
                                        />
                                        {confirmPassword.length > 0 && (
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                {passwordsMatch ? (
                                                    <CheckCircle2 size={18} className="text-[#8cc63f]" />
                                                ) : (
                                                    <X size={18} className="text-[#E7364D]" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading || !password || !passwordsMatch || strength.score < 1}
                                    className="w-full bg-[#E7364D] text-[#FFFFFF] font-bold py-3.5 rounded-[6px] hover:bg-[#EB5B6E] shadow-sm disabled:opacity-50 disabled:hover:bg-[#E7364D] transition-all flex justify-center items-center"
                                >
                                    {loading ? (
                                        <Loader2 size={20} className="animate-spin text-[#FFFFFF]" />
                                    ) : (
                                        'Update Password Securely'
                                    )}
                                </button>
                                
                                <div className="mt-6 text-center">
                                    <Link to="/login" className="text-[13px] font-bold text-[#626262] hover:text-[#E7364D] transition-colors">
                                        Cancel and return to login
                                    </Link>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}