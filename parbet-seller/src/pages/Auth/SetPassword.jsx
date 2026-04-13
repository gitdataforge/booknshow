import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Eye, 
    EyeOff, 
    ShieldCheck, 
    CheckCircle2, 
    XCircle, 
    Loader2, 
    AlertCircle,
    Lock
} from 'lucide-react';
import { auth, db } from '../../lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useSellerStore } from '../../store/useSellerStore';

export default function SetPassword() {
    const navigate = useNavigate();
    
    // FEATURE 1: Secure Verified Session Guard
    const [pendingData, setPendingData] = useState(null);

    // FEATURE 2: Complex Form State Machine
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // FEATURE 3: Network & Error States
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState('');

    // FEATURE 4: Global State Injection for Post-Creation Sync
    const { initAuth } = useSellerStore();

    // FEATURE 5: Real-Time Password Strength Engine
    const passwordCriteria = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };
    
    const isPasswordStrong = Object.values(passwordCriteria).every(Boolean);
    const doPasswordsMatch = password === confirmPassword && password.length > 0;

    // Security check on mount
    useEffect(() => {
        const storedData = localStorage.getItem('parbet_pending_seller');
        if (!storedData) {
            navigate('/auth/signup');
            return;
        }
        
        const parsed = JSON.parse(storedData);
        if (!parsed.verified) {
            navigate('/auth/verify'); // Bounce back if email wasn't verified
            return;
        }
        
        setPendingData(parsed);
        // Pre-fill if they typed it in step 1, but force them to confirm it
        if (parsed.password) {
            setPassword(parsed.password);
        }
    }, [navigate]);

    // FEATURE 6: Multi-Tiered Firebase Account Initialization Pipeline
    const handleFinalizeAccount = async (e) => {
        e.preventDefault();
        if (!isPasswordStrong || !doPasswordsMatch) return;
        
        setIsCreating(true);
        setError('');

        const appId = typeof __app_id !== 'undefined' ? __app_id : 'parbet-seller-app';

        try {
            // Tier 1: Generate official Firebase Auth Identity
            const userCredential = await createUserWithEmailAndPassword(auth, pendingData.email, password);
            const user = userCredential.user;

            // Tier 2: Update Auth Profile Metadata
            await updateProfile(user, {
                displayName: `${pendingData.firstName} ${pendingData.lastName}`.trim()
            });

            // Tier 3: Initialize Secure Firestore Seller Ledger (Strict Pathing)
            const userRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                firstName: pendingData.firstName,
                lastName: pendingData.lastName,
                phone: pendingData.phone,
                countryCode: pendingData.countryCode,
                role: 'seller',
                balance: 0,
                pendingBalance: 0,
                kycVerified: false,
                emailVerified: true, // They passed the OTP step
                smsConsent: pendingData.smsConsent,
                marketingConsent: pendingData.marketingConsent,
                createdAt: serverTimestamp(),
                notifications: {
                    email: true,
                    sms: pendingData.smsConsent
                }
            });

            // Tier 4: Purge Local Storage to prevent replay attacks
            localStorage.removeItem('parbet_pending_seller');

            // Tier 5: Trigger Global Store Sync
            await initAuth();

            // Tier 6: Vault User into Dashboard
            navigate('/profile');
            
        } catch (err) {
            console.error("Account Creation Error:", err);
            // Handle specific Firebase errors gracefully
            if (err.code === 'auth/email-already-in-use') {
                setError('An account with this email already exists. Please log in.');
            } else {
                setError(err.message || 'Failed to create secure account. Please try again.');
            }
            setIsCreating(false);
        }
    };

    // FEATURE 7: Framer Motion Animation Physics
    const shakeAnimation = {
        shake: { x: [0, -10, 10, -10, 10, -5, 5, 0], transition: { duration: 0.4 } }
    };

    if (!pendingData) return null;

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center font-sans p-4 relative">
            <div className="w-full max-w-[480px] bg-white border border-[#e2e2e2] rounded-[8px] shadow-2xl overflow-hidden">
                
                {/* Header */}
                <div className="bg-[#1a1a1a] p-8 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                    <div className="w-16 h-16 bg-[#333333] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#458731]">
                        <Lock size={32} className="text-[#8cc63f]" />
                    </div>
                    <h2 className="text-[24px] font-black tracking-tight mb-1">Secure your account</h2>
                    <p className="text-[14px] text-gray-400">
                        Final step for <strong className="text-white">{pendingData.email}</strong>
                    </p>
                </div>

                <div className="p-8">
                    {/* FEATURE 8: Dynamic Error Rendering */}
                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                variants={shakeAnimation}
                                animate="shake"
                                className="mb-6 p-3 bg-red-50 text-red-600 text-[13px] font-bold rounded-[4px] border border-red-100 flex items-center justify-center gap-2"
                            >
                                <AlertCircle size={16} /> {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleFinalizeAccount} className="space-y-6">
                        {/* New Password Input with Visibility Toggle */}
                        <div className="relative border border-[#cccccc] rounded-[4px] focus-within:border-[#458731] focus-within:ring-1 focus-within:ring-[#458731] transition-all bg-white">
                            <label className="absolute left-3 top-1.5 text-[11px] text-[#54626c] font-bold">New Password <span className="text-red-500">*</span></label>
                            <input 
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pt-6 pb-2 pl-3 pr-12 outline-none bg-transparent text-[15px] font-medium text-[#1a1a1a]"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1a1a1a] p-1"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* FEATURE 9: Real-Time Password Strength UI */}
                        <div className="bg-gray-50 p-4 rounded-[4px] border border-[#e2e2e2]">
                            <p className="text-[11px] font-bold text-[#54626c] uppercase tracking-wider mb-3">Password Requirements</p>
                            <div className="grid grid-cols-2 gap-2">
                                <CriteriaRow met={passwordCriteria.length} text="8+ characters" />
                                <CriteriaRow met={passwordCriteria.uppercase} text="1 Uppercase" />
                                <CriteriaRow met={passwordCriteria.number} text="1 Number" />
                                <CriteriaRow met={passwordCriteria.special} text="1 Special character" />
                            </div>
                        </div>

                        {/* Confirm Password Input */}
                        <div className="relative border border-[#cccccc] rounded-[4px] focus-within:border-[#458731] focus-within:ring-1 focus-within:ring-[#458731] transition-all bg-white">
                            <label className="absolute left-3 top-1.5 text-[11px] text-[#54626c] font-bold">Confirm Password <span className="text-red-500">*</span></label>
                            <input 
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pt-6 pb-2 pl-3 pr-12 outline-none bg-transparent text-[15px] font-medium text-[#1a1a1a]"
                            />
                            {/* Matching Indicator Indicator */}
                            {confirmPassword.length > 0 && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {doPasswordsMatch ? (
                                        <CheckCircle2 size={18} className="text-[#458731]" />
                                    ) : (
                                        <XCircle size={18} className="text-red-500" />
                                    )}
                                </div>
                            )}
                        </div>

                        {/* FEATURE 10: Submission State Physics */}
                        <button 
                            type="submit"
                            disabled={isCreating || !isPasswordStrong || !doPasswordsMatch}
                            className={`w-full py-4 rounded-[4px] font-bold text-[16px] transition-all flex items-center justify-center gap-2 ${
                                (isPasswordStrong && doPasswordsMatch) 
                                ? 'bg-[#458731] text-white hover:bg-[#366a26] shadow-md' 
                                : 'bg-[#e2e2e2] text-[#a0a0a0] cursor-not-allowed'
                            }`}
                        >
                            {isCreating ? (
                                <><Loader2 size={18} className="animate-spin" /> Provisioning Account...</>
                            ) : (
                                <><ShieldCheck size={18} /> Finalize Registration</>
                            )}
                        </button>
                    </form>
                </div>
            </div>
            
            <p className="text-[12px] text-[#54626c] mt-6 flex items-center gap-1.5">
                <Lock size={12} /> Encrypted via Firebase Auth
            </p>
        </div>
    );
}

// Micro-component for strength criteria
function CriteriaRow({ met, text }) {
    return (
        <div className="flex items-center gap-2">
            {met ? (
                <CheckCircle2 size={14} className="text-[#458731]" />
            ) : (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 shrink-0" />
            )}
            <span className={`text-[12px] font-medium ${met ? 'text-[#1a1a1a]' : 'text-gray-500'}`}>
                {text}
            </span>
        </div>
    );
}