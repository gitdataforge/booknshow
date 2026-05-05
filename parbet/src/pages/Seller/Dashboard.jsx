import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Briefcase, PlusCircle, TrendingUp, Users, 
    Calendar, MapPin, Activity, CheckCircle2, 
    CreditCard, ArrowRight, ShieldCheck, PieChart,
    Ticket, Loader2, Download, AlertTriangle
} from 'lucide-react';

import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAppStore } from '../../store/useStore';

/**
 * GLOBAL REBRAND: Booknshow Identity Application (Phase 21 Seller Dashboard)
 * Enforced Colors: #FFFFFF, #E7364D, #333333, #EB5B6E, #FAD8DC, #A3A3A3, #626262
 * 
 * --- 10+ REAL FEATURES & SECTIONS ---
 * SECTION 1: Ambient Illustrative Backgrounds
 * SECTION 2: Master Seller Control Header
 * SECTION 3: Real-Time Financial Ledger Summary
 * SECTION 4: Live Event Roster Engine
 * SECTION 5: Granular Ticket Tier Analytics
 * SECTION 6: Escrow Status Tracking
 * SECTION 7: Hardware-Accelerated Action Cards
 * FEATURE 8: Firestore Real-Time Query Mapping (No mock data)
 * FEATURE 9: Automatic Status Categorization (Live vs Expired)
 * FEATURE 10: Strict RBAC Route Bouncer
 */

const formatDate = (timestamp) => {
    if (!timestamp) return 'Date TBA';
    const d = new Date(timestamp);
    if (isNaN(d)) return 'Date TBA';
    return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// SECTION 1: Ambient Background
const AmbientBackground = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
            className="absolute top-[-5%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#FAD8DC] opacity-20 blur-[120px]"
            animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
            className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#EB5B6E] opacity-10 blur-[100px]"
            animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
    </div>
);

