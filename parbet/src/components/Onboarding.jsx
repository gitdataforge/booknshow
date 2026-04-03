import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, TrendingUp, Zap, Target, Globe, Trophy } from 'lucide-react';
import { useAppStore } from '../store/useStore';

const slides = [
    {
        title: "The best way\nto manage your bets",
        desc: "Parbet brings professional sports betting logic to a seamless, premium interface.",
        graphic: (
            <div className="relative w-full h-80 flex items-center justify-center overflow-hidden">
                <div className="ring-graphic w-64 h-64 border-brand-accent/80 -translate-x-12 -translate-y-8 shadow-[0_0_50px_rgba(112,0,255,0.4)]"></div>
                <div className="ring-graphic w-72 h-72 border-brand-primary/80 translate-x-12 translate-y-12 shadow-[0_0_50px_rgba(29,122,242,0.4)]"></div>
            </div>
        )
    },
    {
        title: "Real-Time\nLive Odds",
        desc: "Experience instantaneous odds updates directly mapped to live match events.",
        graphic: <div className="w-full h-80 flex items-center justify-center"><TrendingUp size={120} className="text-brand-primary drop-shadow-[0_0_30px_rgba(29,122,242,0.6)]" /></div>
    },
    {
        title: "Bank-Grade\nSecurity",
        desc: "Your wallet is secured with end-to-end Firebase encryption and custom rules.",
        graphic: <div className="w-full h-80 flex items-center justify-center"><ShieldCheck size={120} className="text-brand-green drop-shadow-[0_0_30px_rgba(52,211,153,0.6)]" /></div>
    },
    {
        title: "Lightning Fast\nTransactions",
        desc: "Deposit and withdraw instantly with our optimized global routing engine.",
        graphic: <div className="w-full h-80 flex items-center justify-center"><Zap size={120} className="text-brand-primaryLight drop-shadow-[0_0_30px_rgba(74,144,226,0.6)]" /></div>
    },
    {
        title: "Targeted\nEsports Markets",
        desc: "Access niche markets and deep analytics for global Esports tournaments.",
        graphic: <div className="w-full h-80 flex items-center justify-center"><Target size={120} className="text-brand-red drop-shadow-[0_0_30px_rgba(255,59,48,0.6)]" /></div>
    },
    {
        title: "Global\nLeaderboards",
        desc: "Compete against thousands of players worldwide and claim top ranks.",
        graphic: <div className="w-full h-80 flex items-center justify-center"><Globe size={120} className="text-brand-accent drop-shadow-[0_0_30px_rgba(112,0,255,0.6)]" /></div>
    },
    {
        title: "Claim Your\nWelcome Bonus",
        desc: "Get started today with a 100% match on your first Parbet deposit.",
        graphic: <div className="w-full h-80 flex items-center justify-center"><Trophy size={120} className="text-[#F4D03F] drop-shadow-[0_0_30px_rgba(244,208,63,0.6)]" /></div>
    }
];

export default function Onboarding() {
    const [index, setIndex] = useState(0);
    const setOnboarded = useAppStore(state => state.setOnboarded);

    const nextSlide = () => {
        if (index === slides.length - 1) setOnboarded();
        else setIndex(prev => prev + 1);
    };

    return (
        <div className="fixed inset-0 bg-brand-bg flex flex-col justify-between p-8 z-50">
            <div className="flex-1 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    <motion.div key={index} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
                        {slides[index].graphic}
                        <h1 className="text-4xl font-bold whitespace-pre-line mt-8 leading-tight">{slides[index].title}</h1>
                        <p className="text-brand-muted mt-4 text-sm leading-relaxed max-w-sm">{slides[index].desc}</p>
                    </motion.div>
                </AnimatePresence>
            </div>
            
            <div className="flex justify-between items-center pb-8">
                <div className="flex space-x-2">
                    {slides.map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-brand-primary' : 'w-2 bg-brand-cardHover'}`} />
                    ))}
                </div>
                <button onClick={nextSlide} className="w-14 h-14 rounded-full bg-brand-primary flex items-center justify-center shadow-[0_0_20px_rgba(29,122,242,0.4)] hover:scale-105 transition-transform">
                    <ArrowRight size={24} className="text-white" />
                </button>
            </div>
        </div>
    );
}