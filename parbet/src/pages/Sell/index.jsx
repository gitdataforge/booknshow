import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, MapPin, Calendar, DollarSign, Tag, 
    CheckCircle2, ChevronRight, Loader2, Info, Map as MapIcon 
} from 'lucide-react';
import { useAppStore } from '../../store/useStore';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function Sell() {
    const navigate = useNavigate();
    const { user, isAuthenticated, openAuthModal, liveMatches, fetchLocationAndMatches } = useAppStore();
    
    // Core Wizard States
    const [step, setStep] = useState(1);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [listingData, setListingData] = useState({ type: 'ticket', section: '', row: '', quantity: 1, price: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Interactive Search States
    const [searchQuery, setSearchQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        if (!isAuthenticated) openAuthModal();
        if (liveMatches.length === 0) fetchLocationAndMatches();
    }, [isAuthenticated, openAuthModal, liveMatches.length, fetchLocationAndMatches]);

    // ------------------------------------------------------------------
    // Helper: Resolve Standardized Sections for Map Compatibility
    // ------------------------------------------------------------------
    const getAvailableSections = () => {
        if (!selectedEvent) return [];
        const league = (selectedEvent.league || '').toLowerCase();
        
        // Matches DynamicArenaMap
        if (league.includes('basketball') || league.includes('hockey') || league.includes('indoor')) {
            return ['Floor', 'Lower Tier', 'Middle Tier', 'Upper Tier', 'VIP Lounge', 'Box Seats'];
        }
        // Matches DynamicTheaterMap
        if (league.includes('theater') || league.includes('theatre') || league.includes('broadway') || league.includes('comedy')) {
            return ['Orchestra Center', 'Orchestra Left', 'Orchestra Right', 'Mezzanine', 'Balcony', 'Box Seats'];
        }
        // Matches DynamicFestivalMap
        if (league.includes('festival') || league.includes('outdoor')) {
            return ['General Admission', 'VIP West', 'VIP East', 'Main Stage Front', 'Camping Zone'];
        }
        // Matches DynamicStadiumMap (Default: Cricket, Soccer, Football)
        return ['M1', 'M2', 'M3', 'M4', 'North Stand', 'South Stand', 'East Stand', 'West Stand', 'VIP Pavilion', 'General Admission'];
    };

    const filteredEvents = liveMatches.filter(m => 
        m.t1.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.t2.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.league.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setIsTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 500);
    };

    const handleSubmit = async () => {
        if (!user) return openAuthModal();
        if (!listingData.section) return; // Prevent unmapped listings
        
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'listings'), {
                eventId: selectedEvent.id,
                eventName: `${selectedEvent.t1} vs ${selectedEvent.t2}`,
                eventDate: `${selectedEvent.dow}, ${selectedEvent.day} ${selectedEvent.month}`,
                eventLoc: selectedEvent.loc,
                sellerId: user.uid,
                ...listingData,
                section: listingData.section.toUpperCase(), // Normalize for map lookup
                price: parseFloat(listingData.price),
                status: 'active',
                createdAt: new Date().toISOString()
            });
            setStep(3);
        } catch (error) {
            console.error("Error creating listing:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAuthenticated) return <div className="min-h-screen flex items-center justify-center font-bold">Please log in to sell.</div>;

    return (
        <div className={`mx-auto w-full animate-fade-in pb-20 ${step === 1 ? 'pt-16 md:pt-28 max-w-[1200px]' : 'pt-6 max-w-4xl'}`}>
            
            {step > 1 && (
                <div className="px-4">
                    <h1 className="text-4xl font-black text-brand-text mb-8">List your tickets</h1>
                    <div className="flex items-center space-x-2 mb-10">
                        <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-[#114C2A]' : 'bg-gray-200'}`}></div>
                        <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-[#114C2A]' : 'bg-gray-200'}`}></div>
                        <div className={`h-2 flex-1 rounded-full ${step >= 3 ? 'bg-[#114C2A]' : 'bg-gray-200'}`}></div>
                    </div>
                </div>
            )}

            {/* STEP 1: Hero Search */}
            {step === 1 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center w-full px-4">
                    <h1 className="text-[44px] md:text-[64px] font-black text-brand-text mb-3 tracking-tight leading-none text-center">
                        Sell your tickets
                    </h1>
                    <p className="text-[17px] text-brand-text mb-12 text-center font-medium">
                        parbet is the world's largest secondary marketplace for tickets to live events
                    </p>

                    <div className="relative w-full max-w-4xl z-50">
                        <div className={`relative flex items-center bg-white border ${isFocused ? 'border-gray-400 shadow-[0_4px_20px_rgba(0,0,0,0.08)]' : 'border-gray-300 shadow-sm'} rounded-full px-6 py-4 transition-all duration-300`}>
                            <Search size={22} className="text-gray-500 mr-3 flex-shrink-0" />
                            <input 
                                type="text" 
                                placeholder="Search your event and start selling" 
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                                className="bg-transparent outline-none flex-1 text-[17px] text-brand-text placeholder-gray-500 font-medium"
                            />
                            {isTyping ? (
                                <Loader2 size={22} className="text-gray-400 animate-spin flex-shrink-0 ml-3" />
                            ) : (
                                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0 ml-3">
                                    <path d="M21 12a9 9 0 1 1-2.6-6.3" />
                                </svg>
                            )}
                        </div>

                        <AnimatePresence>
                            {isFocused && searchQuery.trim().length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 max-h-[350px] overflow-y-auto text-left z-50"
                                >
                                    {filteredEvents.length > 0 ? (
                                        filteredEvents.map(event => (
                                            <div 
                                                key={event.id} 
                                                onClick={() => { setSelectedEvent(event); setStep(2); }}
                                                className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                                            >
                                                <div>
                                                    <h3 className="font-bold text-[16px] text-brand-text leading-tight">{event.t1} vs {event.t2}</h3>
                                                    <p className="text-[13px] text-brand-muted mt-1 flex items-center">
                                                        <Calendar size={12} className="mr-1.5"/> {event.dow}, {event.day} {event.month} • {event.loc}
                                                    </p>
                                                </div>
                                                <ChevronRight size={18} className="text-gray-400" />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center"><p className="text-[15px] text-brand-muted font-medium">No events found matching "{searchQuery}"</p></div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mt-24 md:mt-32 text-center w-full">
                        <h2 className="text-[28px] font-bold text-[#6A7074] mb-6">Ready to list?</h2>
                        <button onClick={() => setIsFocused(true)} className="bg-[#458731] hover:bg-[#386d27] text-white px-8 py-3.5 rounded-xl font-bold text-[16px] transition-colors shadow-sm">
                            Sell my tickets
                        </button>
                    </div>
                </motion.div>
            )}

            {/* STEP 2: Listing Details (Strict Section Mapping) */}
            {step === 2 && selectedEvent && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="px-4">
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                            <h2 className="text-2xl font-black text-brand-text">Listing Details</h2>
                            <button onClick={() => setStep(1)} className="text-sm font-bold text-[#458731] hover:underline">Change Event</button>
                        </div>
                        
                        <div className="bg-[#F8F9FA] rounded-xl p-5 mb-8 border border-gray-100">
                            <h3 className="font-black text-brand-text text-[18px]">{selectedEvent.t1} vs {selectedEvent.t2}</h3>
                            <p className="text-[14px] text-brand-muted font-medium mt-1">{selectedEvent.dow}, {selectedEvent.day} {selectedEvent.month} • {selectedEvent.loc}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="block text-sm font-black text-brand-text mb-2 uppercase tracking-wider">Listing Type</label>
                                <select 
                                    value={listingData.type}
                                    onChange={(e) => setListingData({...listingData, type: e.target.value})}
                                    className="w-full p-4 rounded-xl border border-gray-300 outline-none focus:border-[#458731] font-bold bg-white cursor-pointer"
                                >
                                    <option value="ticket">Event Ticket</option>
                                    <option value="odds">Custom Odds/Bet</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-black text-brand-text mb-2 uppercase tracking-wider">Price per item (₹)</label>
                                <div className="relative">
                                    <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                        type="number" placeholder="0.00" value={listingData.price}
                                        onChange={(e) => setListingData({...listingData, price: e.target.value})}
                                        className="w-full p-4 pl-10 rounded-xl border border-gray-300 outline-none focus:border-[#458731] font-bold"
                                    />
                                </div>
                            </div>
                            
                            {/* STRICT DROPDOWN FOR SECTION (Map ID Consistency) */}
                            <div>
                                <label className="block text-sm font-black text-brand-text mb-2 uppercase tracking-wider flex items-center">
                                    <MapIcon size={16} className="mr-2" /> Venue Section
                                </label>
                                <div className="relative">
                                    <select 
                                        value={listingData.section}
                                        onChange={(e) => setListingData({...listingData, section: e.target.value})}
                                        className="w-full p-4 rounded-xl border border-gray-300 outline-none focus:border-[#458731] font-bold bg-white cursor-pointer appearance-none"
                                    >
                                        <option value="">Select standardized area...</option>
                                        {getAvailableSections().map(sec => (
                                            <option key={sec} value={sec}>{sec}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <ChevronRight size={20} className="rotate-90" />
                                    </div>
                                </div>
                                <p className="text-[11px] text-[#458731] font-bold mt-2 flex items-center">
                                    <Info size={12} className="mr-1" /> Choosing a standard section enables the interactive venue map
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-black text-brand-text mb-2 uppercase tracking-wider">Row & Seats</label>
                                <input 
                                    type="text" placeholder="e.g. Row G, Seats 12-14" value={listingData.row}
                                    onChange={(e) => setListingData({...listingData, row: e.target.value})}
                                    className="w-full p-4 rounded-xl border border-gray-300 outline-none focus:border-[#458731] font-bold"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-black text-brand-text mb-2 uppercase tracking-wider">Total Quantity</label>
                                <input 
                                    type="number" min="1" value={listingData.quantity}
                                    onChange={(e) => setListingData({...listingData, quantity: e.target.value})}
                                    className="w-full p-4 rounded-xl border border-gray-300 outline-none focus:border-[#458731] font-bold"
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleSubmit}
                            disabled={!listingData.price || !listingData.section || isSubmitting}
                            className="w-full bg-[#114C2A] text-white font-black py-4 rounded-xl hover:bg-[#0c361d] transition-all disabled:opacity-50 flex justify-center items-center text-[17px] shadow-lg shadow-[#114C2A]/20"
                        >
                            {isSubmitting ? <Loader2 size={24} className="animate-spin"/> : 'Publish Listing'}
                        </button>
                    </div>
                </motion.div>
            )}

            {/* STEP 3: Confirmation */}
            {step === 3 && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl border border-gray-200 p-12 shadow-sm text-center mx-4">
                    <div className="w-20 h-20 bg-[#E6F2D9] rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} className="text-[#458731]" />
                    </div>
                    <h2 className="text-3xl font-black text-brand-text mb-4">Listing Published!</h2>
                    <p className="text-brand-muted text-lg mb-8">Your {listingData.type} for {selectedEvent?.t1} is now live and synchronized with the interactive venue map.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => navigate('/dashboard')} className="bg-[#114C2A] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#0c361d] transition-colors">
                            Go to Dashboard
                        </button>
                        <button onClick={() => window.location.reload()} className="bg-white text-brand-text border-2 border-gray-200 font-bold px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors">
                            List another ticket
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}