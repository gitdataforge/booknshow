import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Ticket, Search, Filter, Calendar, MapPin, 
    Download, ShieldCheck, Tag, Loader2, ArrowRight, 
    X, AlertCircle, CheckCircle2, ExternalLink, HelpCircle,
    BarChart3, Repeat, Eye, Zap, ChevronRight, Clock, Maximize2
} from 'lucide-react';
import { useMainStore } from '../../store/useMainStore';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { QRCodeSVG } from 'qrcode.react';

/**
 * GLOBAL REBRAND: Booknshow Identity Application (Phase 8 Profile Orders)
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
 * FEATURE 10: Strict Array Deduplication, Expanded PDF Layout & Exact SVG Logo
 * FEATURE 11: Micro-Typography Flex Layout for Complex Seat Strings
 * FEATURE 12: Dual-Timestamp Architecture (Booking Date vs Event Date)
 * FEATURE 13: Interactive High-Brightness QR Zoom Modal for Scanner Gates
 * FEATURE 14: Dynamic Stadium String Parser (Formats raw DB strings into human-readable ticket blocks)
 */

const formatDate = (isoString) => {
    if (!isoString) return 'Date TBA';
    const d = new Date(isoString);
    if (isNaN(d)) return 'Date TBA';
    return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
};

const formatTime = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    if (isNaN(d)) return '';
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

// FEATURE 14: Formats raw DB strings (e.g., NORTH-UPPER-A-R_A-S10) to human readable (NORTH UPPER A • Row A • Seat 10)
const formatSeatLabel = (seatStr) => {
    if (!seatStr || !seatStr.includes('-')) return seatStr;
    try {
        const parts = seatStr.split('-');
        if (parts.length < 3) return seatStr.replace(/_/g, ' ');
        const seatInfo = parts.pop(); 
        const rowInfo = parts.pop(); 
        const blockInfo = parts.join(' ');
        return `${blockInfo.replace(/_/g, ' ')} • Row ${rowInfo.replace('R_', '')} • Seat ${seatInfo.replace('S', '')}`;
    } catch (e) {
        return seatStr; // Fallback to raw string if parsing fails
    }
};

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

