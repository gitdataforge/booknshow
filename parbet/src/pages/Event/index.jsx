import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, ShieldCheck, Ticket, SlidersHorizontal, ChevronDown, Zap, Eye, X } from 'lucide-react';
import { useAppStore } from '../../store/useStore';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

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
        setSelectedTicketQuantity
    } = useAppStore();

    const [eventData, setEventData] = useState(null);
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
    
    const hasOpenedModal = useRef(false);

    useEffect(() => {
        if (liveMatches.length === 0) {
            fetchLocationAndMatches();
        } else if (eventId) {
            const found = liveMatches.find(m => m.id === eventId);
            setEventData(found);
            
            // Trigger pre-selection modal exactly once when event is found
            if (found && !hasOpenedModal.current && !isTicketQuantityModalOpen) {
                setTicketQuantityModalOpen(true);
                hasOpenedModal.current = true;
            }
            
            // Fetch real P2P listings for this event from Firebase
            const q = query(collection(db, 'listings'), where('eventId', '==', eventId), where('status', '==', 'active'));
            const unsub = onSnapshot(q, (snapshot) => {
                const fetchedListings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Sort by cheapest first natively
                setListings(fetchedListings.sort((a, b) => a.price - b.price));
                setIsLoading(false);
            });
            return () => unsub();
        }
    }, [eventId, liveMatches, fetchLocationAndMatches, setTicketQuantityModalOpen, isTicketQuantityModalOpen]);

    if (!eventId || (!eventData && !isLoading)) return <div className="min-h-screen p-10 font-bold text-center">Event not found.</div>;

    // Dynamically filter listings based on user's quantity selection
    const filteredListings = listings.filter(l => Number(l.quantity) >= selectedTicketQuantity);

    return (
        <div className="w-full animate-fade-in pb-10">
            
            {/* INLINE MODAL: Ticket Quantity Pre-Selector */}
            <AnimatePresence>
                {isTicketQuantityModalOpen && (
                    <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center backdrop-blur-sm p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[24px] p-6 md:p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
                        >
                            <button onClick={() => setTicketQuantityModalOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                            <h2 className="text-2xl font-black text-brand-text mb-6 text-center mt-2">How many tickets?</h2>
                            
                            <div className="flex justify-center flex-wrap gap-3 mb-8">
                                {[1, 2, 3, 4, 5, '6+'].map(qty => {
                                    const value = qty === '6+' ? 6 : qty;
                                    const isSelected = selectedTicketQuantity === value;
                                    return (
                                        <button
                                            key={qty}
                                            onClick={() => setSelectedTicketQuantity(value)}
                                            className={`w-14 h-14 rounded-full font-black text-lg transition-all border-2 ${isSelected ? 'bg-[#114C2A] border-[#114C2A] text-white shadow-md transform scale-110' : 'bg-white border-gray-200 text-brand-text hover:border-[#114C2A] hover:text-[#114C2A]'}`}
                                        >
                                            {qty}
                                        </button>
                                    );
                                })}
                            </div>
                            
                            <div className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-xl mb-8 border border-gray-200">
                                <div>
                                    <h4 className="font-bold text-brand-text text-[15px] mb-0.5">We want to sit together</h4>
                                    <p className="text-[13px] text-brand-muted font-medium">Ensures your seats are adjacent</p>
                                </div>
                                {/* Simulated Toggle Switch */}
                                <div className="w-12 h-6 bg-[#114C2A] rounded-full relative cursor-pointer shadow-inner">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform"></div>
                                </div>
                            </div>
                            
                            <button onClick={() => setTicketQuantityModalOpen(false)} className="w-full bg-[#114C2A] text-white font-bold py-4 rounded-xl hover:bg-[#0c361d] transition-colors text-[17px] shadow-[0_4px_15px_rgba(17,76,42,0.3)]">
                                Continue
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* INLINE SIDEBAR: Event Filters */}
            <AnimatePresence>
                {isFilterSidebarOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 z-[150] backdrop-blur-sm" 
                            onClick={() => setIsFilterSidebarOpen(false)} 
                        />
                        <motion.div 
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-[350px] bg-white z-[160] shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white z-10">
                                <h2 className="text-xl font-black text-brand-text">Filters</h2>
                                <button onClick={() => setIsFilterSidebarOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"><X size={18} className="text-gray-600"/></button>
                            </div>
                            
                            <div className="p-6 flex-1 overflow-y-auto space-y-8 bg-[#F8F9FA]">
                                <div>
                                    <h3 className="font-bold text-brand-text mb-4 text-[15px]">Price Range</h3>
                                    <div className="flex items-center space-x-4">
                                        <div className="relative w-full">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                                            <input type="number" placeholder="Min" className="w-full pl-8 p-3.5 border border-gray-300 rounded-xl outline-none focus:border-[#114C2A] focus:ring-1 focus:ring-[#114C2A] font-bold text-brand-text bg-white" />
                                        </div>
                                        <span className="text-gray-400 font-bold">-</span>
                                        <div className="relative w-full">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                                            <input type="number" placeholder="Max" className="w-full pl-8 p-3.5 border border-gray-300 rounded-xl outline-none focus:border-[#114C2A] focus:ring-1 focus:ring-[#114C2A] font-bold text-brand-text bg-white" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-4 pt-4 border-t border-gray-200">
                                    <h3 className="font-bold text-brand-text text-[15px] mb-2">Ticket Features</h3>
                                    <label className="flex items-center justify-between cursor-pointer p-4 bg-white rounded-xl border border-gray-200 hover:border-[#458731] transition-colors">
                                        <span className="font-bold text-brand-text text-sm flex items-center"><Zap size={18} className="text-[#114C2A] mr-3 fill-[#114C2A]"/> Instant Download</span>
                                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-[#114C2A] focus:ring-[#114C2A]" defaultChecked />
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer p-4 bg-white rounded-xl border border-gray-200 hover:border-[#458731] transition-colors">
                                        <span className="font-bold text-brand-text text-sm flex items-center"><Eye size={18} className="text-gray-600 mr-3"/> Clear View Only</span>
                                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-[#114C2A] focus:ring-[#114C2A]" />
                                    </label>
                                </div>
                            </div>
                            
                            <div className="p-6 border-t border-gray-200 bg-white">
                                <button onClick={() => setIsFilterSidebarOpen(false)} className="w-full bg-[#114C2A] text-white font-bold py-4 rounded-xl hover:bg-[#0c361d] transition-colors shadow-md">
                                    Show {filteredListings.length} Tickets
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* MAIN SPLIT-SCREEN LAYOUT */}
            <div className="w-full h-[85vh] min-h-[700px] flex flex-col lg:flex-row bg-white rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-200 mt-2">
                
                {/* Left Side: Dynamic Stadium Map Visualization */}
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

                    {/* Highly Polished Interactive SVG Stadium Map */}
                    <div className="flex-1 flex items-center justify-center p-10 relative">
                        <svg viewBox="0 0 500 500" className="w-full h-full max-w-[650px] max-h-[650px] drop-shadow-2xl opacity-90 transition-transform duration-1000 hover:scale-105">
                            {/* Pitch Base */}
                            <rect x="175" y="100" width="150" height="300" rx="75" fill="#EAF4D9" stroke="#C5E1A5" strokeWidth="6"/>
                            <circle cx="250" cy="250" r="25" fill="none" stroke="#C5E1A5" strokeWidth="3"/>
                            <line x1="175" y1="250" x2="325" y2="250" stroke="#C5E1A5" strokeWidth="3"/>
                            
                            {/* Lower Tier Seating (Sections) */}
                            <path d="M 140 100 A 110 110 0 0 1 360 100 L 360 400 A 110 110 0 0 1 140 400 Z" fill="none" stroke="#D9EBBF" strokeWidth="35" strokeDasharray="10 5" className="hover:stroke-[#458731] transition-colors cursor-pointer"/>
                            
                            {/* Middle Tier Seating (Sections) */}
                            <path d="M 90 100 A 160 160 0 0 1 410 100 L 410 400 A 160 160 0 0 1 90 400 Z" fill="none" stroke="#C5E1A5" strokeWidth="45" strokeDasharray="18 6" className="hover:stroke-[#458731] transition-colors cursor-pointer"/>
                            
                            {/* Upper Tier Seating (Sections) */}
                            <path d="M 30 100 A 220 220 0 0 1 470 100 L 470 400 A 220 220 0 0 1 30 400 Z" fill="none" stroke="#A3D17A" strokeWidth="55" strokeDasharray="26 8" className="hover:stroke-[#458731] transition-colors cursor-pointer"/>
                        </svg>
                        
                        {/* Dynamic Venue Pin */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none mt-2">
                            <h3 className="text-[#114C2A] font-black text-2xl drop-shadow-md text-center max-w-[200px] leading-tight">
                                {eventData?.loc?.split(',')[0]}
                            </h3>
                            <div className="bg-white/80 backdrop-blur-md px-3 py-1 rounded-full mt-2 border border-gray-200 flex items-center shadow-sm">
                                <ShieldCheck size={14} className="text-[#114C2A] mr-1.5"/>
                                <span className="text-[#114C2A] font-bold text-[10px] uppercase tracking-widest">Interactive Map</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: P2P Ticket Listings Panel */}
                <div className="w-full lg:w-[450px] xl:w-[500px] flex flex-col bg-white h-full z-20 shadow-[-15px_0_40px_rgba(0,0,0,0.05)] border-l border-gray-200">
                    
                    {/* Top Controls Bar (Exact Viagogo Layout) */}
                    <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm z-30">
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
                                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all text-brand-text shadow-sm"
                            >
                                <SlidersHorizontal size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Listings Feed */}
                    <div className="flex-1 overflow-y-auto bg-[#F8F9FA] p-4 md:p-5 space-y-3 relative">
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
                                <p className="text-[14px] text-brand-muted mb-6 font-medium">Try reducing the ticket quantity or adjusting your filters to see more results.</p>
                                <button 
                                    onClick={() => setTicketQuantityModalOpen(true)} 
                                    className="bg-white border border-gray-300 px-6 py-3 rounded-full font-bold text-[14px] hover:bg-gray-50 transition-colors shadow-sm text-brand-text"
                                >
                                    Change Quantity
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col pb-6 space-y-3">
                                <h4 className="text-[13px] font-bold text-gray-500 uppercase tracking-widest mb-1 px-1">
                                    {filteredListings.length} results sorted by price
                                </h4>
                                {filteredListings.map((list) => (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ y: -2 }}
                                        key={list.id} 
                                        onClick={() => navigate(`/checkout?listingId=${list.id}`)}
                                        className="bg-white rounded-[16px] p-5 cursor-pointer border border-gray-200 hover:border-[#114C2A] hover:shadow-[0_0_0_1px_#114C2A] transition-all group relative overflow-hidden flex flex-col"
                                    >
                                        {/* Exact Viagogo Green Accent Bar */}
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#114C2A] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1 pr-4">
                                                <h3 className="font-black text-brand-text text-[18px] leading-tight mb-1">
                                                    Section {list.section || 'General'}
                                                </h3>
                                                <p className="text-[14px] text-brand-muted font-medium">
                                                    Row {list.row || 'Any'} • {list.quantity} Tickets
                                                </p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <span className="block text-[24px] font-black text-brand-text leading-none mb-1">
                                                    ₹{list.price.toLocaleString()}
                                                </span>
                                                <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wide">
                                                    /ea
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Badge Features Row */}
                                        <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-100">
                                            <span className="flex items-center text-[12px] font-bold text-[#114C2A] bg-[#EAF4D9] px-2.5 py-1.5 rounded-[6px]">
                                                <Zap size={14} className="mr-1.5 fill-[#114C2A]"/> Instant download
                                            </span>
                                            <span className="flex items-center text-[12px] font-bold text-gray-600 bg-gray-100 px-2.5 py-1.5 rounded-[6px]">
                                                <Eye size={14} className="mr-1.5 opacity-60"/> Clear view
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}