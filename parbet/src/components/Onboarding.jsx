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
    { title: "Welcome to Parbet\nPremium Sports", desc: "Experience a clean, seamless betting interface inspired by global ticketing platforms.", graphic: <SVGShape><motion.circle cx="100" cy="100" r="70" fill="none" stroke="#114C2A" strokeWidth="12" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }} /><motion.circle cx="100" cy="100" r="90" fill="none" stroke="#E6F2D9" strokeWidth="6" /></SVGShape> },
    { title: "Live Odds &\nMarket Trends", desc: "Track Asian Handicaps and Over/Under lines with real-time updates.", graphic: <SVGShape><motion.path d="M 20 150 L 70 90 L 110 110 L 170 40" fill="none" stroke="#458731" strokeWidth="10" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, repeat: Infinity }} /></SVGShape> },
    { title: "Bank-Grade\n2FA Security", desc: "Your wallet is locked down with mandatory TOTP authentication logic.", graphic: <SVGShape><motion.circle cx="100" cy="100" r="50" fill="none" stroke="#114C2A" strokeWidth="16" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} /></SVGShape> },
    { title: "Lightning Fast\nExecution", desc: "Place orders instantly with one tap via our global edge network.", graphic: <SVGShape><motion.path d="M 100 0 L 100 200 M 0 100 L 200 100" stroke="#E6F2D9" strokeWidth="8" animate={{ rotate: 45 }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} /><circle cx="100" cy="100" r="20" fill="#458731" /></SVGShape> },
    { title: "Top Global\nLeagues", desc: "From the Indian Premier League to the UEFA Champions League.", graphic: <SVGShape><motion.ellipse cx="100" cy="100" rx="90" ry="30" fill="none" stroke="#114C2A" strokeWidth="6" animate={{ ry: [30, 90, 30] }} transition={{ duration: 4, repeat: Infinity }} /></SVGShape> },
    { title: "Secure Payouts\nWorldwide", desc: "Withdraw your winnings safely directly to your preferred bank.", graphic: <SVGShape><motion.polygon points="100,20 180,180 20,180" fill="none" stroke="#458731" strokeWidth="10" animate={{ rotate: -360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} /></SVGShape> },
    { title: "Responsive Across\nAll Devices", desc: "Flawless trading experience whether on mobile or wide desktop.", graphic: <SVGShape><motion.rect x="40" y="40" width="120" height="120" rx="20" fill="none" stroke="#114C2A" strokeWidth="10" animate={{ rotate: 90 }} transition={{ duration: 3, repeat: Infinity }} /></SVGShape> },
    { title: "Ready to\nGet Started?", desc: "Create your account securely and verify your email to unlock your wallet.", graphic: <SVGShape><motion.circle cx="100" cy="100" r="80" fill="none" stroke="#458731" strokeWidth="8" animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }} transition={{ duration: 2, repeat: Infinity }} /><circle cx="100" cy="100" r="10" fill="#114C2A"/></SVGShape> }
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