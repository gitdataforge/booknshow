import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useAppStore } from '../store/useStore';

// Real-time Cloudinary Auto-Optimization Utility
const optimizeImage = (url, width = 1200) => {
    if (!url) return '';
    if (url.includes('res.cloudinary.com')) return url;
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';
    return `https://res.cloudinary.com/${cloudName}/image/fetch/f_auto,q_auto,w_${width}/${encodeURIComponent(url)}`;
};

export default function ViagogoHeroCarousel() {
    const navigate = useNavigate();
    const { isAuthenticated, openAuthModal, toggleFavorite } = useAppStore();
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

    // STRICT CRICKET & KABADDI CONTENT REPLICATION
    const heroSlides = [
        {
            id: "ipl-banner",
            title: "TATA IPL 2026",
            query: "IPL",
            image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80"
        },
        {
            id: "icc-banner",
            title: "ICC T20 World Cup",
            query: "ICC",
            image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80"
        },
        {
            id: "pkl-banner",
            title: "Pro Kabaddi League",
            query: "Kabaddi",
            image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80"
        }
    ];

    // Real-time Auto-Advancing Logic
    useEffect(() => {
        const timer = setInterval(() => setCurrentHeroIndex((p) => (p + 1) % heroSlides.length), 6000);
        return () => clearInterval(timer);
    }, [heroSlides.length]);

    // Secure Interaction Guard
    const handleRestrictedAction = (e, obj) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            openAuthModal();
        } else {
            toggleFavorite(obj);
        }
    };

    return (
        <div className="relative w-full h-[280px] md:h-[340px] lg:h-[400px] rounded-2xl overflow-hidden mb-6 mt-4 group bg-[#004e25]">
            <AnimatePresence mode="wait">
                <motion.div 
                    key={currentHeroIndex} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    transition={{ duration: 0.8 }} 
                    className="absolute inset-0 flex"
                >
                    {/* Left Side: Deep Green Background & Typography */}
                    <div className="relative w-full md:w-[50%] h-full z-20 flex flex-col justify-center px-8 md:px-14 lg:px-16 pb-6">
                        <h2 className="text-[40px] md:text-[56px] lg:text-[64px] font-black text-white mb-6 leading-[1.05] tracking-tight">
                            {heroSlides[currentHeroIndex].title}
                        </h2>
                        {/* 1:1 Viagogo "See Tickets" Button Styling */}
                        <button 
                            onClick={() => navigate(`/performer/${encodeURIComponent(heroSlides[currentHeroIndex].query)}`)} 
                            className="border border-[#1f7f45] bg-transparent text-white hover:bg-[#1f7f45] w-max px-5 py-2.5 rounded-[8px] text-[14px] font-bold transition-colors"
                        >
                            See Tickets
                        </button>
                    </div>
                    
                    {/* Right Side: Masked Image Blend */}
                    <div 
                        className="absolute top-0 bottom-0 right-0 w-[70%] z-10" 
                        style={{ 
                            maskImage: 'linear-gradient(to right, transparent, black 30%)', 
                            WebkitMaskImage: 'linear-gradient(to right, transparent, black 30%)' 
                        }}
                    >
                        <img 
                            src={optimizeImage(heroSlides[currentHeroIndex].image, 1200)} 
                            className="w-full h-full object-cover opacity-90 mix-blend-overlay" 
                            alt={heroSlides[currentHeroIndex].title} 
                        />
                    </div>
                </motion.div>
            </AnimatePresence>
            
            {/* Top Right Heart Icon */}
            <button 
                onClick={(e) => handleRestrictedAction(e, heroSlides[currentHeroIndex])} 
                className="absolute top-4 right-4 w-[36px] h-[36px] bg-[#000000] rounded-full flex items-center justify-center hover:scale-105 transition-transform z-30 shadow-md"
            >
                <Heart size={16} className="text-white" strokeWidth={2}/>
            </button>

            {/* Bottom Left Pagination Dots */}
            <div className="absolute bottom-6 left-8 md:left-14 lg:left-16 flex space-x-2.5 z-30 items-center">
                {heroSlides.map((_, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => setCurrentHeroIndex(idx)} 
                        className={`rounded-full transition-all duration-300 ${idx === currentHeroIndex ? 'bg-white w-2.5 h-2.5' : 'bg-white/40 w-2 h-2 hover:bg-white/60'}`} 
                    />
                ))}
            </div>
        </div>
    );
}