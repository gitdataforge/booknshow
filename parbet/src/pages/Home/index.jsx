import React, { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useAppStore } from '../../store/useStore';

// Newly Created Exact-Match Components
import ViagogoHeroCarousel from '../../components/ViagogoHeroCarousel';
import ViagogoFilterBar from '../../components/ViagogoFilterBar';
import ViagogoEventCard from '../../components/ViagogoEventCard';
import ViagogoCategoryCard from '../../components/ViagogoCategoryCard';

export default function Home() {
    const navigate = useNavigate();
    const { 
        isAuthenticated,
        liveMatches,
        fetchLocationAndMatches,
        searchQuery,
        setLocationDropdownOpen,
        setSearchQuery,
        toggleFavorite
    } = useAppStore();

    // Initial Data Fetch
    useEffect(() => {
        if (liveMatches.length === 0) fetchLocationAndMatches();
    }, [fetchLocationAndMatches, liveMatches.length]);

    // STRICT CRICKET & KABADDI CONTENT FILTERING
    const sportsMatches = useMemo(() => {
        return liveMatches.filter(m => {
            if (!searchQuery) {
                const str = `${m.t1} ${m.t2} ${m.league} ${m.sport}`.toLowerCase();
                return str.includes('cricket') || str.includes('ipl') || str.includes('t20') || str.includes('icc') || str.includes('test') || str.includes('odi') || str.includes('kabaddi') || str.includes('pkl');
            }
            const q = searchQuery.toLowerCase();
            const str = `${m.t1} ${m.t2} ${m.league} ${m.sport}`.toLowerCase();
            return str.includes(q) && (str.includes('cricket') || str.includes('ipl') || str.includes('t20') || str.includes('icc') || str.includes('test') || str.includes('odi') || str.includes('kabaddi') || str.includes('pkl'));
        });
    }, [liveMatches, searchQuery]);

    // Grouping by League/Tournament for Rails
    const groupedEvents = useMemo(() => {
        const groups = {};
        sportsMatches.forEach(e => {
            const key = e.league || e.t1;
            if (!groups[key]) groups[key] = { id: e.id, name: key, imageId: e.t1, events: [] };
            groups[key].events.push(e);
        });

        return Object.values(groups).map(g => {
            g.events.sort((a, b) => new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime());
            const first = g.events[0];
            const formatDateStr = (dStr) => {
                const d = new Date(dStr);
                return `${d.toLocaleDateString('en-US', {weekday: 'short'})}, ${d.toLocaleDateString('en-US', {month: 'short'})} ${d.getDate()} • ${d.toLocaleTimeString('en-US', {hour: 'numeric', minute:'2-digit'})}`;
            };
            return { ...g, dateStr: formatDateStr(first.commence_time), count: g.events.length, firstEventId: first.id };
        });
    }, [sportsMatches]);

    const kabaddiGroups = useMemo(() => {
        return groupedEvents.filter(g => g.name.toLowerCase().includes('kabaddi') || g.name.toLowerCase().includes('pkl'));
    }, [groupedEvents]);

    // STRICT ROUTING GUARD
    const handleRestrictedAction = (e, obj) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            toggleFavorite(obj);
        }
    };

    // Reusable Event Rail with Compact Mobile Design
    const EventRail = ({ title, groups }) => {
        const scrollRef = useRef(null);
        const scroll = (direction) => {
            if (scrollRef.current) scrollRef.current.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
        };
        if (groups.length === 0) return null;

        return (
            <div className="mb-8 md:mb-14 relative group">
                <h2 className="text-[20px] md:text-[24px] font-bold text-[#1a1a1a] mb-4 md:mb-5 tracking-tight">{title}</h2>
                <div className="relative">
                    <div ref={scrollRef} className="flex overflow-x-auto hide-scrollbar space-x-4 md:space-x-5 pb-2 snap-x">
                        {groups.map((g, idx) => (
                            <ViagogoEventCard 
                                key={idx} 
                                group={g} 
                                onClick={() => navigate(`/event?id=${g.firstEventId}`)} 
                            />
                        ))}
                    </div>
                    <button onClick={() => scroll('right')} className="absolute -right-5 top-[40%] -translate-y-1/2 w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:scale-105 transition-transform z-10 hidden lg:flex opacity-0 group-hover:opacity-100">
                        <ChevronDown size={24} className="-rotate-90" />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full bg-white pb-10 md:pb-20 font-sans">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                
                {/* 1. HERO CAROUSEL: Tight pt-2 to sit directly below the mobile search bar */}
                <div className="pt-2 md:pt-4">
                    <ViagogoHeroCarousel />
                </div>

                {/* 2. FILTER BAR: Tight mt-2 and mb-5 to match dense Viagogo vertical rhythm */}
                <div className="mt-2 mb-5 md:mt-4 md:mb-8">
                    <ViagogoFilterBar />
                </div>

                {/* 3. DARK PROMO BANNER (1:1 Spotify UI Replica tightly stacked under filters) */}
                <div className="w-full bg-black rounded-[12px] p-5 md:p-6 mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-center cursor-pointer hover:shadow-xl transition-all">
                    <div className="flex flex-col md:flex-row items-center w-full md:w-auto justify-center md:justify-start mb-5 md:mb-0 space-y-4 md:space-y-0 md:space-x-5">
                        <div className="flex items-center space-x-3">
                            <svg viewBox="0 0 24 24" width="32" height="32" fill="#1DB954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.36.18.54.84.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.239.54-.959.72-1.56.3z"/></svg>
                            <span className="font-bold text-[20px] md:text-[24px] text-white tracking-tight">Spotify</span>
                        </div>
                        <div className="text-center md:text-left border-t md:border-t-0 md:border-l border-gray-800 pt-4 md:pt-0 md:pl-5">
                            <h3 className="font-bold text-[14px] md:text-[16px] text-white leading-tight">Connect your Spotify account</h3>
                            <p className="text-[12px] md:text-[14px] text-gray-400 mt-1">Discover matches from teams you follow</p>
                        </div>
                    </div>
                    <button className="bg-[#1ed760] text-black font-bold px-8 py-3 rounded-full text-[14px] hover:bg-[#1cdf5f] transition-colors w-full md:w-auto">
                        Connect Spotify
                    </button>
                </div>

                {/* 4. JUST FOR YOU RAIL */}
                <EventRail title="Just for You" groups={groupedEvents} />

                {/* 5. POPULAR CATEGORIES GRID */}
                <div className="mb-8 md:mb-14">
                    <h2 className="text-[20px] md:text-[24px] font-bold text-[#1a1a1a] mb-4 md:mb-5 tracking-tight">Popular categories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        {[
                            { name: 'T20 Cricket', img: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80' },
                            { name: 'Test Matches', img: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=600&q=80' },
                            { name: 'Pro Kabaddi', img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80' },
                            { name: 'IPL 2026', img: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=600&q=80' }
                        ].map((cat, idx) => (
                            <ViagogoCategoryCard 
                                key={idx} 
                                name={cat.name} 
                                img={cat.img} 
                                onClick={() => { setLocationDropdownOpen(false); setSearchQuery(cat.name.split(' ')[0]); }} 
                            />
                        ))}
                    </div>
                </div>

                {/* 6. PRO KABADDI RAIL */}
                {kabaddiGroups.length > 0 && (
                    <EventRail title="Pro Kabaddi" groups={kabaddiGroups} />
                )}

                {/* 7. APP DOWNLOAD BANNER */}
                <div className="w-full bg-[#eff4eb] rounded-[16px] p-6 md:p-10 mb-8 flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
                    <div className="md:w-1/2 z-10 mb-6 md:mb-0 text-center md:text-left">
                        <h2 className="text-[24px] md:text-[32px] font-black text-[#1a1a1a] mb-2 leading-tight tracking-tight">Download the parbet app</h2>
                        <p className="text-[14px] md:text-[16px] text-gray-600 font-medium">Favorites, tickets, and more in your pocket</p>
                    </div>
                    
                    <div className="flex items-center space-x-3 z-10 w-full md:w-auto justify-center">
                        <div className="flex flex-col space-y-2">
                            <button className="bg-black text-white px-4 py-2 rounded-[8px] flex items-center space-x-2 hover:bg-gray-800 transition-colors w-[130px]">
                                <div className="flex flex-col items-start leading-none">
                                    <span className="text-[8px]">Download on</span>
                                    <span className="text-[12px] font-bold">App Store</span>
                                </div>
                            </button>
                            <button className="bg-black text-white px-4 py-2 rounded-[8px] flex items-center space-x-2 hover:bg-gray-800 transition-colors w-[130px]">
                                <div className="flex flex-col items-start leading-none">
                                    <span className="text-[8px]">GET IT ON</span>
                                    <span className="text-[12px] font-bold">Google Play</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}