import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Heart, RefreshCw, AlertCircle, ChevronDown, Flame, Clock } from 'lucide-react';
import { useAppStore } from '../../store/useStore';
import LocationDropdown from '../../components/LocationDropdown';
import CategoryNav from '../../components/CategoryNav';
import IplMatchCard from '../../components/IplMatchCard';
import AppDownloadBanner from '../../components/AppDownloadBanner';

// Utility to strictly label dates based on the real-time API
const getRelativeDateLabel = (dateStr) => {
    if (!dateStr) return 'Upcoming';
    const eventDate = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    if (eventDate.toDateString() === today.toDateString()) return 'Today';
    if (eventDate.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0 && diffDays <= 7) return 'This Week';
    return 'Upcoming';
};

export default function Home() {
    const navigate = useNavigate();
    const { 
        isAuthenticated, 
        openAuthModal,
        liveMatches,
        isLoadingMatches,
        apiError,
        userCity,
        userCountry,
        manualCity,
        fetchLocationAndMatches,
        searchQuery,
        setSearchQuery,
        isLocationDropdownOpen,
        setLocationDropdownOpen,
        toggleFavorite,
        favorites
    } = useAppStore();

    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

    // Strict Location Fetching Initialization
    useEffect(() => {
        if (liveMatches.length === 0 && !isLoadingMatches && !apiError) {
            fetchLocationAndMatches();
        }
    }, [fetchLocationAndMatches, liveMatches.length, isLoadingMatches, apiError]);

    const handleRestrictedAction = (actionName, eventObj = null) => {
        if (!isAuthenticated) {
            openAuthModal();
        } else if (eventObj && actionName.includes('Favourite')) {
            toggleFavorite(eventObj);
        }
    };

    const goToEvent = (id) => navigate(`/event?id=${id}`);
    const isFavorite = (id) => favorites?.some(f => f.id === id);

    // --- REAL-TIME FUNCTIONAL FILTERING LOGIC ---
    const filteredMatches = useMemo(() => {
        return liveMatches.filter(m => {
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            return m.t1.toLowerCase().includes(q) || 
                   m.t2?.toLowerCase().includes(q) || 
                   m.league.toLowerCase().includes(q);
        });
    }, [liveMatches, searchQuery]);

    // 1. Dynamic Local Hero Logic
    const heroSlides = useMemo(() => {
        const topEvents = filteredMatches.slice(0, 3);
        const colorSchemes = [
            { left: "#043B1A", right: "#76AC48" },
            { left: "#1D2B36", right: "#E91E63" },
            { left: "#2E1065", right: "#8B5CF6" }
        ];

        if (topEvents.length === 0) {
            return [{
                id: "fallback",
                title: `Live Events in ${userCity}`,
                subtitle: "Discover what's happening near you",
                bgLeft: "#043B1A", bgRight: "#76AC48", query: "Events",
                image: "https://images.unsplash.com/photo-1540039155732-678a1bc231cd?auto=format&fit=crop&w=1000&q=80"
            }];
        }

        return topEvents.map((m, i) => ({
            id: m.id,
            title: m.t1,
            subtitle: m.t2 ? `vs ${m.t2}` : m.league,
            bgLeft: colorSchemes[i % colorSchemes.length].left,
            bgRight: colorSchemes[i % colorSchemes.length].right,
            query: m.t1,
            image: `https://loremflickr.com/1000/500/${encodeURIComponent((m.league || 'event').split(' ')[0])},sports/all`
        }));
    }, [filteredMatches, userCity]);

    useEffect(() => {
        if (heroSlides.length <= 1) return;
        const timer = setInterval(() => setCurrentHeroIndex((prev) => (prev + 1) % heroSlides.length), 5000);
        return () => clearInterval(timer);
    }, [heroSlides.length]);

    // --- SECTION ARRAYS DYNAMICALLY COMPUTED FROM AGGREGATOR ---
    const todayStr = new Date().toDateString();
    
    const todayEvents = filteredMatches.filter(m => new Date(m.commence_time).toDateString() === todayStr);
    
    const iplMatches = filteredMatches.filter(m => 
        m.source === 'CricAPI' || m.league?.toLowerCase().includes('ipl') || m.league?.toLowerCase().includes('premier league')
    );
    
    const concerts = filteredMatches.filter(m => 
        m.source === 'Ticketmaster' || m.source === 'Bandsintown' || m.league?.toLowerCase().includes('concert') || m.league?.toLowerCase().includes('music')
    );
    
    const footballMatches = filteredMatches.filter(m => 
        m.source === 'TheSportsDB' || m.league?.toLowerCase().includes('isl') || m.league?.toLowerCase().includes('soccer') || m.league?.toLowerCase().includes('football')
    );
    
    const theaterComedy = filteredMatches.filter(m => 
        m.league?.toLowerCase().includes('theater') || m.league?.toLowerCase().includes('theatre') || m.league?.toLowerCase().includes('comedy')
    );

    // Standardized Card Renderer for non-IPL sections
    const renderStandardCard = (item) => (
        <motion.div key={`card-${item.id}`} whileHover={{ y: -4 }} onClick={() => goToEvent(item.id)} className="min-w-[240px] max-w-[240px] md:min-w-[260px] md:max-w-[260px] flex-shrink-0 cursor-pointer group">
            <div className="relative w-full h-[160px] rounded-[16px] overflow-hidden mb-3 border border-gray-200 bg-gray-100 shadow-sm">
                <img src={`https://loremflickr.com/600/400/${encodeURIComponent((item.league || 'event').split(' ')[0])},event/all`} alt={item.t1} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <button onClick={(e) => { e.stopPropagation(); handleRestrictedAction(`Favourite`, item); }} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 backdrop-blur-sm z-10 transition-colors shadow-sm">
                    <Heart size={14} className={isFavorite(item.id) ? "fill-[#E91E63] text-[#E91E63]" : "text-white"}/>
                </button>
                <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg flex flex-col items-center shadow-sm">
                    <span className="text-[10px] font-bold text-[#114C2A] uppercase leading-none mb-0.5">{item.month}</span>
                    <span className="text-[18px] font-black text-[#114C2A] leading-none">{item.day}</span>
                </div>
            </div>
            <h3 className="font-bold text-[#1D2B36] text-[16px] leading-tight group-hover:text-[#458731] transition-colors truncate mb-1">
                {item.t1} {item.t2 ? `vs ${item.t2}` : ''}
            </h3>
            <p className="text-[13px] text-gray-500 font-medium truncate mb-0.5 flex items-center">
                <Clock size={12} className="mr-1.5 opacity-70"/> {item.time} • {item.loc}
            </p>
            <p className="text-[12px] font-bold text-[#458731] truncate bg-[#EAF4D9] inline-block px-2 py-0.5 rounded border border-[#C5E1A5]">
                From ₹{Math.floor(parseFloat(item.odds || 1.5) * 800 + 400).toLocaleString()}
            </p>
        </motion.div>
    );

    return (
        <div className="animate-fade-in w-full pb-20 overflow-x-hidden pt-2">
            
            {/* LOCATION FILTER OVERRIDE PILL */}
            <div className="flex items-center space-x-3 mb-6 overflow-x-visible hide-scrollbar pb-2 relative z-[60]">
                <div className="relative">
                    <button 
                        onClick={() => setLocationDropdownOpen(!isLocationDropdownOpen)}
                        className="bg-[#E6F2D9] border border-[#C5E1A5] text-[#114C2A] px-4 py-2 rounded-[10px] text-sm font-bold flex items-center whitespace-nowrap shadow-sm hover:bg-[#D9EBBF] transition-colors"
                    >
                        <MapPin size={16} className="mr-2"/> 
                        {manualCity || userCity || 'Detecting Location...'} 
                        <ChevronDown size={16} className={`ml-2 transition-transform ${isLocationDropdownOpen ? 'rotate-180' : ''}`}/>
                    </button>
                    <div className="absolute left-0 mt-2 z-[70]">
                        <LocationDropdown />
                    </div>
                </div>
                <button onClick={() => fetchLocationAndMatches(manualCity || userCity)} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-[10px] text-sm font-bold flex items-center whitespace-nowrap hover:bg-gray-50 transition-colors shadow-sm">
                    <RefreshCw size={14} className={`mr-2 ${isLoadingMatches ? 'animate-spin' : ''}`}/> Refresh Local Feed
                </button>
            </div>

            {/* 1. DYNAMIC LOCAL HERO CAROUSEL */}
            <div className="relative w-full h-[250px] md:h-[350px] rounded-[20px] overflow-hidden mb-12 shadow-sm border border-gray-200">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={currentHeroIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="absolute inset-0 flex"
                    >
                        <div 
                            className="relative w-[65%] md:w-2/5 h-full z-20 flex flex-col justify-center px-6 md:px-12"
                            style={{ 
                                backgroundColor: heroSlides[currentHeroIndex].bgLeft,
                                clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' 
                            }}
                        >
                            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-wider w-max mb-4 flex items-center border border-white/30">
                                <Flame size={12} className="mr-1.5 text-yellow-400"/> Hottest in {manualCity || userCity}
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight drop-shadow-md line-clamp-2">
                                {heroSlides[currentHeroIndex].title}
                            </h2>
                            <p className="text-white/80 font-medium text-sm md:text-lg mb-6 line-clamp-1">{heroSlides[currentHeroIndex].subtitle}</p>
                            
                            <button 
                                onClick={() => navigate(`/performer/${encodeURIComponent(heroSlides[currentHeroIndex].query)}`)}
                                className="bg-white text-gray-900 hover:bg-gray-100 w-max px-6 py-2.5 rounded-[10px] text-sm font-bold transition-colors shadow-lg"
                            >
                                See Tickets
                            </button>
                        </div>
                        
                        <div className="absolute top-0 bottom-0 right-0 w-3/4 z-10 bg-black overflow-hidden">
                            <img src={heroSlides[currentHeroIndex].image} className="w-full h-full object-cover opacity-70 mix-blend-overlay scale-105" alt="Event Hero"/>
                            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/60"></div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-6 left-6 md:left-12 flex space-x-2.5 z-30">
                    {heroSlides.map((_, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setCurrentHeroIndex(idx)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentHeroIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'}`}
                        />
                    ))}
                </div>
            </div>

            {/* 2. SVG CATEGORY NAVIGATION RAIL */}
            <CategoryNav />

            {/* API LOADING & ERROR STATES */}
            {isLoadingMatches && !apiError && (
                <div className="w-full py-16 flex flex-col items-center justify-center bg-gray-50 rounded-[20px] mb-12 border border-gray-200">
                    <div className="w-10 h-10 border-4 border-[#114C2A] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-sm font-bold text-gray-600">Aggregating local databases for {manualCity || userCity}...</p>
                </div>
            )}
            
            {apiError && (
                <div className="w-full bg-red-50 border border-red-200 rounded-[20px] p-8 mb-12 flex flex-col items-center justify-center text-center">
                    <AlertCircle size={32} className="text-red-500 mb-3" />
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Local Feed Disconnected</h3>
                    <p className="text-sm text-red-600">{apiError}</p>
                </div>
            )}

            {filteredMatches.length === 0 && !isLoadingMatches && !apiError && (
                <div className="w-full text-center py-16 bg-gray-50 rounded-[20px] border border-gray-200 mb-12">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No active events found in {manualCity || userCity}</h3>
                    <p className="text-gray-500 font-medium">Try expanding your search or changing your location above.</p>
                </div>
            )}

            {/* 3. HAPPENING TODAY SECTION */}
            {todayEvents.length > 0 && !isLoadingMatches && (
                <div className="mb-14">
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-[26px] font-black text-[#1D2B36] tracking-tight">Happening Today</h2>
                        <button className="text-[#1D7AF2] font-bold text-sm hover:underline">View all</button>
                    </div>
                    <div className="flex overflow-x-auto hide-scrollbar space-x-4 md:space-x-5 pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                        {todayEvents.map(renderStandardCard)}
                    </div>
                </div>
            )}

            {/* 4. IPL 2026 FEVER (SPECIALIZED CARDS) */}
            {iplMatches.length > 0 && !isLoadingMatches && (
                <div className="mb-14">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-md">
                            <Trophy size={16} className="text-white"/>
                        </div>
                        <h2 className="text-[26px] font-black text-[#1D2B36] tracking-tight">IPL 2026 Fever</h2>
                    </div>
                    <div className="flex overflow-x-auto hide-scrollbar space-x-5 pb-6 -mx-4 px-4 md:mx-0 md:px-0">
                        {iplMatches.map(match => (
                            <div key={`ipl-${match.id}`} className="min-w-[300px] md:min-w-[340px] flex-shrink-0">
                                <IplMatchCard event={match} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 5. UPCOMING LOCAL CONCERTS */}
            {concerts.length > 0 && !isLoadingMatches && (
                <div className="mb-14">
                    <h2 className="text-[26px] font-black text-[#1D2B36] tracking-tight mb-6">Live Music in {manualCity || userCity}</h2>
                    <div className="flex overflow-x-auto hide-scrollbar space-x-4 md:space-x-5 pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                        {concerts.map(renderStandardCard)}
                    </div>
                </div>
            )}

            {/* 8. MODULAR APP DOWNLOAD BANNER */}
            <AppDownloadBanner />

            {/* 6. ISL & FOOTBALL MATCHES */}
            {footballMatches.length > 0 && !isLoadingMatches && (
                <div className="mb-14">
                    <h2 className="text-[26px] font-black text-[#1D2B36] tracking-tight mb-6">Football & ISL Clashes</h2>
                    <div className="flex overflow-x-auto hide-scrollbar space-x-4 md:space-x-5 pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                        {footballMatches.map(renderStandardCard)}
                    </div>
                </div>
            )}

            {/* 7. THEATER & COMEDY NIGHTS */}
            {theaterComedy.length > 0 && !isLoadingMatches && (
                <div className="mb-14">
                    <h2 className="text-[26px] font-black text-[#1D2B36] tracking-tight mb-6">Theater & Comedy Nights</h2>
                    <div className="flex overflow-x-auto hide-scrollbar space-x-4 md:space-x-5 pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                        {theaterComedy.map(renderStandardCard)}
                    </div>
                </div>
            )}

            {/* INLINE SPOTIFY SYNC BANNER */}
            <div className="w-full bg-gradient-to-r from-gray-900 to-black rounded-[20px] p-6 md:p-8 mb-12 flex flex-col md:flex-row justify-between items-center text-white cursor-pointer hover:shadow-2xl transition-shadow border border-gray-800">
                <div className="flex items-center mb-6 md:mb-0 space-x-5">
                    <div className="w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center shadow-lg shadow-[#1DB954]/20 flex-shrink-0">
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="white"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.36.18.54.84.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.239.54-.959.72-1.56.3z"/></svg>
                    </div>
                    <div>
                        <h3 className="font-black text-[20px] leading-tight mb-1">Sync your Spotify</h3>
                        <p className="text-[14px] text-gray-400 font-medium">Get instantly notified when your top artists play in {manualCity || userCity}</p>
                    </div>
                </div>
                <button className="bg-[#1DB954] text-white font-bold px-8 py-3 rounded-full text-sm hover:bg-[#1ed760] hover:scale-105 transition-all w-full md:w-auto shadow-md">
                    Connect Account
                </button>
            </div>

        </div>
    );
}