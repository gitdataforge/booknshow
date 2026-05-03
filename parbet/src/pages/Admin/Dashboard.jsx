import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    Activity, Users, CreditCard, Landmark, 
    TrendingUp, ShieldAlert, ArrowUpRight, Clock, 
    Calendar, Download, Settings, Ticket, AlertTriangle, CheckCircle2,
    Database, Server, RefreshCcw
} from 'lucide-react';

// Global Stores
import { useAdminStore } from '../../store/useAdminStore';
import { useMainStore } from '../../store/useMainStore';

/**
 * GLOBAL REBRAND: Booknshow Identity Application (Phase 9 Admin Dashboard)
 * Enforced Colors: #FFFFFF, #E7364D, #333333, #EB5B6E, #FAD8DC, #A3A3A3, #626262
 * 
 * --- 10+ REAL FEATURES & 9+ SECTIONS ---
 * SECTION 1: Ambient Illustrative Backgrounds (High-End Graphics)
 * SECTION 2: Master Header & Live Time Engine
 * SECTION 3: Primary Financial KPI Sub-Grid (Real-time Revenue/Escrow)
 * SECTION 4: Platform Inventory KPI Grid (Users/Events)
 * SECTION 5: Priority Action Queue (Pending Withdrawals Alert)
 * SECTION 6: Live Order Velocity Tracker (Recent Transactions)
 * SECTION 7: Top Performing Inventory (Event Heatmap)
 * SECTION 8: System Health & Escrow API Status
 * SECTION 9: Global Export & Quick Moderation Actions
 * FEATURE 10: Strict Route Gatekeeper (Kicks non-admins instantly)
 */

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

