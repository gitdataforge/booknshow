import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useStore';
import { ArrowRight, TrendingUp, Calendar, MapPin, Loader2, Edit3, ShieldAlert, ChevronDown, ChevronRight } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';

/**
 * FEATURE 1: Layout Overlap Isolation (Strict pt-padding clears sticky header search)
 * FEATURE 2: Admin God-Mode Banner Editor (Interactive Firestore updates for Hero)
 * FEATURE 3: Real-Time Event Hydration (Replaces broken useMarketStore infinite loops)
 * FEATURE 4: Algorithmic Sport Categorization (Cricket, Kabaddi, Football Rails)
 * FEATURE 5: Dynamic Search Engine & "See All" Exploration Routing
 * FEATURE 6: Fallback Empty State Engine
 * FEATURE 7: Hardware-Accelerated Rail Navigation (Smooth x-axis scrolling)
 * FEATURE 8: Spotify Cross-Promotion Conversion Banner
 * FEATURE 9: App Download Conversion Footer Unit
 * FEATURE 10: Touch/Swipe Optimized Snap-to-Grid Event Cards
 * FEATURE 11: Image 404 Cascade Prevention (Strict URL fallback scrubbing)
 * FEATURE 12: Location-Aware Defaulting (Prioritizes events in userCity)
 */

const getSafeImage = (url, fallbackCategory) => {
    const isKabaddi = fallbackCategory?.toLowerCase().includes('kabaddi');
    const fallback = isKabaddi 
        ? 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=600&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=600&auto=format&fit=crop';
    if (!url) return fallback;
    if (url.includes('res.cloudinary.com/dtz0urit6')) return fallback;
    return url;
};

