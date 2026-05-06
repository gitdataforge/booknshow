import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Heart, MapPin, Calendar, ChevronDown, 
    Download, QrCode, ShieldCheck, Flame, Users,
    Clock, ChevronLeft, ChevronRight, Navigation, Loader2,
    Pencil, ShieldAlert, PlusCircle, Info, Sparkles, X, Filter
} from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';

// Global Stores & Firebase
import { useAppStore } from '../../store/useStore';
import { useMarketStore } from '../../store/useMarketStore';
import { auth } from '../../lib/firebase';

// UI Components
import LocationDropdown from '../../components/LocationDropdown';
import AdminEditEventModal from '../../components/AdminEditEventModal';

/**
 * GLOBAL REBRAND: Booknshow Identity Application (Phase 24 Exclusive Filters)
 * Enforced Colors: #FFFFFF, #E7364D, #333333, #EB5B6E, #FAD8DC, #A3A3A3, #626262
 * FEATURE 1: Exclusive IPL Aggregation Interceptor
 * FEATURE 2: Strict UI Filter Strip-down (Location, Dates, Sold Out only)
 * FEATURE 3: Custom Date Range Prompt Modal
 * FEATURE 4: Real-time Combined Filter Logic Execution
 * FEATURE 5: Hardware-Accelerated Layout & Ambience
 */

// Strict Date Formatters
const getMonthStr = (d) => {
    const date = new Date(d);
    return isNaN(date) ? 'TBA' : date.toLocaleDateString('en-US', { month: 'short' });
};
const getDayNum = (d) => {
    const date = new Date(d);
    return isNaN(date) ? '-' : date.getDate();
};
const getDowStr = (d) => {
    const date = new Date(d);
    return isNaN(date) ? 'TBA' : date.toLocaleDateString('en-US', { weekday: 'short' });
};
const getTimeStr = (d) => {
    const date = new Date(d);
    return isNaN(date) ? 'TBA' : date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

const getRelativeDateLabel = (dateStr) => {
    if (!dateStr) return '';
    const eventDate = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    if (eventDate.toDateString() === today.toDateString()) return 'Today';
    if (eventDate.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0 && diffDays <= 7) return 'This week';
    if (diffDays > 7 && diffDays <= 14) return 'Next week';
    return '';
};

// Legacy Scrubber
const getSafeImage = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=400';
    if (url.includes('res.cloudinary.com/dtz0urit6')) return 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=400';
    return url;
};