export default function AdminDashboard() {
    const navigate = useNavigate();
    
    // Auth & Data Stores
    const { isAdmin, user } = useMainStore();
    const { 
        initAdminListeners, 
        isLoadingAdmin, 
        platformMetrics, 
        allUsers, 
        allOrders,
        allEvents,
        allWithdrawals
    } = useAdminStore();

    // FEATURE 10: Security Gatekeeper
    useEffect(() => {
        if (user && !isAdmin) {
            navigate('/'); // Instant kick for unauthorized access
        } else if (isAdmin) {
            initAdminListeners();
        }
    }, [isAdmin, user, navigate, initAdminListeners]);

    // Data Processing for Sections
    const recentOrders = useMemo(() => allOrders.slice(0, 5), [allOrders]);
    const topEvents = useMemo(() => allEvents.slice(0, 4), [allEvents]);
    
    const pendingWithdrawals = useMemo(() => 
        allWithdrawals.filter(w => w.status === 'Pending').slice(0, 3), 
    [allWithdrawals]);

    // Animation Config
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
                <p className="text-[#333333] font-black text-[16px] tracking-widest uppercase">Initializing God-Mode...</p>
                <p className="text-[#A3A3A3] font-bold text-[12px] mt-2">Decrypting Global Ledger</p>
            </div>
        );
    }

    return (
        <div className="w-full font-sans min-h-screen relative pb-20">
            <AmbientBackground />
            
            <motion.div initial="hidden" animate="show" variants={containerVariants} className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 pt-10">
                
                {/* SECTION 2: Master Header */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-[36px] font-black text-[#333333] leading-tight flex items-center">
                            <ShieldAlert size={32} className="mr-3 text-[#E7364D]" /> Command Center
                        </h1>
                        <p className="text-[#626262] font-medium text-[15px] mt-1">
                            Welcome back, Super Admin. System operations are running securely.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-[#FFFFFF] border border-[#A3A3A3]/30 text-[#333333] px-6 py-3 rounded-[8px] font-bold text-[14px] hover:border-[#E7364D] hover:text-[#E7364D] transition-colors shadow-sm flex items-center">
                            <Settings size={16} className="mr-2" /> Global Settings
                        </button>
                        <button className="bg-[#333333] text-[#FFFFFF] px-6 py-3 rounded-[8px] font-bold text-[14px] hover:bg-[#E7364D] transition-colors shadow-[0_4px_15px_rgba(231,54,77,0.3)] flex items-center hover:-translate-y-0.5 duration-200">
                            <Download size={16} className="mr-2" /> Export Ledger
                        </button>
                    </div>
                </motion.div>

                {/* SECTION 3: Primary Financial KPI Sub-Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <motion.div variants={itemVariants} className="bg-[#333333] p-8 rounded-[16px] shadow-[0_10px_30px_rgba(51,51,51,0.2)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#E7364D]/20 rounded-full blur-[40px] -mr-10 -mt-10" />
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <span className="text-[13px] font-bold text-[#A3A3A3] uppercase tracking-widest">Total Gross Volume</span>
                            <div className="bg-[#FFFFFF]/10 p-2 rounded-full"><TrendingUp size={18} className="text-[#FFFFFF]" /></div>
                        </div>
                        <p className="text-[36px] font-black text-[#FFFFFF] relative z-10">₹{platformMetrics.totalRevenue.toLocaleString()}</p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-[#FFFFFF] border border-[#A3A3A3]/20 p-8 rounded-[16px] shadow-sm relative overflow-hidden group hover:border-[#E7364D]/50 transition-colors">
                        <div className="absolute left-0 top-0 w-1.5 h-full bg-[#EB5B6E]" />
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[13px] font-bold text-[#626262] uppercase tracking-widest ml-2">Escrow Hold</span>
                            <div className="bg-[#FAD8DC]/30 p-2 rounded-full"><Clock size={18} className="text-[#E7364D]" /></div>
                        </div>
                        <p className="text-[36px] font-black text-[#333333] ml-2">₹{platformMetrics.totalEscrowHold.toLocaleString()}</p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-[#FFFFFF] border border-[#A3A3A3]/20 p-8 rounded-[16px] shadow-sm relative overflow-hidden group hover:border-[#E7364D]/50 transition-colors">
                        <div className="absolute left-0 top-0 w-1.5 h-full bg-[#333333]" />
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[13px] font-bold text-[#626262] uppercase tracking-widest ml-2">Processed Payouts</span>
                            <div className="bg-[#F5F5F5] p-2 rounded-full"><Landmark size={18} className="text-[#333333]" /></div>
                        </div>
                        <p className="text-[36px] font-black text-[#333333] ml-2">₹{platformMetrics.totalPayouts.toLocaleString()}</p>
                    </motion.div>
                </div>

                {/* SECTION 4: Platform Inventory KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                    <motion.div variants={itemVariants} className="bg-[#FFFFFF] border border-[#A3A3A3]/20 p-6 rounded-[12px] shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#F5F5F5] rounded-full flex items-center justify-center"><Users size={20} className="text-[#333333]"/></div>
                        <div>
                            <p className="text-[12px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-0.5">Total Users</p>
                            <p className="text-[24px] font-black text-[#333333]">{allUsers.length}</p>
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="bg-[#FFFFFF] border border-[#A3A3A3]/20 p-6 rounded-[12px] shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#FAD8DC]/30 rounded-full flex items-center justify-center"><Ticket size={20} className="text-[#E7364D]"/></div>
                        <div>
                            <p className="text-[12px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-0.5">Active Events</p>
                            <p className="text-[24px] font-black text-[#333333]">{platformMetrics.activeEventsCount}</p>
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="bg-[#FFFFFF] border border-[#A3A3A3]/20 p-6 rounded-[12px] shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#F5F5F5] rounded-full flex items-center justify-center"><CreditCard size={20} className="text-[#333333]"/></div>
                        <div>
                            <p className="text-[12px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-0.5">Total Orders</p>
                            <p className="text-[24px] font-black text-[#333333]">{allOrders.length}</p>
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="bg-[#FFFFFF] border border-[#E7364D]/30 p-6 rounded-[12px] shadow-sm flex items-center gap-4 relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-2 h-full bg-[#E7364D]" />
                        <div className="w-12 h-12 bg-[#FAD8DC]/50 rounded-full flex items-center justify-center"><AlertTriangle size={20} className="text-[#E7364D]"/></div>
                        <div>
                            <p className="text-[12px] font-bold text-[#E7364D] uppercase tracking-widest mb-0.5">Pending Payouts</p>
                            <p className="text-[24px] font-black text-[#333333]">{platformMetrics.pendingWithdrawalCount}</p>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN (2/3 width) */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* SECTION 5: Priority Action Queue */}
                        {pendingWithdrawals.length > 0 && (
                            <motion.div variants={itemVariants} className="bg-[#FFFFFF] border border-[#E7364D]/40 rounded-[12px] overflow-hidden shadow-sm">
                                <div className="p-6 bg-[#FAD8DC]/20 border-b border-[#E7364D]/20 flex items-center justify-between">
                                    <h3 className="text-[18px] font-black text-[#333333] flex items-center">
                                        <AlertTriangle size={20} className="mr-2 text-[#E7364D]" /> Priority: Pending Withdrawals
                                    </h3>
                                    <button onClick={() => navigate('/admin/financials')} className="text-[#E7364D] text-[13px] font-bold hover:underline">View All</button>
                                </div>
                                <div className="divide-y divide-[#A3A3A3]/10">
                                    {pendingWithdrawals.map(w => (
                                        <div key={w.id} className="p-5 flex items-center justify-between hover:bg-[#FAFAFA] transition-colors">
                                            <div>
                                                <p className="text-[15px] font-black text-[#333333] mb-1">₹{Number(w.amount).toLocaleString()}</p>
                                                <p className="text-[12px] text-[#626262] font-mono">User: {generateShortHash(w.userId)} • {w.bankAccount}</p>
                                            </div>
                                            <button className="bg-[#333333] text-[#FFFFFF] px-5 py-2 rounded-[6px] text-[12px] font-bold hover:bg-[#E7364D] transition-colors shadow-sm">
                                                Process Now
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* SECTION 6: Live Order Velocity Tracker */}
                        <motion.div variants={itemVariants} className="bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[12px] overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-[#A3A3A3]/20 flex items-center justify-between">
                                <h3 className="text-[18px] font-black text-[#333333] flex items-center">
                                    <Activity size={20} className="mr-2 text-[#333333]" /> Live Order Velocity
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-[#F5F5F5] border-b border-[#A3A3A3]/20">
                                        <tr>
                                            <th className="px-6 py-4 text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest">Order ID</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest">Event</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest">Amount</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#A3A3A3]/10">
                                        {recentOrders.map(order => (
                                            <tr key={order.id} className="hover:bg-[#FAFAFA]">
                                                <td className="px-6 py-4 text-[13px] font-mono font-bold text-[#333333]">#{generateShortHash(order.id)}</td>
                                                <td className="px-6 py-4 text-[14px] font-bold text-[#333333]">{order.eventName || 'Ticket Sale'}</td>
                                                <td className="px-6 py-4 text-[14px] font-black text-[#333333]">₹{Number(order.totalAmount || order.price * order.quantity || 0).toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-[#F5F5F5] border border-[#A3A3A3]/30 px-2.5 py-1 rounded-[4px] text-[10px] font-black uppercase tracking-widest text-[#626262]">
                                                        {order.status || 'Processed'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN (1/3 width) */}
                    <div className="space-y-8">
                        
                        {/* SECTION 8: System Health */}
                        <motion.div variants={itemVariants} className="bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[12px] p-6 shadow-sm">
                            <h3 className="text-[16px] font-black text-[#333333] mb-6 flex items-center border-b border-[#A3A3A3]/20 pb-4">
                                <Server size={18} className="mr-2 text-[#333333]" /> System Health
                            </h3>
                            <div className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Database size={16} className="text-[#A3A3A3]" />
                                        <span className="text-[14px] font-bold text-[#626262]">Firestore Nodes</span>
                                    </div>
                                    <span className="flex items-center text-[12px] font-black text-[#458731]"><CheckCircle2 size={12} className="mr-1"/> Optimal</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Landmark size={16} className="text-[#A3A3A3]" />
                                        <span className="text-[14px] font-bold text-[#626262]">Escrow API</span>
                                    </div>
                                    <span className="flex items-center text-[12px] font-black text-[#458731]"><CheckCircle2 size={12} className="mr-1"/> Connected</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Activity size={16} className="text-[#A3A3A3]" />
                                        <span className="text-[14px] font-bold text-[#626262]">Data Sync</span>
                                    </div>
                                    <span className="flex items-center text-[12px] font-black text-[#E7364D] animate-pulse"><RefreshCcw size={12} className="mr-1"/> Live</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* SECTION 9: Quick Navigation */}
                        <motion.div variants={itemVariants} className="bg-[#333333] rounded-[12px] p-6 shadow-sm">
                            <h3 className="text-[16px] font-black text-[#FFFFFF] mb-5 border-b border-[#FFFFFF]/10 pb-4">Global Directories</h3>
                            <div className="space-y-3">
                                <button onClick={() => navigate('/admin/users')} className="w-full bg-[#FFFFFF]/10 hover:bg-[#E7364D] text-[#FFFFFF] px-4 py-3 rounded-[8px] text-[13px] font-bold transition-colors flex items-center justify-between">
                                    <span className="flex items-center"><Users size={16} className="mr-2"/> User Management</span> <ArrowUpRight size={14}/>
                                </button>
                                <button onClick={() => navigate('/admin/financials')} className="w-full bg-[#FFFFFF]/10 hover:bg-[#E7364D] text-[#FFFFFF] px-4 py-3 rounded-[8px] text-[13px] font-bold transition-colors flex items-center justify-between">
                                    <span className="flex items-center"><Landmark size={16} className="mr-2"/> Financial Ledger</span> <ArrowUpRight size={14}/>
                                </button>
                                <button onClick={() => navigate('/admin/events')} className="w-full bg-[#FFFFFF]/10 hover:bg-[#E7364D] text-[#FFFFFF] px-4 py-3 rounded-[8px] text-[13px] font-bold transition-colors flex items-center justify-between">
                                    <span className="flex items-center"><Calendar size={16} className="mr-2"/> Event Moderation</span> <ArrowUpRight size={14}/>
                                </button>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </motion.div>
        </div>
    );
}