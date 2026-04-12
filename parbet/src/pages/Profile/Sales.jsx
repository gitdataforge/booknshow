import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Info, 
    Search, 
    ChevronDown, 
    AlertCircle, 
    ExternalLink, 
    Loader2, 
    DollarSign,
    ArrowUpRight
} from 'lucide-react';
import { useMainStore } from '../../store/useMainStore';
import { useNavigate } from 'react-router-dom';

export default function Sales() {
    const navigate = useNavigate();
    
    // FEATURE 1: Real-time Data Extraction from Secure Main Store
    const { user, wallet, orders, isLoadingOrders } = useMainStore();
    
    // FEATURE 2: Local Tab Filtering State (1:1 Viagogo logic)
    const [activeTab, setActiveTab] = useState('All sales');
    const [searchTerm, setSearchTerm] = useState('');

    // FEATURE 3: Real Logic - Verify Payout Methods
    // In production, this checks if the user has a linked bank/PayPal in Firestore
    const hasPayoutMethod = wallet?.payoutMethodLinked || false;

    // FEATURE 4: Production Sales Filtering (Mocking logic for empty/populated states)
    const mySales = []; // This would pull from a real 'sales' collection in a production useMainStore update

    const filteredSales = useMemo(() => {
        return mySales.filter(sale => {
            const matchesSearch = sale.eventName?.toLowerCase().includes(searchTerm.toLowerCase());
            if (activeTab === 'Open') return matchesSearch && sale.status !== 'Paid';
            if (activeTab === 'Closed') return matchesSearch && sale.status === 'Paid';
            return matchesSearch;
        });
    }, [searchTerm, activeTab, mySales]);

    // FEATURE 5: Staggered Framer Motion Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="w-full font-sans max-w-[1000px] pb-20"
        >
            {/* FEATURE 6: Strict Header Typography Mapping */}
            <motion.h1 
                variants={itemVariants}
                className="text-[32px] font-black text-[#1a1a1a] mb-6 tracking-tighter leading-tight"
            >
                Sales
            </motion.h1>

            {/* FEATURE 7: 1:1 REPLICA - Yellow Payout Warning Banner (Real Logic Triggered) */}
            {!hasPayoutMethod && (
                <motion.div 
                    variants={itemVariants}
                    className="w-full bg-[#fff4e5] border border-[#ffcc80] rounded-[4px] p-4 flex flex-col md:flex-row items-center justify-between mb-8 shadow-sm"
                >
                    <div className="flex items-center mb-4 md:mb-0">
                        <AlertCircle size={24} className="text-[#f57c00] mr-3 shrink-0" />
                        <p className="text-[14px] font-bold text-[#1a1a1a]">Action required: Add payout method</p>
                    </div>
                    <button 
                        onClick={() => navigate('/profile/settings')}
                        className="w-full md:w-auto px-5 py-2.5 bg-white border border-[#1a1a1a] rounded-[4px] text-[14px] font-bold text-[#1a1a1a] hover:bg-gray-50 transition-colors shadow-sm active:scale-95"
                    >
                        Add Payout Method
                    </button>
                </motion.div>
            )}

            {/* FEATURE 8: Interactive Sub-Tabs Navigation */}
            <motion.div variants={itemVariants} className="flex border-b border-[#e2e2e2] mb-8 overflow-x-auto no-scrollbar">
                {['All sales', 'Open', 'Closed'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-3 px-1 mr-8 text-[15px] font-bold transition-all border-b-2 whitespace-nowrap ${
                            activeTab === tab 
                            ? 'border-[#458731] text-[#458731]' 
                            : 'border-transparent text-[#54626c] hover:text-[#1a1a1a]'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </motion.div>

            {/* FEATURE 9: Real-time Filter & Search Engine */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center gap-4 mb-10">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by event or order ID"
                        className="w-full pl-10 pr-4 py-2.5 border border-[#cccccc] rounded-[4px] text-[15px] outline-none focus:border-[#458731] focus:ring-1 focus:ring-[#458731] transition-all bg-white shadow-sm"
                    />
                </div>
                <button className="w-full md:w-auto px-4 py-2.5 border border-[#cccccc] rounded-[4px] flex items-center justify-between bg-white hover:bg-gray-50 transition-colors text-[14px] font-medium text-[#1a1a1a]">
                    Last 6 months <ChevronDown size={16} className="ml-4 text-gray-500" />
                </button>
            </motion.div>

            {/* FEATURE 10: Dynamic Empty State vs List Logic */}
            <AnimatePresence mode="wait">
                {isLoadingOrders ? (
                    <motion.div 
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-24"
                    >
                        <Loader2 className="animate-spin text-[#458731] mb-4" size={32} />
                        <p className="text-[#54626c] font-medium text-[15px]">Syncing sales data with network...</p>
                    </motion.div>
                ) : filteredSales.length > 0 ? (
                    <motion.div 
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                    >
                        {/* Map sales here in production */}
                    </motion.div>
                ) : (
                    <motion.div 
                        key="empty"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-32 flex flex-col items-center bg-white border border-dashed border-[#e2e2e2] rounded-[8px]"
                    >
                        <div className="bg-[#f8f9fa] p-5 rounded-full mb-6">
                            <DollarSign size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-2">You don't have any sales</h3>
                        <p className="text-[15px] text-[#54626c] mb-8 max-w-sm">
                            Completed sales and payout history will appear here once you've fulfilled an order.
                        </p>
                        <button 
                            onClick={() => navigate('/profile/listings')}
                            className="text-[#458731] font-bold text-[15px] hover:underline flex items-center"
                        >
                            View my active listings <ArrowUpRight size={16} className="ml-1" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}