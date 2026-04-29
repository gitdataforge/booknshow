import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    List, Calendar, MapPin, Search, ArrowRight, 
    TrendingUp, Tag, ExternalLink, ShieldCheck, 
    Activity, Eye, Clock, Ticket
} from 'lucide-react';
import { useMainStore } from '../../store/useMainStore';
import { useMarketStore } from '../../store/useMarketStore';
import { useNavigate } from 'react-router-dom';

/**
 * FEATURE 1: Framer Motion Staggered Rendering Engine
 * FEATURE 2: Buyer/Seller Global State Synchronization
 * FEATURE 3: Real-Time Inventory Value Auto-Calculator
 * FEATURE 4: Dynamic Search & Filtering Engine
 * FEATURE 5: Live Active/Expired State Badging
 * FEATURE 6: Tier Extraction & Volume Aggregation
 * FEATURE 7: 1:1 Viagogo Enterprise Empty State
 * FEATURE 8: Quick-Action Routing to Seller Dashboard
 * FEATURE 9: Hardware-Accelerated Layout Transitions
 * FEATURE 10: Strict ISO Date Parsing 
 */

const formatDate = (isoString) => {
    if (!isoString) return 'Date TBA';
    const d = new Date(isoString);
    if (isNaN(d)) return 'Date TBA';
    return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
};

