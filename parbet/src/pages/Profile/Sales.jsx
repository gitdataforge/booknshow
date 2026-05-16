import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    IndianRupee, TrendingUp, Calendar, Search, 
    CheckCircle2, Clock, AlertCircle, ArrowUpRight, 
    FileText, Landmark, ChevronDown, DollarSign, X, Download, Loader2
} from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { useMainStore } from '../../store/useMainStore';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * GLOBAL REBRAND: Booknshow Identity Application (Phase 7 Profile Sales)
 * Enforced Colors: #FFFFFF, #E7364D, #333333, #EB5B6E, #FAD8DC, #A3A3A3, #626262
 * FEATURE 1: Illustrative Ambient Backgrounds
 * FEATURE 2: Real-Time Firestore Seller Ledger Sync
 * FEATURE 3: Dynamic Escrow & Payout Auto-Calculator
 * FEATURE 4: Missing Bank Details Warning Banner
 * FEATURE 5: 1:1 Booknshow Enterprise Empty State & Typography
 * FEATURE 6: Advanced Search Indexing
 * FEATURE 7: Multi-Dimensional Sort Engine
 * FEATURE 8: Status Badging (Pending Escrow vs Paid Out)
 * FEATURE 9: Cryptographic Order ID Truncation
 * FEATURE 10: Fixed Price Clipping (Flex constraints adjusted)
 * FEATURE 11: Fullscreen Professional Branded Receipt Generator
 */

