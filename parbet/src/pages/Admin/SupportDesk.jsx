import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, ShieldAlert, Clock, CheckCircle2, MessageSquare, 
    Send, Loader2, LifeBuoy, Zap, ChevronRight, User, AlertCircle, X,
    AlertTriangle, ShieldCheck
} from 'lucide-react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useMainStore } from '../../store/useMainStore';
import { useNavigate } from 'react-router-dom';

/**
 * GLOBAL REBRAND: Booknshow Identity Application (Phase 10 Admin Support Desk)
 * Enforced Colors: #FFFFFF, #E7364D, #333333, #EB5B6E, #FAD8DC, #A3A3A3, #626262
 * FEATURE 1: Secure Admin Role Gatekeeper (Strict Redirect)
 * FEATURE 2: Real-Time Global Ticket Ledger Hydration
 * FEATURE 3: Dynamic Search & Status Filtering Engine
 * FEATURE 4: Multi-Tier Priority Badging
 * FEATURE 5: Real-Time Notification Injection Engine
 * FEATURE 6: Ticket Status Lifecycle Management
 * FEATURE 7: Ambient Admin Background Physics
 * FEATURE 8: 1:1 Booknshow Enterprise Form Components
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
            className="absolute top-[-5%] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-[#FAD8DC] opacity-30 blur-[120px]"
            animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
            className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-[#EB5B6E] opacity-10 blur-[150px]"
            animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />
    </div>
);

const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    if (isNaN(d)) return 'Just now';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export default function SupportDesk() {
    const navigate = useNavigate();
    const { user } = useMainStore();
    
    // Core States
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('Open');
    
    // Action States
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'parbet-44902';

    // FEATURE 1: Strict Admin Gatekeeper
    useEffect(() => {
        if (!user) return;
        const validAdmins = ['testcodecfg@gmail.com', 'krishnamehta.gm@gmail.com', 'jatinseth.op@gmail.com', 'jachinfotech@gmail.com'];
        if (!validAdmins.includes(user.email?.toLowerCase())) {
            console.error("Unauthorized access attempt to God-Mode Support Desk.");
            navigate('/');
        }
    }, [user, navigate]);

    // FEATURE 2: Real-Time Global Ticket Ledger Hydration
    useEffect(() => {
        if (!user) return;

        const ticketsRef = collection(db, 'artifacts', appId, 'support_tickets');
        // We query all tickets and sort them by createdAt descending. The firestore rule protects this.
        const q = query(ticketsRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedTickets = [];
            snapshot.forEach((doc) => {
                fetchedTickets.push({ id: doc.id, ...doc.data() });
            });
            setTickets(fetchedTickets);
            setIsLoading(false);
        }, (error) => {
            console.error("Admin Ticket Sync Error:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user, appId]);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
    };

    // FEATURE 3: Dynamic Search & Status Filtering Engine
    const { filteredTickets, analytics } = useMemo(() => {
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
                    (ticket.email || '').toLowerCase().includes(term) ||
                    (ticket.subject || '').toLowerCase().includes(term) ||
                    (ticket.id || '').toLowerCase().includes(term)
                );
            }
            return true;
        });

        return { 
            filteredTickets: filtered, 
            analytics: { openCount, closedCount, urgentCount } 
        };
    }, [tickets, activeFilter, searchQuery]);

    // FEATURE 5 & 6: Real-Time Notification Injection & Lifecycle Management
    const handleSubmitReply = async (e) => {
        e.preventDefault();
        if (!selectedTicket || !replyText.trim()) return;

        setIsSubmitting(true);
        try {
            // 1. Update the original ticket status
            const ticketRef = doc(db, 'artifacts', appId, 'support_tickets', selectedTicket.id);
            await updateDoc(ticketRef, {
                status: 'Closed',
                adminReply: replyText,
                repliedAt: serverTimestamp(),
                repliedBy: user.email
            });

            // 2. Inject notification directly into the user's notification feed
            // Critical: If the user was a guest, we skip notification injection as they have no UID ledger
            if (selectedTicket.userId && selectedTicket.userId !== 'guest') {
                const notificationsRef = collection(db, 'artifacts', appId, 'notifications');
                await addDoc(notificationsRef, {
                    userId: selectedTicket.userId,
                    type: 'support_reply',
                    title: 'Support Ticket Update',
                    message: `Admin replied to: ${selectedTicket.subject}`,
                    ticketId: selectedTicket.id,
                    timestamp: serverTimestamp(),
                    isRead: false
                });
            }

            showToast(`Reply sent. Ticket ${selectedTicket.id.substring(0,6)} closed.`);
            setReplyText('');
            setSelectedTicket(null);
        } catch (error) {
            console.error("Support Reply Execution Failed:", error);
            showToast("Failed to submit reply. Check console for permissions.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 120 } } };

    return (
        <div className="w-full min-h-screen bg-[#FAFAFA] font-sans pb-20 relative">
            <AmbientBackground />

            {/* Global Toast Notification */}
            <AnimatePresence>
                {toast.show && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20, x: '-50%' }} 
                        animate={{ opacity: 1, y: 0, x: '-50%' }} 
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className={`fixed top-6 left-1/2 z-[9999] flex items-center px-6 py-4 rounded-[8px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] border ${toast.type === 'success' ? 'bg-[#333333] border-[#333333] text-[#FFFFFF]' : 'bg-[#FAD8DC] border-[#E7364D] text-[#E7364D]'}`}
                    >
                        {toast.type === 'success' ? <CheckCircle2 size={20} className="mr-3 text-[#FFFFFF]" /> : <AlertTriangle size={20} className="mr-3" />}
                        <span className="text-[14px] font-bold tracking-wide">{toast.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Global Admin Header */}
            <div className="w-full bg-[#333333] py-4 px-6 md:px-8 flex justify-between items-center shadow-md relative z-10">
                <div className="flex items-center gap-4">
                    <BooknshowLogo className="h-8" />
                    <div className="h-6 w-px bg-[#A3A3A3]/30 hidden md:block"></div>
                    <span className="hidden md:inline-flex items-center gap-1.5 text-[#FFFFFF] bg-[#E7364D] px-2.5 py-1 rounded-[4px] text-[10px] font-black uppercase tracking-widest">
                        <ShieldAlert size={12} /> God-Mode Active
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-[14px] font-black text-[#FFFFFF] leading-tight">Admin Console</p>
                        <p className="text-[11px] text-[#A3A3A3] font-bold">{user?.email}</p>
                    </div>
                    <button onClick={() => navigate('/admin')} className="w-10 h-10 rounded-full bg-[#FFFFFF]/10 border border-[#FFFFFF]/20 flex items-center justify-center hover:bg-[#E7364D] transition-colors">
                        <X size={18} className="text-[#FFFFFF]" />
                    </button>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-8 relative z-10">
                <motion.div initial="hidden" animate="show" variants={containerVariants} className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Left Column: Ledger & Analytics */}
                    <div className="flex-1 w-full flex flex-col gap-6">
                        
                        {/* Analytics Top Bar */}
                        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[12px] p-5 shadow-sm flex items-center gap-4 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#E7364D]/10 rounded-full blur-[20px] -mr-10 -mt-10 group-hover:scale-150 transition-transform"></div>
                                <div className="w-12 h-12 bg-[#F5F5F5] rounded-full flex items-center justify-center border border-[#A3A3A3]/20"><MessageSquare size={20} className="text-[#333333]"/></div>
                                <div>
                                    <p className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest">Open Tickets</p>
                                    <p className="text-[24px] font-black text-[#333333] leading-none mt-1">{analytics.openCount}</p>
                                </div>
                            </div>
                            <div className="bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[12px] p-5 shadow-sm flex items-center gap-4 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#EB5B6E]/10 rounded-full blur-[20px] -mr-10 -mt-10 group-hover:scale-150 transition-transform"></div>
                                <div className="w-12 h-12 bg-[#FAD8DC]/30 rounded-full flex items-center justify-center border border-[#E7364D]/20"><AlertCircle size={20} className="text-[#E7364D]"/></div>
                                <div>
                                    <p className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest">Urgent Priority</p>
                                    <p className="text-[24px] font-black text-[#333333] leading-none mt-1">{analytics.urgentCount}</p>
                                </div>
                            </div>
                            <div className="bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[12px] p-5 shadow-sm flex items-center gap-4 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#333333]/5 rounded-full blur-[20px] -mr-10 -mt-10 group-hover:scale-150 transition-transform"></div>
                                <div className="w-12 h-12 bg-[#F5F5F5] rounded-full flex items-center justify-center border border-[#A3A3A3]/20"><CheckCircle2 size={20} className="text-[#333333]"/></div>
                                <div>
                                    <p className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest">Resolved</p>
                                    <p className="text-[24px] font-black text-[#333333] leading-none mt-1">{analytics.closedCount}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Search & Filter Controls */}
                        <motion.div variants={itemVariants} className="bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[12px] p-4 shadow-sm flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3A3A3]" size={18} />
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by Email, Subject, or ID..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-[#F5F5F5] border border-[#A3A3A3]/20 rounded-[8px] text-[14px] text-[#333333] font-bold outline-none focus:border-[#E7364D]/50 transition-colors shadow-inner"
                                />
                            </div>
                            <div className="flex bg-[#F5F5F5] border border-[#A3A3A3]/20 rounded-[8px] p-1 shrink-0">
                                {['All', 'Open', 'Closed'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setActiveFilter(status)}
                                        className={`px-4 py-1.5 rounded-[6px] text-[13px] font-bold transition-colors ${activeFilter === status ? 'bg-[#FFFFFF] text-[#333333] shadow-sm' : 'text-[#626262] hover:text-[#333333]'}`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Ledger */}
                        <motion.div variants={itemVariants} className="bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[16px] overflow-hidden shadow-sm flex flex-col h-[600px]">
                            <div className="bg-[#FAFAFA] border-b border-[#A3A3A3]/20 px-6 py-4 flex items-center justify-between shrink-0">
                                <h2 className="text-[16px] font-black text-[#333333] flex items-center">
                                    <LifeBuoy size={18} className="mr-2 text-[#E7364D]" /> Customer Inquiries
                                </h2>
                                <span className="text-[12px] font-bold text-[#A3A3A3]">{filteredTickets.length} records</span>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                                <AnimatePresence mode="popLayout">
                                    {isLoading ? (
                                        <div className="flex flex-col items-center justify-center py-20">
                                            <Loader2 size={32} className="animate-spin text-[#E7364D] mb-4" />
                                            <p className="text-[14px] font-bold text-[#626262] uppercase tracking-widest">Hydrating Ledger...</p>
                                        </div>
                                    ) : filteredTickets.length > 0 ? (
                                        filteredTickets.map(ticket => (
                                            <motion.div 
                                                key={ticket.id}
                                                initial={{ opacity: 0, scale: 0.98 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.98 }}
                                                onClick={() => setSelectedTicket(ticket)}
                                                className={`p-4 mb-2 rounded-[12px] border cursor-pointer transition-all ${selectedTicket?.id === ticket.id ? 'bg-[#FAFAFA] border-[#E7364D]/50 shadow-sm' : 'bg-[#FFFFFF] border-[#A3A3A3]/20 hover:border-[#333333]/30'}`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-[4px] border ${ticket.status === 'Open' ? 'bg-[#FAD8DC]/30 text-[#E7364D] border-[#E7364D]/20' : 'bg-[#F5F5F5] text-[#626262] border-[#A3A3A3]/20'}`}>
                                                            {ticket.status}
                                                        </span>
                                                        {ticket.priority === 'Urgent' && ticket.status === 'Open' && (
                                                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-[4px] bg-[#E7364D] text-[#FFFFFF] flex items-center gap-1 shadow-sm">
                                                                <Zap size={10} /> Urgent
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-[11px] font-bold text-[#A3A3A3] flex items-center">
                                                        <Clock size={12} className="mr-1" /> {formatDate(ticket.createdAt)}
                                                    </span>
                                                </div>
                                                <h3 className="text-[15px] font-black text-[#333333] mb-1 truncate">{ticket.subject}</h3>
                                                <p className="text-[13px] text-[#626262] font-medium flex items-center truncate">
                                                    <User size={14} className="mr-1.5 text-[#A3A3A3]" /> {ticket.email || 'Guest User'}
                                                </p>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="text-center py-20">
                                            <ShieldCheck size={48} className="text-[#A3A3A3] mx-auto mb-4 opacity-50" />
                                            <p className="text-[16px] font-black text-[#333333] mb-1">Inbox Zero</p>
                                            <p className="text-[14px] text-[#626262] font-medium max-w-sm mx-auto">No tickets match the current filters. Your queue is clean.</p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Execution Console */}
                    <motion.div variants={itemVariants} className="w-full lg:w-[450px] shrink-0 bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[16px] shadow-[0_8px_30px_rgba(51,51,51,0.06)] flex flex-col h-auto lg:h-[750px] sticky top-6">
                        <div className="bg-[#333333] rounded-t-[15px] px-6 py-4 flex items-center justify-between shrink-0">
                            <h2 className="text-[16px] font-black text-[#FFFFFF] flex items-center">
                                <ShieldAlert size={18} className="mr-2 text-[#E7364D]" /> Resolution Console
                            </h2>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#FAFAFA]">
                            <AnimatePresence mode="wait">
                                {selectedTicket ? (
                                    <motion.div 
                                        key={selectedTicket.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-6"
                                    >
                                        {/* Ticket Meta */}
                                        <div className="bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[12px] p-5 shadow-sm">
                                            <div className="flex justify-between items-start mb-4 pb-4 border-b border-[#A3A3A3]/20">
                                                <div>
                                                    <p className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1">Request ID</p>
                                                    <p className="text-[14px] font-mono font-black text-[#333333]">{selectedTicket.id}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1">Status</p>
                                                    <p className={`text-[14px] font-black ${selectedTicket.status === 'Open' ? 'text-[#E7364D]' : 'text-[#333333]'}`}>{selectedTicket.status}</p>
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <p className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1">User Identity</p>
                                                <p className="text-[14px] font-bold text-[#333333]">{selectedTicket.email || 'Guest'}</p>
                                                <p className="text-[12px] font-mono text-[#626262] mt-0.5">UID: {selectedTicket.userId || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1">Subject</p>
                                                <p className="text-[16px] font-black text-[#333333] leading-tight">{selectedTicket.subject}</p>
                                            </div>
                                        </div>

                                        {/* User Message */}
                                        <div className="bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[12px] p-5 shadow-sm">
                                            <p className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-3 flex items-center">
                                                <MessageSquare size={14} className="mr-1.5" /> Initial Inquiry
                                            </p>
                                            <p className="text-[14px] text-[#626262] font-medium leading-relaxed whitespace-pre-wrap bg-[#F5F5F5] p-4 rounded-[8px] border border-[#A3A3A3]/10">
                                                {selectedTicket.message}
                                            </p>
                                        </div>

                                        {/* Resolution Form or Archive State */}
                                        {selectedTicket.status === 'Open' ? (
                                            <form onSubmit={handleSubmitReply} className="bg-[#FFFFFF] border border-[#E7364D]/30 rounded-[12px] p-5 shadow-sm relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-[#E7364D]"></div>
                                                <p className="text-[11px] font-black text-[#E7364D] uppercase tracking-widest mb-3">Execute Resolution</p>
                                                <textarea 
                                                    required
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    placeholder="Type official response here. This will be securely injected into the user's notification feed..."
                                                    className="w-full bg-[#F5F5F5] border border-[#A3A3A3]/30 rounded-[8px] px-4 py-3 text-[14px] text-[#333333] font-medium focus:bg-[#FFFFFF] focus:border-[#E7364D] outline-none transition-colors min-h-[120px] resize-none mb-4"
                                                ></textarea>
                                                <button 
                                                    type="submit" 
                                                    disabled={isSubmitting}
                                                    className="w-full bg-[#333333] text-[#FFFFFF] py-3.5 rounded-[8px] font-black text-[14px] hover:bg-[#E7364D] transition-colors flex items-center justify-center shadow-md disabled:opacity-50"
                                                >
                                                    {isSubmitting ? <Loader2 size={18} className="animate-spin mr-2" /> : <Send size={18} className="mr-2" />}
                                                    Resolve & Close Ticket
                                                </button>
                                            </form>
                                        ) : (
                                            <div className="bg-[#F5F5F5] border border-[#A3A3A3]/20 rounded-[12px] p-5 shadow-inner">
                                                <p className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-3 flex items-center">
                                                    <CheckCircle2 size={14} className="mr-1.5" /> Resolution Record
                                                </p>
                                                <p className="text-[14px] text-[#333333] font-bold leading-relaxed whitespace-pre-wrap mb-3">
                                                    {selectedTicket.adminReply}
                                                </p>
                                                <p className="text-[11px] font-bold text-[#A3A3A3] text-right">
                                                    Executed by {selectedTicket.repliedBy || 'Admin'} on {formatDate(selectedTicket.repliedAt)}
                                                </p>
                                            </div>
                                        )}

                                    </motion.div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center py-20">
                                        <div className="w-16 h-16 bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-full flex items-center justify-center mb-4 shadow-sm">
                                            <ChevronRight size={24} className="text-[#A3A3A3]" />
                                        </div>
                                        <p className="text-[16px] font-black text-[#333333] mb-1">Select an Inquiry</p>
                                        <p className="text-[13px] text-[#626262] font-medium max-w-[250px]">Choose a ticket from the ledger to view details and execute a resolution.</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                </motion.div>
            </div>
        </div>
    );
}