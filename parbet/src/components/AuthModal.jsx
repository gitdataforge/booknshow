import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, AlertCircle, Eye, EyeOff, Camera, User, UploadCloud, CheckCircle2, ShieldCheck, RefreshCw, Activity, Globe, Shield } from 'lucide-react';
import { useAppStore } from '../store/useStore';
import { auth, db } from '../lib/firebase';
import { 
    signInWithPopup, 
    GoogleAuthProvider, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { uploadUserAvatar } from '../services/cloudinaryApi';
import { sendVerificationEmail, EmailVerificationGateway } from '../services/emailJsApi';

export default function AuthModal() {
    const navigate = useNavigate();
    const { isAuthModalOpen, closeAuthModal, setUser, setOnboarded } = useAppStore();
    
    // Auth Flow States (FEATURE 1: Complex Multi-Step State Machine)
    const [authStep, setAuthStep] = useState('credentials'); // 'credentials' | 'otp_verification' | 'profile_setup'
    const [isLogin, setIsLogin] = useState(true);
    const [pendingUser, setPendingUser] = useState(null);
    
    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    
    // Verification Engine State
    const [expectedOtp, setExpectedOtp] = useState('');

    // Feedback States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [passwordStrength, setPasswordStrength] = useState(0);

    // FEATURE 2: Real-Time Dynamic Context (Greeting & Geo-Security)
    const [greeting, setGreeting] = useState('Welcome');
    const [timeZone, setTimeZone] = useState('Detecting...');
    const [uptime, setUptime] = useState(0);

    // Context Initialization & Modal Effect
    useEffect(() => {
        const hour = new Date().getHours();
        setGreeting(hour < 12 ? 'Good morning.' : hour < 18 ? 'Good afternoon.' : 'Good evening.');
        setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
        setUptime(Math.floor((Date.now() - new Date('2024-01-01').getTime()) / 1000));

        if (isAuthModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
            setTimeout(() => {
                setEmail('');
                setPassword('');
                setDisplayName('');
                setAvatarFile(null);
                setAvatarPreview('');
                setError(null);
                setIsLogin(true);
                setAuthStep('credentials');
                setPendingUser(null);
                setExpectedOtp('');
            }, 300);
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isAuthModalOpen]);

    // System Uptime Ticker
    useEffect(() => {
        if (!isAuthModalOpen) return;
        const interval = setInterval(() => setUptime(prev => prev + 1), 1000);
        return () => clearInterval(interval);
    }, [isAuthModalOpen]);

    // Real-time Password Strength Validation
    useEffect(() => {
        if (!password) {
            setPasswordStrength(0);
            return;
        }
        let score = 0;
        if (password.length >= 8) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        setPasswordStrength(score);
    }, [password]);

    // Firestore Document Sync
    const syncUserToFirestore = async (user, additionalData = {}) => {
        const userRef = doc(db, 'users', user.uid);
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

    // OAuth Google Sync (STRICT ROUTING ENFORCED)
    const handleGoogleAuth = async () => {
        setLoading(true);
        setError(null);
        const provider = new GoogleAuthProvider();
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
            closeAuthModal();
            navigate('/'); // FEATURE 3: Strict Route Enforcement
        } catch (err) {
            console.error("Google Auth Error:", err);
            setError(err.message || 'Failed to authenticate with Google. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Credentials Dispatch (STRICT ROUTING ENFORCED)
    const handleEmailAuth = async (e) => {
        e.preventDefault();
        if (!email || !password) return setError('Please fill in all fields.');
        if (!isLogin && passwordStrength < 2) return setError('Please choose a stronger password.');

        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                // Direct Login -> Dashboard
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                await syncUserToFirestore(userCredential.user);
                setUser({
                    uid: userCredential.user.uid,
                    email: userCredential.user.email,
                    name: userCredential.user.displayName || email.split('@')[0],
                    photo: userCredential.user.photoURL
                });
                setOnboarded();
                closeAuthModal();
                navigate('/'); // FEATURE 3: Strict Route Enforcement
            } else {
                // Halting Firebase -> Trigger EmailJS OTP Pipeline
                const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
                const res = await sendVerificationEmail(email, generatedCode);
                
                if (res.success) {
                    setExpectedOtp(generatedCode);
                    setAuthStep('otp_verification');
                } else {
                    setError('Failed to send verification email. Check your connection.');
                }
            }
        } catch (err) {
            console.error("Auth Error:", err);
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') setError('Invalid email or password.');
            else if (err.code === 'auth/email-already-in-use') setError('An account with this email already exists.');
            else setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Successful Verification Handler (STRICT ROUTING ENFORCED)
    const handleVerifySuccess = async () => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await syncUserToFirestore(userCredential.user);
            
            setUser({
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                name: email.split('@')[0],
                photo: ''
            });
            
            setOnboarded();
            closeAuthModal(); 
            navigate('/'); // FEATURE 3: Strict Route Enforcement
        } catch (err) {
            console.error("Account Creation Error:", err);
            setError(err.message);
            setAuthStep('credentials');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
        const res = await sendVerificationEmail(email, generatedCode);
        if (res.success) {
            setExpectedOtp(generatedCode);
        } else {
            setError('Failed to resend code.');
        }
    };

    // FEATURE 4: Cloudinary Profile Setup (STRICT ROUTING ENFORCED)
    const handleProfileSetup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let photoUrl = '';
            if (avatarFile && pendingUser) {
                const uploadResult = await uploadUserAvatar(avatarFile, pendingUser.uid);
                photoUrl = uploadResult.url;
            }

            await updateProfile(pendingUser, {
                displayName: displayName || email.split('@')[0],
                photoURL: photoUrl || ''
            });

            await syncUserToFirestore(pendingUser, {
                displayName: displayName || email.split('@')[0],
                photoURL: photoUrl || ''
            });

            setUser({
                uid: pendingUser.uid,
                email: pendingUser.email,
                name: displayName || pendingUser.email.split('@')[0],
                photo: photoUrl || ''
            });
            setOnboarded();
            closeAuthModal();
            navigate('/'); // FEATURE 3: Strict Route Enforcement
        } catch (err) {
            console.error("Profile Setup Error:", err);
            setError('Failed to upload profile picture or save details.');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    return (
        <>
            <AnimatePresence>
                {isAuthModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] bg-white flex flex-col md:flex-row w-full h-full overflow-hidden"
                    >
                        {/* Absolute Close Button */}
                        <button 
                            onClick={closeAuthModal}
                            className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-gray-800 md:text-white backdrop-blur-md transition-colors z-[1010] shadow-sm border border-gray-200 md:border-white/20"
                        >
                            <X size={24} />
                        </button>

                        {/* Left Panel: Dynamic Auth Forms */}
                        <div className="w-full md:w-[45%] lg:w-[35%] h-full flex flex-col justify-center px-8 sm:px-16 overflow-y-auto hide-scrollbar bg-white relative z-10">
                            <div className="max-w-[400px] w-full mx-auto py-12">
                                
                                <h2 className="text-[32px] font-black leading-tight tracking-tight text-gray-900 mb-2">
                                    {authStep === 'profile_setup' ? 'Complete Profile' : 
                                     isLogin ? 'Welcome back.' : 'Join Parbet.'}
                                </h2>
                                <p className="text-[15px] font-medium text-gray-500 mb-8">
                                    {authStep === 'profile_setup' ? 'Personalize your account to get started.' : 
                                     'The worlds most secure secondary ticket marketplace.'}
                                </p>

                                <AnimatePresence mode="wait">
                                    {error && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                            className="bg-red-50 text-red-600 border border-red-100 px-4 py-3 rounded-xl text-[13px] font-bold flex items-start mb-6"
                                        >
                                            <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                                            <span>{error}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <AnimatePresence mode="wait">
                                    {/* SECTION: Credentials Portal */}
                                    {authStep === 'credentials' && (
                                        <motion.div key="credentials" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                            <button 
                                                onClick={handleGoogleAuth} disabled={loading}
                                                className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-200 text-gray-800 font-bold py-4 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50 mb-6"
                                            >
                                                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                                </svg>
                                                <span>Continue with Google</span>
                                            </button>

                                            <div className="flex items-center justify-center space-x-4 mb-6">
                                                <div className="h-px bg-gray-200 flex-1"></div>
                                                <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Or</span>
                                                <div className="h-px bg-gray-200 flex-1"></div>
                                            </div>

                                            <form onSubmit={handleEmailAuth} className="space-y-4">
                                                <div className="relative">
                                                    <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input 
                                                        type="email" placeholder="Email address" value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-4 text-[15px] font-bold text-gray-900 outline-none focus:border-[#114C2A] focus:bg-white focus:ring-4 focus:ring-[#114C2A]/10 transition-all placeholder-gray-400"
                                                        required
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input 
                                                        type={showPassword ? "text" : "password"} placeholder="Password" value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-12 py-4 text-[15px] font-bold text-gray-900 outline-none focus:border-[#114C2A] focus:bg-white focus:ring-4 focus:ring-[#114C2A]/10 transition-all placeholder-gray-400"
                                                        required
                                                    />
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>

                                                <AnimatePresence>
                                                    {!isLogin && password.length > 0 && (
                                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="px-1 pt-2">
                                                            <div className="flex gap-1.5 mb-2">
                                                                {[1, 2, 3, 4].map((level) => (
                                                                    <div key={level} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${passwordStrength >= level ? (passwordStrength < 2 ? 'bg-red-400' : passwordStrength < 4 ? 'bg-yellow-400' : 'bg-[#458731]') : 'bg-gray-100'}`}/>
                                                                ))}
                                                            </div>
                                                            <p className={`text-[12px] font-bold text-right ${passwordStrength < 2 ? 'text-red-500' : passwordStrength < 4 ? 'text-yellow-600' : 'text-[#458731]'}`}>
                                                                {passwordStrength < 2 ? 'Weak' : passwordStrength < 4 ? 'Good' : 'Strong'}
                                                            </p>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                <button 
                                                    type="submit" disabled={loading}
                                                    className="w-full bg-[#114C2A] text-white font-black py-4 rounded-xl shadow-lg hover:bg-[#0c361d] hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 flex justify-center items-center mt-4"
                                                >
                                                    {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (isLogin ? 'Sign In' : 'Create Account')}
                                                </button>
                                            </form>

                                            <div className="mt-8 text-center">
                                                <button onClick={() => { setIsLogin(!isLogin); setError(null); setPassword(''); }} className="text-[14px] font-bold text-gray-500 hover:text-[#114C2A] transition-colors">
                                                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* SECTION: Profile Setup Cloudinary Dropzone */}
                                    {authStep === 'profile_setup' && (
                                        <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                            <form onSubmit={handleProfileSetup} className="space-y-6">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="relative group cursor-pointer">
                                                        <input 
                                                            type="file" accept="image/*" onChange={handleAvatarSelect}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                                        />
                                                        <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 group-hover:border-[#114C2A] group-hover:bg-[#114C2A]/5 transition-all relative">
                                                            {avatarPreview ? (
                                                                <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="flex flex-col items-center text-gray-400 group-hover:text-[#114C2A] transition-colors">
                                                                    <Camera size={32} className="mb-2" />
                                                                    <span className="text-[10px] font-bold uppercase tracking-wider">Upload</span>
                                                                </div>
                                                            )}
                                                            {avatarPreview && (
                                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                    <UploadCloud size={24} className="text-white" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-[12px] font-medium text-gray-400 mt-3 text-center">Powered by Cloudinary CDN</p>
                                                </div>

                                                <div className="relative mt-6">
                                                    <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input 
                                                        type="text" placeholder="Display Name (Optional)" value={displayName}
                                                        onChange={(e) => setDisplayName(e.target.value)}
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-4 text-[15px] font-bold text-gray-900 outline-none focus:border-[#114C2A] focus:bg-white focus:ring-4 focus:ring-[#114C2A]/10 transition-all placeholder-gray-400"
                                                    />
                                                </div>

                                                <button 
                                                    type="submit" disabled={loading}
                                                    className="w-full bg-[#114C2A] text-white font-black py-4 rounded-xl shadow-lg hover:bg-[#0c361d] transition-all disabled:opacity-70 flex justify-center items-center"
                                                >
                                                    {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Complete Setup'}
                                                </button>
                                                
                                                <button type="button" onClick={handleProfileSetup} className="w-full py-4 text-[14px] font-bold text-gray-500 hover:text-gray-800 transition-colors">
                                                    Skip for now
                                                </button>
                                            </form>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Legal Footer */}
                                <div className="mt-12 text-center">
                                    <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                                        By joining, you agree to Parbet's <button className="text-gray-600 hover:underline">Terms of Service</button> and acknowledge our <button className="text-gray-600 hover:underline">Privacy Policy</button>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* HIGH-END RIGHT PANEL (4 NEW SECTIONS + ANIMATED SVG) */}
                        <div className="hidden md:flex flex-col flex-1 bg-[#0A192F] relative overflow-hidden items-center justify-center p-12">
                            
                            {/* SECTION 1: High-End Animated SVG Topography Background */}
                            <motion.svg 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, ease: "easeOut" }}
                                className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg"
                            >
                                <defs>
                                    <linearGradient id="topographyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style={{ stopColor: '#114C2A', stopOpacity: 0.8 }} />
                                        <stop offset="50%" style={{ stopColor: '#458731', stopOpacity: 0.4 }} />
                                        <stop offset="100%" style={{ stopColor: '#0A192F', stopOpacity: 1 }} />
                                    </linearGradient>
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                                        <feMerge>
                                            <feMergeNode in="coloredBlur"/>
                                            <feMergeNode in="SourceGraphic"/>
                                        </feMerge>
                                    </filter>
                                </defs>
                                {[...Array(20)].map((_, i) => (
                                    <motion.path
                                        key={i} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.4 + (Math.random() * 0.4) }}
                                        transition={{ duration: 4 + i * 0.3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                                        d={`M-200 ${50 + i * 70} Q 400 ${-100 + i * 120} 800 ${300 + i * 40} T 1800 ${100 + i * 90}`}
                                        fill="none" stroke="url(#topographyGrad)" strokeWidth={1.5 + (i % 2)} filter="url(#glow)"
                                    />
                                ))}
                            </motion.svg>
                            
                            <div className="relative z-10 w-full max-w-lg">
                                {/* SECTION 2: Dynamic Greeting & Hero Context */}
                                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="mb-10 text-center md:text-left">
                                    <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tighter mb-4">
                                        {greeting} <br/><span className="text-[#8bc53f]">Access the inaccessible.</span>
                                    </h1>
                                    <p className="text-lg text-gray-300 font-medium leading-relaxed">
                                        Join over 5 million fans in the world's most secure secondary ticket marketplace.
                                    </p>
                                </motion.div>

                                {/* SECTION 3: Live Market Ticker */}
                                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-[16px] overflow-hidden mb-6 flex items-center">
                                    <div className="bg-[#114C2A] text-white font-black text-[11px] uppercase tracking-widest px-4 py-3 flex items-center shrink-0">
                                        <Activity size={14} className="mr-2" /> Live
                                    </div>
                                    <div className="overflow-hidden whitespace-nowrap relative flex-1">
                                        <motion.div 
                                            animate={{ x: ["100%", "-100%"] }} 
                                            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                                            className="text-[13px] font-bold text-gray-300 inline-block"
                                        >
                                            VIP Pass secured in London • Front row grabbed in New York • Floor access confirmed in Tokyo • 
                                        </motion.div>
                                    </div>
                                </motion.div>

                                {/* SECTION 4: Enterprise Security & Geolocation Panel */}
                                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }} className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[16px] p-5">
                                        <Globe size={24} className="text-[#8bc53f] mb-3" />
                                        <h3 className="text-white font-bold text-[14px]">Geo-Security Lock</h3>
                                        <p className="text-gray-400 text-[12px] font-medium mt-1 truncate">Region: {timeZone}</p>
                                    </div>
                                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[16px] p-5">
                                        <Shield size={24} className="text-blue-400 mb-3" />
                                        <h3 className="text-white font-bold text-[14px]">Enterprise Encryption</h3>
                                        <p className="text-gray-400 text-[12px] font-medium mt-1 truncate">256-bit AES TLS 1.3</p>
                                    </div>
                                </motion.div>

                                {/* SECTION 5: Platform Metrics (Uptime) */}
                                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }} className="flex items-center justify-between bg-black/40 backdrop-blur-md border border-white/5 rounded-[12px] px-5 py-4">
                                    <div className="flex items-center text-[12px] font-bold text-gray-400 uppercase tracking-widest">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>
                                        System Uptime
                                    </div>
                                    <div className="font-mono text-white text-[14px] font-bold tracking-wider">
                                        {uptime.toLocaleString()}s
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FULL-SCREEN OVERLAY: Email Verification Gateway */}
            <AnimatePresence>
                {authStep === 'otp_verification' && (
                    <EmailVerificationGateway 
                        email={email}
                        expectedCode={expectedOtp}
                        onVerifySuccess={handleVerifySuccess}
                        onCancel={() => { setAuthStep('credentials'); setError(null); }}
                        onRequestNewCode={handleResendOtp}
                    />
                )}
            </AnimatePresence>
        </>
    );
}