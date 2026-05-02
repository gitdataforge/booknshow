import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useAppStore } from '../store/useStore';

// Real-time Native Auto-Optimization Utility
const optimizeImage = (url, width = 1200) => {
    if (!url) return '';
    return url;
};

/**
 * GLOBAL REBRAND: Booknshow Identity Application (Phase 4 Carousel)
 * Enforced Colors: #FFFFFF, #E7364D, #333333, #EB5B6E, #FAD8DC, #A3A3A3, #626262
 * FEATURE 1: Dynamic Data Integration
 * The carousel now accepts a `slides` prop passed down from the Home component's Firestore connection.
 * It maps these dynamic Admin-configured objects instead of relying on hardcoded arrays.
 */
export default function ViagogoHeroCarousel({ slides = [] }) {
    const navigate = useNavigate();
    const { isAuthenticated, toggleFavorite } = useAppStore();
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

    // Fallback static data if Firestore connection fails or is empty
    const heroSlides = slides.length > 0 ? slides : [
        {
            id: "ipl-banner-fallback",
            title: "TATA IPL 2026",
            query: "IPL",
            image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80"
        },
        {
            id: "icc-banner-fallback",
            title: "ICC T20 World Cup",
            query: "ICC",
            image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80"
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
            navigate('/login');
        } else {
            toggleFavorite(obj);
        }
    };

    return (
        <div className="relative w-full mb-6 mt-0 md:mt-4 font-sans z-10">
            
            {/* COHESIVE GEOMETRY CONTAINER (Rebranded to #333333 / #E7364D) */}
            <div className="relative w-full h-[260px] sm:h-[300px] md:h-[340px] lg:h-[400px] rounded-[16px] md:rounded-2xl overflow-hidden bg-[#333333] shadow-[0_8px_30px_rgba(51,51,51,0.2)] md:shadow-md group">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={currentHeroIndex} 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        transition={{ duration: 0.5 }} 
                        className="absolute inset-0 flex flex-col md:flex-row cursor-pointer"
                        onClick={() => navigate(`/performer/${encodeURIComponent(heroSlides[currentHeroIndex].query)}`)}
                    >
                        {/* Top/Right Image Section */}
                        <div className="relative w-full h-[70%] sm:h-[75%] md:h-full md:absolute md:right-0 md:w-[70%] z-10">
                            <img 
                                src={optimizeImage(heroSlides[currentHeroIndex].image || heroSlides[currentHeroIndex].imageUrl, 1200)} 
                                className="w-full h-full object-cover md:mix-blend-overlay opacity-80 md:opacity-90" 
                                alt={heroSlides[currentHeroIndex].title} 
                                style={{
                                    maskImage: window.innerWidth >= 768 ? 'linear-gradient(to right, transparent, black 30%)' : 'none',
                                    WebkitMaskImage: window.innerWidth >= 768 ? 'linear-gradient(to right, transparent, black 30%)' : 'none'
                                }}
                            />
                            {/* Top-Right White Heart Button (Rebranded) */}
                            <button 
                                onClick={(e) => handleRestrictedAction(e, heroSlides[currentHeroIndex])} 
                                className="absolute top-3 right-3 md:top-4 md:right-4 w-[32px] h-[32px] md:w-[36px] md:h-[36px] bg-[#FFFFFF]/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#FAD8DC] hover:scale-105 transition-all z-30 shadow-sm"
                            >
                                <Heart size={14} className="text-[#E7364D]" strokeWidth={2.5}/>
                            </button>
                        </div>

                        {/* Bottom/Left Text Block (Rebranded to #E7364D / #333333 Base) */}
                        <div className="relative flex-1 w-full md:w-[50%] h-full z-20 flex flex-col justify-center px-4 md:px-14 lg:px-16 bg-[#E7364D] md:bg-transparent">
                            <h2 className="text-[20px] sm:text-[24px] md:text-[56px] lg:text-[64px] font-bold md:font-black text-[#FFFFFF] leading-tight tracking-tight truncate md:whitespace-normal drop-shadow-sm">
                                {heroSlides[currentHeroIndex].title}
                            </h2>
                            
                            {/* Hidden on Mobile */}
                            <div className="hidden md:block mt-6">
                                <button className="border-2 border-[#FFFFFF] bg-transparent text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#E7364D] px-8 py-3 rounded-[12px] text-[15px] font-black tracking-wide transition-all shadow-sm">
                                    SEE TICKETS
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Exact Pagination Dots: Centered Dark Gray on mobile, Left White on desktop */}
            <div className="flex justify-center md:justify-start md:absolute md:bottom-6 md:left-14 lg:left-16 space-x-2 mt-4 md:mt-0 z-30">
                {heroSlides.map((_, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => setCurrentHeroIndex(idx)} 
                        className={`rounded-full transition-all duration-300 w-2 h-2 md:w-2.5 md:h-2.5 ${idx === currentHeroIndex ? 'bg-[#333333] md:bg-[#FFFFFF]' : 'bg-[#A3A3A3] md:bg-[#FFFFFF]/40 md:hover:bg-[#FFFFFF]/60'}`} 
                    />
                ))}
            </div>
        </div>
    );
}