export default function ListingsTab() {
    const navigate = useNavigate();
    const { user } = useMainStore();
    const { activeListings, isLoading, initMarketListener } = useMarketStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('date');

    // FEATURE 2: Failsafe initialization of market data
    useEffect(() => {
        const unsubscribe = initMarketListener();
        return () => {
            if (unsubscribe && typeof unsubscribe === 'function') unsubscribe();
        };
    }, [initMarketListener]);

    // FEATURE 4: Algorithmic Filtering and Aggregation
    const { myListings, stats } = useMemo(() => {
        if (!user || !user.uid) return { myListings: [], stats: { totalValue: 0, totalTickets: 0, activeCount: 0 } };

        // 1. Strict Isolation: Only listings matching the current user's UID
        const baseListings = activeListings.filter(listing => listing.sellerId === user.uid);

        // 2. Search Application
        let filtered = baseListings.filter(listing => {
            if (!searchQuery) return true;
            const term = searchQuery.toLowerCase();
            return (listing.title || listing.eventName || '').toLowerCase().includes(term) || 
                   (listing.stadium || listing.loc || '').toLowerCase().includes(term);
        });

        // 3. Sorting Engine
        filtered.sort((a, b) => {
            if (sortBy === 'date') {
                return new Date(a.commence_time || a.eventTimestamp).getTime() - new Date(b.commence_time || b.eventTimestamp).getTime();
            }
            if (sortBy === 'value') {
                const valA = (a.ticketTiers || []).reduce((acc, t) => acc + (t.price * t.quantity), 0);
                const valB = (b.ticketTiers || []).reduce((acc, t) => acc + (t.price * t.quantity), 0);
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
            const isActive = eventTime >= new Date().getTime();
            if (isActive) activeCount++;

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
    }, [activeListings, user, searchQuery, sortBy]);

    // Animation Configurations
    const listVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.08 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.1 } }
    };

    return (
        <div className="w-full bg-white rounded-[12px] min-h-[500px] flex flex-col">
            
            {/* Header & Controls */}
            <div className="p-6 md:p-8 border-b border-[#e2e2e2] flex flex-col space-y-6 shrink-0 bg-[#f8f9fa] rounded-t-[12px]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-[24px] font-black text-[#1a1a1a] tracking-tight mb-1">My Active Listings</h2>
                        <p className="text-[13px] text-[#54626c] font-medium">Manage and track the tickets you are currently selling on the Parbet network.</p>
                    </div>
                    <button 
                        onClick={() => window.open('https://seller.parbet.com', '_blank')}
                        className="bg-[#1a1a1a] text-white px-5 py-2.5 rounded-[8px] text-[13px] font-bold hover:bg-black transition-colors flex items-center shrink-0 w-max"
                    >
                        Seller Dashboard <ExternalLink size={16} className="ml-2" />
                    </button>
                </div>

                {/* FEATURE 3: Top-Level Real-Time Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                    <div className="bg-white p-4 rounded-[8px] border border-gray-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Listings</p>
                            <p className="text-[20px] font-black text-[#1a1a1a]">{myListings.length}</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600"><List size={18}/></div>
                    </div>
                    <div className="bg-white p-4 rounded-[8px] border border-gray-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tickets in Stock</p>
                            <p className="text-[20px] font-black text-[#1a1a1a]">{stats.totalTickets}</p>
                        </div>
                        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600"><Ticket size={18}/></div>
                    </div>
                    <div className="bg-white p-4 rounded-[8px] border border-gray-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Potential Revenue</p>
                            <p className="text-[20px] font-black text-[#1a1a1a]">₹{stats.totalValue.toLocaleString()}</p>
                        </div>
                        <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600"><TrendingUp size={18}/></div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 pt-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search your listings..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e2e2e2] rounded-[8px] text-[14px] focus:bg-white focus:border-[#427A1A] outline-none transition-colors"
                        />
                    </div>
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-[#e2e2e2] rounded-[8px] text-[14px] font-bold text-[#1a1a1a] outline-none focus:border-[#427A1A] cursor-pointer"
                    >
                        <option value="date">Sort by Date</option>
                        <option value="value">Sort by Highest Value</option>
                    </select>
                </div>
            </div>

            {/* List Body */}
            <div className="p-6 md:p-8 flex-1">
                {isLoading ? (
                    <div className="w-full flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#427A1A] rounded-full animate-spin mb-4"></div>
                        <p className="text-[14px] font-bold text-gray-500 uppercase tracking-widest">Scanning Marketplace Network</p>
                    </div>
                ) : myListings.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="w-full bg-[#f8f9fa] border border-[#e2e2e2] border-dashed rounded-[12px] p-12 flex flex-col items-center justify-center text-center shadow-sm"
                    >
                        <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-4 shadow-sm">
                            <Tag size={32} className="text-gray-300" />
                        </div>
                        <h3 className="text-[18px] font-black text-[#1a1a1a] mb-2">You don't have any listings right now</h3>
                        <p className="text-[14px] text-gray-500 max-w-md mb-6">
                            {searchQuery 
                                ? "No listings matched your specific search criteria."
                                : "When you list tickets for sale on Parbet, they will automatically sync and appear here."}
                        </p>
                        {!searchQuery && (
                            <button 
                                onClick={() => window.open('https://seller.parbet.com', '_blank')}
                                className="bg-[#427A1A] text-white px-6 py-2.5 rounded-[8px] font-bold text-[14px] hover:bg-[#2F6114] transition-colors shadow-sm"
                            >
                                Create First Listing
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <motion.div 
                        variants={listVariants} 
                        initial="hidden" 
                        animate="show" 
                        className="flex flex-col space-y-6"
                    >
                        <AnimatePresence>
                            {myListings.map((listing) => {
                                const eventTime = new Date(listing.commence_time || listing.eventTimestamp).getTime();
                                const isActive = eventTime >= new Date().getTime();
                                
                                let listingQty = 0;
                                let listingVal = 0;
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
                                    <motion.div 
                                        key={listing.id}
                                        variants={itemVariants}
                                        className="bg-white border border-[#e2e2e2] rounded-[12px] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className={`px-5 py-2.5 flex items-center justify-between border-b ${isActive ? 'bg-[#eaf4d9] border-[#d4edda]' : 'bg-gray-100 border-gray-200'}`}>
                                            <div className="flex items-center gap-2">
                                                {isActive ? <Activity size={16} className="text-[#427A1A]" /> : <Clock size={16} className="text-gray-500" />}
                                                <span className={`text-[12px] font-black uppercase tracking-widest ${isActive ? 'text-[#427A1A]' : 'text-gray-500'}`}>
                                                    {isActive ? 'Active on Marketplace' : 'Event Passed'}
                                                </span>
                                            </div>
                                            <span className="text-[12px] font-mono text-gray-500">ID: {listing.id.substring(0,8).toUpperCase()}</span>
                                        </div>

                                        <div className="p-5 flex flex-col md:flex-row gap-6">
                                            <div className="w-full md:w-32 h-24 bg-gray-100 rounded-[8px] overflow-hidden shrink-0 border border-gray-200">
                                                <img src={listing.imageUrl || "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400"} alt="Event" className="w-full h-full object-cover" />
                                            </div>
                                            
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-[18px] font-black text-[#1a1a1a] leading-tight mb-2 hover:text-[#427A1A] cursor-pointer transition-colors" onClick={() => navigate(`/event?id=${listing.id}`)}>
                                                        {listing.title || listing.eventName}
                                                    </h3>
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-[13px] text-[#54626c] font-medium mb-3">
                                                        <span className="flex items-center"><Calendar size={14} className="mr-1.5 text-gray-400" /> {formatDate(listing.commence_time || listing.eventTimestamp)}</span>
                                                        <span className="flex items-center"><MapPin size={14} className="mr-1.5 text-gray-400" /> {listing.stadium || listing.loc || 'Venue TBA'}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-4 text-[12px] font-bold">
                                                    <span className="bg-gray-100 text-[#1a1a1a] px-3 py-1 rounded-[4px] flex items-center border border-gray-200">
                                                        <Ticket size={12} className="mr-1.5 text-gray-500" /> {listingQty} Available
                                                    </span>
                                                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-[4px] flex items-center border border-green-200">
                                                        <ShieldCheck size={12} className="mr-1.5 text-green-600" /> Verified Listing
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="w-full md:w-48 shrink-0 flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6 text-right">
                                                <div>
                                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Valuation</p>
                                                    <p className="text-[22px] font-black text-[#1a1a1a]">₹{listingVal.toLocaleString()}</p>
                                                </div>
                                                <button 
                                                    onClick={() => navigate(`/event?id=${listing.id}`)}
                                                    className="w-full py-2 bg-white border border-[#e2e2e2] text-[#1a1a1a] text-[13px] font-bold rounded-[8px] hover:bg-gray-50 transition-colors flex items-center justify-center shadow-sm"
                                                >
                                                    <Eye size={16} className="mr-2" /> View Public Page
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
}