const formatDate = (timestamp) => {
    if (!timestamp) return 'Date TBA';
    const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    if (isNaN(d)) return 'Date TBA';
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    if (isNaN(d)) return '';
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const generateShortHash = (id) => {
    if (!id) return '00000000';
    return id.substring(0, 8).toUpperCase();
};

const BooknshowLogo = ({ className = "", textColor = "#FFFFFF" }) => {
    const fillHex = textColor.includes('#') ? textColor.match(/#(?:[0-9a-fA-F]{3,8})/)[0] : "#FFFFFF";
    return (
        <div className={`flex items-center justify-center select-none relative z-10 ${className}`}>
            <svg viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[40px]">
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

export default function Sales() {
    const navigate = useNavigate();
    const { user, wallet, bankDetails } = useMainStore();
    
    const [sales, setSales] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All sales');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    // FEATURE 11: Receipt Modal States
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const receiptRef = useRef(null);

    const hasPayoutMethod = !!bankDetails;

    useEffect(() => {
        if (!user || !user.uid) {
            setIsLoading(false);
            return;
        }

        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('sellerId', '==', user.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedSales = [];
            snapshot.forEach((doc) => {
                fetchedSales.push({ id: doc.id, ...doc.data() });
            });
            setSales(fetchedSales);
            setIsLoading(false);
        }, (error) => {
            console.error("Secure Sales Sync Error:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const { processedSales, metrics } = useMemo(() => {
        let totalRevenue = 0;
        let pendingEscrow = 0;
        let completedPayouts = 0;

        let filtered = sales.filter(sale => {
            const amount = Number(sale.totalAmount || sale.amountPaid || sale.price * sale.quantity || 0);
            totalRevenue += amount;
            
            const isCompleted = sale.status === 'completed' || sale.payoutStatus === 'paid';

            if (isCompleted) {
                completedPayouts += amount;
            } else {
                pendingEscrow += amount;
            }

            if (activeTab === 'Open') return !isCompleted;
            if (activeTab === 'Closed') return isCompleted;
            return true;
        });

        if (searchQuery) {
            const term = searchQuery.toLowerCase();
            filtered = filtered.filter(sale => 
                (sale.eventName || sale.title || '').toLowerCase().includes(term) ||
                (sale.paymentId || sale.id || '').toLowerCase().includes(term)
            );
        }

        filtered.sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : a.timestamp?.toDate ? a.timestamp.toDate().getTime() : (new Date(a.createdAt || a.timestamp || 0).getTime());
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : b.timestamp?.toDate ? b.timestamp.toDate().getTime() : (new Date(b.createdAt || b.timestamp || 0).getTime());
            
            if (sortBy === 'newest') return dateB - dateA;
            if (sortBy === 'oldest') return dateA - dateB;
            
            const valA = Number(a.totalAmount || a.amountPaid || a.price * a.quantity || 0);
            const valB = Number(b.totalAmount || b.amountPaid || b.price * b.quantity || 0);
            if (sortBy === 'highest') return valB - valA;
            
            return 0;
        });

        return { 
            processedSales: filtered, 
            metrics: { totalRevenue, pendingEscrow, completedPayouts } 
        };
    }, [sales, activeTab, searchQuery, sortBy]);

    // FEATURE 11: PDF Generator for Receipt
    const handleDownloadReceipt = async () => {
        if (!receiptRef.current || isDownloading) return;
        setIsDownloading(true);
        try {
            const canvas = await html2canvas(receiptRef.current, { scale: 2, backgroundColor: '#FFFFFF', useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Booknshow_Sale_Receipt_${selectedReceipt.id.substring(0,8)}.pdf`);
        } catch (err) {
            console.error("PDF Generation failed:", err);
            alert("Failed to generate PDF. Please try taking a screenshot.");
        } finally {
            setIsDownloading(false);
        }
    };

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }, exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } } };

    return (
        <div className="w-full font-sans pb-20 pt-4 relative min-h-screen bg-transparent">
            <AmbientBackground />

            <motion.div initial="hidden" animate="show" variants={containerVariants} className="relative z-10 w-full">
                
                <motion.h1 variants={itemVariants} className="text-[32px] font-black text-[#333333] mb-6 tracking-tight leading-tight px-6 md:px-8">
                    Sales Ledger
                </motion.h1>

                {!hasPayoutMethod && (
                    <motion.div variants={itemVariants} className="px-6 md:px-8 mb-8">
                        <div className="w-full bg-[#FAD8DC]/30 border border-[#E7364D]/30 rounded-[8px] p-5 flex flex-col md:flex-row items-center justify-between shadow-sm">
                            <div className="flex items-center mb-4 md:mb-0">
                                <AlertCircle size={24} className="text-[#E7364D] mr-3 shrink-0" />
                                <div>
                                    <p className="text-[14px] font-black text-[#333333] tracking-wide">Action required: Add Bank Details</p>
                                    <p className="text-[13px] text-[#626262] font-medium mt-0.5">We cannot process your withdrawals until a valid payout method is linked.</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => navigate('/profile/settings')}
                                className="w-full md:w-auto px-6 py-2.5 bg-[#333333] border border-[#333333] rounded-[8px] text-[14px] font-bold text-[#FFFFFF] hover:bg-[#E7364D] hover:border-[#E7364D] transition-colors shadow-sm"
                            >
                                Add Bank Details
                            </button>
                        </div>
                    </motion.div>
                )}

                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 px-6 md:px-8">
                    <div className="bg-[#FFFFFF] p-6 rounded-[12px] border border-[#A3A3A3]/20 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#333333]"></div>
                        <p className="text-[12px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1 ml-2">Gross Sales Volume</p>
                        <p className="text-[28px] font-black text-[#333333] ml-2">₹{metrics.totalRevenue.toLocaleString()}</p>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-5 group-hover:opacity-10 transition-opacity text-[#333333]"><TrendingUp size={64}/></div>
                    </div>
                    <div className="bg-[#FFFFFF] p-6 rounded-[12px] border border-[#A3A3A3]/20 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#EB5B6E]"></div>
                        <p className="text-[12px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1 ml-2">Funds in Escrow</p>
                        <p className="text-[28px] font-black text-[#333333] ml-2">₹{metrics.pendingEscrow.toLocaleString()}</p>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-5 group-hover:opacity-10 transition-opacity text-[#EB5B6E]"><Clock size={64}/></div>
                    </div>
                    <div className="bg-[#FFFFFF] p-6 rounded-[12px] border border-[#A3A3A3]/20 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#E7364D]"></div>
                        <p className="text-[12px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1 ml-2">Completed Payouts</p>
                        <p className="text-[28px] font-black text-[#333333] ml-2">₹{metrics.completedPayouts.toLocaleString()}</p>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-5 group-hover:opacity-10 transition-opacity text-[#E7364D]"><Landmark size={64}/></div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex border-b border-[#A3A3A3]/20 mb-8 px-6 md:px-8 overflow-x-auto no-scrollbar">
                    {['All sales', 'Open', 'Closed'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-4 px-2 mr-8 text-[15px] font-black transition-all relative whitespace-nowrap ${
                                activeTab === tab 
                                ? 'text-[#E7364D]' 
                                : 'text-[#626262] hover:text-[#333333]'
                            }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div layoutId="salesTab" className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-[#E7364D] rounded-t-full"></motion.div>
                            )}
                        </button>
                    ))}
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center gap-4 mb-10 px-6 md:px-8">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3A3A3]" size={18} />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by event or order ID"
                            className="w-full pl-10 pr-4 py-3 bg-[#F5F5F5] border border-[#A3A3A3]/20 rounded-[8px] text-[14px] text-[#333333] font-medium outline-none focus:bg-[#FFFFFF] focus:border-[#E7364D]/50 transition-colors shadow-sm"
                        />
                    </div>
                    
                    <div className="flex items-center w-full md:w-auto gap-3">
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full md:w-auto px-4 py-3 bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[8px] text-[14px] font-bold text-[#333333] outline-none focus:border-[#E7364D]/50 cursor-pointer shadow-sm"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="highest">Highest Amount</option>
                        </select>
                    </div>
                </motion.div>

                <div className="px-6 md:px-8">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div 
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-24"
                            >
                                <div className="w-10 h-10 border-4 border-[#FAD8DC] border-t-[#E7364D] rounded-full animate-spin mb-4"></div>
                                <p className="text-[#626262] font-bold text-[14px] uppercase tracking-widest">Syncing secure ledger...</p>
                            </motion.div>
                        ) : processedSales.length > 0 ? (
                            <motion.div 
                                key="list"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-5"
                            >
                                <AnimatePresence>
                                    {processedSales.map((sale) => {
                                        const isPaidOut = sale.status === 'completed' || sale.payoutStatus === 'paid';
                                        const amount = Number(sale.totalAmount || sale.amountPaid || sale.price * sale.quantity || 0);

                                        return (
                                            <motion.div 
                                                key={sale.id}
                                                variants={itemVariants}
                                                initial="hidden"
                                                animate="show"
                                                exit="exit"
                                                className="bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[12px] overflow-hidden shadow-[0_4px_20px_rgba(51,51,51,0.03)] hover:shadow-[0_8px_30px_rgba(231,54,77,0.08)] hover:border-[#E7364D]/30 transition-all flex flex-col md:flex-row items-stretch group"
                                            >
                                                <div className={`hidden md:block w-[6px] shrink-0 ${isPaidOut ? 'bg-[#E7364D]' : 'bg-[#EB5B6E]'}`}></div>
                                                
                                                <div className="flex-1 p-6 flex flex-col md:flex-row gap-6">
                                                    <div className="flex-1 flex flex-col justify-between">
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <span className="text-[11px] font-mono font-bold text-[#626262] bg-[#F5F5F5] px-2.5 py-1 rounded-[4px] border border-[#A3A3A3]/20">
                                                                    ID: {generateShortHash(sale.paymentId || sale.id)}
                                                                </span>
                                                                <span className="text-[12px] font-bold text-[#A3A3A3] uppercase tracking-widest flex items-center">
                                                                    <Calendar size={14} className="mr-1.5" /> {formatDate(sale.createdAt || sale.timestamp || sale.eventTimestamp)}
                                                                </span>
                                                            </div>
                                                            <h3 className="text-[20px] font-black text-[#333333] leading-tight mb-2 truncate group-hover:text-[#E7364D] transition-colors">
                                                                {sale.eventName || sale.title || 'Booknshow Event Ticket'}
                                                            </h3>
                                                            <p className="text-[14px] text-[#626262] font-medium">
                                                                Section: <span className="font-bold text-[#333333]">{sale.tierName || sale.tier || 'General'}</span> <span className="mx-2 text-[#A3A3A3]">•</span> Quantity: <span className="font-bold text-[#333333]">{sale.quantity}</span>
                                                            </p>
                                                        </div>

                                                        <div className="mt-5 pt-5 border-t border-[#A3A3A3]/10 flex flex-wrap items-center gap-4">
                                                            {isPaidOut ? (
                                                                <span className="inline-flex items-center text-[12px] font-black uppercase tracking-widest text-[#E7364D] bg-[#FAD8DC]/30 px-3 py-1.5 rounded-[6px] border border-[#E7364D]/20">
                                                                    <CheckCircle2 size={16} className="mr-2" /> Payout Completed
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center text-[12px] font-black uppercase tracking-widest text-[#EB5B6E] bg-[#FAD8DC]/10 px-3 py-1.5 rounded-[6px] border border-[#EB5B6E]/20">
                                                                    <Clock size={16} className="mr-2" /> Funds in Escrow
                                                                </span>
                                                            )}
                                                            <button 
                                                                onClick={() => setSelectedReceipt(sale)}
                                                                className="text-[13px] text-[#A3A3A3] hover:text-[#E7364D] font-bold flex items-center transition-colors ml-auto md:ml-0"
                                                            >
                                                                <FileText size={16} className="mr-1.5" /> View Receipt
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* FEATURE 10: Fixed flex container to prevent cutoff */}
                                                    <div className="w-full md:w-auto md:min-w-[200px] shrink-0 bg-[#F5F5F5] rounded-[8px] border border-[#A3A3A3]/20 p-5 flex flex-col justify-center text-right overflow-hidden">
                                                        <p className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1">Gross Sale</p>
                                                        <p className="text-[24px] font-black text-[#333333] mb-2 truncate">₹{amount.toLocaleString()}</p>
                                                        
                                                        <div className="w-full border-t border-[#A3A3A3]/20 my-3"></div>
                                                        
                                                        <div className="flex flex-col items-end gap-1 text-[13px]">
                                                            {isPaidOut ? (
                                                                <>
                                                                    <span className="text-[#626262] font-medium">Transferred to</span>
                                                                    <span className="text-[#333333] font-bold flex items-center"><Landmark size={14} className="mr-1.5 text-[#E7364D]"/> Bank Account</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span className="text-[#626262] font-medium">Expected Payout</span>
                                                                    <span className="text-[#333333] font-bold">Post-Event Verification</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-20 flex flex-col items-center bg-[#FFFFFF] border border-dashed border-[#A3A3A3]/30 rounded-[12px] shadow-sm"
                            >
                                <div className="bg-[#FAD8DC]/30 p-5 rounded-full mb-6 border border-[#E7364D]/20">
                                    <DollarSign size={32} className="text-[#E7364D]" />
                                </div>
                                <h3 className="text-[20px] font-black text-[#333333] mb-3">You don't have any {activeTab !== 'All sales' ? activeTab.toLowerCase() : ''} sales</h3>
                                <p className="text-[14px] text-[#626262] font-medium mb-8 max-w-sm leading-relaxed">
                                    {searchQuery 
                                        ? "We couldn't find any sales matching your search criteria."
                                        : "Completed sales and payout history will appear here once you've fulfilled a buyer's order."}
                                </p>
                                {!searchQuery && (
                                    <button 
                                        onClick={() => navigate('/profile/listings')}
                                        className="text-[#E7364D] font-bold text-[15px] hover:text-[#EB5B6E] flex items-center transition-colors bg-[#FAD8DC]/20 px-6 py-3 rounded-[8px]"
                                    >
                                        View my active listings <ArrowUpRight size={18} className="ml-1.5" />
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* FEATURE 11: Fullscreen Professional Branded Receipt Modal */}
            <AnimatePresence>
                {selectedReceipt && (
                    <div className="fixed inset-0 z-[1000] overflow-y-auto bg-[#333333]/90 backdrop-blur-md flex flex-col items-center py-10 px-4">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-2xl mx-auto my-auto"
                        >
                            <button 
                                onClick={() => setSelectedReceipt(null)} 
                                className="absolute -top-12 right-0 bg-[#FFFFFF] text-[#333333] hover:text-[#E7364D] rounded-full p-2 shadow-lg transition-colors z-50"
                            >
                                <X size={24} />
                            </button>

                            <div ref={receiptRef} className="bg-[#FFFFFF] w-full rounded-[16px] shadow-2xl overflow-hidden flex flex-col">
                                {/* Receipt Header */}
                                <div className="bg-[#333333] p-8 border-b-8 border-[#E7364D] flex flex-col items-center text-center relative overflow-hidden shrink-0">
                                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                                    <BooknshowLogo className="mb-2 z-10" />
                                    <h2 className="text-[#FFFFFF] text-[14px] font-bold tracking-[0.3em] uppercase z-10 opacity-80">Official Sale Receipt</h2>
                                </div>

                                {/* Receipt Body */}
                                <div className="p-8 md:p-10 flex-1 flex flex-col">
                                    <div className="flex flex-col md:flex-row justify-between border-b border-[#A3A3A3]/20 pb-6 mb-6 gap-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1">Receipt Number</p>
                                            <p className="text-[14px] font-mono font-black text-[#333333]">TXN-{selectedReceipt.id.toUpperCase()}</p>
                                        </div>
                                        <div className="md:text-right">
                                            <p className="text-[10px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1">Transaction Date</p>
                                            <p className="text-[14px] font-black text-[#333333]">{formatDate(selectedReceipt.createdAt || selectedReceipt.timestamp || selectedReceipt.eventTimestamp)} {formatTime(selectedReceipt.createdAt || selectedReceipt.timestamp)}</p>
                                        </div>
                                    </div>

                                    <div className="mb-8">
                                        <p className="text-[10px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-2">Event Details</p>
                                        <h3 className="text-[20px] font-black text-[#333333] leading-tight mb-2">{selectedReceipt.eventName || selectedReceipt.title || 'Booknshow Event'}</h3>
                                        <p className="text-[14px] text-[#626262] font-medium flex items-center"><Calendar size={14} className="mr-2"/> {formatDate(selectedReceipt.commence_time || selectedReceipt.eventTimestamp)}</p>
                                    </div>

                                    {/* User Details Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FAFAFA] p-6 rounded-[8px] border border-[#A3A3A3]/20 mb-8">
                                        <div>
                                            <p className="text-[10px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1">Seller Identity</p>
                                            <p className="text-[14px] font-black text-[#333333] truncate">{user?.displayName || 'Registered Seller'}</p>
                                            <p className="text-[13px] text-[#626262] truncate">{user?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1">Purchaser Identity</p>
                                            <p className="text-[14px] font-black text-[#333333] truncate">{selectedReceipt.buyerName || 'Verified Buyer'}</p>
                                            <p className="text-[13px] text-[#626262] truncate">{selectedReceipt.buyerEmail || 'Encrypted'}</p>
                                        </div>
                                    </div>

                                    {/* Financial Breakdown */}
                                    <div>
                                        <p className="text-[10px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-3 border-b border-[#A3A3A3]/20 pb-2">Financial Breakdown</p>
                                        
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-[14px] font-bold text-[#626262]">Ticket Allocation ({selectedReceipt.tierName || 'General'})</span>
                                            <span className="text-[14px] font-bold text-[#333333]">{selectedReceipt.quantity} × ₹{(selectedReceipt.price || 0).toLocaleString()}</span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-[14px] font-bold text-[#626262]">Gross Revenue</span>
                                            <span className="text-[14px] font-bold text-[#333333]">₹{(selectedReceipt.price * selectedReceipt.quantity || 0).toLocaleString()}</span>
                                        </div>

                                        <div className="flex justify-between items-center py-4 mt-4 border-t-2 border-[#333333]">
                                            <span className="text-[16px] font-black text-[#333333] uppercase tracking-wider">Total Credit</span>
                                            <span className="text-[24px] font-black text-[#E7364D]">₹{Number(selectedReceipt.totalAmount || selectedReceipt.amountPaid || selectedReceipt.price * selectedReceipt.quantity || 0).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* Escrow Status Footer */}
                                    <div className={`mt-auto pt-6 border-t border-[#A3A3A3]/20 flex items-center justify-center p-4 rounded-[8px] ${(selectedReceipt.status === 'completed' || selectedReceipt.payoutStatus === 'paid') ? 'bg-[#FAD8DC]/30 border-[#E7364D]/20' : 'bg-[#F5F5F5] border-[#A3A3A3]/20'} border`}>
                                        {(selectedReceipt.status === 'completed' || selectedReceipt.payoutStatus === 'paid') ? (
                                            <p className="text-[13px] font-black text-[#E7364D] uppercase tracking-widest flex items-center">
                                                <CheckCircle2 size={18} className="mr-2"/> Funds Released to Bank
                                            </p>
                                        ) : (
                                            <p className="text-[13px] font-black text-[#626262] uppercase tracking-widest flex items-center">
                                                <ShieldCheck size={18} className="mr-2 text-[#E7364D]"/> Funds Secured in Escrow
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Download Action */}
                            <div className="mt-6 flex justify-center">
                                <button 
                                    onClick={handleDownloadReceipt}
                                    disabled={isDownloading}
                                    className="w-full md:w-auto px-8 py-4 bg-[#E7364D] text-[#FFFFFF] font-black rounded-[8px] shadow-[0_10px_30px_rgba(231,54,77,0.3)] hover:bg-[#EB5B6E] hover:-translate-y-1 transition-all flex items-center justify-center disabled:opacity-50"
                                >
                                    {isDownloading ? <Loader2 className="animate-spin mr-3" size={20} /> : <Download size={20} className="mr-3" />}
                                    {isDownloading ? 'Generating PDF...' : 'Download PDF Receipt'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}