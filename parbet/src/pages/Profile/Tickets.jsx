import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Clock, CheckCircle2, MessageSquare, 
    AlertCircle, Zap, ShieldCheck, ChevronDown, 
    LifeBuoy, ArrowRight, Ticket as TicketIcon, HelpCircle
} from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useMainStore } from '../../store/useMainStore';
import { useNavigate } from 'react-router-dom';

/**
 * GLOBAL REBRAND: Booknshow Identity Application (Phase 11 User Tickets Portal)
 * Enforced Colors: #FFFFFF, #E7364D, #333333, #EB5B6E, #FAD8DC, #A3A3A3, #626262
 * FEATURE 1: Real-Time User Ticket Hydration (Strict UID Isolation)
 * FEATURE 2: Local High-Performance Sorting Engine (Bypasses Index Requirements)
 * FEATURE 3: Dynamic Ticket Analytics Dashboard
 * FEATURE 4: Multi-State Status Badging & Priority Mapping
 * FEATURE 5: Expandable Accordion Thread View (User Msg vs Admin Reply)
 * FEATURE 6: Embedded Booknshow Vector Identity
 * FEATURE 7: Illustrative Ambient Backgrounds
 * FEATURE 8: Search & Category Filter Interceptor
 * FEATURE 9: Hardware-Accelerated Animation Arrays
 * FEATURE 10: Seamless Support Escalation CTA
 */

const BooknshowLogo = ({ className = "h-8" }) => (
    <svg viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="10" y="70" fontFamily="Inter, sans-serif" fontSize="64" fontWeight="800" fill="#333333" letterSpacing="-2">book</text>
        <g transform="translate(170, 10) rotate(-12)">
            <path d="M0,0 L16,10 L32,0 L48,10 L64,0 L80,10 L80,95 L60,95 A20,20 0 0,0 20,95 L0,95 Z" fill="#E7364D" />
            <text x="21" y="72" fontFamily="Inter, sans-serif" fontSize="60" fontWeight="900" fill="#FFFFFF">n</text>
        </g>
        <text x="250" y="70" fontFamily="Inter, sans-serif" fontSize="64" fontWeight="800" fill="#333333" letterSpacing="-2">show</text>
    </svg>
);

