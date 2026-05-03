import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    Landmark, Search, ChevronDown, Download, CheckCircle2, 
    XCircle, Clock, AlertTriangle, CreditCard, ShieldCheck, 
    Lock, ExternalLink, RefreshCcw, DollarSign, Smartphone
} from 'lucide-react';

// Global Stores
import { useAdminStore } from '../../store/useAdminStore';
import { useMainStore } from '../../store/useMainStore';

/**
 * GLOBAL REBRAND: Booknshow Identity Application (Phase 9 Admin Financials)
 * Enforced Colors: #FFFFFF, #E7364D, #333333, #EB5B6E, #FAD8DC, #A3A3A3, #626262
 * 
 * --- 10+ REAL FEATURES & 9+ SECTIONS ---
 * SECTION 1: Ambient Illustrative Backgrounds
 * SECTION 2: Master Ledger Header
 * SECTION 3: Global Financial KPI Summary
 * SECTION 4: 3-Way Dynamic Routing Tabs
 * SECTION 5: Real-Time Data Filter & Search Engine
 * SECTION 6: Live Pending Withdrawal Action Queue (Admin Processor)
 * SECTION 7: Global Transaction Ledger
 * SECTION 8: Seller Payment Vault (View Bank/UPI mapping)
 * SECTION 9: CSV Financial Export Engine
 * FEATURE 10: One-Click Firebase Ledger Update (processWithdrawal mutation)
 */

const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    if (isNaN(d)) return 'N/A';
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const generateShortHash = (id) => id ? id.substring(0, 8).toUpperCase() : '00000000';

