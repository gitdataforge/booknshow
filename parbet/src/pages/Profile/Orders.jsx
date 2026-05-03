import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Calendar, MapPin, Loader2, AlertCircle, CheckCircle2, Ticket, Repeat, Search, Download, HelpCircle, BarChart3 } from 'lucide-react';
import { useMainStore } from '../../store/useMainStore';

/**
 * GLOBAL REBRAND: Booknshow Identity Application (Phase 7 Profile Orders)
 * Enforced Colors: #FFFFFF, #E7364D, #333333, #EB5B6E, #FAD8DC, #A3A3A3, #626262
 * FEATURE 1: Illustrative Ambient Backgrounds
 * FEATURE 2: Real-Time Order Hydration from Global Store
 * FEATURE 3: Analytics Dashboard (Total Spent, Active Tickets)
 * FEATURE 4: Hardware-Accelerated Tab Switching (Upcoming vs Past)
 * FEATURE 5: Real-time Local Search Engine
 * FEATURE 6: Dynamic E-Ticket Action Cards
 * FEATURE 7: Transaction Status Trackers (Pending vs Confirmed)
 * FEATURE 8: 1:1 Rebranded Troubleshooting Empty State
 * FEATURE 9: Resale Portal Triggers
 * FEATURE 10: Support & Help Quick Actions
 */

// Safe Date Formatter
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

