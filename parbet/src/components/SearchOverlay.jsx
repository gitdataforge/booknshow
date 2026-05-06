import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    Search, X, Clock, ArrowRight, MapPin, Calendar, 
    Zap, Activity, Ticket, ChevronRight, TrendingUp
} from 'lucide-react';
import { useAppStore } from '../store/useStore';

/**
 * GLOBAL REBRAND: Booknshow Identity Application (Phase 23 Full-Screen Search Engine)
 * Enforced Colors: #FFFFFF, #E7364D, #333333, #EB5B6E, #FAD8DC, #A3A3A3, #626262
 * 
 * --- 10+ REAL FEATURES & SECTIONS ---
 * SECTION 1: Hardware-Accelerated Ambient Backdrop
 * SECTION 2: Master Search Input Console
 * SECTION 3: Real-Time Results Grid (Direct Match Mapping)
 * SECTION 4: Recent Search History Cache
 * SECTION 5: Dynamic Trending Engine (Aggregated Performers)
 * SECTION 6: Keyboard Interceptor (Escape to close)
 * SECTION 7: Direct-to-Checkout Routing
 * FEATURE 8: Contextual Empty States
 * FEATURE 9: Strict Case-Insensitive String Matching
 * FEATURE 10: Smooth Modal Orchestration (Zustand linked)
 */