export default function SellerDashboard() {
    const navigate = useNavigate();
    const { user, userRole } = useAppStore();
    
    // Real-time states
    const [sellerEvents, setSellerEvents] = useState([]);
    const [sellerOrders, setSellerOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Live');

    // FEATURE 10: Security Bouncer
    useEffect(() => {
        if (userRole !== 'seller' && userRole !== 'admin') {
            navigate('/', { replace: true });
        }
    }, [userRole, navigate]);

    // FEATURE 8: Real-Time Firestore Sync
    useEffect(() => {
        if (!user) return;
        
        setIsLoading(true);
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'parbet-44902';
        
        // 1. Fetch Events belonging to this seller
        // CRITICAL: Uses the exact compound index we built in the previous step
        const eventsRef = collection(db, 'events');
        const qEvents = query(eventsRef, where('sellerId', '==', user.uid), orderBy('commence_time', 'desc'));
        
        const unsubEvents = onSnapshot(qEvents, (snapshot) => {
            const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSellerEvents(events);
            
            // If events resolve but orders take a second, at least drop the loader
            setIsLoading(false); 
        }, (error) => {
            console.error("Seller Dashboard Sync Error:", error);
            setIsLoading(false);
        });

        // 2. Fetch Orders referencing this seller
        const ordersRef = collection(db, 'orders');
        const qOrders = query(ordersRef, where('sellerId', '==', user.uid));
        
        const unsubOrders = onSnapshot(qOrders, (snapshot) => {
            const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSellerOrders(orders);
        });

        return () => {
            unsubEvents();
            unsubOrders();
        };
    }, [user]);

    // Data Processing & Compute Engine
    const { filteredEvents, financials } = useMemo(() => {
        const now = new Date().getTime();
        let totalRevenue = 0;
        let ticketsSold = 0;
        let escrowPending = 0;

        // Calculate Revenue from Orders
        sellerOrders.forEach(order => {
            const amount = Number(order.amountPaid || order.totalAmount || 0);
            totalRevenue += amount;
            ticketsSold += Number(order.quantity || 1);
            
            // Assume events occurring in the future hold funds in escrow
            let eventTime;
            if (order.commence_time?.seconds) eventTime = order.commence_time.seconds * 1000;
            else if (order.commence_time) eventTime = new Date(order.commence_time).getTime();
            else eventTime = now - 10000; // Fallback assumes past event if missing

            if (eventTime >= now) {
                escrowPending += amount;
            }
        });

        // Categorize Events
        const mapped = sellerEvents.map(e => {
            let eventTime;
            if (e.commence_time?.seconds) eventTime = e.commence_time.seconds * 1000;
            else if (e.commence_time) eventTime = new Date(e.commence_time).getTime();
            else if (e.eventTimestamp) eventTime = new Date(e.eventTimestamp).getTime();
            else eventTime = now - 10000;

            const isLive = !isNaN(eventTime) && eventTime >= now;
            
            // Calculate capacity specific to this event
            let initialCapacity = 0;
            let currentCapacity = 0;
            
            if (e.ticketTiers && Array.isArray(e.ticketTiers)) {
                initialCapacity = e.ticketTiers.reduce((acc, tier) => acc + Number(tier.initialQuantity || tier.quantity || 0), 0);
                currentCapacity = e.ticketTiers.reduce((acc, tier) => acc + Number(tier.quantity || 0), 0);
            } else {
                initialCapacity = Number(e.initialQuantity || e.quantity || 0);
                currentCapacity = Number(e.quantity || 0);
            }

            const soldForEvent = initialCapacity - currentCapacity;

            return {
                ...e,
                isLive,
                displayDate: formatDate(e.commence_time || e.eventTimestamp),
                initialCapacity,
                currentCapacity,
                soldForEvent: soldForEvent > 0 ? soldForEvent : 0
            };
        });

        // Filter based on tab
        const filtered = mapped.filter(e => activeTab === 'Live' ? e.isLive : !e.isLive);

        return { 
            filteredEvents: filtered, 
            financials: { totalRevenue, ticketsSold, escrowPending, totalEvents: mapped.length } 
        };
    }, [sellerEvents, sellerOrders, activeTab]);

    // Animation Config
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFFFF]">
                <Loader2 className="animate-spin text-[#E7364D] mb-4" size={40} />
                <p className="text-[#333333] font-black text-[16px] tracking-widest uppercase">Connecting to Escrow...</p>
            </div>
        );
    }

    return (
        <div className="w-full font-sans min-h-screen relative pb-20 pt-4">
            <AmbientBackground />
            
            <motion.div initial="hidden" animate="show" variants={containerVariants} className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
                
                {/* SECTION 2: Master Seller Control Header */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pt-6">
                    <div>
                        <h1 className="text-[32px] font-black text-[#333333] leading-tight">Partner Dashboard</h1>
                        <p className="text-[#626262] font-medium text-[14px] mt-1">Manage listings, track revenue, and deploy stadium configurations.</p>
                    </div>
                    <Link to="/seller/create" className="bg-[#E7364D] text-[#FFFFFF] px-6 py-3.5 rounded-[8px] font-bold text-[14px] hover:bg-[#333333] transition-colors shadow-[0_4px_15px_rgba(231,54,77,0.3)] flex items-center w-max hover:-translate-y-0.5 duration-200">
                        <PlusCircle size={18} className="mr-2" /> Publish New Event
                    </Link>
                </motion.div>

                {/* SECTION 3: Real-Time Financial Ledger Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <motion.div variants={itemVariants} className="bg-[#FFFFFF] border border-[#A3A3A3]/20 p-6 rounded-[12px] shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-[#E7364D]/50 transition-colors h-[140px]">
                        <div className="flex items-center text-[#626262] mb-2">
                            <TrendingUp size={16} className="mr-2 text-[#E7364D]" />
                            <span className="text-[12px] font-bold uppercase tracking-widest">Gross Revenue</span>
                        </div>
                        <span className="text-[32px] font-black text-[#333333]">₹{financials.totalRevenue.toLocaleString()}</span>
                        <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.03]"><CreditCard size={100} /></div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-[#FFFFFF] border border-[#A3A3A3]/20 p-6 rounded-[12px] shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-[#E7364D]/50 transition-colors h-[140px]">
                        <div className="flex items-center text-[#626262] mb-2">
                            <ShieldCheck size={16} className="mr-2 text-[#E7364D]" />
                            <span className="text-[12px] font-bold uppercase tracking-widest">Locked in Escrow</span>
                        </div>
                        <span className="text-[32px] font-black text-[#333333]">₹{financials.escrowPending.toLocaleString()}</span>
                        <p className="text-[10px] font-bold text-[#A3A3A3] mt-1">Clears post-event completion</p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-[#FFFFFF] border border-[#A3A3A3]/20 p-6 rounded-[12px] shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-[#E7364D]/50 transition-colors h-[140px]">
                        <div className="flex items-center text-[#626262] mb-2">
                            <Ticket size={16} className="mr-2 text-[#A3A3A3]" />
                            <span className="text-[12px] font-bold uppercase tracking-widest">Tickets Sold</span>
                        </div>
                        <span className="text-[32px] font-black text-[#333333]">{financials.ticketsSold}</span>
                        <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.03]"><Ticket size={100} /></div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="bg-[#333333] p-6 rounded-[12px] shadow-[0_10px_30px_rgba(51,51,51,0.15)] relative overflow-hidden flex flex-col justify-between h-[140px]">
                        <div className="absolute right-[-10%] top-[-10%] w-32 h-32 bg-[#E7364D]/30 rounded-full blur-[40px] pointer-events-none" />
                        <div className="relative z-10 flex items-center text-[#FFFFFF] mb-2">
                            <Briefcase size={16} className="mr-2" />
                            <span className="text-[12px] font-bold uppercase tracking-widest text-[#FAD8DC]">Total Listings</span>
                        </div>
                        <span className="relative z-10 text-[32px] font-black text-[#FFFFFF]">{financials.totalEvents}</span>
                    </motion.div>
                </div>

                {/* Tab Navigation */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#A3A3A3]/20 mb-8 gap-4">
                    <div className="flex">
                        {['Live', 'Past'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 px-2 mr-8 text-[15px] font-black transition-all relative ${
                                    activeTab === tab 
                                    ? 'text-[#E7364D]' 
                                    : 'text-[#626262] hover:text-[#333333]'
                                }`}
                            >
                                {tab} Events
                                {activeTab === tab && (
                                    <motion.div layoutId="sellerTab" className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-[#E7364D] rounded-t-full"></motion.div>
                                )}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* SECTION 4: Live Event Roster Engine */}
                {filteredEvents.length > 0 ? (
                    <div className="space-y-6">
                        <AnimatePresence>
                            {filteredEvents.map((event) => (
                                <motion.div 
                                    key={event.id}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="show"
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[12px] overflow-hidden shadow-[0_4px_20px_rgba(51,51,51,0.03)] hover:shadow-[0_8px_30px_rgba(231,54,77,0.08)] hover:border-[#E7364D]/30 transition-all flex flex-col md:flex-row group"
                                >
                                    {/* Graphic Pillar */}
                                    <div className="w-full md:w-[240px] h-[160px] md:h-auto bg-[#F5F5F5] relative shrink-0 border-r border-[#A3A3A3]/10">
                                        <img src={event.imageUrl || "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800"} alt="Event Cover" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#333333]/80 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4">
                                            <span className={`inline-block px-2 py-1 rounded-[4px] text-[9px] font-black uppercase tracking-widest border ${event.isLive ? 'bg-[#E7364D] text-[#FFFFFF] border-[#E7364D]' : 'bg-[#A3A3A3] text-[#FFFFFF] border-[#A3A3A3]'}`}>
                                                {event.isLive ? 'Active Listing' : 'Archived'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Data Body */}
                                    <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-[22px] font-black text-[#333333] leading-tight group-hover:text-[#E7364D] transition-colors">{event.title || event.eventName}</h3>
                                                <button className="text-[#A3A3A3] hover:text-[#333333] transition-colors"><ArrowRight size={20} /></button>
                                            </div>
                                            
                                            <div className="flex flex-col gap-2 mt-4">
                                                <div className="flex items-center text-[13px] text-[#626262] font-medium">
                                                    <Calendar size={16} className="mr-3 text-[#E7364D]" /> {event.displayDate}
                                                </div>
                                                <div className="flex items-center text-[13px] text-[#626262] font-medium">
                                                    <MapPin size={16} className="mr-3 text-[#A3A3A3]" /> {event.stadium || event.loc || 'Venue TBA'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* SECTION 5: Granular Ticket Tier Analytics */}
                                        <div className="mt-6 pt-6 border-t border-[#A3A3A3]/20 grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="bg-[#FAFAFA] p-3 rounded-[8px] border border-[#A3A3A3]/10">
                                                <p className="text-[10px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1">Total Capacity</p>
                                                <p className="text-[16px] font-black text-[#333333]">{event.initialCapacity}</p>
                                            </div>
                                            <div className="bg-[#FAFAFA] p-3 rounded-[8px] border border-[#A3A3A3]/10">
                                                <p className="text-[10px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1">Remaining</p>
                                                <p className="text-[16px] font-black text-[#333333]">{event.currentCapacity}</p>
                                            </div>
                                            <div className="bg-[#FAFAFA] p-3 rounded-[8px] border border-[#A3A3A3]/10">
                                                <p className="text-[10px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1">Tickets Sold</p>
                                                <p className="text-[16px] font-black text-[#E7364D]">{event.soldForEvent}</p>
                                            </div>
                                            <div className="bg-[#FAFAFA] p-3 rounded-[8px] border border-[#A3A3A3]/10">
                                                <p className="text-[10px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1">Sell-Through</p>
                                                <p className="text-[16px] font-black text-[#333333]">{event.initialCapacity > 0 ? Math.round((event.soldForEvent / event.initialCapacity) * 100) : 0}%</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div variants={itemVariants} className="w-full flex flex-col items-center justify-center bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[12px] py-24 shadow-sm text-center">
                        <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mb-6">
                            <Briefcase size={32} className="text-[#A3A3A3] opacity-50" />
                        </div>
                        <h3 className="text-[20px] font-black text-[#333333] mb-2">No {activeTab} Listings Found</h3>
                        <p className="text-[14px] text-[#626262] font-medium max-w-md">Your seller ledger is currently empty. Initialize a new event to deploy stadium seating matrices.</p>
                        <Link to="/seller/create" className="mt-8 bg-[#333333] text-[#FFFFFF] px-6 py-3 rounded-[8px] font-bold text-[14px] hover:bg-[#E7364D] transition-colors shadow-sm inline-flex items-center">
                            <PlusCircle size={18} className="mr-2" /> Start Creating
                        </Link>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}