export default function Orders() {
    // SECTION 2: State Management
    const [activeTab, setActiveTab] = useState('Upcoming');
    const [searchQuery, setSearchQuery] = useState('');
    
    // SECTION 3: Real-Time Data Extraction
    const { orders, isLoadingOrders } = useMainStore();

    // SECTION 4: Analytics Calculation Logic
    const analytics = useMemo(() => {
        let active = 0;
        let totalSpent = 0;
        const now = new Date().getTime();
        
        orders.forEach(order => {
            totalSpent += Number(order.amount || 0);
            const eventTime = new Date(order.commence_time || order.eventTimestamp || order.createdAt).getTime();
            if (!isNaN(eventTime) && eventTime >= now) {
                active += Number(order.quantity || 1);
            }
        });
        
        return { active, totalSpent };
    }, [orders]);

    // SECTION 5: Logical Data Filtering (Production Rules for Upcoming vs Past + Search)
    const filteredOrders = useMemo(() => {
        const now = new Date().getTime();
        return orders.filter(order => {
            const eventTime = new Date(order.commence_time || order.eventTimestamp || order.createdAt).getTime();
            const isPast = !isNaN(eventTime) && eventTime < now;
            
            // Tab Filter
            if (activeTab === 'Upcoming' && isPast) return false;
            if (activeTab === 'Past' && !isPast) return false;
            
            // Search Filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const eventName = (order.eventName || '').toLowerCase();
                const orderId = (order.paymentId || order.id || '').toLowerCase();
                if (!eventName.includes(query) && !orderId.includes(query)) return false;
            }
            
            return true;
        });
    }, [orders, activeTab, searchQuery]);

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
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
                {/* SECTION 6: Header & Analytics Dashboard */}
                <div className="px-6 md:px-8 mb-8">
                    <motion.h1 variants={itemVariants} className="text-[32px] font-black text-[#333333] mb-6 tracking-tight leading-tight">
                        My Orders
                    </motion.h1>
                    
                    <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-2">
                        <div className="bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[12px] p-5 shadow-sm">
                            <div className="flex items-center text-[#626262] mb-2">
                                <Ticket size={16} className="mr-2 text-[#E7364D]" />
                                <span className="text-[13px] font-bold uppercase tracking-wider">Active Tickets</span>
                            </div>
                            <span className="text-[28px] font-black text-[#333333]">{analytics.active}</span>
                        </div>
                        <div className="bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[12px] p-5 shadow-sm">
                            <div className="flex items-center text-[#626262] mb-2">
                                <BarChart3 size={16} className="mr-2 text-[#E7364D]" />
                                <span className="text-[13px] font-bold uppercase tracking-wider">Total Orders</span>
                            </div>
                            <span className="text-[28px] font-black text-[#333333]">{orders.length}</span>
                        </div>
                        <div className="bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[12px] p-5 shadow-sm hidden md:block">
                            <div className="flex items-center text-[#626262] mb-2">
                                <CheckCircle2 size={16} className="mr-2 text-[#E7364D]" />
                                <span className="text-[13px] font-bold uppercase tracking-wider">Total Spent</span>
                            </div>
                            <span className="text-[28px] font-black text-[#333333]">₹{analytics.totalSpent.toLocaleString()}</span>
                        </div>
                    </motion.div>
                </div>
                
                {/* SECTION 7: Interactive Tab Navigation & Search */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#A3A3A3]/20 mb-8 px-6 md:px-8 gap-4">
                    <div className="flex">
                        {['Upcoming', 'Past'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 px-2 mr-8 text-[15px] font-black transition-all relative ${
                                    activeTab === tab 
                                    ? 'text-[#E7364D]' 
                                    : 'text-[#626262] hover:text-[#333333]'
                                }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div layoutId="orderTab" className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-[#E7364D] rounded-t-full"></motion.div>
                                )}
                            </button>
                        ))}
                    </div>
                    
                    {orders.length > 0 && (
                        <div className="relative w-full md:w-[280px] mb-4 md:mb-0">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3A3A3]" />
                            <input 
                                type="text"
                                placeholder="Search event or Order ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#F5F5F5] border border-[#A3A3A3]/20 text-[#333333] text-[14px] font-medium rounded-[8px] py-2.5 pl-9 pr-4 focus:outline-none focus:border-[#E7364D]/50 focus:bg-[#FFFFFF] transition-all"
                            />
                        </div>
                    )}
                </motion.div>

                <div className="px-6 md:px-8">
                    {/* SECTION 8: Real-Time Loading State Logic */}
                    {isLoadingOrders ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="animate-spin text-[#E7364D] mb-4" size={32} />
                            <p className="text-[#626262] font-bold text-[14px] uppercase tracking-widest">Decrypting Ledger...</p>
                        </div>
                    ) : filteredOrders.length > 0 ? (
                        
                        /* SECTION 9: Populated Orders List */
                        <div className="space-y-6">
                            <AnimatePresence>
                                {filteredOrders.map((order) => {
                                    const isPending = order.status === 'pending_approval' || order.paymentMethod === 'bank_transfer';
                                    return (
                                        <motion.div 
                                            key={order.id}
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="show"
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[12px] overflow-hidden shadow-[0_4px_20px_rgba(51,51,51,0.03)] hover:shadow-[0_8px_30px_rgba(231,54,77,0.08)] hover:border-[#E7364D]/30 transition-all group"
                                        >
                                            {/* Status Header */}
                                            <div className={`px-5 py-3 flex items-center justify-between border-b border-[#A3A3A3]/10 ${isPending ? 'bg-[#FAD8DC]/20' : 'bg-[#F5F5F5]'}`}>
                                                <div className="flex items-center gap-2.5">
                                                    {isPending ? <AlertCircle size={16} className="text-[#EB5B6E]" /> : <CheckCircle2 size={16} className="text-[#E7364D]" />}
                                                    <span className={`text-[12px] font-black uppercase tracking-widest ${isPending ? 'text-[#EB5B6E]' : 'text-[#E7364D]'}`}>
                                                        {isPending ? 'Reviewing Payment Proof' : 'Order Confirmed'}
                                                    </span>
                                                </div>
                                                <span className="text-[13px] font-bold text-[#A3A3A3] tracking-wide">
                                                    ID: {order.paymentId ? order.paymentId.substring(0,8).toUpperCase() : order.id.substring(0,8).toUpperCase()}
                                                </span>
                                            </div>
                                            
                                            {/* Body */}
                                            <div className="p-6 flex flex-col md:flex-row gap-8">
                                                <div className="flex-1 flex flex-col justify-between space-y-5">
                                                    <div>
                                                        <h3 className="text-[20px] font-black text-[#333333] leading-tight mb-3 group-hover:text-[#E7364D] transition-colors">{order.eventName || 'Booknshow Event'}</h3>
                                                        <div className="flex items-center text-[14px] text-[#626262] font-medium mb-2">
                                                            <Calendar size={16} className="mr-3 text-[#A3A3A3]" /> {formatDate(order.commence_time || order.eventTimestamp || order.createdAt)}
                                                        </div>
                                                        <div className="flex items-center text-[14px] text-[#626262] font-medium">
                                                            <MapPin size={16} className="mr-3 text-[#A3A3A3]" /> {order.eventLoc || 'Venue TBA'}
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Action Bar */}
                                                    <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-[#A3A3A3]/10">
                                                        <button disabled={isPending} className={`px-6 py-2.5 rounded-[8px] text-[14px] font-bold transition-all shadow-sm flex items-center ${isPending ? 'bg-[#F5F5F5] text-[#A3A3A3] cursor-not-allowed' : 'bg-[#E7364D] text-[#FFFFFF] hover:bg-[#EB5B6E] hover:shadow-[0_4px_15px_rgba(231,54,77,0.3)] hover:-translate-y-0.5'}`}>
                                                            <Download size={16} className="mr-2" /> Download E-Ticket
                                                        </button>
                                                        <button className="px-6 py-2.5 bg-[#FFFFFF] border border-[#A3A3A3]/30 text-[#333333] text-[14px] font-bold rounded-[8px] hover:bg-[#FAD8DC]/10 hover:border-[#E7364D] hover:text-[#E7364D] flex items-center transition-all">
                                                            <Repeat size={16} className="mr-2" /> Sell on Marketplace
                                                        </button>
                                                        <button className="p-2.5 bg-[#FFFFFF] border border-[#A3A3A3]/30 text-[#626262] rounded-[8px] hover:bg-[#F5F5F5] hover:text-[#333333] transition-all ml-auto md:ml-0" title="Get Support">
                                                            <HelpCircle size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                {/* Ticket Summary Side-Panel */}
                                                <div className="w-full md:w-[240px] bg-[#F5F5F5] rounded-[8px] border border-[#A3A3A3]/20 p-5 flex flex-col justify-center">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <p className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1">Section / Tier</p>
                                                            <p className="text-[15px] font-black text-[#333333]">{order.tierName || 'General Admission'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1">Quantity</p>
                                                            <p className="text-[15px] font-black text-[#333333]">{order.quantity} Tickets</p>
                                                        </div>
                                                        <div className="pt-3 border-t border-[#A3A3A3]/20">
                                                            <p className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1">Total Paid</p>
                                                            <p className="text-[18px] font-black text-[#E7364D]">₹{(Number(order.amount) || 0).toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    ) : (
                        /* SECTION 10: 1:1 Rebranded Troubleshooting Empty State */
                        <motion.div variants={itemVariants} className="w-full flex flex-col items-center md:items-start mt-4">
                            <div className="w-full max-w-[800px] border border-[#A3A3A3]/20 rounded-[12px] p-8 md:p-10 mb-10 bg-[#FFFFFF] shadow-[0_10px_40px_rgba(51,51,51,0.05)] relative overflow-hidden">
                                
                                {/* Empty State Decorator */}
                                <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-[#FAD8DC]/30 rounded-bl-full -z-0"></div>
                                
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-[#FAD8DC]/50 rounded-full flex items-center justify-center mb-6">
                                        <Search size={24} className="text-[#E7364D]" />
                                    </div>
                                    <h3 className="text-[20px] font-black text-[#333333] mb-8 leading-tight">
                                        Don't see your orders? <br className="md:hidden"/>Here's what you can do:
                                    </h3>
                                    
                                    <div className="space-y-8">
                                        <section>
                                            <p className="text-[15px] font-bold text-[#333333] mb-4">1. Check your email address</p>
                                            <ul className="space-y-3">
                                                <li className="flex items-start text-[14px] text-[#626262] font-medium leading-relaxed">
                                                    <ChevronRight size={18} className="text-[#E7364D] mr-3 mt-0.5 shrink-0" strokeWidth={3} />
                                                    Ensure the email used for purchase exactly matches the email on this account.
                                                </li>
                                                <li className="flex items-start text-[14px] text-[#626262] font-medium leading-relaxed">
                                                    <ChevronRight size={18} className="text-[#E7364D] mr-3 mt-0.5 shrink-0" strokeWidth={3} />
                                                    If different, sign out and sign back in with the correct email via Google Auth.
                                                </li>
                                            </ul>
                                        </section>

                                        <section>
                                            <p className="text-[15px] font-bold text-[#333333] mb-4">2. Did you check out as a guest?</p>
                                            <ul className="space-y-3">
                                                <li className="flex items-start text-[14px] text-[#626262] font-medium leading-relaxed">
                                                    <ChevronRight size={18} className="text-[#E7364D] mr-3 mt-0.5 shrink-0" strokeWidth={3} />
                                                    Find your secure Guest Access Code in the order confirmation email.
                                                </li>
                                                <li className="flex items-start text-[14px] text-[#626262] font-medium leading-relaxed">
                                                    <ChevronRight size={18} className="text-[#E7364D] mr-3 mt-0.5 shrink-0" strokeWidth={3} />
                                                    Sign out, click 'Sign In', and select 'Guest Purchase? Find your order'.
                                                </li>
                                                <li className="flex items-start text-[14px] text-[#626262] font-medium leading-relaxed">
                                                    <ChevronRight size={18} className="text-[#E7364D] mr-3 mt-0.5 shrink-0" strokeWidth={3} />
                                                    Enter your email and access code to decrypt and view your order.
                                                </li>
                                            </ul>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}