// High-Fidelity Inline SVG Replica of Official Booknshow Logo
const BooknshowLogo = ({ className = "", textColor = "#333333" }) => {
    const fillHex = textColor.includes('#') ? textColor.match(/#(?:[0-9a-fA-F]{3,8})/)[0] : "#333333";
    return (
        <div className={`flex items-center justify-center select-none relative z-10 ${className}`}>
            <svg viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[30px] transform hover:scale-[1.02] transition-transform duration-300">
                <text x="10" y="70" fontFamily="Inter, sans-serif" fontSize="64" fontWeight="800" fill={fillHex} letterSpacing="-2">book</text>
                <g transform="translate(170, 10) rotate(-12)">
                    <path d="M0,0 L16,10 L32,0 L48,10 L64,0 L80,10 L80,95 L60,95 A20,20 0 0,0 20,95 L0,95 Z" fill="#E7364D" />
                    <text x="21" y="72" fontFamily="Inter, sans-serif" fontSize="60" fontWeight="900" fill="#FFFFFF">n</text>
                </g>
                <text x="250" y="70" fontFamily="Inter, sans-serif" fontSize="64" fontWeight="800" fill={fillHex} letterSpacing="-2">show</text>
            </svg>
        </div>
    );
};

export default function SearchOverlay() {
    const navigate = useNavigate();
    const inputRef = useRef(null);
    
    // Store Connection
    const { 
        isFullScreenSearchOpen, 
        setFullScreenSearchOpen, 
        liveMatches, 
        trendingPerformers,
        recentSearches,
        addRecentSearch,
        clearRecentSearches
    } = useAppStore();

    // Local State
    const [localQuery, setLocalQuery] = useState('');

    // FEATURE 6: Auto-focus & Keyboard Interceptor
    useEffect(() => {
        if (isFullScreenSearchOpen) {
            setLocalQuery('');
            setTimeout(() => inputRef.current?.focus(), 100);
            
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') setFullScreenSearchOpen(false);
            };
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [isFullScreenSearchOpen, setFullScreenSearchOpen]);

    // FEATURE 9: Advanced Matching Engine
    const searchResults = React.useMemo(() => {
        if (!localQuery.trim()) return [];
        
        const q = localQuery.toLowerCase();
        
        // Return matches where the query exists in the event name, t1, t2, or stadium
        return liveMatches.filter(match => {
            const eventName = (match.eventName || '').toLowerCase();
            const t1 = (match.t1 || '').toLowerCase();
            const t2 = (match.t2 || '').toLowerCase();
            const loc = (match.loc || '').toLowerCase();
            const league = (match.league || '').toLowerCase();
            
            return eventName.includes(q) || 
                   t1.includes(q) || 
                   t2.includes(q) || 
                   loc.includes(q) ||
                   league.includes(q);
        }).slice(0, 8); // Limit to top 8 results for performance
    }, [localQuery, liveMatches]);

    // Format utility
    const formatDisplayDate = (isoString) => {
        if (!isoString) return 'TBA';
        const d = new Date(isoString);
        if (isNaN(d)) return 'TBA';
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    // Navigation Handler
    const executeSearch = (searchTerm, directPath = null) => {
        addRecentSearch(searchTerm);
        setFullScreenSearchOpen(false);
        
        if (directPath) {
            navigate(directPath);
        } else {
            // Default to performer search if no exact route is mapped
            navigate(`/performer/${encodeURIComponent(searchTerm)}`);
        }
    };

    // Animation Config
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.2 } }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: -40, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', bounce: 0, duration: 0.4 } },
        exit: { opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.2 } }
    };

    const listVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <AnimatePresence>
            {isFullScreenSearchOpen && (
                <motion.div 
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="fixed inset-0 z-[9999] bg-[#FFFFFF] overflow-y-auto"
                >
                    {/* SECTION 1: Ambient Illustrative Background */}
                    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                        <motion.div
                            className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#FAD8DC] opacity-30 blur-[100px]"
                            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#E7364D] opacity-5 blur-[120px]"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        />
                    </div>

                    <div className="relative z-10 w-full max-w-[1000px] mx-auto min-h-screen flex flex-col px-6 md:px-10 pt-8 pb-20">
                        
                        {/* Header & Brand */}
                        <div className="flex justify-between items-center mb-10 shrink-0">
                            <BooknshowLogo className="origin-left scale-90 md:scale-100" />
                            <button 
                                onClick={() => setFullScreenSearchOpen(false)}
                                className="p-2.5 bg-[#F5F5F5] hover:bg-[#FAD8DC]/50 text-[#333333] hover:text-[#E7364D] rounded-full transition-colors flex items-center justify-center group"
                            >
                                <X size={24} className="group-hover:scale-110 transition-transform" />
                            </button>
                        </div>

                        <motion.div variants={containerVariants} className="w-full">
                            {/* SECTION 2: Master Search Input Console */}
                            <div className="relative group mb-8">
                                <Search size={28} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#A3A3A3] group-focus-within:text-[#E7364D] transition-colors" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={localQuery}
                                    onChange={(e) => setLocalQuery(e.target.value)}
                                    placeholder="Search for events, teams, venues, or keywords..."
                                    className="w-full bg-[#FAFAFA] border-2 border-[#A3A3A3]/20 rounded-[20px] py-6 pl-16 pr-6 text-[22px] md:text-[28px] font-black text-[#333333] placeholder:text-[#A3A3A3] focus:outline-none focus:border-[#E7364D] focus:bg-[#FFFFFF] shadow-[0_10px_40px_rgba(51,51,51,0.05)] transition-all"
                                />
                                {localQuery && (
                                    <button 
                                        onClick={() => setLocalQuery('')}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-[#E7364D] p-1"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>

                            {/* SECTION 3: Real-Time Results Grid */}
                            <div className="w-full min-h-[400px]">
                                {localQuery.trim() ? (
                                    searchResults.length > 0 ? (
                                        <motion.div variants={listVariants} initial="hidden" animate="visible" className="bg-[#FFFFFF] rounded-[16px] border border-[#A3A3A3]/20 shadow-sm overflow-hidden">
                                            <div className="p-4 border-b border-[#A3A3A3]/10 bg-[#FAFAFA]">
                                                <p className="text-[11px] font-black text-[#A3A3A3] uppercase tracking-widest flex items-center"><Activity size={14} className="mr-2 text-[#E7364D]"/> Top Live Matches</p>
                                            </div>
                                            <div className="divide-y divide-[#A3A3A3]/10">
                                                {searchResults.map((match) => (
                                                    <motion.button
                                                        key={match.id}
                                                        variants={itemVariants}
                                                        onClick={() => executeSearch(match.eventName || match.t1, `/checkout?event=${match.eventId || match.id}`)}
                                                        className="w-full p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-[#FAFAFA] group text-left transition-colors"
                                                    >
                                                        <div className="flex-1 pr-4">
                                                            <h3 className="text-[18px] font-black text-[#333333] mb-2 group-hover:text-[#E7364D] transition-colors line-clamp-1">{match.eventName || `${match.t1} vs ${match.t2}`}</h3>
                                                            <div className="flex flex-wrap gap-4 text-[13px] font-bold text-[#626262]">
                                                                <span className="flex items-center"><Calendar size={14} className="mr-1.5 text-[#E7364D]"/> {formatDisplayDate(match.commence_time)}</span>
                                                                <span className="flex items-center"><MapPin size={14} className="mr-1.5 text-[#A3A3A3]"/> {match.loc || 'Venue TBA'}</span>
                                                            </div>
                                                        </div>
                                                        <div className="mt-4 md:mt-0 flex items-center justify-between w-full md:w-auto md:justify-end gap-6 shrink-0">
                                                            <div className="text-left md:text-right">
                                                                <p className="text-[10px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-0.5">Tickets From</p>
                                                                <p className="text-[16px] font-black text-[#E7364D]">₹{match.minPrice?.toLocaleString() || '1500'}</p>
                                                            </div>
                                                            <div className="w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#A3A3A3]/20 flex items-center justify-center text-[#A3A3A3] group-hover:border-[#E7364D] group-hover:bg-[#E7364D] group-hover:text-[#FFFFFF] transition-all shadow-sm">
                                                                <ChevronRight size={20} />
                                                            </div>
                                                        </div>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div className="py-20 flex flex-col items-center justify-center text-center">
                                            <div className="w-20 h-20 bg-[#F5F5F5] rounded-full flex items-center justify-center mb-6">
                                                <Search size={32} className="text-[#A3A3A3]" />
                                            </div>
                                            <h3 className="text-[20px] font-black text-[#333333] mb-2">No Results Found</h3>
                                            <p className="text-[14px] text-[#626262] font-medium max-w-md">We couldn't find any live matches or performers matching "{localQuery}". Try a different team, venue, or keyword.</p>
                                        </div>
                                    )
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        
                                        {/* SECTION 4: Recent Search History */}
                                        <div>
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-[12px] font-black text-[#A3A3A3] uppercase tracking-widest flex items-center"><Clock size={16} className="mr-2"/> Recent Searches</h3>
                                                {recentSearches.length > 0 && (
                                                    <button onClick={clearRecentSearches} className="text-[11px] font-bold text-[#626262] hover:text-[#E7364D] transition-colors">Clear All</button>
                                                )}
                                            </div>
                                            
                                            {recentSearches.length > 0 ? (
                                                <div className="flex flex-wrap gap-3">
                                                    {recentSearches.map((search, idx) => (
                                                        <button 
                                                            key={idx}
                                                            onClick={() => { setLocalQuery(search); setTimeout(() => executeSearch(search), 100); }}
                                                            className="px-4 py-2.5 bg-[#FFFFFF] border border-[#A3A3A3]/30 rounded-full text-[13px] font-bold text-[#333333] hover:border-[#E7364D] hover:text-[#E7364D] transition-colors shadow-sm flex items-center"
                                                        >
                                                            {search}
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-[13px] text-[#A3A3A3] font-medium bg-[#FAFAFA] p-4 rounded-[8px] border border-[#A3A3A3]/20">Your recent search history will appear here.</p>
                                            )}
                                        </div>

                                        {/* SECTION 5: Dynamic Trending Engine */}
                                        <div>
                                            <h3 className="text-[12px] font-black text-[#E7364D] uppercase tracking-widest mb-4 flex items-center"><TrendingUp size={16} className="mr-2"/> Trending Performers</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {trendingPerformers.slice(0, 8).map((perf, idx) => (
                                                    <button 
                                                        key={idx}
                                                        onClick={() => executeSearch(perf.name)}
                                                        className="p-3 bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[8px] flex items-center hover:border-[#E7364D] group transition-colors shadow-sm text-left"
                                                    >
                                                        <Zap size={16} className="text-[#A3A3A3] group-hover:text-[#E7364D] mr-3 shrink-0" />
                                                        <span className="text-[14px] font-black text-[#333333] truncate group-hover:text-[#E7364D] transition-colors">{perf.name}</span>
                                                    </button>
                                                ))}
                                                {trendingPerformers.length === 0 && (
                                                    // Fallback if array is empty during initial load
                                                    ['Chennai Super Kings', 'Mumbai Indians', 'Royal Challengers Bengaluru', 'Gujarat Titans'].map((team, idx) => (
                                                        <button 
                                                            key={idx}
                                                            onClick={() => executeSearch(team)}
                                                            className="p-3 bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[8px] flex items-center hover:border-[#E7364D] group transition-colors shadow-sm text-left"
                                                        >
                                                            <Zap size={16} className="text-[#A3A3A3] group-hover:text-[#E7364D] mr-3 shrink-0" />
                                                            <span className="text-[14px] font-black text-[#333333] truncate group-hover:text-[#E7364D] transition-colors">{team}</span>
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        </div>

                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}