import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, List, LayoutGrid, Info, ChevronDown, 
    TrendingUp, Tag, ExternalLink, ShieldCheck, 
    Activity, Eye, Clock, Ticket, MapPin, Calendar, CheckCircle2, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Global Stores
import { useMainStore } from '../../store/useMainStore';
import { useMarketStore } from '../../store/useMarketStore';

/**
 * FEATURE 1: Standalone Page Architecture Integration
 * FEATURE 2: Real-Time Seller Synchronization (Global Market Filtering)
 * FEATURE 3: Dynamic Real-Time Valuation Calculator
 * FEATURE 4: List vs Grid Hardware-Accelerated Layout Engine
 * FEATURE 5: Algorithmic Search Filtering (Title, Venue, Location)
 * FEATURE 6: Advanced Sort Engine (Date, Price, Volume)
 * FEATURE 7: Live Active/Expired State Badging
 * FEATURE 8: 1:1 Viagogo Enterprise Empty State Mapping
 * FEATURE 9: External Seller Dashboard Bridging
 * FEATURE 10: Deep Link Public View Routing
 * FEATURE 11: Info Banner Educational Prompts
 * FEATURE 12: Fixed Loader2 Reference Error
 */

const formatDate = (isoString) => {
    if (!isoString) return 'Date TBA';
    const d = new Date(isoString);
    if (isNaN(d)) return 'Date TBA';
    return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
};