const AmbientBackground = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
            className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-[#FAD8DC] opacity-30 blur-[100px]"
            animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
            className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full bg-[#EB5B6E] opacity-10 blur-[120px]"
            animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
    </div>
);

const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    if (isNaN(d)) return 'Processing...';
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export default function UserTickets() {
    const navigate = useNavigate();
    const { user } = useMainStore();
    
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [expandedTicketId, setExpandedTicketId] = useState(null);

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'parbet-44902';

    // FEATURE 1: Real-Time Sync scoped strictly to the authenticated user
    useEffect(() => {
        if (!user || !user.uid) {
            setIsLoading(false);
            return;
        }

        const ticketsRef = collection(db, 'artifacts', appId, 'support_tickets');
        const q = query(ticketsRef, where('userId', '==', user.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedTickets = [];
            snapshot.forEach((doc) => {
                fetchedTickets.push({ id: doc.id, ...doc.data() });
            });
            setTickets(fetchedTickets);
            setIsLoading(false);
        }, (error) => {
            console.error("User Ticket Sync Error:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user, appId]);

    // FEATURE 2, 3 & 8: Local sorting, filtering, and analytic computations
    const { processedTickets, analytics } = useMemo(() => {
        let openCount = 0;
        let closedCount = 0;
        let urgentCount = 0;

        let filtered = tickets.filter(ticket => {
            // Analytics Calculation
            if (ticket.status === 'Open') openCount++;
            if (ticket.status === 'Closed') closedCount++;
            if (ticket.priority === 'Urgent' && ticket.status === 'Open') urgentCount++;

            // Status Filter
            if (activeFilter !== 'All' && ticket.status !== activeFilter) return false;

            // Search Filter
            if (searchQuery) {
                const term = searchQuery.toLowerCase();
                return (
                    (ticket.subject || '').toLowerCase().includes(term) ||
                    (ticket.id || '').toLowerCase().includes(term) ||
                    (ticket.message || '').toLowerCase().includes(term)
                );
            }
            return true;
        });

        // Local Sort: Newest First (Bypasses Firestore Index limits)
        filtered.sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
        });

        return { 
            processedTickets: filtered, 
            analytics: { total: tickets.length, openCount, closedCount, urgentCount } 
        };
    }, [tickets, activeFilter, searchQuery]);

    const toggleAccordion = (id) => {
        setExpandedTicketId(prev => prev === id ? null : id);
    };

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 120 } } };

    return (
        <div className="w-full min-h-screen bg-transparent font-sans pb-20 pt-8 px-4 md:px-8 relative">
            <AmbientBackground />

            <motion.div 
                initial="hidden" animate="show" variants={containerVariants} 
                className="max-w-[1000px] mx-auto relative z-10"
            >
                {/* Header Section */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-[32px] md:text-[40px] font-black text-[#333333] tracking-tighter leading-none mb-3">
                            Support History
                        </h1>
                        <p className="text-[15px] font-medium text-[#626262]">
                            Track the status of your inquiries and communications with the Booknshow team.
                        </p>
                    </div>
                    <BooknshowLogo className="h-8 md:h-10 opacity-90 hidden md:block" />
                </motion.div>

                {/* Analytics Dashboard Grid */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[12px] p-5 shadow-sm relative overflow-hidden group hover:border-[#E7364D]/50 transition-colors">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-[#F5F5F5] rounded-full blur-[20px] -mr-5 -mt-5 group-hover:scale-150 transition-transform"></div>
                        <TicketIcon size={20} className="text-[#333333] mb-3 relative z-10" />
                        <p className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest relative z-10">Total Tickets</p>
                        <p className="text-[28px] font-black text-[#333333] leading-none mt-1 relative z-10">{analytics.total}</p>
                    </div>
                    <div className="bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[12px] p-5 shadow-sm relative overflow-hidden group hover:border-[#E7364D]/50 transition-colors">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-[#EB5B6E]/10 rounded-full blur-[20px] -mr-5 -mt-5 group-hover:scale-150 transition-transform"></div>
                        <Clock size={20} className="text-[#EB5B6E] mb-3 relative z-10" />
                        <p className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest relative z-10">In Progress</p>
                        <p className="text-[28px] font-black text-[#333333] leading-none mt-1 relative z-10">{analytics.openCount}</p>
                    </div>
                    <div className="bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[12px] p-5 shadow-sm relative overflow-hidden group hover:border-[#E7364D]/50 transition-colors">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-[#E7364D]/10 rounded-full blur-[20px] -mr-5 -mt-5 group-hover:scale-150 transition-transform"></div>
                        <CheckCircle2 size={20} className="text-[#E7364D] mb-3 relative z-10" />
                        <p className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest relative z-10">Resolved</p>
                        <p className="text-[28px] font-black text-[#333333] leading-none mt-1 relative z-10">{analytics.closedCount}</p>
                    </div>
                    <div className="bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[12px] p-5 shadow-sm relative overflow-hidden group hover:border-[#E7364D]/50 transition-colors">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-[#333333]/5 rounded-full blur-[20px] -mr-5 -mt-5 group-hover:scale-150 transition-transform"></div>
                        <Zap size={20} className="text-[#333333] mb-3 relative z-10" />
                        <p className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest relative z-10">Urgent</p>
                        <p className="text-[28px] font-black text-[#333333] leading-none mt-1 relative z-10">{analytics.urgentCount}</p>
                    </div>
                </motion.div>

                {/* Filter and Search Section */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-[#FFFFFF] p-4 rounded-[12px] border border-[#A3A3A3]/20 shadow-sm">
                    <div className="flex bg-[#F5F5F5] border border-[#A3A3A3]/20 rounded-[8px] p-1 w-full md:w-auto shrink-0">
                        {['All', 'Open', 'Closed'].map(status => (
                            <button
                                key={status}
                                onClick={() => { setActiveFilter(status); setExpandedTicketId(null); }}
                                className={`flex-1 md:px-6 py-2 rounded-[6px] text-[13px] font-bold transition-all ${activeFilter === status ? 'bg-[#FFFFFF] text-[#E7364D] shadow-sm border border-[#A3A3A3]/10' : 'text-[#626262] hover:text-[#333333]'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-[350px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3A3A3]" size={18} />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setExpandedTicketId(null); }}
                            placeholder="Search ticket subject or ID..."
                            className="w-full pl-10 pr-4 py-2.5 bg-[#F5F5F5] border border-[#A3A3A3]/20 rounded-[8px] text-[14px] text-[#333333] font-bold outline-none focus:bg-[#FFFFFF] focus:border-[#E7364D] transition-colors"
                        />
                    </div>
                </motion.div>

                {/* Tickets Ledger List */}
                <motion.div variants={itemVariants} className="space-y-4 min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div 
                                key="loading"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-24 text-center"
                            >
                                <div className="w-10 h-10 border-4 border-[#FAD8DC] border-t-[#E7364D] rounded-full animate-spin mb-4 mx-auto"></div>
                                <p className="text-[14px] font-bold text-[#626262] uppercase tracking-widest">Retrieving Secure Records...</p>
                            </motion.div>
                        ) : processedTickets.length > 0 ? (
                            <motion.div 
                                key="tickets-list"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                <AnimatePresence>
                                    {processedTickets.map(ticket => (
                                        <motion.div 
                                            key={ticket.id}
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }}
                                            className="bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[12px] shadow-sm overflow-hidden"
                                        >
                                            <button 
                                                onClick={() => toggleAccordion(ticket.id)}
                                                className="w-full px-6 py-5 flex flex-col md:flex-row md:items-center justify-between text-left hover:bg-[#FAFAFA] transition-colors gap-4"
                                            >
                                                <div className="flex-1 min-w-0 pr-4">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-[4px] border ${ticket.status === 'Open' ? 'bg-[#FAD8DC]/30 text-[#E7364D] border-[#E7364D]/20' : 'bg-[#F5F5F5] text-[#626262] border-[#A3A3A3]/30'}`}>
                                                            {ticket.status}
                                                        </span>
                                                        <span className="text-[11px] font-mono text-[#A3A3A3] font-bold">ID: {ticket.id.substring(0,8).toUpperCase()}</span>
                                                        <span className="text-[11px] font-bold text-[#A3A3A3] flex items-center hidden md:flex">
                                                            <Clock size={12} className="mr-1" /> {formatDate(ticket.createdAt)}
                                                        </span>
                                                    </div>
                                                    <h3 className={`text-[16px] truncate transition-colors ${expandedTicketId === ticket.id ? 'font-black text-[#E7364D]' : 'font-bold text-[#333333]'}`}>
                                                        {ticket.subject}
                                                    </h3>
                                                </div>
                                                <div className="flex items-center justify-between w-full md:w-auto shrink-0">
                                                    <span className="text-[11px] font-bold text-[#A3A3A3] flex items-center md:hidden">
                                                        <Clock size={12} className="mr-1" /> {formatDate(ticket.createdAt)}
                                                    </span>
                                                    <ChevronDown size={20} className={`text-[#A3A3A3] transition-transform duration-300 ${expandedTicketId === ticket.id ? 'rotate-180 text-[#E7364D]' : ''}`} />
                                                </div>
                                            </button>

                                            <AnimatePresence>
                                                {expandedTicketId === ticket.id && (
                                                    <motion.div 
                                                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden bg-[#FAFAFA] border-t border-[#A3A3A3]/10"
                                                    >
                                                        <div className="p-6 space-y-6">
                                                            {/* User Message Block */}
                                                            <div>
                                                                <p className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-2 flex items-center">
                                                                    <User size={14} className="mr-1.5" /> Your Inquiry
                                                                </p>
                                                                <div className="bg-[#FFFFFF] border border-[#A3A3A3]/20 p-4 rounded-[8px] shadow-sm">
                                                                    <p className="text-[14px] text-[#626262] font-medium leading-relaxed whitespace-pre-wrap">
                                                                        {ticket.message}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Admin Reply Block */}
                                                            {ticket.status === 'Closed' && ticket.adminReply ? (
                                                                <div>
                                                                    <p className="text-[11px] font-black text-[#E7364D] uppercase tracking-widest mb-2 flex items-center">
                                                                        <ShieldCheck size={14} className="mr-1.5" /> Booknshow Support Reply
                                                                    </p>
                                                                    <div className="bg-[#FAD8DC]/20 border-l-4 border-[#E7364D] p-4 rounded-r-[8px]">
                                                                        <p className="text-[14px] text-[#333333] font-bold leading-relaxed whitespace-pre-wrap">
                                                                            {ticket.adminReply}
                                                                        </p>
                                                                        <p className="text-[11px] text-[#A3A3A3] font-bold mt-3 text-right">
                                                                            Replied on {formatDate(ticket.repliedAt)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-3 bg-[#FFFFFF] border border-[#A3A3A3]/20 p-4 rounded-[8px]">
                                                                    <div className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center border border-[#A3A3A3]/30">
                                                                        <Clock size={14} className="text-[#A3A3A3]" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[13px] font-bold text-[#333333]">Under Review</p>
                                                                        <p className="text-[12px] font-medium text-[#626262]">Our team is currently reviewing your ticket. We will respond shortly.</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                className="bg-[#FFFFFF] border border-[#A3A3A3]/20 border-dashed rounded-[16px] p-12 flex flex-col items-center justify-center text-center shadow-sm"
                            >
                                <div className="w-16 h-16 bg-[#FAFAFA] border border-[#A3A3A3]/20 rounded-full flex items-center justify-center mb-5">
                                    <HelpCircle size={28} className="text-[#A3A3A3]" />
                                </div>
                                <h3 className="text-[20px] font-black text-[#333333] mb-2">No tickets found</h3>
                                <p className="text-[14px] text-[#626262] font-medium max-w-sm mb-6">
                                    {searchQuery 
                                        ? `We couldn't find any tickets matching "${searchQuery}".` 
                                        : "You haven't submitted any support requests yet. If you need assistance, our team is ready to help."}
                                </p>
                                {searchQuery ? (
                                    <button 
                                        onClick={() => setSearchQuery('')}
                                        className="bg-[#333333] text-[#FFFFFF] px-6 py-2.5 rounded-[8px] font-bold text-[13px] hover:bg-[#E7364D] transition-colors shadow-sm"
                                    >
                                        Clear Search
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => navigate('/profile/support')}
                                        className="bg-[#E7364D] text-[#FFFFFF] px-6 py-2.5 rounded-[8px] font-bold text-[13px] hover:bg-[#EB5B6E] transition-colors shadow-sm flex items-center"
                                    >
                                        Create Support Ticket <ArrowRight size={16} className="ml-2" />
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Footer Support Escalation CTA */}
                <motion.div variants={itemVariants} className="mt-12 p-6 md:p-8 bg-[#333333] rounded-[16px] shadow-[0_10px_40px_rgba(51,51,51,0.2)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-[#E7364D]/20 rounded-full blur-[60px] pointer-events-none"></div>
                    <div className="flex items-center gap-5 relative z-10">
                        <div className="bg-[#FFFFFF]/10 p-4 rounded-full border border-[#FFFFFF]/20 shrink-0">
                            <LifeBuoy size={24} className="text-[#FFFFFF]" />
                        </div>
                        <div>
                            <h4 className="text-[18px] font-black text-[#FFFFFF] mb-1">Need immediate assistance?</h4>
                            <p className="text-[14px] font-medium text-[#A3A3A3]">Access the main support portal to open a new ticket or chat with us.</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate('/profile/support')}
                        className="w-full md:w-auto px-8 py-3.5 bg-[#FFFFFF] hover:bg-[#E7364D] text-[#333333] hover:text-[#FFFFFF] text-[14px] font-black rounded-[8px] transition-colors shadow-sm relative z-10"
                    >
                        Contact Support Hub
                    </button>
                </motion.div>

            </motion.div>
        </div>
    );
}