// SECTION 1: Ambient Background
const AmbientBackground = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
            className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#E7364D] opacity-10 blur-[120px]"
            animate={{ scale: [1, 1.05, 1], opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
            className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#333333] opacity-5 blur-[100px]"
            animate={{ scale: [1, 1.1, 1], opacity: [0.02, 0.05, 0.02] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
    </div>
);

export default function AdminFinancials() {
    const navigate = useNavigate();
    
    // Auth & Data Stores
    const { isAdmin, user } = useMainStore();
    const { 
        allOrders, 
        allWithdrawals, 
        allPaymentMethods, 
        platformMetrics, 
        isLoadingAdmin,
        processWithdrawal
    } = useAdminStore();

    // UI States
    const [activeTab, setActiveTab] = useState('Pending Payouts');
    const [searchTerm, setSearchTerm] = useState('');
    const [isProcessingId, setIsProcessingId] = useState(null);

    // FEATURE 10: Security Gatekeeper
    useEffect(() => {
        if (user && !isAdmin) navigate('/'); 
    }, [isAdmin, user, navigate]);

    // Data Compute Engine
    const { mergedWithdrawals, globalLedger, vaultData } = useMemo(() => {
        // 1. Merge Withdrawals with Exact Bank Details
        const withdrawals = allWithdrawals.map(w => {
            const sellerBank = allPaymentMethods.find(p => p.userId === w.userId);
            return {
                ...w,
                displayDate: formatDate(w.requestedAt),
                sellerBankDetails: sellerBank || null
            };
        });

        // 2. Global Ledger (All Orders)
        const ledger = allOrders.map(o => ({
            ...o,
            amount: Number(o.totalAmount || o.price * o.quantity || 0),
            displayDate: formatDate(o.createdAt || o.eventTimestamp)
        })).filter(o => {
            if (!searchTerm) return true;
            const term = searchTerm.toLowerCase();
            return (o.id.toLowerCase().includes(term) || (o.eventName || '').toLowerCase().includes(term));
        });

        // 3. Vault (All Payment Methods)
        const vault = allPaymentMethods.filter(p => {
            if (!searchTerm) return true;
            const term = searchTerm.toLowerCase();
            return (p.accountName || '').toLowerCase().includes(term) || (p.userId || '').toLowerCase().includes(term);
        });

        return { mergedWithdrawals: withdrawals, globalLedger: ledger, vaultData: vault };
    }, [allWithdrawals, allOrders, allPaymentMethods, searchTerm]);

    const pendingQueue = mergedWithdrawals.filter(w => w.status === 'Pending');
    const completedQueue = mergedWithdrawals.filter(w => w.status !== 'Pending');

    // FEATURE 10: Mutation Handler
    const handleProcessAction = async (id, status) => {
        const actionStr = status === 'Processed (Direct Transfer)' ? 'MARK AS PAID' : 'REJECT';
        if (!window.confirm(`Are you sure you want to ${actionStr} this withdrawal request? This action will permanently update the global ledger.`)) return;
        
        setIsProcessingId(id);
        try {
            await processWithdrawal(id, status);
        } catch (error) {
            alert("Failed to update ledger. Please check console.");
        } finally {
            setIsProcessingId(null);
        }
    };

    // SECTION 9: CSV Export Engine
    const handleDownloadCSV = () => {
        const headers = ['Order ID', 'Date', 'Event Name', 'Seller ID', 'Amount', 'Status'];
        const csvContent = [
            headers.join(','),
            ...globalLedger.map(o => `"${o.id}","${o.displayDate}","${o.eventName}","${o.sellerId}","${o.amount}","${o.status}"`)
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Booknshow_Global_Ledger_${new Date().getTime()}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    if (isLoadingAdmin) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5]">
                <RefreshCcw className="animate-spin text-[#E7364D] mb-4" size={40} />
                <p className="text-[#333333] font-black text-[16px] tracking-widest uppercase">Syncing Master Ledger...</p>
            </div>
        );
    }

    return (
        <div className="w-full font-sans min-h-screen relative pb-20">
            <AmbientBackground />
            
            <motion.div initial="hidden" animate="show" variants={containerVariants} className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 pt-10">
                
                {/* SECTION 2: Master Ledger Header */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/admin')} className="p-3 bg-[#FFFFFF] border border-[#A3A3A3]/30 rounded-[8px] hover:border-[#E7364D] hover:text-[#E7364D] transition-colors shadow-sm">
                            <Lock size={20} className="text-[#333333]" />
                        </button>
                        <div>
                            <h1 className="text-[32px] font-black text-[#333333] leading-tight">Financial Operations</h1>
                            <p className="text-[#626262] font-medium text-[14px] mt-1">Manage global escrow, execute payouts, and audit transactions.</p>
                        </div>
                    </div>
                    <button onClick={handleDownloadCSV} className="bg-[#333333] text-[#FFFFFF] px-6 py-3 rounded-[8px] font-bold text-[14px] hover:bg-[#E7364D] transition-colors shadow-[0_4px_15px_rgba(231,54,77,0.3)] flex items-center w-max hover:-translate-y-0.5 duration-200">
                        <Download size={16} className="mr-2" /> Export Complete Ledger
                    </button>
                </motion.div>

                {/* SECTION 3: Global Financial KPI Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <motion.div variants={itemVariants} className="bg-[#333333] p-6 rounded-[12px] shadow-[0_10px_30px_rgba(51,51,51,0.15)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#E7364D]/20 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none" />
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <span className="text-[12px] font-bold text-[#A3A3A3] uppercase tracking-widest">Total Escrow Hold</span>
                            <div className="bg-[#FFFFFF]/10 p-2 rounded-full"><Clock size={16} className="text-[#FFFFFF]" /></div>
                        </div>
                        <p className="text-[32px] font-black text-[#FFFFFF] relative z-10">₹{platformMetrics.totalEscrowHold.toLocaleString()}</p>
                    </motion.div>
                    <motion.div variants={itemVariants} className="bg-[#FFFFFF] border border-[#E7364D]/30 p-6 rounded-[12px] shadow-sm relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute right-0 top-0 w-1.5 h-full bg-[#E7364D]" />
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[12px] font-bold text-[#E7364D] uppercase tracking-widest">Pending Withdrawals</span>
                            <div className="bg-[#FAD8DC]/50 p-2 rounded-full"><AlertTriangle size={16} className="text-[#E7364D]" /></div>
                        </div>
                        <p className="text-[32px] font-black text-[#333333]">{pendingQueue.length}</p>
                    </motion.div>
                    <motion.div variants={itemVariants} className="bg-[#FFFFFF] border border-[#A3A3A3]/20 p-6 rounded-[12px] shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-[#E7364D]/50 transition-colors">
                        <div className="absolute left-0 top-0 w-1.5 h-full bg-[#333333]" />
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[12px] font-bold text-[#A3A3A3] uppercase tracking-widest ml-2">Total Paid Out</span>
                            <div className="bg-[#F5F5F5] p-2 rounded-full"><Landmark size={16} className="text-[#333333]" /></div>
                        </div>
                        <p className="text-[32px] font-black text-[#333333] ml-2">₹{platformMetrics.totalPayouts.toLocaleString()}</p>
                    </motion.div>
                </div>

                {/* SECTION 4: 3-Way Dynamic Routing Tabs */}
                <motion.div variants={itemVariants} className="flex border-b border-[#A3A3A3]/30 mb-8 overflow-x-auto no-scrollbar">
                    {['Pending Payouts', 'Global Ledger', 'Seller Vault (Bank/UPI)'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-4 px-2 mr-8 text-[15px] font-black transition-all border-b-[3px] relative whitespace-nowrap ${
                                activeTab === tab ? 'border-[#E7364D] text-[#E7364D]' : 'border-transparent text-[#626262] hover:text-[#333333]'
                            }`}
                        >
                            {tab}
                            {tab === 'Pending Payouts' && pendingQueue.length > 0 && (
                                <span className="ml-2 bg-[#E7364D] text-[#FFFFFF] text-[10px] px-2 py-0.5 rounded-full">{pendingQueue.length}</span>
                            )}
                        </button>
                    ))}
                </motion.div>

                {/* SECTION 5: Real-Time Data Filter & Search Engine */}
                <motion.div variants={itemVariants} className="relative w-full max-w-md mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3A3A3]" size={18} />
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by ID, User, or Event..."
                        className="w-full pl-12 pr-4 py-3.5 bg-[#FFFFFF] border border-[#A3A3A3]/30 rounded-[8px] text-[14px] text-[#333333] font-bold outline-none focus:border-[#E7364D] shadow-sm transition-colors"
                    />
                </motion.div>

                <AnimatePresence mode="wait">
                    {/* --- TAB 1: PENDING PAYOUTS ACTION QUEUE --- */}
                    {activeTab === 'Pending Payouts' && (
                        <motion.div key="payouts" variants={containerVariants} initial="hidden" animate="show" exit="exit" className="w-full space-y-6">
                            {pendingQueue.length > 0 ? pendingQueue.map(w => (
                                <motion.div variants={itemVariants} key={w.id} className="bg-[#FFFFFF] border border-[#E7364D]/40 rounded-[12px] p-6 shadow-sm hover:shadow-[0_4px_20px_rgba(231,54,77,0.08)] transition-all">
                                    <div className="flex flex-col lg:flex-row gap-6 justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="bg-[#FAD8DC]/30 text-[#E7364D] text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-[4px] border border-[#E7364D]/20">Action Required</span>
                                                <span className="text-[12px] font-bold text-[#A3A3A3]">{w.displayDate}</span>
                                            </div>
                                            <h3 className="text-[28px] font-black text-[#333333] mb-1">₹{Number(w.amount).toLocaleString()}</h3>
                                            <p className="text-[13px] text-[#626262] font-mono font-bold">Req ID: {w.id} • Seller ID: {generateShortHash(w.userId)}</p>
                                        </div>

                                        <div className="flex-1 bg-[#FAFAFA] border border-[#A3A3A3]/20 rounded-[8px] p-5">
                                            <h4 className="text-[12px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-3 flex items-center"><ShieldCheck size={14} className="mr-1.5"/> Destination Credentials</h4>
                                            {w.sellerBankDetails ? (
                                                <div className="space-y-2">
                                                    {w.sellerBankDetails.accountNumber && (
                                                        <div className="flex items-center gap-3 text-[#333333] font-mono text-[13px]">
                                                            <Landmark size={16} className="text-[#626262]"/>
                                                            <span><strong className="text-[#1a1a1a]">ACCT:</strong> {w.sellerBankDetails.accountNumber} <strong className="text-[#1a1a1a] ml-2">IFSC:</strong> {w.sellerBankDetails.ifscCode}</span>
                                                        </div>
                                                    )}
                                                    {w.sellerBankDetails.upiId && (
                                                        <div className="flex items-center gap-3 text-[#333333] font-mono text-[13px]">
                                                            <Smartphone size={16} className="text-[#626262]"/>
                                                            <span><strong className="text-[#1a1a1a]">UPI:</strong> {w.sellerBankDetails.upiId}</span>
                                                        </div>
                                                    )}
                                                    <div className="text-[12px] text-[#626262] font-bold mt-2 pt-2 border-t border-[#A3A3A3]/10 uppercase">
                                                        NAME: {w.sellerBankDetails.accountName || 'Not Provided'}
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-[13px] font-bold text-[#E7364D] flex items-center"><AlertTriangle size={14} className="mr-1.5"/> No Bank Details Linked in Vault</p>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-3 justify-center min-w-[200px]">
                                            <button 
                                                onClick={() => handleProcessAction(w.id, 'Processed (Direct Transfer)')}
                                                disabled={isProcessingId === w.id || !w.sellerBankDetails}
                                                className="w-full bg-[#333333] text-[#FFFFFF] px-6 py-3.5 rounded-[8px] font-bold text-[14px] hover:bg-[#E7364D] transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center"
                                            >
                                                {isProcessingId === w.id ? <RefreshCcw size={18} className="animate-spin" /> : <><CheckCircle2 size={18} className="mr-2"/> Mark as Paid</>}
                                            </button>
                                            <button 
                                                onClick={() => handleProcessAction(w.id, 'Rejected - Invalid Details')}
                                                disabled={isProcessingId === w.id}
                                                className="w-full bg-[#FFFFFF] border border-[#A3A3A3]/30 text-[#626262] px-6 py-3 rounded-[8px] font-bold text-[14px] hover:text-[#E7364D] hover:bg-[#FAD8DC]/20 hover:border-[#E7364D]/50 transition-colors flex items-center justify-center"
                                            >
                                                <XCircle size={18} className="mr-2"/> Reject Request
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="py-24 flex flex-col items-center justify-center text-center bg-[#FFFFFF] border border-dashed border-[#A3A3A3]/30 rounded-[12px]">
                                    <ShieldCheck size={48} className="text-[#A3A3A3] mb-4 opacity-50" />
                                    <h3 className="text-[20px] font-black text-[#333333] mb-2">Inbox Zero</h3>
                                    <p className="text-[14px] text-[#626262] font-medium">All pending withdrawals have been successfully processed.</p>
                                </div>
                            )}

                            {completedQueue.length > 0 && (
                                <div className="mt-12">
                                    <h3 className="text-[18px] font-black text-[#333333] mb-6 border-b border-[#A3A3A3]/20 pb-4">Recently Processed</h3>
                                    <div className="bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[12px] overflow-hidden shadow-sm">
                                        <table className="w-full text-left">
                                            <thead className="bg-[#F5F5F5] border-b border-[#A3A3A3]/20">
                                                <tr>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest">Date</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest">User ID</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest">Amount</th>
                                                    <th className="px-6 py-4 text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#A3A3A3]/10">
                                                {completedQueue.map(w => (
                                                    <tr key={w.id} className="hover:bg-[#FAFAFA]">
                                                        <td className="px-6 py-4 text-[13px] text-[#626262] font-bold">{w.displayDate}</td>
                                                        <td className="px-6 py-4 text-[13px] font-mono text-[#333333] font-bold">{generateShortHash(w.userId)}</td>
                                                        <td className="px-6 py-4 text-[14px] font-black text-[#333333]">₹{Number(w.amount).toLocaleString()}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2.5 py-1 rounded-[4px] text-[10px] font-black uppercase tracking-widest border ${w.status.includes('Rejected') ? 'bg-[#FAD8DC]/30 text-[#E7364D] border-[#E7364D]/20' : 'bg-[#eaf4d9] text-[#458731] border-[#d5edba]'}`}>
                                                                {w.status.includes('Processed') ? 'Paid' : 'Rejected'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* --- TAB 2: GLOBAL LEDGER --- */}
                    {activeTab === 'Global Ledger' && (
                        <motion.div key="ledger" variants={containerVariants} initial="hidden" animate="show" exit="exit" className="w-full">
                            <div className="bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[12px] overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-[#F5F5F5] border-b border-[#A3A3A3]/20">
                                                <th className="px-6 py-4 text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest">Date</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest">Order ID</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest">Event</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest">Amount</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#A3A3A3]/10">
                                            {globalLedger.map((o) => (
                                                <tr key={o.id} className="hover:bg-[#FAFAFA] transition-colors">
                                                    <td className="px-6 py-4 text-[13px] text-[#626262] font-medium whitespace-nowrap">{o.displayDate}</td>
                                                    <td className="px-6 py-4 text-[13px] font-mono font-bold text-[#0064d2] cursor-pointer hover:underline">#{generateShortHash(o.id)}</td>
                                                    <td className="px-6 py-4 text-[14px] font-bold text-[#333333]">{o.eventName || 'Ticket Sale'}</td>
                                                    <td className="px-6 py-4 text-[14px] font-black text-[#333333] whitespace-nowrap">₹{o.amount.toLocaleString()}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2.5 py-1 rounded-[4px] text-[10px] font-black uppercase tracking-widest border bg-[#F5F5F5] text-[#626262] border-[#A3A3A3]/30">
                                                            {o.status || 'Processed'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {globalLedger.length === 0 && (
                                                <tr><td colSpan="5" className="px-6 py-12 text-center text-[#A3A3A3] font-bold text-[14px]">No ledger records found matching search.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- TAB 3: SELLER VAULT --- */}
                    {activeTab === 'Seller Vault (Bank/UPI)' && (
                        <motion.div key="vault" variants={containerVariants} initial="hidden" animate="show" exit="exit" className="w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {vaultData.map(v => (
                                    <motion.div variants={itemVariants} key={v.id} className="bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[12px] p-6 shadow-sm hover:shadow-[0_4px_20px_rgba(51,51,51,0.04)] transition-all">
                                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#A3A3A3]/10">
                                            <div className="w-10 h-10 bg-[#F5F5F5] border border-[#A3A3A3]/20 rounded-full flex items-center justify-center shrink-0">
                                                <Lock size={16} className="text-[#333333]"/>
                                            </div>
                                            <div>
                                                <h4 className="text-[15px] font-black text-[#333333] truncate">{v.accountName || 'Seller Bank'}</h4>
                                                <p className="text-[11px] font-mono text-[#A3A3A3]">UID: {generateShortHash(v.userId)}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            {v.accountNumber && (
                                                <div>
                                                    <p className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1 flex items-center"><Landmark size={12} className="mr-1.5"/> Bank ACC</p>
                                                    <p className="text-[14px] font-mono font-bold text-[#333333]">{v.accountNumber}</p>
                                                    <p className="text-[12px] text-[#626262] font-medium mt-0.5">IFSC: {v.ifscCode}</p>
                                                </div>
                                            )}
                                            {v.upiId && (
                                                <div className="pt-2">
                                                    <p className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1 flex items-center"><Smartphone size={12} className="mr-1.5"/> UPI ID</p>
                                                    <p className="text-[14px] font-mono font-bold text-[#E7364D] lowercase">{v.upiId}</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                                {vaultData.length === 0 && (
                                    <div className="col-span-full py-12 text-center text-[#A3A3A3] font-bold text-[14px]">No payment methods found matching search.</div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}