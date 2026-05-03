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
 * GLOBAL REBRAND: Booknshow Identity Application (Phase 7 Profile Listings)
 * Enforced Colors: #FFFFFF, #E7364D, #333333, #EB5B6E, #FAD8DC, #A3A3A3, #626262
 * FEATURE 1: Illustrative Ambient Backgrounds
 * FEATURE 2: Real-Time Seller Synchronization (Global Market Filtering)
 * FEATURE 3: Dynamic Real-Time Valuation Calculator
 * FEATURE 4: List vs Grid Hardware-Accelerated Layout Engine
 * FEATURE 5: Algorithmic Search Filtering (Title, Venue, Location)
 * FEATURE 6: Advanced Sort Engine (Date, Price, Volume)
 * FEATURE 7: Live Active/Expired State Badging
 * FEATURE 8: 1:1 Rebranded Booknshow Empty State Mapping
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

// SECTION 1: Ambient Illustrative Background
const AmbientBackground = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
            className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#FAD8DC] opacity-20 blur-[80px]"
            animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
            className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#EB5B6E] opacity-10 blur-[100px]"
            animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
    </div>
);

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
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    return (
        <div className="w-full font-sans pb-20 pt-4 relative min-h-screen bg-transparent">
            <AmbientBackground />

            <motion.div 
                initial="hidden"
                animate="show"
                variants={containerVariants}
                className="relative z-10 w-full"
            >
                {/* Header & Seller Dashboard Bridge */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 px-6 md:px-8">
                    <motion.h1 variants={itemVariants} className="text-[32px] font-black text-[#333333] tracking-tight leading-tight">
                        My Inventory
                    </motion.h1>
                    <motion.button 
                        variants={itemVariants}
                        onClick={() => window.open('https://seller-booknshow.web.app', '_blank')}
                        className="bg-[#333333] text-[#FFFFFF] px-6 py-2.5 rounded-[8px] text-[14px] font-bold hover:bg-[#E7364D] hover:shadow-[0_4px_15px_rgba(231,54,77,0.3)] hover:-translate-y-0.5 transition-all flex items-center w-max"
                    >
                        Seller Dashboard <ExternalLink size={16} className="ml-2" />
                    </motion.button>
                </div>

                {/* Analytics Summary */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 px-6 md:px-8">
                    <div className="bg-[#FFFFFF] p-5 rounded-[12px] border border-[#A3A3A3]/20 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[12px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1">Active Events</p>
                            <p className="text-[28px] font-black text-[#333333]">{stats.activeCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-[#FAD8DC]/30 rounded-full flex items-center justify-center text-[#E7364D] border border-[#E7364D]/20"><Activity size={20}/></div>
                    </div>
                    <div className="bg-[#FFFFFF] p-5 rounded-[12px] border border-[#A3A3A3]/20 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[12px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1">Tickets in Stock</p>
                            <p className="text-[28px] font-black text-[#333333]">{stats.totalTickets}</p>
                        </div>
                        <div className="w-12 h-12 bg-[#FAD8DC]/30 rounded-full flex items-center justify-center text-[#E7364D] border border-[#E7364D]/20"><Ticket size={20}/></div>
                    </div>
                    <div className="bg-[#FFFFFF] p-5 rounded-[12px] border border-[#A3A3A3]/20 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[12px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1">Potential Revenue</p>
                            <p className="text-[28px] font-black text-[#333333]">₹{stats.totalValue.toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 bg-[#FAD8DC]/30 rounded-full flex items-center justify-center text-[#E7364D] border border-[#E7364D]/20"><TrendingUp size={20}/></div>
                    </div>
                </motion.div>

                {/* Controls Bar */}
                <motion.div variants={itemVariants} className="flex flex-col lg:flex-row items-center gap-4 mb-8 px-6 md:px-8">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3A3A3]" size={18} />
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search your listings by event or venue..."
                            className="w-full pl-10 pr-4 py-3 bg-[#F5F5F5] border border-[#A3A3A3]/20 rounded-[8px] text-[14px] text-[#333333] font-medium outline-none focus:bg-[#FFFFFF] focus:border-[#E7364D]/50 transition-colors shadow-sm"
                        />
                    </div>

                    <div className="flex items-center space-x-3 w-full lg:w-auto">
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className="flex-1 lg:flex-none px-4 py-3 bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[8px] text-[14px] font-bold text-[#333333] outline-none focus:border-[#E7364D]/50 cursor-pointer shadow-sm"
                        >
                            <option value="date_asc">Event Date (Closest)</option>
                            <option value="value_desc">Highest Valuation</option>
                        </select>

                        <div className="hidden lg:flex items-center border border-[#A3A3A3]/20 rounded-[8px] overflow-hidden shadow-sm bg-[#FFFFFF]">
                            <button onClick={() => setViewMode('list')} className={`p-3 transition-colors ${viewMode === 'list' ? 'bg-[#FAD8DC]/30 text-[#E7364D]' : 'text-[#A3A3A3] hover:text-[#333333]'}`}>
                                <List size={20} />
                            </button>
                            <div className="w-[1px] h-6 bg-[#A3A3A3]/20"></div>
                            <button onClick={() => setViewMode('grid')} className={`p-3 transition-colors ${viewMode === 'grid' ? 'bg-[#FAD8DC]/30 text-[#E7364D]' : 'text-[#A3A3A3] hover:text-[#333333]'}`}>
                                <LayoutGrid size={20} />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Info Banner */}
                <motion.div variants={itemVariants} className="px-6 md:px-8 mb-8">
                    <div className="w-full bg-[#F5F5F5] border border-[#A3A3A3]/20 rounded-[8px] p-4 flex items-start shadow-sm">
                        <div className="mt-0.5 mr-3 shrink-0"><Info size={20} className="text-[#333333]" /></div>
                        <p className="text-[14px] text-[#626262] font-medium leading-relaxed">
                            Listings updated via the Booknshow Seller Dashboard sync automatically in real-time. If you don't see a recent listing, ensure your event has passed the moderation review.
                        </p>
                    </div>
                </motion.div>

                {/* Data Rendering */}
                <div className="px-6 md:px-8">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="animate-spin text-[#E7364D] mb-4" size={32} />
                                <p className="text-[#626262] font-bold text-[14px] uppercase tracking-widest">Syncing Live Market Data...</p>
                            </motion.div>
                        ) : myListings.length === 0 ? (
                            <motion.div key="empty" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full bg-[#FFFFFF] border border-[#A3A3A3]/20 border-dashed rounded-[12px] p-12 flex flex-col items-center justify-center text-center shadow-sm">
                                <div className="w-16 h-16 bg-[#FAD8DC]/30 border border-[#E7364D]/20 rounded-full flex items-center justify-center mb-6"><Tag size={32} className="text-[#E7364D]" /></div>
                                <h3 className="text-[20px] font-black text-[#333333] mb-3">No active listings found</h3>
                                <p className="text-[14px] text-[#626262] font-medium mb-8 max-w-md leading-relaxed">
                                    {searchTerm ? "We couldn't find any listings matching your search. Try a different keyword." : "When you list tickets for sale on the Booknshow Seller Platform, they will automatically sync and appear here in real-time."}
                                </p>
                                {!searchTerm && (
                                    <button onClick={() => window.open('https://seller-booknshow.web.app', '_blank')} className="bg-[#E7364D] hover:bg-[#EB5B6E] text-[#FFFFFF] font-bold py-3.5 px-8 rounded-[8px] transition-all shadow-[0_4px_15px_rgba(231,54,77,0.3)] hover:-translate-y-0.5">
                                        Open Seller Dashboard
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
                                        <motion.div layout key={listing.id} variants={itemVariants} className={`bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[12px] overflow-hidden shadow-[0_4px_20px_rgba(51,51,51,0.03)] hover:shadow-[0_8px_30px_rgba(231,54,77,0.08)] hover:border-[#E7364D]/30 transition-all group ${viewMode === 'grid' ? 'flex-col' : 'flex-col md:flex-row'}`}>
                                            <div className={`${viewMode === 'grid' ? 'w-full h-48' : 'w-full md:w-48 h-48 md:h-auto'} bg-[#F5F5F5] relative shrink-0 overflow-hidden`}>
                                                <img src={listing.imageUrl || "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600"} alt="Event" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                <div className="absolute top-3 left-3 bg-[#FFFFFF]/90 backdrop-blur-sm px-3 py-1.5 rounded-[6px] flex items-center shadow-sm">
                                                    {isActive ? <CheckCircle2 size={14} className="text-[#E7364D] mr-1.5" /> : <Clock size={14} className="text-[#A3A3A3] mr-1.5" />}
                                                    <span className={`text-[11px] font-black uppercase tracking-widest ${isActive ? 'text-[#E7364D]' : 'text-[#A3A3A3]'}`}>{isActive ? 'Live' : 'Ended'}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="p-6 flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-[20px] font-black text-[#333333] leading-tight mb-3 line-clamp-2 hover:text-[#E7364D] cursor-pointer transition-colors" onClick={() => navigate(`/event?id=${listing.id}`)}>
                                                        {listing.title || listing.eventName}
                                                    </h3>
                                                    <div className="space-y-2 mb-4">
                                                        <div className="flex items-center text-[14px] text-[#626262] font-medium"><Calendar size={16} className="mr-3 text-[#A3A3A3] shrink-0" /> {formatDate(listing.commence_time || listing.eventTimestamp)}</div>
                                                        <div className="flex items-center text-[14px] text-[#626262] font-medium"><MapPin size={16} className="mr-3 text-[#A3A3A3] shrink-0" /> <span className="truncate">{listing.stadium || listing.loc || 'Venue TBA'}</span></div>
                                                    </div>
                                                </div>
                                                
                                                <div className="pt-4 border-t border-[#A3A3A3]/10 flex items-center justify-between mt-auto">
                                                    <div>
                                                        <p className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1">Stock / Value</p>
                                                        <p className="text-[16px] font-black text-[#333333]">{listingQty} tix <span className="mx-1 text-[#A3A3A3]">•</span> <span className="text-[#E7364D]">₹{listingVal.toLocaleString()}</span></p>
                                                    </div>
                                                    <button onClick={() => navigate(`/event?id=${listing.id}`)} className="p-2.5 bg-[#FFFFFF] border border-[#A3A3A3]/30 rounded-[8px] hover:bg-[#FAD8DC]/20 hover:border-[#E7364D] hover:text-[#E7364D] transition-all text-[#626262]" title="View Public Page">
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
        </div>
    );
}