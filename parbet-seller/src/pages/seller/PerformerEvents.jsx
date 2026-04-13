import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, MapPin, Calendar, Loader2 } from 'lucide-react';
import { useSellerStore } from '../../store/useSellerStore';

export default function PerformerEvents() {
    const { performerName } = useParams();
    const navigate = useNavigate();
    
    // Decode URL slug (e.g., "Mumbai-Indians" -> "Mumbai Indians")
    const decodedName = useMemo(() => {
        return performerName ? performerName.replace(/-/g, ' ') : 'Event';
    }, [performerName]);

    // FEATURE 1: Global Store Integration (Zero Mock Data)
    const { iplEvents, fetchIPLEvents, isLoadingIPLEvents } = useSellerStore();
    const [activeTab, setActiveTab] = useState('Events');

    // Trigger strict data fetch if the store is empty
    useEffect(() => {
        if (iplEvents.length === 0) {
            fetchIPLEvents();
        }
    }, [fetchIPLEvents, iplEvents.length]);

    // FEATURE 2: Mathematical Array Filtering Engine
    const filteredEvents = useMemo(() => {
        return iplEvents.filter(event => 
            event.t1?.toLowerCase().includes(decodedName.toLowerCase()) || 
            event.t2?.toLowerCase().includes(decodedName.toLowerCase()) ||
            event.league?.toLowerCase().includes(decodedName.toLowerCase())
        );
    }, [iplEvents, decodedName]);

    // FEATURE 3: Exact Viagogo Chronological Date Parser
    const parseDateBlock = (isoString) => {
        const d = new Date(isoString);
        if (isNaN(d)) return { date: 'TBA', dayTime: '' };
        
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        
        const dateNum = d.getDate().toString().padStart(2, '0');
        const month = monthNames[d.getMonth()];
        const day = dayNames[d.getDay()];
        const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

        return {
            date: `${dateNum} ${month}`, // e.g., "16 APR"
            dayTime: `${day}\n${time}`    // e.g., "THU\n19:30"
        };
    };

    // FEATURE 4: Seller Redirection Handler
    const handleSellClick = (event) => {
        // Generates deterministic ID mapping to the Main Site
        const eventId = `${event.t1}-${event.t2 || 'event'}-${event.commence_time?.split('T')[0]}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        // Navigate to the creation flow with pre-filled context
        navigate(`/create-listing?eventId=${eventId}&eventName=${encodeURIComponent(event.t1 + (event.t2 ? ` vs ${event.t2}` : ''))}&venue=${encodeURIComponent(event.loc)}&date=${event.commence_time}`);
    };

    return (
        <div className="min-h-screen bg-white font-sans text-[#1a1a1a] flex flex-col w-full">
            
            {/* FEATURE 5: 1:1 Viagogo Faded Dark Stadium Hero Banner */}
            <div className="relative w-full h-[240px] md:h-[280px] bg-[#222222] overflow-hidden flex items-end">
                {/* High-Quality Cricket Stadium Background */}
                <img 
                    src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2000&auto=format&fit=crop" 
                    alt="Cricket Stadium" 
                    className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
                />
                
                {/* Giant Watermark Text Background */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full overflow-hidden pointer-events-none select-none">
                    <h1 className="text-[120px] md:text-[180px] font-black text-white/5 whitespace-nowrap tracking-tighter ml-[-20px]">
                        {decodedName.toUpperCase()}
                    </h1>
                </div>

                {/* Hero Foreground Text */}
                <div className="relative z-10 w-full max-w-[1100px] mx-auto px-4 pb-6 md:pb-8">
                    <h2 className="text-white text-[28px] md:text-[42px] font-black tracking-tight leading-none">
                        Sell {decodedName} Tickets
                    </h2>
                </div>
            </div>

            {/* FEATURE 6: Strict UI Filter Navigation Tabs */}
            <div className="w-full border-b border-[#e2e2e2] sticky top-0 bg-white z-20 shadow-sm">
                <div className="max-w-[1100px] mx-auto px-4 py-3 md:py-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                        {['Events', 'Parking', 'VIP', 'Others'].map((tab) => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2 rounded-full text-[14px] font-medium transition-colors whitespace-nowrap border ${
                                    activeTab === tab 
                                    ? 'bg-[#8cc63f] border-[#8cc63f] text-white' 
                                    : 'bg-white border-[#cccccc] text-[#54626c] hover:bg-gray-50'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    
                    <button className="flex items-center gap-2 px-4 py-2 border border-[#cccccc] rounded-full text-[14px] text-[#54626c] bg-white hover:bg-gray-50 whitespace-nowrap">
                        Sort by date <ChevronDown size={16} />
                    </button>
                </div>
            </div>

            {/* Sub-Header Context Text */}
            <div className="w-full text-center py-4 border-b border-[#e2e2e2] bg-[#fdfdfd]">
                <p className="text-[14px] text-[#1a1a1a]">
                    No events within <span className="underline decoration-dashed decoration-gray-400 cursor-pointer">50</span> miles of <span className="underline decoration-dashed decoration-gray-400 cursor-pointer">New York</span> for <span className="flex items-center justify-center gap-1 inline-flex cursor-pointer underline decoration-dashed decoration-gray-400">all dates <ChevronDown size={14} className="mt-0.5" /></span>
                </p>
            </div>

            {/* FEATURE 7: Core Page Layout (List + Sidebar) */}
            <div className="max-w-[1100px] mx-auto w-full px-4 py-6 md:py-8 flex flex-col md:flex-row gap-8 items-start">
                
                {/* Left Column: Chronological Event Ledger */}
                <div className="flex-1 w-full min-w-0">
                    <div className="w-full border border-[#cccccc] rounded-[4px] bg-white overflow-hidden shadow-sm">
                        
                        {/* Ledger Header */}
                        <div className="px-5 py-4 bg-[#f9f9f9] border-b border-[#cccccc]">
                            <h3 className="text-[15px] text-[#54626c]">
                                <strong className="text-[#1a1a1a]">{filteredEvents.length}</strong> events in all locations
                            </h3>
                        </div>

                        {/* Loading State */}
                        {isLoadingIPLEvents && filteredEvents.length === 0 && (
                            <div className="p-12 flex flex-col items-center justify-center text-[#54626c]">
                                <Loader2 size={32} className="animate-spin mb-4 text-[#8cc63f]" />
                                <p className="text-[15px] font-medium">Fetching real-time inventory...</p>
                            </div>
                        )}

                        {/* No Events State */}
                        {!isLoadingIPLEvents && filteredEvents.length === 0 && (
                            <div className="p-12 flex flex-col items-center justify-center text-[#54626c] text-center">
                                <Calendar size={48} className="mb-4 text-gray-300" />
                                <p className="text-[18px] font-bold text-[#1a1a1a] mb-2">No events found</p>
                                <p className="text-[14px]">There are currently no active {decodedName} events available for selling.</p>
                            </div>
                        )}

                        {/* FEATURE 8: 1:1 Replica Event Row Mapping */}
                        {!isLoadingIPLEvents && filteredEvents.map((event, index) => {
                            const { date, dayTime } = parseDateBlock(event.commence_time);
                            
                            return (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={event.id || index}
                                    onClick={() => handleSellClick(event)}
                                    className="flex flex-col sm:flex-row items-start sm:items-center p-0 border-b border-[#e2e2e2] last:border-b-0 hover:bg-[#f9fdf7] cursor-pointer transition-colors group"
                                >
                                    {/* Date Block */}
                                    <div className="w-full sm:w-[100px] flex flex-row sm:flex-col items-center sm:items-center justify-between sm:justify-center p-4 sm:p-5 border-b sm:border-b-0 sm:border-r border-[#e2e2e2] shrink-0">
                                        <div className="text-[22px] font-black text-[#1a1a1a] tracking-tight leading-none text-center">
                                            {date.split(' ')[0]} <span className="text-[18px] uppercase">{date.split(' ')[1]}</span>
                                        </div>
                                        <div className="text-[11px] text-[#54626c] font-medium uppercase text-center mt-1 whitespace-pre-line leading-snug">
                                            {dayTime}
                                        </div>
                                    </div>

                                    {/* Event Details */}
                                    <div className="flex-1 p-4 sm:p-5 min-w-0">
                                        <h4 className="text-[16px] font-bold text-[#1a1a1a] truncate mb-1.5 group-hover:text-[#0064d2] transition-colors">
                                            {event.t1} {event.t2 && `vs ${event.t2}`}
                                        </h4>
                                        <div className="text-[13px] text-[#54626c] flex items-center gap-1.5 truncate">
                                            <span>{event.loc || 'Stadium TBA'}</span>
                                        </div>
                                        <div className="text-[13px] text-[#54626c] truncate">
                                            {event.city || 'Location TBA'}, {event.country}
                                        </div>
                                    </div>

                                    {/* Action Link */}
                                    <div className="w-full sm:w-auto p-4 sm:p-5 border-t sm:border-t-0 border-[#e2e2e2] flex items-center justify-end shrink-0">
                                        <span className="text-[15px] font-medium text-[#54626c] group-hover:text-[#0064d2] transition-colors">
                                            Sell Tickets
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* FEATURE 9: Right Sidebar (Request an Event) */}
                <div className="w-full md:w-[300px] shrink-0">
                    <h3 className="text-[16px] font-bold text-[#1a1a1a] mb-4">Request an Event</h3>
                    <div className="bg-white rounded-[4px] text-[14px] text-[#1a1a1a] leading-relaxed">
                        Can't find the event you're looking for?
                        <br />
                        <button className="text-[#0064d2] hover:underline mt-1">Tell us about it!</button>
                    </div>
                </div>

            </div>
        </div>
    );
}