// Ambient background
const PerformerAmbientBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#FFFFFF]">
        <motion.div
            className="absolute top-[10%] -left-[10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-[#FAD8DC] opacity-30 blur-[100px]"
            animate={{ x: [0, 40, 0], y: [0, 20, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
            className="absolute top-[40%] -right-[10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-[#FAD8DC] opacity-20 blur-[120px]"
            animate={{ x: [0, -30, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
    </div>
);

// FEATURE 3: Custom Date Selection Modal
const CustomDateModal = ({ isOpen, onClose, onApply }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#333333]/80 backdrop-blur-sm p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#FFFFFF] rounded-[16px] p-6 md:p-8 w-full max-w-md shadow-2xl relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-[#A3A3A3] hover:text-[#333333] transition-colors"><X size={20}/></button>
                <div className="flex items-center mb-6">
                    <Calendar className="text-[#E7364D] mr-3" size={24} />
                    <h2 className="text-[20px] font-black text-[#333333]">Select Date Range</h2>
                </div>
                
                <div className="space-y-4 mb-8">
                    <div>
                        <label className="block text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1">Start Date</label>
                        <input 
                            type="date" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#A3A3A3]/30 rounded-[8px] text-[14px] font-bold text-[#333333] focus:border-[#E7364D] outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1">End Date</label>
                        <input 
                            type="date" 
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#A3A3A3]/30 rounded-[8px] text-[14px] font-bold text-[#333333] focus:border-[#E7364D] outline-none"
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 text-[14px] font-bold text-[#626262] bg-[#F5F5F5] rounded-[8px] hover:bg-[#E5E5E5] transition-colors">Cancel</button>
                    <button 
                        onClick={() => onApply(startDate, endDate)} 
                        disabled={!startDate || !endDate}
                        className="flex-1 py-3 text-[14px] font-black text-[#FFFFFF] bg-[#E7364D] rounded-[8px] hover:bg-[#333333] transition-colors disabled:opacity-50"
                    >
                        Apply Filter
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default function Performer() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // FEATURE 1: Exclusive Interceptor
    const isExclusiveMode = id?.toLowerCase() === 'exclusive';
    const rawPerformerName = decodeURIComponent(id || 'Indian Premier League');
    const performerName = isExclusiveMode ? 'Indian Premier League' : rawPerformerName;

    const { 
        userCity, 
        isLocationDropdownOpen, 
        setLocationDropdownOpen, 
        performerFilters,
        setPerformerFilter
    } = useAppStore();
    
    // Shared Market State
    const { activeListings, isLoading, initMarketListener } = useMarketStore();

    // Local UI States
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isCustomDateModalOpen, setIsCustomDateModalOpen] = useState(false);
    const itemsPerPage = 12;
    const filterRef = useRef(null);

    // Admin States
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminModalOpen, setAdminModalOpen] = useState(false);
    const [selectedAdminEvent, setSelectedAdminEvent] = useState(null);
    const [showLoader, setShowLoader] = useState(true);

    // Click outside handler for dropdowns
    useEffect(() => {
        function handleClickOutside(event) {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Verify Admin Identity
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user && user.email) {
                const validAdmins = ['testcodecfg@gmail.com', 'krishnamehta.gm@gmail.com', 'jatinseth.op@gmail.com', 'jachinfotech@gmail.com'];
                setIsAdmin(validAdmins.includes(user.email.toLowerCase()));
            } else {
                setIsAdmin(false);
            }
        });
        return () => unsubscribeAuth();
    }, []);

    // Initialize Real-Time Singleton Listener
    useEffect(() => {
        const unsubscribe = initMarketListener();
        window.scrollTo(0, 0);
        return () => {
            if (unsubscribe && typeof unsubscribe === 'function') unsubscribe();
        };
    }, [initMarketListener]);

    // Failsafe Loading Resolver
    useEffect(() => {
        if (activeListings && activeListings.length > 0) {
            setShowLoader(false);
        }
        const failsafe = setTimeout(() => setShowLoader(false), 4000);
        return () => clearTimeout(failsafe);
    }, [activeListings]);

    // FEATURE 4: Strict Real-Time API Combined Filtering Engine
    const { filteredEvents, fansAlsoLove } = useMemo(() => {
        const isIPLContext = performerName.toLowerCase().includes('ipl') || performerName.toLowerCase().includes('premier league');
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];

        // BASE FILTER: Entity Match
        const base = activeListings.filter(m => {
            const title = m.title || m.eventName || '';
            const t1 = m.t1 || m.team1 || '';
            const t2 = m.t2 || m.team2 || '';
            const league = m.league || '';
            const cat = m.sportCategory || m.category || '';
            
            const searchString = `${title} ${t1} ${t2} ${league} ${cat}`.toLowerCase();
            const query = performerName.toLowerCase();
            
            if (isIPLContext) {
                return searchString.includes('ipl') || 
                       searchString.includes('premier league') || 
                       searchString.includes('cricket') ||
                       searchString.includes('chennai super kings') ||
                       searchString.includes('mumbai indians') ||
                       searchString.includes('royal challengers') ||
                       searchString.includes('sunrisers') ||
                       searchString.includes('gujarat titans');
            }
            if (query === 'cricket') return searchString.includes('cricket') || searchString.includes('t20') || searchString.includes('test');
            if (query === 'kabaddi') return searchString.includes('kabaddi') || searchString.includes('pkl');
            if (query === 'world cup') return searchString.includes('world cup') || searchString.includes('icc');
            
            return searchString.includes(query);
        });

        // LAYER 1: Location Filter (Ignored for IPL)
        let filtered = base.filter(m => {
            if (isIPLContext) return true;
            if (userCity && userCity !== 'All Cities' && userCity !== 'Global' && userCity !== 'Current Location' && userCity !== 'Detecting...') {
                const locStr = `${m.loc} ${m.city} ${m.location} ${m.stadium}`.toLowerCase();
                if (!locStr.includes(userCity.toLowerCase())) return false;
            }
            return true;
        });

        // LAYER 2: Date Filter Logic
        if (performerFilters.dateRange?.from) {
            filtered = filtered.filter(m => {
                const eDateStr = (m.commence_time || m.eventTimestamp || '').split('T')[0];
                if (!eDateStr) return false;

                const filterType = performerFilters.dateRange.from; // We use 'from' as the identifier for standard filters

                if (filterType === 'today') {
                    return eDateStr === todayStr;
                }
                if (filterType === 'tomorrow') {
                    const tmrw = new Date();
                    tmrw.setDate(now.getDate() + 1);
                    return eDateStr === tmrw.toISOString().split('T')[0];
                }
                if (filterType === 'weekend') {
                    const d = new Date(eDateStr);
                    return d.getDay() === 0 || d.getDay() === 6;
                }
                if (filterType === 'custom' && performerFilters.customDateRange.from && performerFilters.customDateRange.to) {
                    const eTime = new Date(eDateStr).getTime();
                    const fromTime = new Date(performerFilters.customDateRange.from).getTime();
                    const toTime = new Date(performerFilters.customDateRange.to).getTime();
                    return eTime >= fromTime && eTime <= toTime;
                }

                return true;
            });
        }

        // LAYER 3: Sold Out Filter
        if (performerFilters.hideSoldOut) {
            filtered = filtered.filter(m => {
                const displayPrice = m.startingPrice !== null && m.startingPrice !== undefined ? m.startingPrice : m.price || m.minPrice;
                return displayPrice !== null && displayPrice !== undefined;
            });
        }

        // Sort Chronologically
        filtered.sort((a, b) => {
            const dateA = new Date(a.commence_time || a.eventTimestamp).getTime();
            const dateB = new Date(b.commence_time || b.eventTimestamp).getTime();
            return dateA - dateB;
        });

        // Derive "Fans Also Love" dynamically
        const tGroups = {};
        activeListings.forEach(e => {
            const key = e.sportCategory || e.team1 || e.title;
            if (!key) return;
            if (!tGroups[key]) tGroups[key] = { id: e.id, name: key, imageId: e.imageUrl || e.image || e.thumb, events: [] };
            tGroups[key].events.push(e);
        });

        const fansArr = Object.values(tGroups)
            .filter(g => !g.name.toLowerCase().includes(performerName.toLowerCase()))
            .slice(0, 4);

        return { 
            filteredEvents: filtered, 
            fansAlsoLove: fansArr 
        };
    }, [activeListings, performerName, userCity, performerFilters]);

    const viewerCount = useMemo(() => Math.floor((filteredEvents.length * 451.08) || 5413), [filteredEvents.length]);
    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
    const paginatedEvents = filteredEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getDisplayName = () => {
        if (isExclusiveMode) return 'Exclusive IPL';
        if (performerName.toUpperCase() === 'IPL') return 'Indian Premier League';
        if (performerName.toUpperCase() === 'ICC') return 'ICC World Cup';
        return performerName;
    };

    const handleCreateNew = () => {
        setSelectedAdminEvent({
            t1: performerName,
            t2: 'Opponent Team',
            league: performerName.toLowerCase().includes('ipl') ? 'Indian Premier League' : 'Tournament',
            sportCategory: performerName.toLowerCase().includes('ipl') || performerName.toLowerCase().includes('cricket') ? 'Cricket' : 'Sports'
        });
        setAdminModalOpen(true);
    };

    const handleEventClick = (e, mId) => {
        e.stopPropagation();
        navigate(`/event?id=${mId}`);
    };

    const handleDateSelection = (type) => {
        if (type === 'custom') {
            setIsCustomDateModalOpen(true);
            setActiveDropdown(null);
        } else {
            setPerformerFilter('dateRange', { from: type });
            setActiveDropdown(null);
        }
    };

    const applyCustomDates = (start, end) => {
        setPerformerFilter('dateRange', { from: 'custom' });
        setPerformerFilter('customDateRange', { from: start, to: end });
        setIsCustomDateModalOpen(false);
    };

    const clearDateFilter = () => {
        setPerformerFilter('dateRange', { from: null });
        setPerformerFilter('customDateRange', { from: null, to: null });
    };

    // Filter UI Resolvers
    const getDateDisplayLabel = () => {
        const filter = performerFilters.dateRange?.from;
        if (!filter) return 'All dates';
        if (filter === 'today') return 'Today';
        if (filter === 'tomorrow') return 'Tomorrow';
        if (filter === 'weekend') return 'This Weekend';
        if (filter === 'custom') return `${performerFilters.customDateRange.from.slice(5)} to ${performerFilters.customDateRange.to.slice(5)}`;
        return 'All dates';
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="w-full pb-20 bg-[#FFFFFF] font-sans text-[#333333] relative overflow-hidden">
            
            <PerformerAmbientBackground />
            
            <AdminEditEventModal 
                isOpen={adminModalOpen} 
                onClose={() => { setAdminModalOpen(false); setSelectedAdminEvent(null); }} 
                eventData={selectedAdminEvent} 
            />

            <CustomDateModal 
                isOpen={isCustomDateModalOpen} 
                onClose={() => setIsCustomDateModalOpen(false)} 
                onApply={applyCustomDates} 
            />
            
            {/* SECTION 1: EXACT BOOKNSHOW HERO BANNER */}
            <div className="w-full bg-[#333333] h-[240px] md:h-[280px] relative overflow-hidden flex items-center z-10">
                <div className="absolute inset-0 z-0 flex justify-end">
                    <div className="w-full md:w-[60%] h-full relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#333333] via-[#333333]/80 to-transparent z-10"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1500&auto=format&fit=crop" 
                            alt="Stadium Cover" 
                            className="w-full h-full object-cover object-right opacity-60 mix-blend-overlay"
                        />
                    </div>
                </div>
                
                <div className="relative z-20 max-w-[1200px] mx-auto px-4 md:px-8 w-full flex justify-between items-end md:items-center">
                    <h1 className="text-[36px] md:text-[56px] font-black text-[#FFFFFF] leading-[1.05] tracking-tight max-w-[600px] capitalize drop-shadow-md">
                        {getDisplayName()} <br className="hidden md:block" /> Tickets
                    </h1>
                    <div className="flex flex-col items-end gap-3">
                        <div className="hidden md:flex items-center gap-2 border border-[#FFFFFF]/30 rounded-full px-4 py-2 text-[#FFFFFF] bg-[#333333]/50 backdrop-blur-sm cursor-pointer hover:bg-[#E7364D]/80 hover:border-[#E7364D] transition-colors shadow-sm">
                            <span className="text-[14px] font-bold">10.8K</span>
                            <Heart size={16} />
                        </div>
                        {isAdmin && (
                            <button onClick={handleCreateNew} className="bg-[#E7364D] text-[#FFFFFF] px-5 py-2.5 rounded-full font-black flex items-center gap-2 hover:bg-[#EB5B6E] transition-colors shadow-[0_8px_20px_rgba(231,54,77,0.3)] shrink-0 text-[14px]">
                                <PlusCircle size={18} /> Add Listing
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 md:px-8 mt-6 relative z-10">
                
                {/* SECTION 2: VIEWER BANNER */}
                <div className="w-full bg-[#FAD8DC]/30 text-[#E7364D] rounded-[12px] p-4 flex items-center mb-6 shadow-sm border border-[#E7364D]/20">
                    <Users size={20} className="mr-3 shrink-0" strokeWidth={2.5}/>
                    <span className="text-[14px] md:text-[15px] font-medium tracking-tight">
                        {viewerCount.toLocaleString()} people viewed <strong className="font-black">{getDisplayName()}</strong> events in the past hour
                    </span>
                </div>

                {/* FEATURE 2: STRICT FILTER ROW (Location, Dates, Sold Out ONLY) */}
                <div className="flex flex-wrap items-center gap-3 overflow-visible pb-6 border-b border-[#A3A3A3]/20 mb-6" ref={filterRef}>
                    
                    {/* Location Dropdown */}
                    <div className="relative">
                        <button 
                            onClick={() => { setLocationDropdownOpen(!isLocationDropdownOpen); setActiveDropdown(null); }}
                            className={`px-5 py-2.5 rounded-full text-[14px] font-bold flex items-center whitespace-nowrap shadow-sm transition-all border ${userCity && userCity !== 'All Cities' && userCity !== 'Global' ? 'bg-[#FAD8DC]/30 border-[#E7364D] text-[#E7364D]' : 'bg-[#333333] border-[#333333] text-[#FFFFFF] hover:bg-[#E7364D] hover:border-[#E7364D]'}`}
                        >
                            <Navigation size={14} className="mr-2 -rotate-45 shrink-0"/> 
                            {userCity === 'Loading...' || userCity === 'Detecting...' ? 'Detecting...' : (userCity === 'All Cities' ? 'Global' : userCity)} 
                            <ChevronDown size={16} className={`ml-2 transition-transform ${isLocationDropdownOpen ? 'rotate-180' : ''}`}/>
                        </button>
                        {isLocationDropdownOpen && <div className="absolute left-0 mt-2 z-50"><LocationDropdown /></div>}
                    </div>

                    {/* Date Dropdown */}
                    <div className="relative">
                        <button 
                            onClick={() => { setActiveDropdown(activeDropdown === 'dates' ? null : 'dates'); setLocationDropdownOpen(false); }}
                            className={`px-5 py-2.5 rounded-full text-[14px] font-bold flex items-center whitespace-nowrap shadow-sm transition-all border ${performerFilters.dateRange?.from ? 'bg-[#FAD8DC]/30 border-[#E7364D] text-[#E7364D]' : 'bg-[#FFFFFF] border-[#A3A3A3]/50 text-[#333333] hover:border-[#E7364D] hover:text-[#E7364D]'}`}
                        >
                            <Calendar size={14} className="mr-2 shrink-0" />
                            {getDateDisplayLabel()}
                            <ChevronDown size={16} className={`ml-2 transition-transform ${activeDropdown === 'dates' ? 'rotate-180' : ''}`}/>
                        </button>
                        <AnimatePresence>
                            {activeDropdown === 'dates' && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute left-0 mt-2 w-56 bg-[#FFFFFF] rounded-[12px] shadow-[0_10px_30px_rgba(51,51,51,0.15)] border border-[#A3A3A3]/20 py-2 z-50 overflow-hidden">
                                    <button onClick={() => clearDateFilter()} className="w-full text-left px-5 py-3 text-[14px] font-bold text-[#626262] hover:bg-[#FAD8DC]/20 hover:text-[#E7364D] transition-colors border-b border-[#A3A3A3]/10">All dates</button>
                                    <button onClick={() => handleDateSelection('today')} className="w-full text-left px-5 py-3 text-[14px] font-bold text-[#626262] hover:bg-[#FAD8DC]/20 hover:text-[#E7364D] transition-colors">Today</button>
                                    <button onClick={() => handleDateSelection('tomorrow')} className="w-full text-left px-5 py-3 text-[14px] font-bold text-[#626262] hover:bg-[#FAD8DC]/20 hover:text-[#E7364D] transition-colors">Tomorrow</button>
                                    <button onClick={() => handleDateSelection('weekend')} className="w-full text-left px-5 py-3 text-[14px] font-bold text-[#626262] hover:bg-[#FAD8DC]/20 hover:text-[#E7364D] transition-colors border-b border-[#A3A3A3]/10">This weekend</button>
                                    <button onClick={() => handleDateSelection('custom')} className="w-full text-left px-5 py-3 text-[14px] font-bold text-[#333333] hover:bg-[#FAD8DC]/20 hover:text-[#E7364D] transition-colors flex items-center"><Filter size={14} className="mr-2"/> Custom dates</button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Hide Sold Out Toggle */}
                    <button 
                        onClick={() => setPerformerFilter('hideSoldOut', !performerFilters.hideSoldOut)}
                        className={`px-5 py-2.5 rounded-full text-[14px] font-bold flex items-center whitespace-nowrap shadow-sm transition-all border ${performerFilters.hideSoldOut ? 'bg-[#333333] border-[#333333] text-[#FFFFFF]' : 'bg-[#FFFFFF] border-[#A3A3A3]/50 text-[#333333] hover:border-[#E7364D] hover:text-[#E7364D]'}`}
                    >
                        Hide sold out
                    </button>
                    
                    {/* Active Filter Clear Button */}
                    {(performerFilters.dateRange?.from || performerFilters.hideSoldOut) && (
                        <button 
                            onClick={() => { clearDateFilter(); setPerformerFilter('hideSoldOut', false); }}
                            className="ml-auto text-[12px] font-bold text-[#A3A3A3] hover:text-[#E7364D] transition-colors flex items-center"
                        >
                            <X size={14} className="mr-1"/> Clear Filters
                        </button>
                    )}
                </div>

                {/* SECTION 4: EVENT LIST HEADER */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-[18px] md:text-[20px] font-black text-[#333333] tracking-tight flex items-center gap-3">
                        {filteredEvents.length} events matching filters
                        {isAdmin && (
                            <span className="hidden md:inline-flex items-center gap-1 bg-[#FAD8DC]/30 text-[#E7364D] border border-[#E7364D]/50 px-2 py-0.5 rounded-[4px] text-[10px] font-black uppercase tracking-widest">
                                <ShieldAlert size={12} /> Admin
                            </span>
                        )}
                    </h2>
                </div>

                {/* SECTION 5: MAIN EVENT LEDGER */}
                <div className="flex flex-col gap-3 mb-12">
                    {showLoader ? (
                        <div className="w-full py-20 flex flex-col items-center justify-center border border-[#A3A3A3]/20 rounded-[16px] bg-[#FFFFFF]/80 backdrop-blur-sm shadow-sm">
                            <Loader2 size={32} className="text-[#E7364D] animate-spin mb-4" />
                            <p className="text-[14px] font-bold text-[#333333]">Syncing live secure inventory...</p>
                        </div>
                    ) : filteredEvents.length === 0 ? (
                        <div className="w-full py-16 flex flex-col items-center justify-center bg-[#FFFFFF]/80 backdrop-blur-sm border border-[#A3A3A3]/20 rounded-[16px] shadow-sm">
                            <ShieldCheck size={48} className="text-[#A3A3A3] mb-4" />
                            <h3 className="text-[18px] font-black text-[#333333]">No Active Events Found</h3>
                            <p className="text-[14px] text-[#626262] mt-2 text-center max-w-sm">Try adjusting your location, dates, or sold-out filters.</p>
                        </div>
                    ) : (
                        paginatedEvents.map((m, index) => {
                            const displayPrice = m.startingPrice !== null && m.startingPrice !== undefined ? m.startingPrice : m.price || m.minPrice;
                            const hasTickets = displayPrice !== null && displayPrice !== undefined;
                            const formattedPrice = hasTickets ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(displayPrice) : null;
                            const relativeLabel = getRelativeDateLabel(m.commence_time || m.eventTimestamp);
                            
                            const isHottest = index === 0 && !performerFilters.hideSoldOut; // Only show hottest on default sort
                            const isSellingOut = (index === 1 || index === 2) && hasTickets;
                            
                            const dObj = new Date(m.commence_time || m.eventTimestamp);
                            const isWeekend = !isNaN(dObj) && (dObj.getDay() === 0 || dObj.getDay() === 6);

                            return (
                                <div 
                                    key={m.id} 
                                    onClick={(e) => handleEventClick(e, m.id)}
                                    className="relative bg-[#FFFFFF] border border-[#A3A3A3]/30 rounded-[16px] p-4 flex flex-col md:flex-row md:items-center hover:shadow-[0_8px_30px_rgba(51,51,51,0.08)] hover:border-[#E7364D] transition-all cursor-pointer group/item z-10"
                                >
                                    {isAdmin && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedAdminEvent(m);
                                                setAdminModalOpen(true);
                                            }}
                                            className="absolute -top-3 -right-3 md:top-1/2 md:-translate-y-1/2 md:right-4 z-[60] bg-[#333333] text-[#FFFFFF] p-2.5 rounded-full shadow-[0_4px_15px_rgba(51,51,51,0.2)] opacity-100 md:opacity-0 group-hover/item:opacity-100 transition-all hover:scale-110 hover:bg-[#E7364D]"
                                            title="God Mode: Edit Event"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                    )}

                                    {/* Exact Booknshow Date Tear-off */}
                                    <div className="flex items-center flex-1">
                                        <div className="flex flex-col items-center justify-center pr-5 md:pr-6 border-r border-[#A3A3A3]/20 min-w-[75px]">
                                            <span className="text-[13px] font-bold text-[#E7364D] uppercase">{getMonthStr(m.commence_time || m.eventTimestamp)}</span>
                                            <span className="text-[28px] font-black text-[#333333] leading-none my-0.5">{getDayNum(m.commence_time || m.eventTimestamp)}</span>
                                            <span className="text-[12px] text-[#A3A3A3] font-bold uppercase">{getDowStr(m.commence_time || m.eventTimestamp)}</span>
                                        </div>
                                        
                                        {/* Event Details */}
                                        <div className="pl-5 md:pl-6 flex-1 min-w-0">
                                            <h3 className="text-[16px] md:text-[18px] font-black text-[#333333] leading-tight mb-1 truncate group-hover/item:text-[#E7364D] transition-colors pr-8">
                                                {m.title || m.eventName || `${m.t1} vs ${m.t2}`}
                                            </h3>
                                            <p className="text-[13px] text-[#626262] flex items-center mb-2.5 truncate font-medium">
                                                {getTimeStr(m.commence_time || m.eventTimestamp)} <span className="mx-1.5 text-[#A3A3A3]">•</span> <MapPin size={12} className="mr-1 shrink-0 text-[#A3A3A3]" /> <span className="truncate">{m.stadium || m.loc}, {m.location?.split(',')[0] || m.city}</span>
                                            </p>
                                            
                                            {/* Dynamic Tags */}
                                            <div className="flex flex-wrap gap-2 items-center">
                                                {relativeLabel && (
                                                    <div className="flex items-center bg-[#F5F5F5] border border-[#A3A3A3]/20 text-[#333333] px-2 py-0.5 rounded-[6px] text-[11px] font-bold">
                                                        <Calendar size={12} className="mr-1.5 text-[#A3A3A3]"/> {relativeLabel}
                                                    </div>
                                                )}
                                                {isHottest && (
                                                    <div className="flex items-center bg-[#FAD8DC]/30 text-[#E7364D] px-2 py-0.5 rounded-[6px] text-[11px] font-bold border border-[#E7364D]/20 shadow-sm">
                                                        <Flame size={12} className="mr-1.5"/> Hottest event
                                                    </div>
                                                )}
                                                {isSellingOut && (
                                                    <div className="flex items-center bg-[#333333] text-[#FFFFFF] px-2 py-0.5 rounded-[6px] text-[11px] font-bold shadow-sm">
                                                        <Clock size={12} className="mr-1.5"/> Few tickets left
                                                    </div>
                                                )}
                                                {isWeekend && !isSellingOut && !isHottest && (
                                                    <div className="flex items-center bg-[#F5F5F5] border border-[#A3A3A3]/20 text-[#333333] px-2 py-0.5 rounded-[6px] text-[11px] font-bold">
                                                        <Calendar size={12} className="mr-1.5 text-[#A3A3A3]"/> This weekend
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* See Tickets Button mapped to Live Inventory */}
                                    <div className="mt-4 md:mt-0 pt-4 md:pt-0 border-t border-[#A3A3A3]/20 md:border-t-0 flex justify-end shrink-0 md:pl-4 md:pr-12">
                                        {hasTickets ? (
                                            <div className="flex items-center md:flex-col gap-4 md:gap-0 w-full md:w-auto">
                                                <div className="flex flex-col items-start md:items-end flex-1 md:flex-none md:mb-1.5">
                                                    <span className="text-[10px] font-bold text-[#A3A3A3] uppercase tracking-widest">Starting from</span>
                                                    <span className="text-[20px] font-black text-[#333333] group-hover/item:text-[#E7364D] transition-colors">{formattedPrice}</span>
                                                </div>
                                                <button className="w-auto px-6 py-2.5 rounded-[8px] font-black text-[14px] bg-[#E7364D] text-[#FFFFFF] group-hover/item:bg-[#EB5B6E] transition-all shadow-[0_4px_10px_rgba(231,54,77,0.2)] shrink-0 whitespace-nowrap">
                                                    See tickets
                                                </button>
                                            </div>
                                        ) : (
                                            <button disabled className="w-full md:w-auto px-6 py-2.5 rounded-[8px] font-bold text-[14px] border border-[#E7364D]/50 text-[#E7364D] bg-[#FAD8DC]/30 cursor-not-allowed">
                                                Sold out
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* SECTION 6: PAGINATION CONTROLS */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mb-16 relative z-10">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-10 h-10 flex items-center justify-center text-[#A3A3A3] hover:text-[#333333] disabled:opacity-30">
                            <ChevronLeft size={20} />
                        </button>
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                            const page = i + 1;
                            return (
                                <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 flex items-center justify-center rounded-full text-[14px] font-bold transition-colors shadow-sm border ${page === currentPage ? 'bg-[#E7364D] text-[#FFFFFF] border-[#E7364D]' : 'bg-[#FFFFFF] text-[#333333] border-[#A3A3A3]/30 hover:border-[#E7364D] hover:text-[#E7364D]'}`}>
                                    {page}
                                </button>
                            );
                        })}
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-10 h-10 flex items-center justify-center text-[#A3A3A3] hover:text-[#333333] disabled:opacity-30">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}

                {/* SECTION 7: DYNAMIC FANS ALSO LOVE CAROUSEL */}
                {fansAlsoLove.length > 0 && (
                    <div className="mb-16 relative z-10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[20px] md:text-[24px] font-black text-[#333333] tracking-tight">
                                <strong className="text-[#E7364D]">{getDisplayName()}</strong> fans also love
                            </h2>
                        </div>
                        
                        <div className="flex overflow-x-auto custom-scrollbar space-x-4 pb-4 snap-x">
                            {fansAlsoLove.map((item, idx) => (
                                <div key={idx} className="min-w-[240px] max-w-[240px] cursor-pointer group snap-start" onClick={() => navigate(`/performer/${encodeURIComponent(item.name)}`)}>
                                    <div className="w-full h-[150px] relative rounded-[16px] overflow-hidden mb-3 border border-[#A3A3A3]/20 shadow-sm group-hover:shadow-[0_10px_30px_rgba(51,51,51,0.1)] transition-all bg-[#333333]">
                                        <img src={getSafeImage(item.imageId)} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                                    </div>
                                    <h3 className="font-black text-[#333333] text-[16px] leading-tight truncate group-hover:text-[#E7364D] transition-colors">{item.name}</h3>
                                    <p className="text-[13px] text-[#626262] font-medium mt-1">{item.events.length} upcoming events</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </motion.div>
    );
}