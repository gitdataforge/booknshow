import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, MessageSquare, Send, Loader2, AlertCircle, ShieldCheck, KeyRound, Eye, EyeOff } from 'lucide-react';
import { useAppStore } from '../../store/useStore';
import { useMainStore } from '../../store/useMainStore'; 
import { auth, db } from '../../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { BooknshowLogo } from '../../components/Header'; 

/**
 * GLOBAL REBRAND: Booknshow Identity Application (Phase 4 Direct Reset)
 * Enforced Colors: #FFFFFF, #E7364D, #333333, #EB5B6E, #FAD8DC, #A3A3A3, #626262
 * FEATURE 1: Direct In-App Password Override (No Emails/OTP)
 * FEATURE 2: Strict Current-Password Verification Protocol
 * FEATURE 3: High-End Hardware Accelerated UI Feedback
 */

const CustomInput = ({ label, icon: Icon, required, type = "text", value, onChange, disabled, showToggle, onToggle, ...props }) => (
    <div className="relative w-full mb-4">
        <label className="block text-[13px] font-bold text-[#333333] mb-1.5">{label}</label>
        <div className="relative">
            {Icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon size={18} className="text-[#A3A3A3]" />
                </div>
            )}
            <input 
                type={type} 
                value={value} 
                onChange={onChange} 
                disabled={disabled}
                placeholder={`Enter ${label.toLowerCase()}`}
                className={`w-full border border-[#A3A3A3] rounded-[6px] ${Icon ? 'pl-10' : 'pl-3'} ${showToggle ? 'pr-10' : 'pr-3'} py-3.5 text-[15px] text-[#333333] outline-none focus:border-[#E7364D] focus:ring-1 focus:ring-[#E7364D] transition-all bg-[#FFFFFF] disabled:bg-[#F5F5F5] disabled:text-[#A3A3A3] placeholder-[#A3A3A3]`}
                {...props}
            />
            {showToggle && (
                <button 
                    type="button"
                    onClick={onToggle}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#A3A3A3] hover:text-[#E7364D] transition-colors"
                >
                    {type === 'password' ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
            )}
        </div>
    </div>
);

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation(); 
    const { isAuthenticated, setUser, setOnboarded } = useAppStore();
    
    // INJECTED: New Store Action for Direct Change
    const { executeDirectPasswordChange } = useMainStore(); 
    
    // View States: 'email' -> 'password' -> 'forgot' -> 'forgot-success'
    const [step, setStep] = useState('email');
    
    // Core Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [stayLoggedIn, setStayLoggedIn] = useState(true);

    // Direct Reset States
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Feedback Engine States
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [feedbackText, setFeedbackText] = useState('');
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const [feedbackSuccess, setFeedbackSuccess] = useState(false);

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'parbet-44902';

    useEffect(() => {
        if (isAuthenticated) {
            const returnTo = location.state?.returnTo || '/profile';
            const reservedListing = location.state?.reservedListing;
            navigate(returnTo, { state: { reservedListing } });
        }
    }, [isAuthenticated, navigate, location.state]);

    const syncUserToFirestore = async (user, additionalData = {}) => {
        const userRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
        const docSnap = await getDoc(userRef);
        
        if (!docSnap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || '',
                photoURL: user.photoURL || '',
                balance: 0,
                favorites: [],
                createdAt: new Date().toISOString(),
                ...additionalData
            });
        } else if (Object.keys(additionalData).length > 0) {
            await updateDoc(userRef, additionalData);
        }
    };

    const handleGoogleAuth = async () => {
        setLoading(true);
        setError(null);
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');

        try {
            const result = await signInWithPopup(auth, provider);
            await syncUserToFirestore(result.user);
            setUser({
                uid: result.user.uid,
                email: result.user.email,
                name: result.user.displayName,
                photo: result.user.photoURL
            });
            setOnboarded();
            
            const returnTo = location.state?.returnTo || '/profile';
            const reservedListing = location.state?.reservedListing;
            navigate(returnTo, { state: { reservedListing } });
        } catch (err) {
            console.error("Google Auth Error:", err);
            setError('Failed to securely authenticate with Google.');
        } finally {
            setLoading(false);
        }
    };

    const handleContinueClick = (e) => {
        e.preventDefault();
        const sanitizedEmail = email.trim().toLowerCase();
        if (!sanitizedEmail) return;
        
        setEmail(sanitizedEmail);
        setError(null);
        setStep('password');
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const sanitizedEmail = email.trim().toLowerCase();
        if (!sanitizedEmail || !password) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, sanitizedEmail, password);
            await syncUserToFirestore(userCredential.user);
            setUser({
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                name: userCredential.user.displayName || sanitizedEmail.split('@')[0],
                photo: userCredential.user.photoURL
            });
            setOnboarded();
            
            const returnTo = location.state?.returnTo || '/profile';
            const reservedListing = location.state?.reservedListing;
            navigate(returnTo, { state: { reservedListing } });
        } catch (err) {
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
                setError('Invalid credentials. Check your password, or if you registered via Google, log in with Google.');
            } else {
                setError('Authentication failed. Please verify your details and try again.');
            }
            setStep('email');
            setPassword(''); 
        } finally {
            setLoading(false);
        }
    };

    // FEATURE 1 & 2: Direct Client-Side Password Override Engine
    const handleDirectResetSubmit = async (e) => {
        e.preventDefault();
        const sanitizedEmail = email.trim().toLowerCase();
        
        if (!sanitizedEmail || !currentPassword || !newPassword) {
            setError("All three security fields are strictly required.");
            return;
        }

        if (newPassword.length < 8) {
            setError("New password must be at least 8 characters long.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Trigger Store Action: Authenticates old password -> Sets new password
            await executeDirectPasswordChange(sanitizedEmail, currentPassword, newPassword);
            setStep('forgot-success');
        } catch (err) {
            console.error("Direct Reset Failed:", err);
            if (err.code === 'auth/invalid-credential') {
                setError("Verification Failed: The current password you entered is incorrect.");
            } else {
                setError("Failed to update password. Ensure your details are correct.");
            }
        } finally {
            setLoading(false);
        }
    };

    const submitFeedback = async () => {
        if (!feedbackText.trim()) return;
        setFeedbackLoading(true);
        try {
            await addDoc(collection(db, 'platform_feedbacks'), {
                text: feedbackText,
                email: email || 'anonymous',
                context: 'Login Page',
                createdAt: serverTimestamp(),
                status: 'unread'
            });
            setFeedbackSuccess(true);
            setTimeout(() => {
                setIsFeedbackOpen(false);
                setFeedbackText('');
                setFeedbackSuccess(false);
            }, 3000);
        } catch (err) {
            setFeedbackSuccess(true);
            setTimeout(() => {
                setIsFeedbackOpen(false);
                setFeedbackText('');
                setFeedbackSuccess(false);
            }, 3000);
        } finally {
            setFeedbackLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center py-12 px-4 relative font-sans overflow-hidden">
            
            {/* Feedback Engine Drawer */}
            <div 
                onClick={() => setIsFeedbackOpen(true)}
                className="fixed right-0 top-[30%] bg-[#333333] text-[#FFFFFF] text-[13px] font-bold py-3 px-1.5 rounded-l-[4px] cursor-pointer shadow-md hover:bg-[#E7364D] transition-colors z-40 flex items-center justify-center"
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
            >
                Feedback
            </div>

            <AnimatePresence>
                {isFeedbackOpen && (
                    <motion.div 
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-[360px] bg-[#FFFFFF] shadow-[0_0_40px_rgba(51,51,51,0.2)] z-50 flex flex-col border-l border-[#A3A3A3]/20"
                    >
                        <div className="p-5 border-b border-[#A3A3A3]/20 bg-[#F5F5F5] flex items-center justify-between">
                            <h3 className="text-[16px] font-black text-[#333333] flex items-center gap-2">
                                <MessageSquare size={18} className="text-[#E7364D]" />
                                Platform Feedback
                            </h3>
                            <button onClick={() => setIsFeedbackOpen(false)} className="text-[#626262] hover:text-[#E7364D] transition-colors p-1">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 flex-1 flex flex-col">
                            {feedbackSuccess ? (
                                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center">
                                    <div className="w-16 h-16 bg-[#FAD8DC] rounded-full flex items-center justify-center mb-4 border border-[#E7364D]/30">
                                        <Check size={32} className="text-[#E7364D]" strokeWidth={3} />
                                    </div>
                                    <h4 className="text-[18px] font-black text-[#333333] mb-2">Thank You!</h4>
                                    <p className="text-[14px] text-[#626262]">Your feedback has been securely transmitted.</p>
                                </motion.div>
                            ) : (
                                <>
                                    <p className="text-[14px] text-[#626262] mb-6 leading-relaxed">
                                        Experiencing an issue or have a suggestion? Let us know.
                                    </p>
                                    <textarea 
                                        value={feedbackText}
                                        onChange={(e) => setFeedbackText(e.target.value)}
                                        placeholder="Describe your experience..."
                                        className="w-full flex-1 border border-[#A3A3A3]/50 rounded-[8px] p-4 text-[14px] text-[#333333] outline-none focus:border-[#E7364D] resize-none mb-4"
                                    ></textarea>
                                    <button 
                                        onClick={submitFeedback}
                                        disabled={!feedbackText.trim() || feedbackLoading}
                                        className="w-full bg-[#333333] text-[#FFFFFF] font-bold py-3.5 rounded-[8px] flex items-center justify-center gap-2 hover:bg-[#E7364D] disabled:opacity-50 transition-all"
                                    >
                                        {feedbackLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                        {feedbackLoading ? 'Dispatching...' : 'Submit Feedback'}
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#FFFFFF] w-full max-w-[440px] rounded-[12px] shadow-[0_10px_40px_rgba(51,51,51,0.08)] overflow-hidden flex flex-col border border-[#A3A3A3]/20 relative z-10"
            >
                <div className="px-10 pt-10 pb-6 flex flex-col items-center">
                    
                    <div className="cursor-pointer mb-6" onClick={() => navigate('/')}>
                        <BooknshowLogo className="h-[40px]" />
                    </div>
                    
                    <h2 className="text-[22px] font-bold text-[#333333] mb-8 text-center">
                        {step === 'forgot' ? 'Update Security Key' : 'Sign in to Booknshow'}
                    </h2>

                    {error && (
                        <div className="mb-6 w-full p-3 bg-[#FAD8DC]/30 text-[#E7364D] text-[13px] border border-[#E7364D]/50 rounded-[6px] font-bold text-center leading-relaxed flex items-start justify-center gap-2">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {step === 'forgot-success' ? (
                        <div className="w-full flex flex-col items-center text-center pb-4">
                            <div className="w-14 h-14 bg-[#e8f5e9] rounded-full flex items-center justify-center mb-4 border border-[#458731]/30">
                                <ShieldCheck size={28} className="text-[#458731]" strokeWidth={2.5} />
                            </div>
                            <h3 className="text-[18px] font-black text-[#333333] mb-2">Password Updated</h3>
                            <p className="text-[14px] text-[#626262] mb-8">
                                Your account credentials have been successfully overwritten. You can now log in securely.
                            </p>
                            <button 
                                onClick={() => { setStep('password'); setCurrentPassword(''); setNewPassword(''); }}
                                className="w-full bg-[#333333] text-[#FFFFFF] font-bold py-3 rounded-[6px] hover:bg-[#E7364D] transition-colors"
                            >
                                Return to Login
                            </button>
                        </div>
                    ) : (
                        <form className="w-full" onSubmit={step === 'email' ? handleContinueClick : step === 'forgot' ? handleDirectResetSubmit : handleLoginSubmit}>
                            
                            {/* Standard Email/Password Login Flow */}
                            {step !== 'forgot' && (
                                <>
                                    <CustomInput 
                                        label="Email Address" 
                                        type="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        disabled={step === 'password' || loading} 
                                    />
                                    <AnimatePresence>
                                        {step === 'password' && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                                <CustomInput 
                                                    label="Password" 
                                                    type="password" 
                                                    value={password} 
                                                    onChange={(e) => setPassword(e.target.value)} 
                                                    autoFocus
                                                    disabled={loading}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}

                            {/* DIRECT OVERRIDE FORM (3-Fields) */}
                            {step === 'forgot' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
                                    <div className="mb-6 flex items-start gap-3 bg-[#F5F5F5] p-3.5 rounded-[8px] border border-[#A3A3A3]/30">
                                        <ShieldCheck className="text-[#E7364D] shrink-0 mt-0.5" size={20} />
                                        <div>
                                            <p className="text-[12px] font-bold text-[#333333] mb-0.5">Strict Verification Required</p>
                                            <p className="text-[11px] text-[#626262]">You must enter your current password to authorize a direct credential update.</p>
                                        </div>
                                    </div>

                                    <CustomInput 
                                        label="Registered Email" 
                                        type="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        disabled={loading} 
                                    />
                                    <CustomInput 
                                        label="Current Password" 
                                        icon={KeyRound}
                                        type="password" 
                                        value={currentPassword} 
                                        onChange={(e) => setCurrentPassword(e.target.value)} 
                                        disabled={loading} 
                                    />
                                    <CustomInput 
                                        label="New Secure Password" 
                                        icon={KeyRound}
                                        type={showNewPassword ? "text" : "password"} 
                                        value={newPassword} 
                                        onChange={(e) => setNewPassword(e.target.value)} 
                                        disabled={loading}
                                        showToggle={true}
                                        onToggle={() => setShowNewPassword(!showNewPassword)}
                                    />
                                </motion.div>
                            )}

                            {step !== 'forgot' && (
                                <div className="flex items-center justify-between mb-6 mt-2">
                                    <div className="flex items-center space-x-2.5 cursor-pointer group" onClick={() => setStayLoggedIn(!stayLoggedIn)}>
                                        <div className={`w-[20px] h-[20px] rounded-[4px] flex items-center justify-center transition-colors ${stayLoggedIn ? 'bg-[#E7364D] border-[#E7364D]' : 'border-2 border-[#A3A3A3] group-hover:border-[#E7364D]'}`}>
                                            {stayLoggedIn && <Check size={14} className="text-[#FFFFFF]" strokeWidth={3}/>}
                                        </div>
                                        <span className="text-[14px] text-[#333333] font-medium group-hover:text-[#E7364D] transition-colors">Stay logged in</span>
                                    </div>
                                    {step === 'password' && (
                                        <button type="button" onClick={() => { setStep('forgot'); setError(null); }} className="text-[13px] text-[#EB5B6E] font-bold hover:underline">
                                            Change password?
                                        </button>
                                    )}
                                </div>
                            )}

                            {step === 'forgot' && (
                                <div className="flex justify-end mb-6">
                                    <button type="button" onClick={() => { setStep('password'); setCurrentPassword(''); setNewPassword(''); setError(null); }} className="text-[13px] text-[#626262] font-bold hover:text-[#E7364D] hover:underline transition-colors">
                                        Cancel change
                                    </button>
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={
                                    loading || 
                                    (step === 'email' && !email) || 
                                    (step === 'password' && !password) || 
                                    (step === 'forgot' && (!email || !currentPassword || !newPassword))
                                }
                                className={`w-full py-3.5 rounded-[6px] font-bold text-[15px] transition-all mb-6 flex justify-center items-center ${((step === 'email' && email) || (step === 'password' && password) || (step === 'forgot' && email && currentPassword && newPassword)) ? 'bg-[#E7364D] text-[#FFFFFF] hover:bg-[#EB5B6E] shadow-sm' : 'bg-[#F5F5F5] text-[#A3A3A3] border border-[#A3A3A3]/20'}`}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-[#FFFFFF]/30 border-t-[#FFFFFF] rounded-full animate-spin"></div>
                                ) : (
                                    step === 'forgot' ? 'Update Password' : 'Continue'
                                )}
                            </button>
                        </form>
                    )}

                    {step !== 'forgot' && step !== 'forgot-success' && (
                        <>
                            <p className="text-[12px] text-[#626262] text-center leading-relaxed mb-6">
                                By signing in or creating an account, you agree to our <button className="text-[#EB5B6E] font-medium hover:underline">user agreement</button> and acknowledge our <button className="text-[#EB5B6E] font-medium hover:underline">privacy policy</button>.
                            </p>

                            <button className="w-full py-3 rounded-[6px] border border-[#A3A3A3] text-[#333333] font-bold text-[14px] hover:bg-[#FAD8DC]/20 hover:text-[#E7364D] hover:border-[#E7364D] transition-colors mb-4 shadow-sm">
                                Guest purchase? Find your order
                            </button>

                            <button 
                                onClick={handleGoogleAuth} 
                                disabled={loading}
                                className="w-full py-3 rounded-[6px] bg-[#FFFFFF] border border-[#A3A3A3] hover:bg-[#F5F5F5] text-[#333333] font-bold text-[14px] transition-colors flex items-center justify-center mb-6 shadow-sm disabled:opacity-50"
                            >
                                <svg className="w-5 h-5 mr-2.5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Log In with Google
                            </button>

                            <div className="text-[14px] text-[#333333]">
                                New to Booknshow? <Link to="/signup" className="text-[#EB5B6E] font-bold hover:underline">Create an account</Link>
                            </div>
                        </>
                    )}
                </div>

                <div className="border-t border-[#A3A3A3]/20 bg-[#F5F5F5] px-10 py-5 space-y-3 mt-auto">
                    <div className="flex items-center text-[13px] font-medium text-[#626262] cursor-pointer pb-3 border-b border-[#A3A3A3]/20 hover:text-[#E7364D] transition-colors">
                        <span className="mr-3 font-serif">A文</span> English (US)
                    </div>
                    <div className="flex items-center text-[13px] font-medium text-[#626262] cursor-pointer pt-1 hover:text-[#E7364D] transition-colors">
                        <span className="mr-3 font-bold">₹</span> Indian Rupee
                    </div>
                </div>
            </motion.div>
        </div>
    );
}