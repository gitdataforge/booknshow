import os

def write_file(filepath, content):
    dir_name = os.path.dirname(filepath)
    if dir_name:  
        os.makedirs(dir_name, exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content.strip())
    print(f"Created: {filepath}")

def main():
    print("🚀 Generating Parbet React Architecture (Viagogo-Style Light Theme & 2FA Flow)...")

    # ==========================================
    # 1. ENV VARIABLES
    # ==========================================
    env_content = """
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
"""
    write_file('.env.example', env_content)
    write_file('.env.local', env_content)

    # ==========================================
    # 2. CONFIGURATION & STYLING
    # ==========================================
    tailwind_config = """
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#FFFFFF',
          panel: '#F8F9FA',
          primary: '#114C2A', // Viagogo Dark Green
          primaryLight: '#E6F2D9', // Viagogo Soft Green Background
          accent: '#458731', // Viagogo Button Green
          text: '#212529',
          muted: '#6C757D',
          border: '#DEE2E6',
          red: '#DC3545'
        }
      },
      fontFamily: { sans: ['"Inter"', 'sans-serif'] },
      animation: { 'fade-in': 'fadeIn 0.5s ease-out' },
      keyframes: { fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } } }
    },
  },
  plugins: [],
}
"""
    write_file('tailwind.config.js', tailwind_config)

    index_css = """
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

body { background-color: #FFFFFF; color: #212529; margin: 0; font-family: 'Inter', sans-serif; overflow-x: hidden; }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
"""
    write_file('src/index.css', index_css)

    # ==========================================
    # 3. STATE, FIREBASE & EMAILJS
    # ==========================================
    store_js = """
import { create } from 'zustand';
export const useAppStore = create((set) => ({
    user: null, balance: 0, diamonds: 0,
    hasOnboarded: localStorage.getItem('parbet_onboarded') === 'true',
    isAuthenticated: false,
    setOnboarded: () => { localStorage.setItem('parbet_onboarded', 'true'); set({ hasOnboarded: true }); },
    setAuth: (status) => set({ isAuthenticated: status }),
    setUser: (user) => set({ user }),
    setWallet: (balance, diamonds) => set({ balance, diamonds }),
}));
"""
    write_file('src/store/useStore.js', store_js)

    firebase_js = """
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, doc, updateDoc, increment, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
"""
    write_file('src/lib/firebase.js', firebase_js)

    email_js = """
import emailjs from '@emailjs/browser';
export const sendVerificationEmail = async (email, code) => {
    try {
        await emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            { to_email: email, verification_code: code },
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
        return { success: true };
    } catch (e) { console.error('EmailJS Error:', e); return { success: false }; }
};
"""
    write_file('src/lib/email.js', email_js)

    # ==========================================
    # 4. AUTH FLOW (Email OTP -> Password -> 2FA -> Login)
    # ==========================================
    authflow_jsx = """
import React, { useState } from 'react';
import * as OTPAuth from 'otpauth';
import { QRCodeSVG } from 'qrcode.react';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { sendVerificationEmail } from '../lib/email';
import { useAppStore } from '../store/useStore';
import { ShieldCheck, Mail, Key, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthFlow() {
    const setAuth = useAppStore(state => state.setAuth);
    const [step, setStep] = useState('select');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [inputCode, setInputCode] = useState('');
    const [totpSecret, setTotpSecret] = useState('');
    const [totpUri, setTotpUri] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendEmailCode = async () => {
        setLoading(true); setError('');
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedCode(code);
        const res = await sendVerificationEmail(email, code);
        setLoading(false);
        if (res.success) setStep('verify_email');
        else setError('Failed to send email. Check EmailJS configuration.');
    };

    const handleVerifyEmail = () => {
        if (inputCode === generatedCode) setStep('setup_pass');
        else setError('Invalid code.');
    };

    const handleSetupPassword = async () => {
        setLoading(true); setError('');
        try {
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            const secret = new OTPAuth.Secret({ size: 20 });
            const totp = new OTPAuth.TOTP({ issuer: 'Parbet', label: email, algorithm: 'SHA1', digits: 6, period: 30, secret });
            setTotpSecret(secret.base32);
            setTotpUri(totp.toString());
            await setDoc(doc(db, 'users', userCred.user.uid), { email, mfaSecret: secret.base32, balance: 1999.98 });
            setStep('setup_2fa');
        } catch (err) { setError(err.message); }
        setLoading(false);
    };

    const handleVerify2FASetup = () => {
        const totp = new OTPAuth.TOTP({ secret: OTPAuth.Secret.fromBase32(totpSecret) });
        if (totp.validate({ token: inputCode, window: 1 }) !== null) setAuth(true);
        else setError('Invalid 2FA code.');
    };

    const handleLogin = async () => {
        setLoading(true); setError('');
        try {
            const userCred = await signInWithEmailAndPassword(auth, email, password);
            const userDoc = await getDoc(doc(db, 'users', userCred.user.uid));
            if (userDoc.exists()) {
                setTotpSecret(userDoc.data().mfaSecret);
                setStep('verify_2fa');
            } else { setError('User data not found.'); }
        } catch (err) { setError(err.message); }
        setLoading(false);
    };

    const handleVerifyLogin2FA = () => {
        const totp = new OTPAuth.TOTP({ secret: OTPAuth.Secret.fromBase32(totpSecret) });
        if (totp.validate({ token: inputCode, window: 1 }) !== null) setAuth(true);
        else setError('Invalid 2FA code.');
    };

    return (
        <div className="min-h-screen bg-brand-panel flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl border border-brand-border">
                <div className="flex justify-center mb-6"><ShieldCheck size={48} className="text-brand-primary" /></div>
                <h2 className="text-2xl font-bold text-center text-brand-text mb-8">Secure Access</h2>
                
                {error && <div className="bg-brand-red/10 text-brand-red p-3 rounded-lg text-sm mb-4 text-center">{error}</div>}

                {step === 'select' && (
                    <div className="space-y-4">
                        <button onClick={() => setStep('login')} className="w-full bg-brand-primary text-white py-3 rounded-xl font-bold hover:bg-brand-primary/90 transition-colors">Sign In to Account</button>
                        <button onClick={() => setStep('signup_email')} className="w-full bg-white text-brand-primary py-3 rounded-xl border border-brand-border font-bold hover:bg-brand-panel transition-colors">Create New Account</button>
                    </div>
                )}

                {step === 'signup_email' && (
                    <div className="space-y-4">
                        <div className="flex items-center bg-white rounded-xl px-4 py-3 border border-brand-border"><Mail size={18} className="text-brand-muted mr-3"/><input type="email" placeholder="Enter Email Address" value={email} onChange={e=>setEmail(e.target.value)} className="bg-transparent outline-none flex-1 text-sm text-brand-text"/></div>
                        <button onClick={handleSendEmailCode} disabled={loading} className="w-full bg-brand-primary text-white py-3 rounded-xl font-bold hover:bg-brand-primary/90 transition-colors">{loading ? 'Sending...' : 'Send Verification Code'}</button>
                    </div>
                )}

                {step === 'verify_email' && (
                    <div className="space-y-4">
                        <p className="text-sm text-brand-muted text-center">Enter the 4-digit code sent to {email}</p>
                        <input type="text" placeholder="0000" maxLength="4" value={inputCode} onChange={e=>setInputCode(e.target.value)} className="w-full bg-white rounded-xl px-4 py-3 text-center tracking-[1em] text-xl font-bold outline-none border border-brand-border focus:border-brand-primary text-brand-text" />
                        <button onClick={handleVerifyEmail} className="w-full bg-brand-primary text-white py-3 rounded-xl font-bold hover:bg-brand-primary/90 transition-colors">Verify Email</button>
                    </div>
                )}

                {step === 'setup_pass' && (
                    <div className="space-y-4">
                        <div className="flex items-center bg-white rounded-xl px-4 py-3 border border-brand-border"><Key size={18} className="text-brand-muted mr-3"/><input type="password" placeholder="Create Password" value={password} onChange={e=>setPassword(e.target.value)} className="bg-transparent outline-none flex-1 text-sm text-brand-text"/></div>
                        <button onClick={handleSetupPassword} disabled={loading} className="w-full bg-brand-primary text-white py-3 rounded-xl font-bold hover:bg-brand-primary/90 transition-colors">{loading ? 'Saving...' : 'Set Password & Continue'}</button>
                    </div>
                )}

                {step === 'setup_2fa' && (
                    <div className="space-y-4 flex flex-col items-center">
                        <p className="text-sm text-brand-muted text-center">Scan this QR code with Google Authenticator or Authy to enable strictly required 2FA.</p>
                        <div className="bg-white p-4 rounded-xl border border-brand-border shadow-sm"><QRCodeSVG value={totpUri} size={150} /></div>
                        <input type="text" placeholder="Enter 6-digit TOTP" maxLength="6" value={inputCode} onChange={e=>setInputCode(e.target.value)} className="w-full bg-white rounded-xl px-4 py-3 text-center tracking-widest text-lg font-bold outline-none border border-brand-border text-brand-text focus:border-brand-primary" />
                        <button onClick={handleVerify2FASetup} className="w-full bg-brand-accent text-white py-3 rounded-xl font-bold hover:bg-brand-accent/90 transition-colors">Enable 2FA & Complete</button>
                    </div>
                )}

                {step === 'login' && (
                    <div className="space-y-4">
                        <div className="flex items-center bg-white rounded-xl px-4 py-3 border border-brand-border"><Mail size={18} className="text-brand-muted mr-3"/><input type="email" placeholder="Email Address" value={email} onChange={e=>setEmail(e.target.value)} className="bg-transparent outline-none flex-1 text-sm text-brand-text"/></div>
                        <div className="flex items-center bg-white rounded-xl px-4 py-3 border border-brand-border"><Lock size={18} className="text-brand-muted mr-3"/><input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="bg-transparent outline-none flex-1 text-sm text-brand-text"/></div>
                        <button onClick={handleLogin} disabled={loading} className="w-full bg-brand-primary text-white py-3 rounded-xl font-bold hover:bg-brand-primary/90 transition-colors">{loading ? 'Authenticating...' : 'Sign In'}</button>
                    </div>
                )}

                {step === 'verify_2fa' && (
                    <div className="space-y-4">
                        <p className="text-sm text-brand-muted text-center">Enter the 6-digit code from your Authenticator App</p>
                        <input type="text" placeholder="000 000" maxLength="6" value={inputCode} onChange={e=>setInputCode(e.target.value)} className="w-full bg-white rounded-xl px-4 py-3 text-center tracking-[0.5em] text-xl font-bold outline-none border border-brand-border text-brand-text focus:border-brand-primary" />
                        <button onClick={handleVerifyLogin2FA} className="w-full bg-brand-primary text-white py-3 rounded-xl font-bold flex justify-center items-center hover:bg-brand-primary/90 transition-colors">Unlock Account <ArrowRight size={16} className="ml-2"/></button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
"""
    write_file('src/components/AuthFlow.jsx', authflow_jsx)

    # ==========================================
    # 5. ONBOARDING (8 SLIDES - Light/Green Theme)
    # ==========================================
    onboarding_jsx = """
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { useAppStore } from '../store/useStore';

const SVGShape = ({ children }) => (
    <motion.svg viewBox="0 0 200 200" className="w-64 h-64 overflow-visible" animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
        {children}
    </motion.svg>
);

const slides = [
    { title: "Welcome to Parbet\\nPremium Sports", desc: "Experience a clean, seamless betting interface inspired by global ticketing platforms.", graphic: <SVGShape><motion.circle cx="100" cy="100" r="70" fill="none" stroke="#114C2A" strokeWidth="12" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }} /><motion.circle cx="100" cy="100" r="90" fill="none" stroke="#E6F2D9" strokeWidth="6" /></SVGShape> },
    { title: "Live Odds &\\nMarket Trends", desc: "Track Asian Handicaps and Over/Under lines with real-time updates.", graphic: <SVGShape><motion.path d="M 20 150 L 70 90 L 110 110 L 170 40" fill="none" stroke="#458731" strokeWidth="10" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, repeat: Infinity }} /></SVGShape> },
    { title: "Bank-Grade\\n2FA Security", desc: "Your wallet is locked down with mandatory TOTP authentication logic.", graphic: <SVGShape><motion.circle cx="100" cy="100" r="50" fill="none" stroke="#114C2A" strokeWidth="16" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} /></SVGShape> },
    { title: "Lightning Fast\\nExecution", desc: "Place orders instantly with one tap via our global edge network.", graphic: <SVGShape><motion.path d="M 100 0 L 100 200 M 0 100 L 200 100" stroke="#E6F2D9" strokeWidth="8" animate={{ rotate: 45 }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} /><circle cx="100" cy="100" r="20" fill="#458731" /></SVGShape> },
    { title: "Top Global\\nLeagues", desc: "From the Indian Premier League to the UEFA Champions League.", graphic: <SVGShape><motion.ellipse cx="100" cy="100" rx="90" ry="30" fill="none" stroke="#114C2A" strokeWidth="6" animate={{ ry: [30, 90, 30] }} transition={{ duration: 4, repeat: Infinity }} /></SVGShape> },
    { title: "Secure Payouts\\nWorldwide", desc: "Withdraw your winnings safely directly to your preferred bank.", graphic: <SVGShape><motion.polygon points="100,20 180,180 20,180" fill="none" stroke="#458731" strokeWidth="10" animate={{ rotate: -360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} /></SVGShape> },
    { title: "Responsive Across\\nAll Devices", desc: "Flawless trading experience whether on mobile or wide desktop.", graphic: <SVGShape><motion.rect x="40" y="40" width="120" height="120" rx="20" fill="none" stroke="#114C2A" strokeWidth="10" animate={{ rotate: 90 }} transition={{ duration: 3, repeat: Infinity }} /></SVGShape> },
    { title: "Ready to\\nGet Started?", desc: "Create your account securely and verify your email to unlock your wallet.", graphic: <SVGShape><motion.circle cx="100" cy="100" r="80" fill="none" stroke="#458731" strokeWidth="8" animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }} transition={{ duration: 2, repeat: Infinity }} /><circle cx="100" cy="100" r="10" fill="#114C2A"/></SVGShape> }
];

export default function Onboarding() {
    const [index, setIndex] = useState(0);
    const setOnboarded = useAppStore(state => state.setOnboarded);

    return (
        <div className="relative w-full h-screen bg-brand-bg flex flex-col justify-between p-8 z-50 items-center text-center overflow-hidden">
            <div className="flex-1 flex flex-col justify-center items-center w-full max-w-md">
                <AnimatePresence mode="wait">
                    <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 0.3 }} className="flex flex-col items-center w-full">
                        <div className="w-full flex justify-center mb-8 h-64">{slides[index].graphic}</div>
                        <h1 className="text-4xl font-black whitespace-pre-line mt-8 leading-tight tracking-tight text-brand-text">{slides[index].title}</h1>
                        <p className="text-brand-muted mt-4 text-sm leading-relaxed max-w-xs mx-auto">{slides[index].desc}</p>
                    </motion.div>
                </AnimatePresence>
            </div>
            
            <div className="w-full max-w-md pb-8">
                <div className="flex justify-center space-x-2 mb-8">
                    {slides.map((_, i) => (<div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-brand-primary' : 'w-2 bg-brand-border'}`} />))}
                </div>
                {index < slides.length - 1 ? (
                    <button onClick={() => setIndex(i => i + 1)} className="w-full bg-brand-panel border border-brand-border text-brand-text font-bold py-4 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
                        <span>Continue</span><ArrowRight size={18} className="ml-2 text-brand-muted" />
                    </button>
                ) : (
                    <button onClick={() => setOnboarded()} className="w-full bg-brand-primary text-white font-black py-4 rounded-xl flex items-center justify-center hover:scale-[1.02] transition-transform shadow-lg">
                        <Play size={18} className="mr-2" fill="currentColor" /><span>GET STARTED</span>
                    </button>
                )}
            </div>
        </div>
    );
}
"""
    write_file('src/components/Onboarding.jsx', onboarding_jsx)

    # ==========================================
    # 6. APP LAYOUT (Viagogo Style Desktop/Mobile)
    # ==========================================
    app_jsx = """
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAppStore } from './store/useStore';
import { Search, User, Menu, Heart, Ticket } from 'lucide-react';

import Onboarding from './components/Onboarding';
import AuthFlow from './components/AuthFlow';
import Home from './pages/Home';

function DesktopNav() {
    const navigate = useNavigate();
    return (
        <div className="w-full bg-white border-b border-brand-border sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <h1 onClick={()=>navigate('/')} className="text-2xl font-black tracking-tighter text-brand-text cursor-pointer">parbet</h1>
                    <div className="hidden md:flex items-center bg-white border border-brand-border rounded-full px-4 py-2.5 w-96 shadow-sm">
                        <Search size={18} className="text-brand-muted mr-3"/>
                        <input type="text" placeholder="Search events, teams and more" className="bg-transparent outline-none flex-1 text-sm text-brand-text placeholder-brand-muted"/>
                    </div>
                </div>
                <div className="hidden md:flex items-center space-x-6 text-sm font-bold text-brand-text">
                    <button onClick={()=>navigate('/')} className="hover:text-brand-primary transition-colors">Explore</button>
                    <button className="hover:text-brand-primary transition-colors">Sell</button>
                    <button className="hover:text-brand-primary transition-colors">Favourites</button>
                    <button className="hover:text-brand-primary transition-colors">My Bets</button>
                    <div className="flex items-center space-x-3 cursor-pointer border-l border-brand-border pl-6">
                        <span>Profile</span>
                        <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center"><User size={16} className="text-white"/></div>
                    </div>
                </div>
                {/* Mobile Hamburger */}
                <div className="md:hidden flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center"><User size={16} className="text-white"/></div>
                    <Menu size={24} className="text-brand-text"/>
                </div>
            </div>
            {/* Mobile Search Bar below header */}
            <div className="md:hidden px-4 pb-4">
                <div className="flex items-center bg-white border border-brand-border rounded-full px-4 py-2.5 w-full shadow-sm">
                    <Search size={18} className="text-brand-muted mr-3"/>
                    <input type="text" placeholder="Search events, teams..." className="bg-transparent outline-none flex-1 text-sm text-brand-text placeholder-brand-muted"/>
                </div>
            </div>
        </div>
    );
}

function MainLayout() {
    return (
        <div className="flex flex-col w-full min-h-screen bg-brand-bg text-brand-text">
            <DesktopNav />
            <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-8">
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </main>
        </div>
    );
}

export default function App() {
    const { hasOnboarded, isAuthenticated, setAuth, setWallet } = useAppStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userRef = doc(db, 'users', user.uid);
                const unsubWallet = onSnapshot(userRef, (docSnap) => {
                    if (docSnap.exists()) setWallet(docSnap.data().balance, 0);
                });
                setLoading(false);
                return () => unsubWallet();
            } else {
                setAuth(false);
                setLoading(false);
            }
        });
        return () => unsubAuth();
    }, []);

    if (loading) return <div className="min-h-screen bg-brand-bg flex items-center justify-center"><div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div></div>;
    
    return (
        <BrowserRouter>
            {!hasOnboarded ? <Onboarding /> : (!isAuthenticated ? <AuthFlow /> : <MainLayout />)}
        </BrowserRouter>
    );
}
"""
    write_file('src/App.jsx', app_jsx)
    write_file('src/main.jsx', "import React from 'react'; import ReactDOM from 'react-dom/client'; import App from './App.jsx'; import './index.css'; ReactDOM.createRoot(document.getElementById('root')).render(<App />);")

    # ==========================================
    # 7. HOME PAGE (Viagogo Ticket Style but Parimatch Logic)
    # ==========================================
    home_jsx = """
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Heart, ShieldCheck } from 'lucide-react';

const matches = [
    { id: 1, month: "Apr", day: "4", dow: "Sat", league: "Indian Premier League", t1: "Delhi Capitals", t2: "Mumbai Indians", time: "3:30 PM", loc: "Delhi, India • Arun Jaitley Stadium", odds: "1.85", tag: "Hottest event on our site", tagColor: "text-brand-accent bg-brand-primaryLight" },
    { id: 2, month: "Apr", day: "4", dow: "Sat", league: "Indian Premier League", t1: "Gujarat Titans", t2: "Rajasthan Royals", time: "7:30 PM", loc: "Ahmedabad, India • Narendra Modi Stadium", odds: "2.10", tag: "Today", tagColor: "text-brand-muted bg-brand-panel" },
    { id: 3, month: "Apr", day: "5", dow: "Sun", league: "Indian Premier League", t1: "Sunrisers Hyderabad", t2: "Lucknow Super Giants", time: "3:30 PM", loc: "Hyderabad, India • Rajiv Gandhi Stadium", odds: "1.95", tag: "Tomorrow", tagColor: "text-brand-muted bg-brand-panel" },
    { id: 4, month: "Apr", day: "5", dow: "Sun", league: "Indian Premier League", t1: "Royal Challengers Bengaluru", t2: "Chennai Super Kings", time: "7:30 PM", loc: "Bengaluru, India • M. Chinnaswamy Stadium", odds: "1.75", tag: "Selling Fast", tagColor: "text-brand-red bg-red-50" }
];

export default function Home() {
    return (
        <div className="animate-fade-in w-full pb-20">
            {/* Title Section */}
            <div className="flex justify-between items-end mb-6">
                <h1 className="text-4xl md:text-5xl font-black text-brand-text leading-tight">Indian Premier<br/>League Betting</h1>
                <button className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center hover:bg-brand-panel transition-colors"><Heart size={18} className="text-brand-muted"/></button>
            </div>

            {/* Filters Row */}
            <div className="flex space-x-3 mb-8 overflow-x-auto hide-scrollbar">
                <button className="bg-brand-text text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center whitespace-nowrap"><MapPin size={16} className="mr-2"/> Pune</button>
                <button className="bg-white border border-brand-border text-brand-text px-4 py-2 rounded-xl text-sm font-bold flex items-center whitespace-nowrap"><Calendar size={16} className="mr-2"/> All dates</button>
                <button className="bg-white border border-brand-border text-brand-text px-4 py-2 rounded-xl text-sm font-bold flex items-center whitespace-nowrap">Price</button>
            </div>

            {/* Hero Banner (Green Patterned) */}
            <div className="w-full h-64 md:h-80 bg-brand-primary rounded-3xl overflow-hidden mb-10 relative flex items-center shadow-lg">
                <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCI+CjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNMCAwbDQwIDQwbC00MCA0MHoiIGZpbGw9IiM0NTg3MzEiLz4KPHBhdGggZD0iTTQwIDBsNDAgNDBsLTQwIDQweiIgZmlsbD0iI0U2RjJEOSIvPgo8L3N2Zz4=')]"></div>
                <div className="relative z-10 p-8 md:p-12 w-full flex justify-between items-center">
                    <div>
                        <h2 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">WORLD<br/>CUP</h2>
                        <button className="border border-white/30 text-white hover:bg-white/10 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors">See Markets</button>
                    </div>
                </div>
                <button className="absolute top-6 right-6 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center hover:bg-black/50 transition-colors z-20"><Heart size={18} className="text-white"/></button>
            </div>

            <h3 className="font-bold text-lg mb-4">63 events available</h3>

            {/* Viagogo Style Match List */}
            <div className="space-y-4 mb-12">
                {matches.map(m => (
                    <motion.div whileHover={{ scale: 1.01 }} key={m.id} className="bg-white border border-brand-border rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center hover:shadow-md transition-all cursor-pointer">
                        {/* Desktop Layout Inner Flex */}
                        <div className="flex flex-1 items-center">
                            {/* Date Block */}
                            <div className="flex flex-col items-center justify-center pr-4 md:pr-6 border-r border-brand-border min-w-[70px]">
                                <span className="text-sm font-bold text-brand-muted">{m.month}</span>
                                <span className="text-2xl font-black text-brand-text my-0.5">{m.day}</span>
                                <span className="text-xs text-brand-muted">{m.dow}</span>
                            </div>
                            
                            {/* Match Info */}
                            <div className="pl-4 md:pl-6 flex-1">
                                <h3 className="text-lg font-bold text-brand-text leading-tight mb-1">{m.t1} vs {m.t2}</h3>
                                <p className="text-sm text-brand-muted mb-2">{m.time} • {m.loc}</p>
                                <div className="flex space-x-2">
                                    {m.tag && <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${m.tagColor}`}>{m.tag}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons / Odds (Mobile stacks below, Desktop pushes right) */}
                        <div className="mt-4 md:mt-0 flex space-x-2 w-full md:w-auto">
                             <button className="flex-1 md:flex-none border border-brand-border rounded-xl px-6 py-2.5 font-bold text-sm text-brand-text hover:bg-brand-panel transition-colors shadow-sm">Odds: {m.odds}</button>
                             <button className="flex-1 md:flex-none bg-brand-text text-white rounded-xl px-6 py-2.5 font-bold text-sm hover:bg-brand-text/90 transition-colors shadow-sm">Place Bet</button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer Trust Elements */}
            <div className="border-t border-brand-border pt-10 flex flex-col md:flex-row justify-between">
                <div>
                    <div className="flex items-center space-x-2 mb-4">
                        <ShieldCheck size={32} className="text-brand-accent"/>
                        <div>
                            <h4 className="font-bold text-lg text-brand-text">parbet guarantee</h4>
                        </div>
                    </div>
                    <ul className="space-y-2 text-sm font-bold text-brand-muted">
                        <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-brand-accent mr-2"></div> World class security checks</li>
                        <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-brand-accent mr-2"></div> Transparent pricing</li>
                        <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-brand-accent mr-2"></div> 100% order guarantee</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
"""
    write_file('src/pages/Home/index.jsx', home_jsx)

    # Empty stubs to prevent build crashes
    write_file('src/pages/Discovery/index.jsx', "export default function Discovery() { return <div className='p-6'>Explore Categories</div>; }")
    write_file('src/pages/TeamFocus/index.jsx', "export default function TeamFocus() { return <div className='p-6'>Team Details</div>; }")

    # ==========================================
    # 8. DYNAMIC GENERATION OF 50+ PAGES
    # ==========================================
    pages_list = [ "Wallet", "AdminDashboard", "LiveMatches", "UpcomingMatches", "MatchDetails", "BetSlip", "MyBets", "BetHistory", "Transactions", "Leaderboard", "Profile", "EditProfile", "Settings", "Security", "Notifications", "CricketBetting", "FootballBetting", "TennisBetting", "Esports", "LiveBettingScreen", "OddsMovement", "MultiBet", "CashOut", "Bonuses", "Referral", "Achievements", "DailyRewards", "HelpCenter", "Contact", "FAQs", "Login", "Signup", "ForgotPassword", "Promo1", "Promo2", "CampaignA", "CampaignB", "EventX", "LandingUser", "LandingGuest", "AdminUsers", "AdminAddMatch", "AdminEditMatch", "AdminOdds", "AdminResults", "AdminTrans", "AdminFraud", "AdminReports", "AdminAnalytics", "AdminNotifs", "AdminLogs", "AdminSettings", "AdminRoles", "AdminPerms", "AffiliatePortal", "VIPClub" ]

    page_template = """
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function {{PAGE_NAME}}() {
    const navigate = useNavigate();
    return (
        <div className="w-full pb-20 animate-fade-in">
            <h1 className="text-3xl font-black text-brand-text mb-6">{{PAGE_NAME}}</h1>
            <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm">
                <p className="text-brand-muted mb-4">Content for {{PAGE_NAME}} module.</p>
                <button onClick={() => navigate(-1)} className="bg-brand-panel border border-brand-border px-6 py-2 rounded-xl text-sm font-bold text-brand-text hover:bg-gray-100 transition-colors">Go Back</button>
            </div>
        </div>
    );
}
"""
    for page in pages_list:
        write_file(f'src/pages/{page}/index.jsx', page_template.replace("{{PAGE_NAME}}", page))

    print("\n✅ VIAGOGO LIGHT THEME & AUTH OVERHAUL COMPLETE!")

if __name__ == "__main__":
    main()