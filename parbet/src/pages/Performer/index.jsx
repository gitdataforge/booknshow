import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Heart, Share, MapPin, Calendar, Tag, ChevronDown, 
    Info, Download, QrCode, ShieldCheck, Flame, Users,
    Search, Check, Clock 
} from 'lucide-react';
import { useAppStore } from '../../store/useStore';
import LocationDropdown from '../../components/LocationDropdown';
import FilterDropdown from '../../components/FilterDropdown';
import PerformerHero from '../../components/PerformerHero';

// Strict Relative Date Formatter
const getRelativeDateLabel = (dateStr) => {
    if (!dateStr) return '';
    const eventDate = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    if (eventDate.toDateString() === today.toDateString()) return 'Today';
    if (eventDate.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    const diffTime = Math.abs(eventDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 7) return 'This Week';
    return '';
};

export default function Performer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const performerName = decodeURIComponent(id || '');

    const { 
        liveMatches, 
        userCity, 
        isLoadingMatches, 
        fetchLocationAndMatches,
        isAuthenticated,
        openAuthModal,
        isLocationDropdownOpen,
        setLocationDropdownOpen,
        performerFilters,
        setPerformerFilter
    } = useAppStore();

    // Local Dropdown Toggle States
    const [activeDropdown, setActiveDropdown] = useState(null); // 'date', 'opponent', 'price', 'homeAway'
    const [emailInput, setEmailInput] = useState('');

    useEffect(() => {
        if (liveMatches.length === 0 && !isLoadingMatches) {
            fetchLocationAndMatches();
        }
        window.scrollTo(0, 0);
    }, [liveMatches.length, isLoadingMatches, fetchLocationAndMatches, id]);

    const handleRestrictedAction = (actionName) => {
        if (!isAuthenticated) openAuthModal();
        else console.log(`Executing secure real-time action: ${actionName}`);
    };

    const toggleDropdown = (dropdownName) => {
        if (activeDropdown === dropdownName) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(dropdownName);
            setLocationDropdownOpen(false);
        }
    };

    // --- RIGOROUS REAL-TIME API FILTERING ---
    const { baseEvents, filteredEvents, uniqueOpponents } = useMemo(() => {
        // 1. Base filter for this specific performer/team
        const base = liveMatches.filter(m => 
            m.t1.toLowerCase().includes(performerName.toLowerCase()) || 
            m.t2?.toLowerCase().includes(performerName.toLowerCase()) ||
            m.league.toLowerCase().includes(performerName.toLowerCase())
        );

        // Extract unique opponents for the dropdown filter
        const opponentsSet = new Set();
        base.forEach(m => {
            if (m.t1 && !m.t1.toLowerCase().includes(performerName.toLowerCase())) opponentsSet.add(m.t1);
            if (m.t2 && !m.t2.toLowerCase().includes(performerName.toLowerCase())) opponentsSet.add(m.t2);
        });

        // 2. Apply user-selected Deep UI filters
        const filtered = base.filter(m => {
            // Location Filter (Global / Local)
            if (userCity && userCity !== 'All Cities' && userCity !== 'Global' && userCity !== 'Current Location') {
                if (m.loc && !m.loc.toLowerCase().includes(userCity.toLowerCase())) return false;
            }

            // Opponent Filter
            if (performerFilters.activeOpponent && performerFilters.activeOpponent !== 'All opponents') {
                const opponentName = performerFilters.activeOpponent.toLowerCase();
                const isPlayingOpponent = 
                    (m.t1 && m.t1.toLowerCase().includes(opponentName)) || 
                    (m.t2 && m.t2.toLowerCase().includes(opponentName));
                if (!isPlayingOpponent) return false;
            }

            // Home/Away Filter
            if (performerFilters.homeAway !== 'All games') {
                const isHome = m.t1.toLowerCase().includes(performerName.toLowerCase());
                if (performerFilters.homeAway === 'Home games' && !isHome) return false;
                if (performerFilters.homeAway === 'Away games' && isHome) return false;
            }

            return true;
        });

        return { baseEvents: base, filteredEvents: filtered, uniqueOpponents: Array.from(opponentsSet).sort() };
    }, [liveMatches, performerName, userCity, performerFilters]);

    // 3. Extract recommendations (other performers in the API)
    const relatedEvents = liveMatches.filter(m => 
        !m.t1.toLowerCase().includes(performerName.toLowerCase()) && 
        !m.league.toLowerCase().includes(performerName.toLowerCase())
    ).slice(0, 6);

    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
            className="w-full pb-20 bg-white"
        >
            <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-6 md:pt-12">
                
                {/* MODULAR HERO SECTION (Injected with dynamic data and favorite functionality) */}
                <PerformerHero 
                    performerName={performerName} 
                    eventCount={filteredEvents.length} 
                    userCity={userCity}
                >
                    {/* FILTER TABS RAIL (image_f557a3.png) passed safely via children slot */}
                    <div className="flex flex-wrap items-center gap-3 overflow-x-visible pb-2 relative z-50">
                        {/* Location Pill */}
                        <div className="relative">
                            <button 
                                onClick={() => { setLocationDropdownOpen(!isLocationDropdownOpen); setActiveDropdown(null); }}
                                className="bg-[#212529] text-white px-4 py-2.5 rounded-full text-[14px] font-bold flex items-center whitespace-nowrap shadow-sm hover:bg-black transition-colors border border-transparent"
                            >
                                <MapPin size={16} className="mr-2 fill-white text-[#212529]"/> 
                                {userCity === 'Loading...' ? 'Detecting...' : userCity} 
                                <ChevronDown size={16} className={`ml-2 transition-transform ${isLocationDropdownOpen ? 'rotate-180' : ''}`}/>
                            </button>
                            {isLocationDropdownOpen && (
                                <div className="absolute left-0 mt-2 z-50">
                                    <LocationDropdown />
                                </div>
                            )}
                        </div>

                        {/* Dates Pill */}
                        <div className="relative">
                            <button 
                                onClick={() => toggleDropdown('date')}
                                className={`border bg-white text-brand-text px-4 py-2.5 rounded-full text-[14px] font-medium flex items-center whitespace-nowrap shadow-sm transition-colors ${activeDropdown === 'date' ? 'border-gray-800 ring-1 ring-gray-800' : 'border-gray-300 hover:bg-gray-50'}`}
                            >
                                All dates <ChevronDown size={16} className={`ml-2 opacity-60 transition-transform ${activeDropdown === 'date' ? 'rotate-180' : ''}`}/>
                            </button>
                            <FilterDropdown type="date" isOpen={activeDropdown === 'date'} onClose={() => setActiveDropdown(null)} />
                        </div>

                        {/* Opponents Pill */}
                        <div className="relative">
                            <button 
                                onClick={() => toggleDropdown('opponent')}
                                className={`border bg-white text-brand-text px-4 py-2.5 rounded-full text-[14px] font-medium flex items-center whitespace-nowrap shadow-sm transition-colors ${activeDropdown === 'opponent' || performerFilters.activeOpponent ? 'border-gray-800 ring-1 ring-gray-800' : 'border-gray-300 hover:bg-gray-50'}`}
                            >
                                {performerFilters.activeOpponent && performerFilters.activeOpponent !== 'All opponents' ? performerFilters.activeOpponent : 'Opponents'} 
                                <ChevronDown size={16} className={`ml-2 opacity-60 transition-transform ${activeDropdown === 'opponent' ? 'rotate-180' : ''}`}/>
                            </button>
                            <AnimatePresence>
                                {activeDropdown === 'opponent' && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 mt-2 w-[280px] bg-white rounded-[16px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-200 z-50 py-2 max-h-[300px] overflow-y-auto"
                                    >
                                        <div className="px-4 py-2 border-b border-gray-100 mb-2">
                                            <div className="relative">
                                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input type="text" placeholder="Opponent name" className="w-full pl-9 pr-4 py-2 border border-[#80C2FF] rounded-lg outline-none focus:ring-1 focus:ring-[#80C2FF] text-sm" />
                                            </div>
                                        </div>
                                        {['All opponents', ...uniqueOpponents].map((opp, idx) => (
                                            <button 
                                                key={idx}
                                                onClick={() => { setPerformerFilter('activeOpponent', opp); setActiveDropdown(null); }}
                                                className="w-full text-left px-5 py-2.5 text-[15px] text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                                            >
                                                {opp}
                                                {(performerFilters.activeOpponent === opp || (!performerFilters.activeOpponent && opp === 'All opponents')) && <Check size={16} className="text-gray-600"/>}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Price Pill */}
                        <div className="relative hidden md:block">
                            <button 
                                onClick={() => toggleDropdown('price')}
                                className={`border bg-white text-brand-text px-4 py-2.5 rounded-full text-[14px] font-medium flex items-center whitespace-nowrap shadow-sm transition-colors ${activeDropdown === 'price' ? 'border-gray-800 ring-1 ring-gray-800' : 'border-gray-300 hover:bg-gray-50'}`}
                            >
                                Price <ChevronDown size={16} className={`ml-2 opacity-60 transition-transform ${activeDropdown === 'price' ? 'rotate-180' : ''}`}/>
                            </button>
                            <FilterDropdown type="price" isOpen={activeDropdown === 'price'} onClose={() => setActiveDropdown(null)} />
                        </div>

                        {/* Home/Away Pill */}
                        <div className="relative hidden md:block">
                            <button 
                                onClick={() => toggleDropdown('homeAway')}
                                className={`border bg-white text-brand-text px-4 py-2.5 rounded-full text-[14px] font-medium flex items-center whitespace-nowrap shadow-sm transition-colors ${activeDropdown === 'homeAway' || performerFilters.homeAway !== 'All games' ? 'border-gray-800 ring-1 ring-gray-800' : 'border-gray-300 hover:bg-gray-50'}`}
                            >
                                {performerFilters.homeAway === 'All games' ? 'Home/Away' : performerFilters.homeAway} 
                                <ChevronDown size={16} className={`ml-2 opacity-60 transition-transform ${activeDropdown === 'homeAway' ? 'rotate-180' : ''}`}/>
                            </button>
                            <AnimatePresence>
                                {activeDropdown === 'homeAway' && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 mt-2 w-[200px] bg-white rounded-[16px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-200 z-50 py-2"
                                    >
                                        {['All games', 'Home games', 'Away games'].map((option) => (
                                            <button 
                                                key={option}
                                                onClick={() => { setPerformerFilter('homeAway', option); setActiveDropdown(null); }}
                                                className="w-full text-left px-5 py-3 text-[15px] text-gray-800 hover:bg-gray-50 flex justify-between items-center"
                                            >
                                                {option}
                                                {performerFilters.homeAway === option && <Check size={18} className="text-gray-600"/>}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </PerformerHero>

                {/* 2-COLUMN SPLIT: Event List & Sticky Guarantee Rail */}
                <div className="flex flex-col lg:flex-row gap-8 mb-16 relative">
                    
                    {/* EVENT LIST SECTION (image_f55c1e.png) */}
                    <div className="flex-1 flex flex-col space-y-3 z-10">
                        {isLoadingMatches ? (
                            <div className="w-full py-20 flex flex-col items-center justify-center border border-gray-200 rounded-[16px]">
                                <div className="w-8 h-8 border-4 border-[#114C2A] border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-sm font-bold text-gray-500">Loading events...</p>
                            </div>
                        ) : filteredEvents.length === 0 ? (
                            <div className="w-full py-16 bg-gray-50 rounded-[16px] border border-gray-200 text-center">
                                <h3 className="text-[18px] font-bold text-brand-text mb-2">No matching events</h3>
                                <p className="text-brand-muted text-[14px]">Try adjusting your filters or location to see more results.</p>
                                <button onClick={() => { setLocationDropdownOpen(false); }} className="mt-4 text-[#458731] font-bold hover:underline">Clear Location Filter</button>
                            </div>
                        ) : (
                            filteredEvents.map((m, index) => {
                                const isHottest = index === 0 && !performerFilters.activeOpponent;
                                const relativeLabel = getRelativeDateLabel(m.commence_time);
                                
                                return (
                                    <div 
                                        key={m.id} 
                                        onClick={() => navigate(`/event?id=${m.id}`)}
                                        className="bg-white border border-[#DEE2E6] rounded-[16px] p-4 flex flex-col md:flex-row md:items-center hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center flex-1">
                                            {/* Left Date Tear-off Box */}
                                            <div className="flex flex-col items-center justify-center pr-5 border-r border-[#DEE2E6] min-w-[85px]">
                                                <span className="text-[13px] font-bold text-gray-900 mb-0.5">{m.month}</span>
                                                <span className="text-[26px] font-black text-gray-900 leading-none mb-0.5">{m.day}</span>
                                                <span className="text-[12px] text-gray-500 font-medium">{m.dow}</span>
                                            </div>
                                            
                                            {/* Middle Event Details */}
                                            <div className="pl-5 flex-1">
                                                <h3 className="text-[17px] font-bold text-[#1D2B36] leading-tight mb-1 group-hover:text-[#458731] transition-colors">
                                                    {m.t1} {m.t2 ? `vs ${m.t2}` : ''}
                                                </h3>
                                                <p className="text-[13px] text-gray-500 flex items-center mb-2">
                                                    {m.time} • 🇮🇳 {m.loc}
                                                </p>
                                                <div className="flex flex-wrap gap-2 items-center">
                                                    {relativeLabel && (
                                                        <div className="flex items-center bg-[#EAF4D9] text-[#114C2A] border border-[#C5E1A5] px-2 py-0.5 rounded-[4px] text-[11px] font-bold uppercase tracking-wider">
                                                            <Calendar size={12} className="mr-1.5 opacity-80"/> {relativeLabel}
                                                        </div>
                                                    )}
                                                    {isHottest && (
                                                        <div className="flex items-center bg-[#E6F2D9] text-[#114C2A] px-2 py-0.5 rounded-[4px] text-[11px] font-bold border border-[#C5E1A5]">
                                                            <Flame size={12} className="mr-1.5"/> Hottest event on our site <Info size={10} className="ml-1 opacity-60"/>
                                                        </div>
                                                    )}
                                                    {!isHottest && Math.random() > 0.5 && (
                                                        <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-0.5 rounded-[4px] text-[11px] font-bold border border-blue-100">
                                                            <Clock size={12} className="mr-1.5"/> On sale soon
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Action Button */}
                                        <div className="mt-4 md:mt-0 pt-4 md:pt-0 border-t border-[#DEE2E6] md:border-t-0 flex justify-end shrink-0">
                                            <button className="w-full md:w-auto border border-gray-300 text-gray-900 bg-white px-5 py-2.5 rounded-[10px] font-bold text-[14px] group-hover:bg-gray-50 transition-colors shadow-sm">
                                                See tickets
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Right-Hand Sticky Rail: Guarantee Box */}
                    <div className="hidden lg:block w-[400px] shrink-0">
                        <div className="sticky top-[100px] p-5 bg-[#F8F9FA] rounded-[16px] border border-gray-200 flex items-start gap-4 shadow-sm">
                            <ShieldCheck size={24} className="text-[#114C2A] shrink-0"/>
                            <div>
                                <h4 className="font-bold text-brand-text mb-1 text-[15px]">100% Order Guarantee</h4>
                                <p className="text-[13px] text-gray-500 font-medium">We back every order so you can buy and sell tickets with 100% confidence.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RECOMMENDATIONS RAIL (image_f5601c.jpg) */}
                {relatedEvents.length > 0 && (
                    <div className="mb-16 mt-12 border-t border-gray-100 pt-12">
                        <h2 className="text-[26px] font-black text-brand-text mb-6 tracking-tight">{performerName} fans also love</h2>
                        <div className="flex overflow-x-auto hide-scrollbar space-x-4 pb-4">
                            {relatedEvents.map((item) => (
                                <div key={`rel-${item.id}`} onClick={() => navigate(`/performer/${encodeURIComponent(item.t1)}`)} className="min-w-[280px] max-w-[280px] flex-shrink-0 cursor-pointer group">
                                    <div className="relative w-full h-[180px] rounded-[16px] overflow-hidden mb-3 border border-gray-200 bg-gray-100 shadow-sm">
                                        <img 
                                            src={`https://loremflickr.com/600/400/${encodeURIComponent(item.t1.split(' ')[0])},sports/all`} 
                                            alt={item.t1} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                        />
                                        <button onClick={(e) => { e.stopPropagation(); handleRestrictedAction(`Favourite`); }} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 backdrop-blur-sm z-10 transition-colors">
                                            <Heart size={14} className="text-white"/>
                                        </button>
                                    </div>
                                    <h3 className="font-bold text-[#1D2B36] text-[17px] leading-tight group-hover:text-[#458731] transition-colors truncate">{item.t1}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* APP DOWNLOAD BANNER (image_f56360.jpg) */}
                <div className="w-full bg-[#EAF4D9] rounded-[20px] p-8 md:p-12 flex flex-col md:flex-row justify-between items-center relative overflow-hidden mb-16 border border-[#C5E1A5] shadow-sm">
                    <div className="md:w-1/2 z-10 text-center md:text-left mb-8 md:mb-0">
                        <h2 className="text-[28px] md:text-[36px] font-black text-[#114C2A] mb-2 leading-tight tracking-tight">Download the parbet app</h2>
                        <p className="text-[16px] text-[#114C2A]/80 font-medium mb-8">Discover your favourite events with ease</p>
                        
                        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                            <button className="bg-black text-white px-5 py-3 rounded-[12px] flex items-center hover:bg-gray-900 transition-colors w-full sm:w-auto justify-center shadow-md">
                                <Download size={22} className="mr-3" />
                                <div className="text-left leading-none">
                                    <span className="text-[10px] block opacity-80">Download on the</span>
                                    <span className="text-[14px] font-bold">App Store</span>
                                </div>
                            </button>
                            <button className="bg-black text-white px-5 py-3 rounded-[12px] flex items-center hover:bg-gray-900 transition-colors w-full sm:w-auto justify-center shadow-md">
                                <Download size={22} className="mr-3" />
                                <div className="text-left leading-none">
                                    <span className="text-[10px] block opacity-80">GET IT ON</span>
                                    <span className="text-[14px] font-bold">Google Play</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="md:w-1/2 flex justify-center md:justify-end z-10">
                        <div className="bg-white p-3 rounded-[16px] shadow-lg border border-gray-100 flex flex-col items-center">
                            <QrCode size={90} className="text-gray-900 mb-2"/>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Scan to get</span>
                        </div>
                    </div>
                </div>

                {/* EMAIL SUBSCRIPTION BANNER */}
                <div className="w-full flex flex-col items-center text-center px-4 mb-8">
                    <h3 className="text-[20px] font-bold text-brand-text mb-6">Get hot events and deals delivered straight to your inbox</h3>
                    <div className="flex flex-col sm:flex-row items-center w-full max-w-md space-y-3 sm:space-y-0 sm:space-x-3">
                        <div className="relative w-full">
                            <input 
                                type="email" placeholder="Email address" 
                                value={emailInput} onChange={(e) => setEmailInput(e.target.value)}
                                className="w-full bg-transparent border-b-2 border-gray-300 py-3 outline-none focus:border-[#458731] transition-colors text-[16px] font-medium text-brand-text placeholder-gray-400"
                            />
                        </div>
                        <button className="w-full sm:w-auto border border-[#458731] text-[#458731] font-bold px-8 py-3 rounded-full hover:bg-[#EAF4D9] transition-colors whitespace-nowrap shadow-sm">
                            Join the List
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}