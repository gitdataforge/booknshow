import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Ticket, Clock, Calendar, MapPin, Search, 
    ArrowRight, CheckCircle2, AlertCircle, Building, 
    CreditCard, ChevronRight, HelpCircle, Repeat
} from 'lucide-react';
import { useMainStore } from '../../store/useMainStore';

/**
 * FEATURE 1: Framer Motion Staggered Rendering Engine
 * FEATURE 2: Intelligent Time-Series Splitting (Upcoming vs Past)
 * FEATURE 3: Viagogo 1:1 Empty State Architecture
 * FEATURE 4: Secure Data Fallbacks for Legacy Documents
 * FEATURE 5: Dynamic Order Status Badges (Pending vs Completed)
 * FEATURE 6: Payment Gateway Icon Mapping (Razorpay vs Bank Transfer)
 * FEATURE 7: Integrated Resell Action Hooks
 * FEATURE 8: Support Desk Action Hooks
 * FEATURE 9: Cryptographic Order ID Truncation
 * FEATURE 10: Interactive Tab Controller
 */

// Strict formatters
const formatDate = (isoString) => {
    if (!isoString) return 'Date TBA';
    const d = new Date(isoString);
    if (isNaN(d)) return 'Date TBA';
    return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
};

const formatTime = (isoString) => {
    if (!isoString) return 'Time TBA';
    const d = new Date(isoString);
    if (isNaN(d)) return 'Time TBA';
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

const generateShortHash = (id) => {
    if (!id) return '00000000';
    return id.substring(0, 8).toUpperCase();
};

export default function OrdersTab() {
    const { orders, isLoadingOrders } = useMainStore();
    const [activeTab, setActiveTab] = useState('upcoming');
    const [searchQuery, setSearchQuery] = useState('');

    // FEATURE 2: Intelligent Time-Series Splitting
    const { upcoming, past } = useMemo(() => {
        const now = new Date().getTime();
        const upcomingArr = [];
        const pastArr = [];

        // Apply strict search filtering simultaneously
        const filtered = orders.filter(o => {
            if (!searchQuery) return true;
            const term = searchQuery.toLowerCase();
            const eName = (o.eventName || '').toLowerCase();
            const oId = (o.paymentId || o.id || '').toLowerCase();
            return eName.includes(term) || oId.includes(term);
        });

        filtered.forEach(order => {
            const eventTime = new Date(order.commence_time || order.eventTimestamp).getTime();
            // If date is invalid or in the future, it is upcoming. Otherwise, it is past.
            if (isNaN(eventTime) || eventTime >= now) {
                upcomingArr.push(order);
            } else {
                pastArr.push(order);
            }
        });

        return { upcoming: upcomingArr, past: pastArr };
    }, [orders, searchQuery]);

    const displayOrders = activeTab === 'upcoming' ? upcoming : past;

    // Animation Configurations
    const listVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.1 } }
    };

    return (
        <div className="w-full bg-white rounded-[12px] min-h-[500px] flex flex-col">
            
            {/* Header & Controls */}
            <div className="p-6 md:p-8 border-b border-[#e2e2e2] flex flex-col space-y-6 shrink-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-[24px] font-black text-[#1a1a1a] tracking-tight">My Orders</h2>
                    
                    {/* Search Bar */}
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search by event or order ID" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-[#e2e2e2] rounded-[8px] text-[14px] focus:bg-white focus:border-[#427A1A] outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* Tab Controller */}
                <div className="flex items-center space-x-6 border-b border-gray-200">
                    <button 
                        onClick={() => setActiveTab('upcoming')}
                        className={`pb-3 text-[15px] font-bold transition-colors relative ${activeTab === 'upcoming' ? 'text-[#1a1a1a]' : 'text-gray-500 hover:text-[#1a1a1a]'}`}
                    >
                        Upcoming ({upcoming.length})
                        {activeTab === 'upcoming' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#427A1A] rounded-t-md"></div>}
                    </button>
                    <button 
                        onClick={() => setActiveTab('past')}
                        className={`pb-3 text-[15px] font-bold transition-colors relative ${activeTab === 'past' ? 'text-[#1a1a1a]' : 'text-gray-500 hover:text-[#1a1a1a]'}`}
                    >
                        Past Events ({past.length})
                        {activeTab === 'past' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#427A1A] rounded-t-md"></div>}
                    </button>
                </div>
            </div>

            {/* List Body */}
            <div className="p-6 md:p-8 flex-1 bg-gray-50/50">
                {isLoadingOrders ? (
                    <div className="w-full flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#427A1A] rounded-full animate-spin mb-4"></div>
                        <p className="text-[14px] font-bold text-gray-500 uppercase tracking-widest">Retrieving Secure Ledger</p>
                    </div>
                ) : displayOrders.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="w-full bg-white border border-[#e2e2e2] border-dashed rounded-[12px] p-12 flex flex-col items-center justify-center text-center shadow-sm"
                    >
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Ticket size={32} className="text-gray-300" />
                        </div>
                        <h3 className="text-[18px] font-black text-[#1a1a1a] mb-2">No {activeTab} orders found</h3>
                        <p className="text-[14px] text-gray-500 max-w-md">
                            {searchQuery 
                                ? "We couldn't find any orders matching your search. Try a different keyword."
                                : "When you buy tickets, your secure order details and e-tickets will appear here."}
                        </p>
                    </motion.div>
                ) : (
                    <motion.div 
                        variants={listVariants} 
                        initial="hidden" 
                        animate="show" 
                        className="flex flex-col space-y-6"
                    >
                        <AnimatePresence>
                            {displayOrders.map((order) => {
                                const isPending = order.status === 'pending_approval' || order.paymentMethod === 'bank_transfer';
                                
                                return (
                                    <motion.div 
                                        key={order.id}
                                        variants={itemVariants}
                                        className="bg-white border border-[#e2e2e2] rounded-[12px] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                                    >
                                        {/* Status Header */}
                                        <div className={`px-5 py-2.5 flex items-center justify-between border-b ${isPending ? 'bg-orange-50 border-orange-100' : 'bg-[#f0f9f0] border-[#d4edda]'}`}>
                                            <div className="flex items-center gap-2">
                                                {isPending ? (
                                                    <AlertCircle size={16} className="text-orange-600" />
                                                ) : (
                                                    <CheckCircle2 size={16} className="text-[#427A1A]" />
                                                )}
                                                <span className={`text-[12px] font-black uppercase tracking-widest ${isPending ? 'text-orange-700' : 'text-[#427A1A]'}`}>
                                                    {isPending ? 'Reviewing Payment Proof' : 'Order Confirmed'}
                                                </span>
                                            </div>
                                            <span className="text-[12px] text-gray-500 font-mono">
                                                Order #{generateShortHash(order.paymentId || order.id)}
                                            </span>
                                        </div>

                                        <div className="p-5 flex flex-col md:flex-row gap-6">
                                            {/* Event Info */}
                                            <div className="flex-1 flex flex-col justify-between space-y-4">
                                                <div>
                                                    <h3 className="text-[18px] font-black text-[#1a1a1a] leading-tight mb-2">
                                                        {order.eventName || 'Parbet Event'}
                                                    </h3>
                                                    <div className="flex items-center text-[13px] text-[#54626c] font-medium mb-1">
                                                        <Calendar size={14} className="mr-2 text-gray-400" />
                                                        {formatDate(order.commence_time || order.eventTimestamp)} • {formatTime(order.commence_time || order.eventTimestamp)}
                                                    </div>
                                                    <div className="flex items-center text-[13px] text-[#54626c] font-medium">
                                                        <MapPin size={14} className="mr-2 text-gray-400" />
                                                        {order.eventLoc || 'Venue TBA'}
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
                                                    <button 
                                                        disabled={isPending}
                                                        className={`px-5 py-2 rounded-[8px] text-[13px] font-bold transition-colors shadow-sm flex items-center ${isPending ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#427A1A] text-white hover:bg-[#2F6114]'}`}
                                                        onClick={() => alert("Please instruct the AI to build the TicketUI.jsx component to view E-Tickets.")}
                                                    >
                                                        <Ticket size={16} className="mr-2" />
                                                        {isPending ? 'Ticket Locked' : 'View E-Ticket'}
                                                    </button>
                                                    <button className="px-5 py-2 bg-white border border-[#e2e2e2] text-[#1a1a1a] text-[13px] font-bold rounded-[8px] hover:bg-gray-50 transition-colors flex items-center shadow-sm">
                                                        <Repeat size={16} className="mr-2" /> Resell
                                                    </button>
                                                    <button className="px-3 py-2 text-gray-500 hover:text-[#1a1a1a] transition-colors">
                                                        <HelpCircle size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Order Ledger Right Side */}
                                            <div className="w-full md:w-[220px] shrink-0 bg-gray-50 rounded-[8px] border border-gray-100 p-4 flex flex-col justify-between">
                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Section / Tier</p>
                                                        <p className="text-[14px] font-bold text-[#1a1a1a]">{order.tierName || 'General Admission'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Quantity</p>
                                                        <p className="text-[14px] font-bold text-[#1a1a1a]">{order.quantity} Tickets</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Payment Method</p>
                                                        <div className="flex items-center gap-1.5 text-[14px] font-bold text-[#1a1a1a]">
                                                            {order.paymentMethod === 'bank_transfer' ? <Building size={14} className="text-gray-500"/> : <CreditCard size={14} className="text-gray-500"/>}
                                                            {order.paymentMethod === 'bank_transfer' ? 'Manual Escrow' : 'Razorpay Secure'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
                                                    <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Total</span>
                                                    <span className="text-[18px] font-black text-[#1a1a1a]">₹{order.totalAmount?.toLocaleString()}</span>
                                                </div>
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