import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    Wallet, 
    Ticket, 
    TrendingUp, 
    ArrowRight, 
    Clock, 
    CheckCircle2, 
    AlertCircle,
    PlusCircle,
    Banknote,
    ChevronRight
} from 'lucide-react';
import { useSellerStore } from '../../store/useSellerStore';

export default function ProfileOverview() {
    const navigate = useNavigate();
    
    // FEATURE 1: Secure Data Extraction from Seller Store
    // Relies strictly on real-time data populated by the global seller gatekeeper
    const { user, walletBalance, listings = [], sales = [], isLoading } = useSellerStore();

    // FEATURE 2: Dynamic Time-Aware Greeting Logic
    const [greeting, setGreeting] = useState('');
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');
    }, []);

    // FEATURE 3: Real-Time Inventory Computation
    const activeListingsCount = useMemo(() => {
        return listings.filter(l => l.status === 'active').length;
    }, [listings]);

    const pendingListingsCount = useMemo(() => {
        return listings.filter(l => l.status === 'pending').length;
    }, [listings]);

    // FEATURE 4: Live Lifetime Revenue Calculator
    const lifetimeRevenue = useMemo(() => {
        return sales.reduce((total, sale) => total + (Number(sale.amount) || 0), 0);
    }, [sales]);

    // FEATURE 5: Chronological Sales Pipeline Sorter
    const recentSales = useMemo(() => {
        return [...sales]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 3); // Extract only the 3 most recent for the dashboard feed
    }, [sales]);

    // FEATURE 6: Currency Formatter Utility
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    // FEATURE 7: Framer Motion Staggered Physics Engine
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
    };

    if (isLoading) {
        return (
            <div className="w-full h-[60vh] flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#1a1a1a] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-[13px] font-bold text-[#54626c] tracking-widest uppercase">Syncing Dashboard...</p>
            </div>
        );
    }

    return (
        <motion.div 
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="w-full font-sans max-w-[1000px] pb-20"
        >
            {/* FEATURE 8: Contextual Header with Quick-Action Injection */}
            <motion.div variants={cardVariants} className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-[28px] md:text-[32px] font-black text-[#1a1a1a] tracking-tight leading-tight">
                        {greeting}, {user?.displayName || user?.email?.split('@')[0] || 'Seller'}.
                    </h1>
                    <p className="text-[#54626c] text-[15px] mt-1">
                        Here is what is happening with your inventory and sales today.
                    </p>
                </div>
                <button 
                    onClick={() => navigate('/sell')} // Assuming there's a global sell route or modal trigger
                    className="flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#333333] text-white px-6 py-3 rounded-[4px] font-bold text-[14px] transition-colors shrink-0"
                >
                    <PlusCircle size={18} /> List New Tickets
                </button>
            </motion.div>

            {/* FEATURE 9: Real-Time Financial & Inventory Metric Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Metric 1: Available Wallet Balance */}
                <motion.div variants={cardVariants} className="bg-white border border-[#e2e2e2] rounded-[4px] p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="w-10 h-10 bg-[#eaf4d9] rounded-full flex items-center justify-center mb-4">
                            <Wallet size={20} className="text-[#458731]" />
                        </div>
                        <p className="text-[13px] font-bold text-[#54626c] uppercase tracking-wider mb-1">Available to Withdraw</p>
                        <h2 className="text-[32px] font-black text-[#1a1a1a] tracking-tight">
                            {formatCurrency(walletBalance)}
                        </h2>
                    </div>
                    <button 
                        onClick={() => navigate('/profile/wallet')}
                        className="mt-6 text-[#0064d2] text-[14px] font-bold hover:underline flex items-center"
                    >
                        Manage Wallet <ArrowRight size={16} className="ml-1" />
                    </button>
                </motion.div>

                {/* Metric 2: Active Inventory */}
                <motion.div variants={cardVariants} className="bg-white border border-[#e2e2e2] rounded-[4px] p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="w-10 h-10 bg-[#ebf3fb] rounded-full flex items-center justify-center mb-4">
                            <Ticket size={20} className="text-[#0064d2]" />
                        </div>
                        <p className="text-[13px] font-bold text-[#54626c] uppercase tracking-wider mb-1">Active Listings</p>
                        <div className="flex items-baseline gap-3">
                            <h2 className="text-[32px] font-black text-[#1a1a1a] tracking-tight">
                                {activeListingsCount}
                            </h2>
                            {pendingListingsCount > 0 && (
                                <span className="text-[13px] font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md">
                                    {pendingListingsCount} pending
                                </span>
                            )}
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate('/profile/listings')}
                        className="mt-6 text-[#0064d2] text-[14px] font-bold hover:underline flex items-center"
                    >
                        View Inventory <ArrowRight size={16} className="ml-1" />
                    </button>
                </motion.div>

                {/* Metric 3: Lifetime Sales Tracking */}
                <motion.div variants={cardVariants} className="bg-white border border-[#e2e2e2] rounded-[4px] p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="w-10 h-10 bg-[#f8f9fa] rounded-full flex items-center justify-center mb-4 border border-[#e2e2e2]">
                            <TrendingUp size={20} className="text-[#1a1a1a]" />
                        </div>
                        <p className="text-[13px] font-bold text-[#54626c] uppercase tracking-wider mb-1">Lifetime Revenue</p>
                        <h2 className="text-[32px] font-black text-[#1a1a1a] tracking-tight">
                            {formatCurrency(lifetimeRevenue)}
                        </h2>
                    </div>
                    <button 
                        onClick={() => navigate('/profile/sales')}
                        className="mt-6 text-[#0064d2] text-[14px] font-bold hover:underline flex items-center"
                    >
                        View All Sales <ArrowRight size={16} className="ml-1" />
                    </button>
                </motion.div>
            </div>

            {/* FEATURE 10: Dynamic Recent Activity Feed & Production Empty States */}
            <motion.div variants={cardVariants} className="bg-white border border-[#e2e2e2] rounded-[4px] shadow-sm overflow-hidden">
                <div className="border-b border-[#e2e2e2] px-6 py-5 flex items-center justify-between bg-[#f8f9fa]">
                    <h3 className="text-[16px] font-bold text-[#1a1a1a] flex items-center gap-2">
                        <Clock size={18} className="text-[#54626c]" /> Recent Sales Activity
                    </h3>
                    {recentSales.length > 0 && (
                        <button onClick={() => navigate('/profile/sales')} className="text-[13px] font-bold text-[#0064d2] hover:underline">
                            View All
                        </button>
                    )}
                </div>

                <div className="p-0">
                    {recentSales.length > 0 ? (
                        <div className="divide-y divide-[#e2e2e2]">
                            {recentSales.map((sale) => (
                                <div key={sale.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#eaf4d9] flex items-center justify-center shrink-0 mt-1">
                                            <Banknote size={20} className="text-[#458731]" />
                                        </div>
                                        <div>
                                            <h4 className="text-[15px] font-bold text-[#1a1a1a] mb-1">{sale.eventName || 'Event Tickets Sold'}</h4>
                                            <div className="flex items-center gap-3 text-[13px] text-[#54626c]">
                                                <span>Order #{sale.id.substring(0, 8).toUpperCase()}</span>
                                                <span className="w-1 h-1 rounded-full bg-[#cccccc]"></span>
                                                <span>{new Date(sale.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between md:justify-end gap-6 md:w-auto w-full border-t border-gray-100 md:border-0 pt-4 md:pt-0">
                                        <div className="text-right">
                                            <div className="text-[16px] font-black text-[#1a1a1a]">+{formatCurrency(sale.amount)}</div>
                                            <div className="text-[12px] font-bold text-[#458731] flex items-center justify-end mt-1">
                                                <CheckCircle2 size={12} className="mr-1" /> Payment Secured
                                            </div>
                                        </div>
                                        <button onClick={() => navigate('/profile/sales')} className="text-gray-400 hover:text-[#1a1a1a] transition-colors">
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 px-6 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-[#f8f9fa] rounded-full flex items-center justify-center mb-4">
                                <TrendingUp size={28} className="text-gray-400" />
                            </div>
                            <h4 className="text-[18px] font-bold text-[#1a1a1a] mb-2">No sales yet</h4>
                            <p className="text-[15px] text-[#54626c] max-w-md mb-6">
                                When your tickets sell, the transactions will appear here securely. List your first tickets to get started.
                            </p>
                            <button 
                                onClick={() => navigate('/sell')}
                                className="bg-white border border-[#cccccc] hover:border-[#1a1a1a] text-[#1a1a1a] px-6 py-2.5 rounded-[4px] font-bold text-[14px] transition-colors"
                            >
                                Create a Listing
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}