import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import { useSellerStore } from '../../store/useSellerStore';
import SearchDropdown from '../../components/SearchDropdown';
import SellerEventCard from '../../components/SellerEventCard';

export default function Home() {
    const { 
        searchQuery, setSearchQuery, 
        fetchLiveEvents, 
        fetchIPLEvents, iplEvents, isLoadingIPLEvents 
    } = useSellerStore();
    
    const navigate = useNavigate();

    // Fetch both the real-time search data and the dedicated IPL feed on mount
    useEffect(() => {
        fetchLiveEvents();
        fetchIPLEvents();
    }, [fetchLiveEvents, fetchIPLEvents]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/create-listing?q=${encodeURIComponent(searchQuery)}`);
        } else {
            navigate('/create-listing');
        }
    };

    // FEATURE UPDATE: Dynamic Performer Catalog Routing
    // Replaces static creation linking with the 1:1 Viagogo team catalog funnel
    const handleSellClick = (event) => {
        const teamSlug = event.t1 ? event.t1.replace(/\s+/g, '-') : 'Event';
        navigate(`/sell/performer/${encodeURIComponent(teamSlug)}`);
    };

    return (
        <div className="relative w-full min-h-screen bg-white font-sans overflow-hidden flex flex-col">
            
            {/* 1. TOPOGRAPHIC BACKGROUND SVG WAVES (Faint Mobile Background) */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.03]">
                <svg className="absolute -left-32 top-0 h-[100%] w-[800px]" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <circle cx="0" cy="50" r="20" fill="none" stroke="#000" strokeWidth="0.2" />
                    <circle cx="0" cy="50" r="40" fill="none" stroke="#000" strokeWidth="0.2" />
                    <circle cx="0" cy="50" r="60" fill="none" stroke="#000" strokeWidth="0.2" />
                    <circle cx="0" cy="50" r="80" fill="none" stroke="#000" strokeWidth="0.2" />
                </svg>
                <svg className="absolute -right-32 bottom-0 h-[100%] w-[800px]" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <circle cx="100" cy="80" r="20" fill="none" stroke="#000" strokeWidth="0.2" />
                    <circle cx="100" cy="80" r="40" fill="none" stroke="#000" strokeWidth="0.2" />
                    <circle cx="100" cy="80" r="60" fill="none" stroke="#000" strokeWidth="0.2" />
                    <circle cx="100" cy="80" r="80" fill="none" stroke="#000" strokeWidth="0.2" />
                </svg>
            </div>

            <main className="relative z-10 flex-1 flex flex-col items-center justify-start pt-16 md:pt-24 px-5 w-full max-w-[1200px] mx-auto pb-20">
                
                {/* 2. MAIN HERO CONTENT (1:1 Mobile Typography Replica) */}
                <h1 className="text-[36px] md:text-[56px] font-black text-[#1a1a1a] mb-2 tracking-tight text-center leading-tight">
                    Sell your tickets
                </h1>
                
                <p className="text-[15px] md:text-[18px] text-[#1a1a1a] font-medium mb-8 text-center max-w-2xl px-2">
                    parbet is the world's largest secondary marketplace for tickets to live events
                </p>

                {/* Central Search Bar */}
                <div className="relative w-full max-w-[800px] mb-16">
                    <form 
                        onSubmit={handleSearch}
                        className="w-full bg-white border border-[#cccccc] rounded-[8px] h-[52px] md:h-[56px] flex items-center px-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus-within:border-[#458731] focus-within:ring-1 focus-within:ring-[#458731] group transition-all"
                    >
                        <Search size={18} className="text-gray-500 shrink-0 group-focus-within:text-[#458731]" />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search your event and start selling" 
                            className="flex-1 h-full outline-none text-[15px] md:text-[16px] text-[#1a1a1a] ml-3 placeholder-gray-500 bg-transparent"
                        />
                    </form>
                    {/* LIVE API SEARCH DROPDOWN */}
                    <SearchDropdown />
                </div>

                {/* 3. VALUE PROPOSITIONS: "Selling with Viagogo Makes Sense" */}
                <div className="w-full flex flex-col items-center mb-16">
                    <h2 className="text-[20px] font-bold text-[#1a1a1a] mb-10 text-center tracking-tight">
                        Selling with parbet Makes Sense
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 w-full px-4">
                        
                        {/* Prop 1: Quick & Easy */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 mb-4 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-12 h-12" fill="#eaf4d9" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                </svg>
                            </div>
                            <h3 className="text-[16px] font-bold text-[#1a1a1a] mb-2">Quick & Easy</h3>
                            <p className="text-[15px] text-[#54626c] leading-relaxed">Sell event tickets from any device in a few steps</p>
                        </div>

                        {/* Prop 2: Massive Audience */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 mb-4 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-14 h-14" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="12" rx="2" fill="#eaf4d9" />
                                    <path d="M3 8h18 M8 4v4 M16 4v4" />
                                    <circle cx="8" cy="20" r="2" />
                                    <circle cx="16" cy="20" r="2" />
                                    <circle cx="12" cy="18" r="2" />
                                    <path d="M5 22c0-1.5 1-3 3-3 M19 22c0-1.5-1-3-3-3 M12 22v-2" />
                                </svg>
                            </div>
                            <h3 className="text-[16px] font-bold text-[#1a1a1a] mb-2">Massive Audience</h3>
                            <p className="text-[15px] text-[#54626c] leading-relaxed">World's largest secondary marketplace for live event tickets</p>
                        </div>

                        {/* Prop 3: Secure */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 mb-4 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-14 h-14" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#eaf4d9" />
                                    <path d="M4 12h16 M4 8h16" strokeDasharray="2 2" />
                                </svg>
                            </div>
                            <h3 className="text-[16px] font-bold text-[#1a1a1a] mb-2">Secure</h3>
                            <p className="text-[15px] text-[#54626c] leading-relaxed">We'll help get your tickets to buyers wherever you are</p>
                        </div>

                        {/* Prop 4: Get paid */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 mb-4 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-14 h-14" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="8" fill="#eaf4d9" />
                                    <path d="M12 8v8 M10 10h4 M10 14h4" />
                                    <path d="M16 16l4-4-4-4 M20 12H12" />
                                </svg>
                            </div>
                            <h3 className="text-[16px] font-bold text-[#1a1a1a] mb-2">Get paid</h3>
                            <p className="text-[15px] text-[#54626c] leading-relaxed">Receive payment from parbet directly</p>
                        </div>

                    </div>
                </div>

                {/* 4. REAL-TIME IPL EVENT INTEGRATION (Mobile Catalog View) */}
                <div className="w-full max-w-[1000px] mt-8">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h2 className="text-[24px] font-black text-[#1a1a1a] tracking-tight">
                            Hot Events in India
                        </h2>
                        <button 
                            onClick={() => navigate('/ipl')}
                            className="text-[#458731] font-bold text-[14px] hover:underline"
                        >
                            View All IPL
                        </button>
                    </div>

                    <div className="w-full border border-[#e2e2e2] rounded-[8px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                        <div className="bg-[#f8f9fa] border-b border-[#e2e2e2] px-6 py-4 text-[13px] text-[#54626c] font-medium">
                            <span className="font-bold text-[#1a1a1a]">{isLoadingIPLEvents ? 'Loading' : iplEvents.length}</span> active listings
                        </div>

                        {isLoadingIPLEvents ? (
                            <div className="flex flex-col items-center justify-center py-16 bg-white">
                                <Loader2 className="animate-spin text-[#458731] mb-3" size={28} />
                                <p className="text-[#54626c] text-[14px] font-medium">Syncing live sports network...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col divide-y divide-[#e2e2e2] bg-white">
                                {iplEvents.slice(0, 10).map((event) => (
                                    <SellerEventCard 
                                        key={event.id} 
                                        event={event} 
                                        onClick={handleSellClick} 
                                    />
                                ))}
                                {iplEvents.length === 0 && (
                                    <div className="py-12 text-center text-[#54626c] text-[15px]">
                                        No active events found. Be the first to list!
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
}