export default function Home() {
    const navigate = useNavigate();
    const { 
        liveMatches, 
        isLoadingMatches, 
        userCity, 
        fetchLocationAndMatches, 
        homeBanners, 
        fetchHomeBanners,
        searchQuery,
        setSearchQuery,
        setExploreCategory
    } = useAppStore();
    
    const [isAdmin, setIsAdmin] = useState(false);
    
    // Admin Edit States
    const [isEditingBanner, setIsEditingBanner] = useState(false);
    const [editBannerData, setEditBannerData] = useState({ title: '', subtitle: '', imageUrl: '' });

    // FEATURE 3: Initialize Global State (Prevents Infinite Re-renders)
    useEffect(() => {
        if (liveMatches.length === 0 && !isLoadingMatches) {
            fetchLocationAndMatches();
        }
        if (homeBanners.length === 0) {
            fetchHomeBanners();
        }
    }, [liveMatches.length, isLoadingMatches, fetchLocationAndMatches, homeBanners.length, fetchHomeBanners]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && user.email) {
                const validAdmins = ['testcodecfg@gmail.com', 'krishnamehta.gm@gmail.com', 'jatinseth.op@gmail.com'];
                setIsAdmin(validAdmins.includes(user.email.toLowerCase()));
            } else {
                setIsAdmin(false);
            }
        });
        return () => unsubscribe();
    }, []);

    // FEATURE 2: Admin God-Mode Saves to platform_config
    const handleSaveBanner = async () => {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        try {
            if (homeBanners[0]?.id && homeBanners[0].id !== 'default_1') {
                const bannerRef = doc(db, 'artifacts', appId, 'public', 'data', 'platform_config', homeBanners[0].id);
                await updateDoc(bannerRef, editBannerData);
            } else {
                const configRef = collection(db, 'artifacts', appId, 'public', 'data', 'platform_config');
                await addDoc(configRef, { ...editBannerData, type: 'hero_banner' });
            }
            fetchHomeBanners();
            setIsEditingBanner(false);
        } catch (error) {
            console.error("Admin Update Failed:", error);
            alert("Failed to update banner. Please check firestore.rules.");
        }
    };

    // FEATURE 5: Dynamic Search Engine
    const filteredMatches = useMemo(() => {
        if (!searchQuery) return liveMatches;
        const q = searchQuery.toLowerCase();
        return liveMatches.filter(m => {
            const searchString = `${m.title} ${m.eventName} ${m.stadium} ${m.loc} ${m.city} ${m.sportCategory}`.toLowerCase();
            return searchString.includes(q);
        });
    }, [liveMatches, searchQuery]);

    // FEATURE 12 & 4: Location-Aware Algorithmic Categories
    const trendingMatches = useMemo(() => {
        let filtered = filteredMatches;
        if (userCity && !['All Cities', 'Global', 'Loading...', 'Detecting...'].includes(userCity)) {
            const local = filteredMatches.filter(m => (`${m.loc} ${m.city} ${m.location}`.toLowerCase()).includes(userCity.toLowerCase()));
            if (local.length > 0) filtered = local;
        }
        return filtered.slice(0, 8);
    }, [filteredMatches, userCity]);

    const cricketMatches = useMemo(() => 
        filteredMatches.filter(m => {
            const str = `${m.title} ${m.sportCategory} ${m.eventName}`.toLowerCase();
            return str.includes('cricket') || str.includes('t20') || str.includes('test') || str.includes('ipl');
        }), 
    [filteredMatches]);

    const kabaddiMatches = useMemo(() => 
        filteredMatches.filter(m => {
            const str = `${m.title} ${m.sportCategory} ${m.eventName}`.toLowerCase();
            return str.includes('kabaddi') || str.includes('pkl');
        }), 
    [filteredMatches]);

    const activeBanner = homeBanners[0] || { 
        title: 'Tata IPL 2026', 
        subtitle: 'Book your tickets now before they sell out.', 
        imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1200&auto=format&fit=crop' 
    };

    // FEATURE 7: Reusable Hardware-Accelerated Event Rail
    const EventRail = ({ title, events, categoryQuery }) => {
        const scrollRef = useRef(null);
        
        const scroll = (direction) => {
            if (scrollRef.current) {
                scrollRef.current.scrollBy({ left: direction === 'left' ? -320 : 320, behavior: 'smooth' });
            }
        };

        if (events.length === 0) return null;

        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 md:mb-16 relative group">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                    <div className="flex items-center gap-3">
                        <h2 className="text-[22px] md:text-[28px] font-black text-[#1a1a1a] tracking-tight">{title}</h2>
                        {isAdmin && (
                            <span className="hidden md:inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-[6px] text-[11px] font-black uppercase tracking-widest">
                                <ShieldAlert size={12} /> Admin Sync
                            </span>
                        )}
                    </div>
                    {/* Strict "See All" Exploration Routing */}
                    {events.length >= 4 && (
                        <button 
                            onClick={() => {
                                setExploreCategory(categoryQuery || title);
                                setSearchQuery(categoryQuery === 'Trending' ? '' : categoryQuery);
                                navigate('/explore');
                            }}
                            className="text-[14px] font-bold text-[#0064d2] hover:underline hidden md:flex items-center gap-1"
                        >
                            See all <ChevronRight size={16} />
                        </button>
                    )}
                </div>
                
                <div className="relative">
                    <div ref={scrollRef} className="flex overflow-x-auto custom-scrollbar space-x-4 md:space-x-5 pb-6 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0">
                        {events.map((m, idx) => {
                            const date = new Date(m.commence_time || m.eventTimestamp);
                            const safeImage = getSafeImage(m.imageUrl || m.image || m.thumb, m.title || m.sportCategory);
                            return (
                                <motion.div 
                                    whileHover={{ y: -6 }}
                                    onClick={() => navigate(`/event?id=${m.id}`)}
                                    key={`rail-${m.id}-${idx}`} 
                                    className="min-w-[280px] md:min-w-[320px] bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl border border-[#e2e2e2] hover:border-[#8cc63f] cursor-pointer snap-start group/card transition-all"
                                >
                                    <div className="h-[160px] relative bg-[#f8f9fa] overflow-hidden">
                                        <img src={safeImage} alt={m.title} className="w-full h-full object-cover opacity-90 group-hover/card:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-[8px] flex flex-col items-center shadow-md">
                                            <span className="text-[10px] font-black text-[#c21c3a] uppercase leading-none tracking-widest mb-1">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                                            <span className="text-[20px] font-black text-[#1a1a1a] leading-none">{date.getDate()}</span>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-black text-[18px] text-[#1a1a1a] leading-tight mb-2 line-clamp-2 group-hover/card:text-[#458731] transition-colors">{m.title || m.eventName || `${m.t1} vs ${m.t2}`}</h3>
                                        <p className="text-[13px] text-[#54626c] font-bold flex items-center mb-1">
                                            <MapPin size={14} className="mr-2 text-[#9ca3af] shrink-0"/> 
                                            <span className="truncate">{m.loc || m.stadium}, {m.city}</span>
                                        </p>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                    
                    {events.length > 4 && (
                        <button 
                            onClick={() => scroll('right')} 
                            className="absolute -right-5 top-[35%] -translate-y-1/2 w-12 h-12 bg-white border border-[#e2e2e2] rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-center text-[#1a1a1a] hover:scale-105 transition-transform z-10 hidden lg:flex opacity-0 group-hover:opacity-100"
                        >
                            <ChevronDown size={24} className="-rotate-90" />
                        </button>
                    )}
                </div>
            </motion.div>
        );
    };

    return (
        // FEATURE 1: Layout Overlap Isolation (pt-6 md:pt-10 creates safety padding beneath header)
        <div className="w-full min-h-screen bg-white font-sans overflow-x-hidden pt-6 md:pt-10">
            
            {/* FEATURE 2: Admin Editor Modal */}
            <AnimatePresence>
                {isEditingBanner && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-[24px] p-8 max-w-lg w-full shadow-2xl">
                            <h2 className="text-2xl font-black mb-6">Edit Hero Banner</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[12px] font-black uppercase text-gray-500 mb-1 block">Main Title</label>
                                    <input type="text" value={editBannerData.title} onChange={e => setEditBannerData({...editBannerData, title: e.target.value})} className="w-full border border-gray-300 rounded-[8px] p-3 outline-none focus:border-[#458731]" />
                                </div>
                                <div>
                                    <label className="text-[12px] font-black uppercase text-gray-500 mb-1 block">Subtitle</label>
                                    <input type="text" value={editBannerData.subtitle} onChange={e => setEditBannerData({...editBannerData, subtitle: e.target.value})} className="w-full border border-gray-300 rounded-[8px] p-3 outline-none focus:border-[#458731]" />
                                </div>
                                <div>
                                    <label className="text-[12px] font-black uppercase text-gray-500 mb-1 block">Image URL</label>
                                    <input type="text" value={editBannerData.imageUrl} onChange={e => setEditBannerData({...editBannerData, imageUrl: e.target.value})} className="w-full border border-gray-300 rounded-[8px] p-3 outline-none focus:border-[#458731]" />
                                </div>
                            </div>
                            <div className="flex gap-4 mt-8">
                                <button onClick={() => setIsEditingBanner(false)} className="flex-1 py-3 border border-gray-300 rounded-[12px] font-bold hover:bg-gray-50">Cancel</button>
                                <button onClick={handleSaveBanner} className="flex-1 py-3 bg-[#458731] text-white rounded-[12px] font-bold shadow-lg shadow-[#458731]/30">Save Changes</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MAIN HERO SECTION */}
            <div className="relative w-full h-[400px] md:h-[480px] max-w-[1400px] mx-auto px-4 md:px-8 group">
                {isAdmin && (
                    <button onClick={() => { setEditBannerData(activeBanner); setIsEditingBanner(true); }} className="absolute top-4 right-8 z-50 bg-white/95 backdrop-blur text-black px-4 py-2 rounded-[8px] text-[13px] font-black shadow-lg flex items-center gap-2 border border-gray-200 hover:bg-black hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                        <Edit3 size={14} /> Edit Banner
                    </button>
                )}
                <div className="w-full h-full rounded-[24px] overflow-hidden relative shadow-md border border-gray-100">
                    <img src={activeBanner.imageUrl} alt="Hero Banner" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-8 md:px-16">
                        <h1 className="text-white text-4xl md:text-6xl font-black tracking-tighter mb-4 max-w-2xl leading-tight">{activeBanner.title}</h1>
                        <p className="text-white/90 text-lg md:text-xl font-medium max-w-xl mb-8">{activeBanner.subtitle}</p>
                        <button onClick={() => navigate('/explore')} className="bg-[#8cc63f] text-black font-black px-8 py-4 rounded-[12px] w-max hover:bg-[#7ab332] transition-colors flex items-center gap-2 shadow-lg shadow-[#8cc63f]/20">
                            Explore Now <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* DYNAMIC CONTENT RAILS */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
                {isLoadingMatches ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="animate-spin text-[#8cc63f] mb-4" size={40} />
                        <h3 className="text-[16px] font-black text-[#1a1a1a] uppercase tracking-widest">Hydrating Live Markets</h3>
                    </div>
                ) : filteredMatches.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full py-24 flex flex-col items-center justify-center bg-[#f8f9fa] border border-[#e2e2e2] rounded-[24px] text-center px-6">
                        <div className="w-16 h-16 bg-[#fdf2f2] rounded-full flex items-center justify-center mb-4">
                            <ShieldAlert size={32} className="text-[#c21c3a]" />
                        </div>
                        <h3 className="text-[20px] font-black text-[#1a1a1a] mb-2">No Match Inventories Found</h3>
                        <p className="text-[15px] text-[#54626c] max-w-md mx-auto mb-6">
                            There are currently no live tickets for "{searchQuery}". The market is updating constantly, try adjusting your search.
                        </p>
                        <button onClick={() => setSearchQuery('')} className="bg-[#1a1a1a] text-white px-6 py-3 rounded-[8px] font-bold text-[14px] hover:bg-black transition-colors">
                            Clear Search Filters
                        </button>
                    </motion.div>
                ) : (
                    <>
                        {/* FEATURE 4: Algorithmic Rails */}
                        <EventRail title="Trending Now" events={trendingMatches} categoryQuery="Trending" />
                        
                        {/* FEATURE 8: Spotify Cross-Promotion Banner */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full bg-[#1a1a1a] rounded-[16px] p-6 md:p-8 mb-10 md:mb-16 flex flex-col md:flex-row justify-between items-center cursor-pointer shadow-lg transition-transform hover:scale-[1.01]">
                            <div className="flex flex-col md:flex-row items-center w-full md:w-auto justify-center md:justify-start mb-6 md:mb-0 space-y-4 md:space-y-0 md:space-x-6">
                                <div className="flex items-center space-x-3">
                                    <svg viewBox="0 0 24 24" width="36" height="36" fill="#1DB954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.36.18.54.84.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.239.54-.959.72-1.56.3z"/></svg>
                                    <span className="font-black text-[24px] text-white tracking-tight">Spotify</span>
                                </div>
                                <div className="text-center md:text-left border-t md:border-t-0 md:border-l border-gray-700 pt-4 md:pt-0 md:pl-6">
                                    <h3 className="font-bold text-[16px] md:text-[18px] text-white leading-tight">Connect your Spotify account</h3>
                                    <p className="text-[13px] md:text-[14px] text-gray-400 mt-1">Discover concert tickets for artists you follow</p>
                                </div>
                            </div>
                            <button className="bg-[#1ed760] text-[#1a1a1a] font-black px-8 py-3.5 rounded-full text-[14px] hover:bg-[#1cdf5f] transition-colors shadow-lg shadow-[#1ed760]/20 w-full md:w-auto">
                                Connect Account
                            </button>
                        </motion.div>

                        <EventRail title="Top Cricket Matches" events={cricketMatches} categoryQuery="Cricket" />
                        <EventRail title="Pro Kabaddi League" events={kabaddiMatches} categoryQuery="Kabaddi" />
                    </>
                )}

                {/* FEATURE 9: App Download Conversion Footer */}
                <div className="w-full bg-[#f8f9fa] border border-[#e2e2e2] rounded-[24px] p-8 md:p-12 mt-12 flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
                    <div className="md:w-1/2 z-10 mb-8 md:mb-0 text-center md:text-left">
                        <h2 className="text-[28px] md:text-[36px] font-black text-[#1a1a1a] mb-2 leading-tight tracking-tight">Download the parbet app</h2>
                        <p className="text-[15px] md:text-[16px] text-[#54626c] font-medium max-w-sm mx-auto md:mx-0">Favorites, secure digital tickets, and global markets right in your pocket.</p>
                    </div>
                    
                    <div className="flex items-center gap-4 z-10 w-full md:w-auto justify-center">
                        <button className="bg-black text-white px-5 py-3 rounded-[12px] flex items-center gap-3 hover:bg-gray-800 transition-colors shadow-lg">
                            <div className="flex flex-col items-start leading-none text-left">
                                <span className="text-[9px] text-gray-300 font-bold uppercase tracking-wider mb-0.5">Download on the</span>
                                <span className="text-[15px] font-black tracking-tight">App Store</span>
                            </div>
                        </button>
                        <button className="bg-black text-white px-5 py-3 rounded-[12px] flex items-center gap-3 hover:bg-gray-800 transition-colors shadow-lg">
                            <div className="flex flex-col items-start leading-none text-left">
                                <span className="text-[9px] text-gray-300 font-bold uppercase tracking-wider mb-0.5">Get it on</span>
                                <span className="text-[15px] font-black tracking-tight">Google Play</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}