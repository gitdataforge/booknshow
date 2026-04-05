import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, ShieldCheck, Ticket, SlidersHorizontal, ChevronDown, Zap, Eye, X, AlertCircle, Flame } from 'lucide-react';
import { useAppStore } from '../../store/useStore';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

// Modular Component Imports
import DynamicStadiumMap from '../../components/DynamicStadiumMap';
import TicketQuantityModal from '../../components/TicketQuantityModal';
import EventFilters from '../../components/EventFilters';

export default function Event() {
    const [searchParams] = useSearchParams();
    const eventId = searchParams.get('id');
    const navigate = useNavigate();
    
    const { 
        liveMatches, 
        fetchLocationAndMatches,
        isTicketQuantityModalOpen,
        setTicketQuantityModalOpen,
        selectedTicketQuantity,
    } = useAppStore();

    const [eventData, setEventData] = useState(null);
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Feature UI States
    const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState(null); // Linked to interactive map
    const [sitTogether, setSitTogether] = useState(true); // Linked to quantity modal
    const [instantDownloadOnly, setInstantDownloadOnly] = useState(false); // Linked to sidebar
    const [clearViewOnly, setClearViewOnly] = useState(false); // Linked to sidebar
    const [sortOrder, setSortOrder] = useState('asc'); // Linked to sidebar
    
    const hasOpenedModal = useRef(false);
    const feedScrollRef = useRef(null);

    useEffect(() => {
        if (liveMatches.length === 0) {
            fetchLocationAndMatches();
        } else if (eventId) {
            const found = liveMatches.find(m => m.id === eventId);
            setEventData(found);
            
            // Trigger pre-selection modal exactly once when event is loaded
            if (found && !hasOpenedModal.current && !isTicketQuantityModalOpen) {
                setTicketQuantityModalOpen(true);
                hasOpenedModal.current = true;
            }
            
            // Fetch real P2P listings for this event from Firebase securely
            const q = query(collection(db, 'listings'), where('eventId', '==', eventId), where('status', '==', 'active'));
            const unsub = onSnapshot(q, (snapshot) => {
                const fetchedListings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setListings(fetchedListings);
                setIsLoading(false);
            });
            return () => unsub();
        }
    }, [eventId, liveMatches, fetchLocationAndMatches, setTicketQuantityModalOpen, isTicketQuantityModalOpen]);

    // Feature 4: Smart Auto-scroll to top when a new section/filter is applied
    useEffect(() => {
        if (feedScrollRef.current) {
            feedScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [activeSection, sortOrder, instantDownloadOnly, clearViewOnly]);

    if (!eventId || (!eventData && !isLoading)) return <div className="min-h-screen p-10 font-bold text-center">Event not found.</div>;

    // Features 1, 3, 6: Master Filtering & Sorting Engine
    const filteredListings = listings.filter(l => {
        // 1. Quantity check
        if (Number(l.quantity) < selectedTicketQuantity) return false;
        
        // 2. Interactive Map Section check
        if (activeSection && (l.section || 'General').toUpperCase().trim() !== activeSection) return false;
        
        // 3. Detailed Sidebar Filters check
        if (instantDownloadOnly && !l.instantDownload) return false; // Requires true if toggle is on
        if (clearViewOnly && l.obstructedView) return false; // Rejects if view is obstructed
        
        // 4. Functional Sit Together logic: filter out explicit split seats if quantity > 1
        if (sitTogether && Number(selectedTicketQuantity) > 1 && l.splitSeats) return false;

        return true;
    }).sort((a, b) => {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    });

    const clearAllFilters = () => {
        setActiveSection(null);
        setInstantDownloadOnly(false);
        setClearViewOnly(false);
    };

    // Calculate best value (cheapest ticket in the currently filtered array)
    const bestValuePrice = filteredListings.length > 0 ? Math.min(...filteredListings.map(l => Number(l.price))) : null;

    return (
        <div className="w-full animate-fade-in pb-10 pt-4">
            
            {/* Extracted Modular Overlays */}
            <TicketQuantityModal sitTogether={sitTogether} setSitTogether={setSitTogether} />
            
            <EventFilters 
                isOpen={isFilterSidebarOpen} 
                onClose={() => setIsFilterSidebarOpen(false)} 
                instantDownloadOnly={instantDownloadOnly}
                setInstantDownloadOnly={setInstantDownloadOnly}
                clearViewOnly={clearViewOnly}
                setClearViewOnly={setClearViewOnly}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                filteredCount={filteredListings.length}
            />

            {/* MAIN SPLIT-SCREEN LAYOUT */}
            <div className="w-full h-[85vh] min-h-[700px] flex flex-col lg:flex-row bg-white rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-200">
                
                {/* Left Side: Modular Dynamic Stadium Map */}
                <div className="hidden lg:flex flex-1 relative flex-col bg-[#F4F6F8]">
                    {/* Header Overlay */}
                    <div className="absolute top-0 left-0 right-0 p-6 z-10 flex justify-between items-start pointer-events-none">
                        <div>
                            <h1 className="text-3xl font-black text-[#1D2B36] drop-shadow-sm mb-1">{eventData?.t1} vs {eventData?.t2}</h1>
                            <p className="text-[15px] text-[#4A5560] font-medium flex items-center">
                                {eventData?.dow}, {eventData?.day} {eventData?.month} • {eventData?.time} • <MapPin size={14} className="mx-1.5 opacity-60"/> {eventData?.loc}
                            </p>
                        </div>
                        <span className="px-3 py-1.5 bg-[#114C2A] text-white text-[11px] font-bold uppercase tracking-widest rounded-lg shadow-sm">Verified Event</span>
                    </div>

                    {/* Integrated Dynamic Map Component mapping real sections */}
                    <DynamicStadiumMap 
                        activeSection={activeSection} 
                        onSectionSelect={setActiveSection} 
                    />
                </div>

                {/* Right Side: P2P Ticket Listings Panel */}
                <div className="w-full lg:w-[450px] xl:w-[500px] flex flex-col bg-white h-full z-20 shadow-[-15px_0_40px_rgba(0,0,0,0.05)] border-l border-gray-200">
                    
                    {/* Top Controls Bar */}
                    <div className="p-5 border-b border-gray-200 flex flex-col bg-white shadow-sm z-30">
                        <div className="flex items-center justify-between mb-3">
                            <button 
                                onClick={() => setTicketQuantityModalOpen(true)} 
                                className="flex items-center space-x-2 bg-white border border-gray-300 text-brand-text px-5 py-2.5 rounded-full font-bold text-[14px] hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
                            >
                                <span>{selectedTicketQuantity} Tickets</span>
                                <ChevronDown size={14} className="opacity-60" />
                            </button>
                            <div className="flex items-center space-x-2">
                                <button className="flex items-center space-x-2 bg-white border border-transparent text-brand-text px-3 py-2.5 rounded-full font-bold text-[14px] hover:bg-gray-50 transition-colors">
                                    <span>Any section</span>
                                    <ChevronDown size={14} className="opacity-60" />
                                </button>
                                <button 
                                    onClick={() => setIsFilterSidebarOpen(true)} 
                                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all text-brand-text shadow-sm relative"
                                >
                                    <SlidersHorizontal size={16} />
                                    {/* Unread filter indicator dot */}
                                    {(instantDownloadOnly || clearViewOnly || sortOrder === 'desc') && (
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#E91E63] rounded-full border-2 border-white"></div>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Feature 2: Active Filter Chips */}
                        <AnimatePresence>
                            {(activeSection || instantDownloadOnly || clearViewOnly) && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }} 
                                    animate={{ opacity: 1, height: 'auto' }} 
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex flex-wrap gap-2 pt-2"
                                >
                                    {activeSection && (
                                        <div className="flex items-center bg-[#EAF4D9] border border-[#C5E1A5] text-[#114C2A] px-3 py-1.5 rounded-full text-[12px] font-bold shadow-sm">
                                            Section {activeSection}
                                            <button onClick={() => setActiveSection(null)} className="ml-2 hover:text-black"><X size={12} /></button>
                                        </div>
                                    )}
                                    {instantDownloadOnly && (
                                        <div className="flex items-center bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-[12px] font-bold shadow-sm">
                                            Instant Download
                                            <button onClick={() => setInstantDownloadOnly(false)} className="ml-2 hover:text-black"><X size={12} /></button>
                                        </div>
                                    )}
                                    {clearViewOnly && (
                                        <div className="flex items-center bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-[12px] font-bold shadow-sm">
                                            Clear View
                                            <button onClick={() => setClearViewOnly(false)} className="ml-2 hover:text-black"><X size={12} /></button>
                                        </div>
                                    )}
                                    <button onClick={clearAllFilters} className="text-[12px] font-bold text-gray-400 hover:text-brand-text transition-colors px-2 py-1.5">
                                        Clear all
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Scrollable Listings Feed */}
                    <div ref={feedScrollRef} className="flex-1 overflow-y-auto bg-[#F8F9FA] p-4 md:p-5 relative scroll-smooth">
                        {isLoading ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#F8F9FA]">
                                <div className="w-10 h-10 border-4 border-[#114C2A] border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="font-bold text-brand-text">Finding best seats...</p>
                            </div>
                        ) : filteredListings.length === 0 ? (
                            <div className="bg-white border border-gray-200 rounded-[20px] p-10 text-center mt-4 shadow-sm">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Ticket size={28} className="text-gray-400" />
                                </div>
                                <h3 className="text-[18px] font-black text-brand-text mb-2 leading-tight">No matching tickets</h3>
                                <p className="text-[14px] text-brand-muted mb-6 font-medium">Try reducing the ticket quantity or clearing your section filter to see more results.</p>
                                <button 
                                    onClick={clearAllFilters} 
                                    className="bg-white border border-gray-300 px-6 py-3 rounded-full font-bold text-[14px] hover:bg-gray-50 transition-colors shadow-sm text-brand-text"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col pb-6 space-y-3">
                                <h4 className="text-[13px] font-bold text-gray-500 uppercase tracking-widest mb-1 px-1">
                                    {filteredListings.length} results sorted by {sortOrder === 'asc' ? 'lowest price' : 'highest price'}
                                </h4>
                                
                                {/* Feature 7: Animated PopLayout Feed Transitions */}
                                <AnimatePresence mode="popLayout">
                                    {filteredListings.map((list) => {
                                        const isBestValue = Number(list.price) === bestValuePrice && sortOrder === 'asc';
                                        
                                        return (
                                            <motion.div 
                                                layout
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                                                whileHover={{ y: -2 }}
                                                key={list.id} 
                                                onClick={() => navigate(`/checkout?listingId=${list.id}`)}
                                                className={`bg-white rounded-[16px] p-5 cursor-pointer border hover:border-[#114C2A] hover:shadow-[0_0_0_1px_#114C2A] transition-all group relative overflow-hidden flex flex-col ${isBestValue ? 'border-[#114C2A]/30 shadow-sm' : 'border-gray-200'}`}
                                            >
                                                {/* Exact Viagogo Green Accent Bar */}
                                                <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors duration-300 ${isBestValue ? 'bg-[#114C2A]' : 'bg-[#114C2A] opacity-0 group-hover:opacity-100'}`}></div>
                                                
                                                <div className="flex justify-between items-start mb-4 pl-2">
                                                    <div className="flex-1 pr-4">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <h3 className="font-black text-brand-text text-[18px] leading-tight">
                                                                Section {list.section || 'General'}
                                                            </h3>
                                                            {/* Feature 6: Best Value Highlighter */}
                                                            {isBestValue && (
                                                                <span className="flex items-center bg-[#FFF1F2] text-[#E91E63] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                                                                    <Flame size={10} className="mr-1"/> Best Value
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-[14px] text-brand-muted font-medium flex flex-wrap items-center gap-2 mt-1">
                                                            <span>Row {list.row || 'Any'}</span>
                                                            <span>•</span>
                                                            <span>{list.quantity} Tickets</span>
                                                            
                                                            {/* Feature 5: Scarcity Warning Engine */}
                                                            {Number(list.quantity) <= 2 && (
                                                                <span className="flex items-center text-[#E91E63] font-bold text-[12px] bg-[#FFF1F2] px-1.5 py-0.5 rounded">
                                                                    <AlertCircle size={12} className="mr-1"/> Only {list.quantity} left
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="text-right flex-shrink-0">
                                                        <span className="block text-[24px] font-black text-brand-text leading-none mb-1">
                                                            ₹{Number(list.price).toLocaleString()}
                                                        </span>
                                                        <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wide">
                                                            /ea
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                {/* Badge Features Row */}
                                                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-100 pl-2">
                                                    <span className="flex items-center text-[12px] font-bold text-[#114C2A] bg-[#EAF4D9] px-2.5 py-1.5 rounded-[6px]">
                                                        <Zap size={14} className="mr-1.5 fill-[#114C2A]"/> Instant download
                                                    </span>
                                                    <span className="flex items-center text-[12px] font-bold text-gray-600 bg-gray-100 px-2.5 py-1.5 rounded-[6px]">
                                                        <Eye size={14} className="mr-1.5 opacity-60"/> Clear view
                                                    </span>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}