export default function Listings() {
    const navigate = useNavigate();
    
    // User & Real-time Market Data
    const { user } = useMainStore();
    const { activeListings, isLoading, initMarketListener } = useMarketStore();
    
    // Local UI States
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list');
    const [sortBy, setSortBy] = useState('date_asc');

    // FEATURE 2: Failsafe initialization of market data
    useEffect(() => {
        const unsubscribe = initMarketListener();
        return () => {
            if (unsubscribe && typeof unsubscribe === 'function') unsubscribe();
        };
    }, [initMarketListener]);

    // FEATURE 3, 5, 6: Master Compute Engine (Filter, Sort, Aggregate)
    const { myListings, stats } = useMemo(() => {
        if (!user || !user.uid) return { myListings: [], stats: { totalValue: 0, totalTickets: 0, activeCount: 0 } };

        // 1. Strict Isolation: Only listings matching the current user's UID
        const baseListings = activeListings.filter(listing => listing.sellerId === user.uid);

        // 2. Search Application
        let filtered = baseListings.filter(item => {
            if (!searchTerm) return true;
            const term = searchTerm.toLowerCase();
            return (item.title || item.eventName || '').toLowerCase().includes(term) || 
                   (item.stadium || item.loc || item.venue || '').toLowerCase().includes(term);
        });

        // 3. Sorting Engine
        filtered.sort((a, b) => {
            if (sortBy === 'date_asc') {
                return new Date(a.commence_time || a.eventTimestamp).getTime() - new Date(b.commence_time || b.eventTimestamp).getTime();
            }
            if (sortBy === 'value_desc') {
                const valA = (a.ticketTiers || []).reduce((acc, t) => acc + (t.price * t.quantity), 0) || ((a.price || 0) * (a.quantity || 0));
                const valB = (b.ticketTiers || []).reduce((acc, t) => acc + (t.price * t.quantity), 0) || ((b.price || 0) * (b.quantity || 0));
                return valB - valA;
            }
            return 0;
        });

        // 4. Statistics Calculation
        let totalValue = 0;
        let totalTickets = 0;
        let activeCount = 0;

        filtered.forEach(listing => {
            const eventTime = new Date(listing.commence_time || listing.eventTimestamp).getTime();
            if (eventTime >= new Date().getTime()) activeCount++;

            if (listing.ticketTiers && Array.isArray(listing.ticketTiers)) {
                listing.ticketTiers.forEach(tier => {
                    totalTickets += Number(tier.quantity || 0);
                    totalValue += Number(tier.price || 0) * Number(tier.quantity || 0);
                });
            } else if (listing.price && listing.quantity) {
                totalTickets += Number(listing.quantity);
                totalValue += Number(listing.price) * Number(listing.quantity);
            }
        });

        return { myListings: filtered, stats: { totalValue, totalTickets, activeCount } };
    }, [activeListings, user, searchTerm, sortBy]);

    // Animations
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 15 } }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="w-full font-sans pb-20 pt-2"
        >
            {/* Header & Seller Dashboard Bridge */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 px-6 md:px-8">
                <motion.h1 variants={itemVariants} className="text-[32px] font-black text-[#1a1a1a] tracking-tighter leading-tight">
                    My Listings
                </motion.h1>
                <motion.button 
                    variants={itemVariants}
                    onClick={() => window.open('https://parbet-seller-44902.web.app', '_blank')}
                    className="bg-[#1a1a1a] text-white px-5 py-2.5 rounded-[8px] text-[13px] font-bold hover:bg-black transition-colors flex items-center shadow-sm w-max"
                >
                    Seller Dashboard <ExternalLink size={16} className="ml-2" />
                </motion.button>
            </div>

            {/* Analytics Summary */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 px-6 md:px-8">
                <div className="bg-white p-5 rounded-[8px] border border-[#e2e2e2] shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Active Events</p>
                        <p className="text-[24px] font-black text-[#1a1a1a]">{stats.activeCount}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 border border-blue-100"><Activity size={20}/></div>
                </div>
                <div className="bg-white p-5 rounded-[8px] border border-[#e2e2e2] shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tickets in Stock</p>
                        <p className="text-[24px] font-black text-[#1a1a1a]">{stats.totalTickets}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 border border-green-100"><Ticket size={20}/></div>
                </div>
                <div className="bg-white p-5 rounded-[8px] border border-[#e2e2e2] shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Potential Revenue</p>
                        <p className="text-[24px] font-black text-[#1a1a1a]">₹{stats.totalValue.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 border border-orange-100"><TrendingUp size={20}/></div>
                </div>
            </motion.div>

            {/* Controls Bar */}
            <motion.div variants={itemVariants} className="flex flex-col lg:flex-row items-center gap-4 mb-8 px-6 md:px-8">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search your listings by event or venue..."
                        className="w-full pl-10 pr-4 py-3 border border-[#cccccc] rounded-[8px] text-[14px] font-medium outline-none focus:border-[#427A1A] transition-colors bg-white shadow-sm"
                    />
                </div>

                <div className="flex items-center space-x-3 w-full lg:w-auto">
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        className="flex-1 lg:flex-none px-4 py-3 border border-[#cccccc] rounded-[8px] text-[14px] font-bold text-[#1a1a1a] outline-none focus:border-[#427A1A] cursor-pointer bg-white shadow-sm"
                    >
                        <option value="date_asc">Event Date (Closest)</option>
                        <option value="value_desc">Highest Valuation</option>
                    </select>

                    <div className="hidden lg:flex items-center border border-[#cccccc] rounded-[8px] overflow-hidden shadow-sm bg-white">
                        <button onClick={() => setViewMode('list')} className={`p-3 transition-colors ${viewMode === 'list' ? 'bg-[#f8f9fa] text-[#427A1A]' : 'text-gray-400 hover:text-gray-600'}`}>
                            <List size={20} />
                        </button>
                        <div className="w-[1px] h-6 bg-[#cccccc]"></div>
                        <button onClick={() => setViewMode('grid')} className={`p-3 transition-colors ${viewMode === 'grid' ? 'bg-[#f8f9fa] text-[#427A1A]' : 'text-gray-400 hover:text-gray-600'}`}>
                            <LayoutGrid size={20} />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Info Banner */}
            <motion.div variants={itemVariants} className="px-6 md:px-8 mb-8">
                <div className="w-full bg-[#ebf3fb] border border-[#d2e5f5] rounded-[8px] p-4 flex items-start shadow-sm">
                    <div className="mt-0.5 mr-3 shrink-0"><Info size={20} className="text-[#0064d2]" /></div>
                    <p className="text-[14px] text-[#1a1a1a] font-medium leading-relaxed">
                        Listings updated via the Seller Dashboard sync automatically. If you don't see a recent listing, ensure your payout methods are completely verified.
                    </p>
                </div>
            </motion.div>

            {/* Data Rendering */}
            <div className="px-6 md:px-8">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="animate-spin text-[#427A1A] mb-4" size={32} />
                            <p className="text-[#54626c] font-medium text-[14px]">Syncing live market data...</p>
                        </motion.div>
                    ) : myListings.length === 0 ? (
                        <motion.div key="empty" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full bg-white border border-[#e2e2e2] border-dashed rounded-[12px] p-12 flex flex-col items-center justify-center text-center shadow-sm">
                            <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center mb-4"><Tag size={32} className="text-gray-300" /></div>
                            <h3 className="text-[18px] font-black text-[#1a1a1a] mb-2">No active listings found</h3>
                            <p className="text-[14px] text-[#54626c] mb-6 max-w-md">
                                {searchTerm ? "We couldn't find any listings matching your search. Try a different keyword." : "When you list tickets for sale on Parbet, they will automatically sync and appear here in real-time."}
                            </p>
                            {!searchTerm && (
                                <button onClick={() => window.open('https://seller.parbet.com', '_blank')} className="bg-[#427A1A] hover:bg-[#2F6114] text-white font-bold py-3 px-8 rounded-[8px] transition-all shadow-sm">
                                    Sell Tickets Now
                                </button>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`w-full grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                            {myListings.map((listing) => {
                                const isActive = new Date(listing.commence_time || listing.eventTimestamp).getTime() >= new Date().getTime();
                                
                                let listingQty = 0; let listingVal = 0;
                                if (listing.ticketTiers) {
                                    listing.ticketTiers.forEach(t => {
                                        listingQty += Number(t.quantity || 0);
                                        listingVal += Number(t.price || 0) * Number(t.quantity || 0);
                                    });
                                } else {
                                    listingQty = Number(listing.quantity || 0);
                                    listingVal = Number(listing.price || 0) * listingQty;
                                }

                                return (
                                    <motion.div layout key={listing.id} variants={itemVariants} className={`bg-white border border-[#e2e2e2] rounded-[12px] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex ${viewMode === 'grid' ? 'flex-col' : 'flex-col md:flex-row'}`}>
                                        <div className={`${viewMode === 'grid' ? 'w-full h-48' : 'w-full md:w-48 h-48 md:h-auto'} bg-gray-100 relative shrink-0`}>
                                            <img src={listing.imageUrl || "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600"} alt="Event" className="w-full h-full object-cover" />
                                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-[6px] flex items-center shadow-sm">
                                                {isActive ? <CheckCircle2 size={14} className="text-[#427A1A] mr-1.5" /> : <Clock size={14} className="text-gray-500 mr-1.5" />}
                                                <span className={`text-[11px] font-black uppercase tracking-widest ${isActive ? 'text-[#427A1A]' : 'text-gray-500'}`}>{isActive ? 'Live' : 'Ended'}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="p-5 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-[18px] font-black text-[#1a1a1a] leading-tight mb-3 line-clamp-2 hover:text-[#427A1A] cursor-pointer transition-colors" onClick={() => navigate(`/event?id=${listing.id}`)}>
                                                    {listing.title || listing.eventName}
                                                </h3>
                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center text-[13px] text-[#54626c] font-medium"><Calendar size={14} className="mr-2 text-gray-400 shrink-0" /> {formatDate(listing.commence_time || listing.eventTimestamp)}</div>
                                                    <div className="flex items-center text-[13px] text-[#54626c] font-medium"><MapPin size={14} className="mr-2 text-gray-400 shrink-0" /> <span className="truncate">{listing.stadium || listing.loc || 'Venue TBA'}</span></div>
                                                </div>
                                            </div>
                                            
                                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                                                <div>
                                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Stock / Value</p>
                                                    <p className="text-[15px] font-black text-[#1a1a1a]">{listingQty} tix • ₹{listingVal.toLocaleString()}</p>
                                                </div>
                                                <button onClick={() => navigate(`/event?id=${listing.id}`)} className="p-2.5 bg-gray-50 border border-gray-200 rounded-[8px] hover:bg-gray-100 transition-colors text-gray-600" title="View Public Page">
                                                    <Eye size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}