const BooknshowLogo = ({ className = "", textColor = "#FFFFFF" }) => {
    const fillHex = textColor.includes('#') ? textColor.match(/#(?:[0-9a-fA-F]{3,8})/)[0] : "#FFFFFF";
    
    return (
        <div className={`flex items-center justify-center select-none relative z-10 ${className}`}>
            <svg viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[40px] transform hover:scale-[1.02] transition-transform duration-300">
                <text x="10" y="70" fontFamily="Inter, sans-serif" fontSize="64" fontWeight="800" fill={fillHex} letterSpacing="-2">book</text>
                <g transform="translate(170, 10) rotate(-12)">
                    <path d="M0,0 L16,10 L32,0 L48,10 L64,0 L80,10 L80,95 L60,95 A20,20 0 0,0 20,95 L0,95 Z" fill="#E7364D" />
                    <text x="21" y="72" fontFamily="Inter, sans-serif" fontSize="60" fontWeight="900" fill="#FFFFFF">n</text>
                </g>
                <text x="250" y="70" fontFamily="Inter, sans-serif" fontSize="64" fontWeight="800" fill={fillHex} letterSpacing="-2">show</text>
            </svg>
        </div>
    );
};

export default function Orders() {
    const navigate = useNavigate();
    const { user, orders, isLoadingOrders } = useMainStore();
    
    const [activeTab, setActiveTab] = useState('Upcoming');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    
    // FEATURE 13: Zoomed QR State
    const [zoomedQR, setZoomedQR] = useState(null);
    const ticketRef = useRef(null);

    const uniqueOrders = useMemo(() => {
        if (!orders) return [];
        const seen = new Set();
        return orders.filter(order => {
            const isDuplicate = seen.has(order.id);
            seen.add(order.id);
            return !isDuplicate;
        });
    }, [orders]);

    const analytics = useMemo(() => {
        let active = 0;
        let totalSpent = 0;
        const now = new Date().getTime();
        
        uniqueOrders.forEach(order => {
            totalSpent += Number(order.amountPaid || order.totalAmount || 0);
            
            let eventTime;
            if (order.commence_time?.seconds) eventTime = order.commence_time.seconds * 1000;
            else if (order.commence_time) eventTime = new Date(order.commence_time).getTime();
            else if (order.eventTimestamp) eventTime = new Date(order.eventTimestamp).getTime();
            else if (order.createdAt?.seconds) eventTime = order.createdAt.seconds * 1000;
            else eventTime = new Date(order.createdAt).getTime();

            if (isNaN(eventTime) || eventTime >= now) {
                active += Number(order.quantity || 1);
            }
        });
        
        return { active, totalSpent };
    }, [uniqueOrders]);

    const filteredOrders = useMemo(() => {
        const now = new Date().getTime();
        return uniqueOrders.filter(order => {
            let eventTime;
            if (order.commence_time?.seconds) eventTime = order.commence_time.seconds * 1000;
            else if (order.commence_time) eventTime = new Date(order.commence_time).getTime();
            else if (order.eventTimestamp) eventTime = new Date(order.eventTimestamp).getTime();
            else if (order.createdAt?.seconds) eventTime = order.createdAt.seconds * 1000;
            else eventTime = new Date(order.createdAt).getTime();
            
            const isPast = !isNaN(eventTime) && eventTime < now;
            
            if (activeTab === 'Upcoming' && isPast) return false;
            if (activeTab === 'Past' && !isPast) return false;
            
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const eventName = (order.eventName || '').toLowerCase();
                const orderId = (order.paymentId || order.id || '').toLowerCase();
                if (!eventName.includes(query) && !orderId.includes(query)) return false;
            }
            
            return true;
        }).sort((a, b) => {
            const dateA = a.createdAt?.seconds || 0;
            const dateB = b.createdAt?.seconds || 0;
            return dateB - dateA;
        });
    }, [uniqueOrders, activeTab, searchQuery]);

    const handleDownloadTicket = async () => {
        if (!ticketRef.current || isDownloading) return;
        setIsDownloading(true);
        try {
            const canvas = await html2canvas(ticketRef.current, { scale: 2, backgroundColor: '#FFFFFF', useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Booknshow_Ticket_${selectedTicket.id.substring(0,8)}.pdf`);
        } catch (err) {
            console.error("PDF Generation failed:", err);
            alert("Failed to generate PDF. Please try taking a screenshot.");
        } finally {
            setIsDownloading(false);
        }
    };

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

    return (
        <div className="w-full font-sans pb-20 pt-4 relative min-h-screen bg-transparent">
            <AmbientBackground />
            
            <motion.div initial="hidden" animate="show" variants={containerVariants} className="relative z-10 w-full">
                
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
                            <span className="text-[28px] font-black text-[#333333]">{uniqueOrders.length}</span>
                        </div>
                        <div className="bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[12px] p-5 shadow-sm hidden md:block">
                            <div className="flex items-center text-[#626262] mb-2">
                                <CheckCircle2 size={16} className="mr-2 text-[#E7364D]" />
                                <span className="text-[13px] font-bold uppercase tracking-wider">Total Spent</span>
                            </div>
                            <span className="text-[28px] font-black text-[#333333]">INR {analytics.totalSpent.toLocaleString()}</span>
                        </div>
                    </motion.div>
                </div>
                
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
                    
                    {uniqueOrders.length > 0 && (
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
                    {isLoadingOrders ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="animate-spin text-[#E7364D] mb-4" size={32} />
                            <p className="text-[#626262] font-bold text-[14px] uppercase tracking-widest">Decrypting Ledger...</p>
                        </div>
                    ) : filteredOrders.length > 0 ? (
                        
                        <div className="space-y-6">
                            <AnimatePresence>
                                {filteredOrders.map((order) => {
                                    const isPending = order.status === 'pending_approval' || order.paymentMethod === 'bank_transfer' || order.status === 'Pending';
                                    
                                    // FEATURE 12: Dual Timestamp Resolution
                                    // 1. Transaction Date
                                    let transactionDate;
                                    if (order.createdAt?.seconds) transactionDate = order.createdAt.seconds * 1000;
                                    else transactionDate = order.createdAt;

                                    // 2. Scheduled Event Date
                                    let eventDate;
                                    if (order.commence_time?.seconds) eventDate = order.commence_time.seconds * 1000;
                                    else if (order.commence_time) eventDate = order.commence_time;
                                    else if (order.eventTimestamp) eventDate = order.eventTimestamp;
                                    else eventDate = transactionDate; // Fallback only if totally missing
                                    
                                    return (
                                        <motion.div 
                                            key={order.id}
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="show"
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[12px] overflow-hidden shadow-[0_4px_20px_rgba(51,51,51,0.03)] hover:shadow-[0_8px_30px_rgba(231,54,77,0.08)] hover:border-[#E7364D]/30 transition-all group"
                                        >
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
                                            
                                            <div className="p-6 flex flex-col md:flex-row gap-8">
                                                <div className="flex-1 flex flex-col justify-between space-y-5">
                                                    <div>
                                                        <h3 className="text-[20px] font-black text-[#333333] leading-tight mb-3 group-hover:text-[#E7364D] transition-colors">{order.eventName || 'Booknshow Event'}</h3>
                                                        
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-[#FAFAFA] p-3 rounded-[8px] border border-[#A3A3A3]/20">
                                                            <div className="flex items-center text-[13px] text-[#626262] font-medium">
                                                                <Clock size={16} className="mr-2 text-[#A3A3A3]" /> 
                                                                <div>
                                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#A3A3A3]">Order Placed</p>
                                                                    <p className="font-black text-[#333333]">{formatDate(transactionDate)}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center text-[13px] text-[#626262] font-medium">
                                                                <Calendar size={16} className="mr-2 text-[#E7364D]" /> 
                                                                <div>
                                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#E7364D]">Event Date</p>
                                                                    <p className="font-black text-[#333333]">{formatDate(eventDate)} {formatTime(eventDate)}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center text-[14px] text-[#626262] font-medium mt-4">
                                                            <MapPin size={16} className="mr-3 text-[#A3A3A3]" /> {order.eventLoc || 'Venue TBA'}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-[#A3A3A3]/10">
                                                        <button 
                                                            disabled={isPending} 
                                                            onClick={() => setSelectedTicket(order)}
                                                            className={`px-6 py-2.5 rounded-[8px] text-[14px] font-bold transition-all shadow-sm flex items-center ${isPending ? 'bg-[#F5F5F5] text-[#A3A3A3] cursor-not-allowed' : 'bg-[#E7364D] text-[#FFFFFF] hover:bg-[#EB5B6E] hover:shadow-[0_4px_15px_rgba(231,54,77,0.3)] hover:-translate-y-0.5'}`}
                                                        >
                                                            <Eye size={16} className="mr-2" /> View & Download E-Ticket
                                                        </button>
                                                        <button onClick={() => navigate('/seller/create')} className="px-6 py-2.5 bg-[#FFFFFF] border border-[#A3A3A3]/30 text-[#333333] text-[14px] font-bold rounded-[8px] hover:bg-[#FAD8DC]/10 hover:border-[#E7364D] hover:text-[#E7364D] flex items-center transition-all">
                                                            <Repeat size={16} className="mr-2" /> Sell on Marketplace
                                                        </button>
                                                        <button onClick={() => window.open('mailto:support@booknshow.com', '_blank')} className="p-2.5 bg-[#FFFFFF] border border-[#A3A3A3]/30 text-[#626262] rounded-[8px] hover:bg-[#F5F5F5] hover:text-[#333333] transition-all ml-auto md:ml-0" title="Get Support">
                                                            <HelpCircle size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                                
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
                                                            <p className="text-[18px] font-black text-[#E7364D]">INR {(Number(order.totalAmount || order.amountPaid) || 0).toLocaleString()}</p>
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
                        <motion.div variants={itemVariants} className="w-full flex flex-col items-center md:items-start mt-4">
                            <div className="w-full max-w-[800px] border border-[#A3A3A3]/20 rounded-[12px] p-8 md:p-10 mb-10 bg-[#FFFFFF] shadow-[0_10px_40px_rgba(51,51,51,0.05)] relative overflow-hidden">
                                
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

            {/* Ticket Modal */}
            <AnimatePresence>
                {selectedTicket && (
                    <div className="fixed inset-0 z-[990] flex items-center justify-center bg-[#333333]/80 backdrop-blur-sm p-4 overflow-y-auto">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="bg-transparent w-full max-w-md relative my-auto"
                        >
                            <button onClick={() => setSelectedTicket(null)} className="absolute -top-12 right-0 text-[#FFFFFF] hover:text-[#E7364D] transition-colors bg-[#333333] p-2 rounded-full z-50 shadow-xl">
                                <X size={24} />
                            </button>

                            <div ref={ticketRef} className="bg-[#FFFFFF] rounded-[16px] overflow-hidden shadow-2xl relative flex flex-col">
                                
                                <div className="bg-[#333333] w-full pt-6 pb-5 flex flex-col justify-center items-center border-b-4 border-[#E7364D] relative overflow-hidden shrink-0">
                                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                                    <BooknshowLogo textColor="#FFFFFF" className="scale-75 origin-center -mb-2" />
                                    <p className="text-[10px] text-[#A3A3A3] uppercase tracking-[0.2em] relative z-10 font-bold">Official Access Pass</p>
                                </div>

                                <div className="p-6 md:p-8 bg-[#FFFFFF] relative flex-1 flex flex-col">
                                    <div className="mb-6 pb-6 border-b border-dashed border-[#A3A3A3]/40">
                                        <h2 className="text-[22px] font-black text-[#333333] leading-tight mb-4">{selectedTicket.eventName}</h2>
                                        
                                        <div className="space-y-3">
                                            {/* FEATURE 12: Dual Timestamp Ticket Injection */}
                                            <div className="flex items-start gap-3">
                                                <Calendar size={16} className="text-[#E7364D] mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="text-[10px] font-bold text-[#E7364D] uppercase tracking-widest mb-0.5">Event Date</p>
                                                    <p className="text-[14px] font-black text-[#333333]">
                                                        {selectedTicket.commence_time?.seconds ? new Date(selectedTicket.commence_time.seconds * 1000).toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 
                                                         selectedTicket.commence_time ? new Date(selectedTicket.commence_time).toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) :
                                                         selectedTicket.eventTimestamp ? new Date(selectedTicket.eventTimestamp).toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Date TBA'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Clock size={16} className="text-[#A3A3A3] mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="text-[10px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-0.5">Order Placed</p>
                                                    <p className="text-[14px] font-black text-[#626262]">
                                                        {selectedTicket.createdAt?.seconds ? new Date(selectedTicket.createdAt.seconds * 1000).toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : 
                                                         selectedTicket.createdAt ? new Date(selectedTicket.createdAt).toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <MapPin size={16} className="text-[#A3A3A3] mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="text-[10px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-0.5">Venue</p>
                                                    <p className="text-[14px] font-black text-[#333333]">{selectedTicket.eventLoc || 'Venue TBA'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-[#FAFAFA] p-3 rounded-[8px] border border-[#A3A3A3]/20">
                                            <p className="text-[10px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1">Tier / Section</p>
                                            <p className="text-[15px] font-black text-[#E7364D] truncate">{selectedTicket.tierName}</p>
                                        </div>
                                        <div className="bg-[#FAFAFA] p-3 rounded-[8px] border border-[#A3A3A3]/20">
                                            <p className="text-[10px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1">Admit</p>
                                            <p className="text-[15px] font-black text-[#333333]">{selectedTicket.quantity} Person(s)</p>
                                        </div>
                                        
                                        <div className="bg-[#FAFAFA] p-3 rounded-[8px] border border-[#A3A3A3]/20 col-span-2">
                                            <p className="text-[10px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1">Allocated Seats</p>
                                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                {selectedTicket.seatNumbers && selectedTicket.seatNumbers.length > 0 ? (
                                                    selectedTicket.seatNumbers.map(seat => (
                                                        // FEATURE 14: Injection of the formatting utility for the PDF render
                                                        <span key={seat} className="bg-[#E7364D] text-[#FFFFFF] px-2 py-1 rounded-[4px] text-[10px] font-black tracking-widest shadow-sm break-words inline-block text-center border border-[#E7364D]/50">
                                                            {formatSeatLabel(seat)}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-[11px] font-bold text-[#626262]">General Admission / Unassigned</span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="bg-[#FAFAFA] p-3 rounded-[8px] border border-[#A3A3A3]/20 col-span-2">
                                            <p className="text-[10px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1">Buyer Details</p>
                                            <p className="text-[14px] font-black text-[#333333] truncate">{selectedTicket.buyerName || selectedTicket.buyerEmail || user?.email}</p>
                                        </div>
                                    </div>

                                    <div className="bg-[#FAFAFA] p-4 rounded-[8px] border border-[#A3A3A3]/20 mb-6">
                                        <p className="text-[10px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-3 border-b border-[#A3A3A3]/20 pb-2">Payment Summary</p>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[13px] font-bold text-[#626262]">Subtotal & Fees</span>
                                            <span className="text-[13px] font-bold text-[#333333]">INR {Math.round((Number(selectedTicket.totalAmount || selectedTicket.amountPaid) || 0) * 0.85).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-[13px] font-bold text-[#626262]">Taxes (18%)</span>
                                            <span className="text-[13px] font-bold text-[#333333]">INR {Math.round((Number(selectedTicket.totalAmount || selectedTicket.amountPaid) || 0) * 0.15).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-[#A3A3A3]/20">
                                            <span className="text-[14px] font-black text-[#333333]">Total Paid</span>
                                            <span className="text-[16px] font-black text-[#E7364D]">INR {(Number(selectedTicket.totalAmount || selectedTicket.amountPaid) || 0).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* FEATURE 13: Interactive Tap-to-Zoom QR Trigger */}
                                    <div className="flex flex-col items-center justify-center p-4 bg-[#F5F5F5] rounded-[12px] border border-[#A3A3A3]/20 mt-auto group">
                                        <button 
                                            onClick={() => setZoomedQR(`BOOKNSHOW_SECURE_${selectedTicket.id}`)}
                                            className="bg-[#FFFFFF] p-2 rounded-[8px] shadow-sm mb-3 relative cursor-pointer hover:border-[#E7364D] border border-transparent transition-all"
                                            title="Tap to enlarge for gate scanner"
                                        >
                                            <QRCodeSVG value={`BOOKNSHOW_SECURE_${selectedTicket.id}`} size={120} fgColor="#333333" level="H" />
                                            <div className="absolute inset-0 bg-[#FFFFFF]/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-[8px] backdrop-blur-[1px]">
                                                <Maximize2 size={24} className="text-[#E7364D]" />
                                            </div>
                                        </button>
                                        <p className="text-[10px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-0.5">Ticket ID</p>
                                        <p className="text-[14px] font-mono font-black text-[#333333] tracking-widest">{selectedTicket.id.substring(0, 12).toUpperCase()}</p>
                                        <p className="text-[10px] font-bold text-[#E7364D] uppercase tracking-widest mt-3 flex items-center"><Maximize2 size={10} className="mr-1"/> Tap QR code to zoom for scanner</p>
                                    </div>
                                </div>
                                
                                <div className="h-4 w-full bg-[radial-gradient(circle,transparent_4px,#FFFFFF_4px)] bg-[length:16px_16px] -mt-2 shrink-0"></div>
                            </div>

                            <div className="mt-6">
                                <button 
                                    onClick={handleDownloadTicket} 
                                    disabled={isDownloading}
                                    className="w-full bg-[#E7364D] text-[#FFFFFF] font-black py-4 rounded-[8px] hover:bg-[#333333] transition-colors shadow-[0_4px_15px_rgba(231,54,77,0.4)] flex items-center justify-center disabled:opacity-50"
                                >
                                    {isDownloading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Download size={20} className="mr-2" />}
                                    {isDownloading ? 'Generating PDF...' : 'Download E-Ticket'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* FEATURE 13: Fullscreen Max-Brightness QR Zoom Overlay */}
            <AnimatePresence>
                {zoomedQR && (
                    <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#FFFFFF] p-6">
                        <button onClick={() => setZoomedQR(null)} className="absolute top-6 right-6 text-[#333333] hover:text-[#E7364D] transition-colors p-2 bg-[#F5F5F5] rounded-full">
                            <X size={32} />
                        </button>
                        
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-[#FFFFFF] p-8 rounded-[24px] shadow-[0_20px_60px_rgba(51,51,51,0.15)] flex flex-col items-center border border-[#A3A3A3]/20"
                        >
                            <QRCodeSVG value={zoomedQR} size={300} fgColor="#000000" level="H" includeMargin={true} />
                            <h2 className="text-[20px] font-black text-[#333333] mt-8 tracking-widest uppercase border-b-2 border-[#E7364D] pb-2">Ready for Scan</h2>
                            <p className="text-[13px] font-bold text-[#626262] mt-3">Present this code directly to the gate steward.</p>
                            <p className="text-[11px] font-bold text-[#A3A3A3] mt-1">Please maximize your screen brightness.</p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}