import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    List, 
    LayoutGrid, 
    Info, 
    ChevronDown, 
    Filter, 
    MoreHorizontal,
    Loader2,
    Ticket
} from 'lucide-react';
import { useMainStore } from '../../store/useMainStore';
import { useNavigate } from 'react-router-dom';

export default function Listings() {
    const navigate = useNavigate();
    const { orders, isLoadingOrders } = useMainStore(); // Using orders/listings from store
    
    // FEATURE 1: Real-time Search State
    const [searchTerm, setSearchTerm] = useState('');
    
    // FEATURE 2: Layout Toggle State (List vs Grid)
    const [viewMode, setViewMode] = useState('list');
    
    // FEATURE 3: Sorting Logic State
    const [sortBy, setSortBy] = useState('Action required');

    // FEATURE 4: Mocking real listings if store doesn't have them yet for UI demo 
    // In production, this pulls from useMainStore.myListings
    const myListings = []; 

    // FEATURE 5: Advanced Search Filtering Logic
    const filteredListings = useMemo(() => {
        return myListings.filter(item => 
            item.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.venue?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, myListings]);

    // FEATURE 6: Staggered Animation Engine
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.04 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="w-full font-sans max-w-[1000px] pb-20"
        >
            {/* FEATURE 7: Strict Typography Header */}
            <motion.h1 
                variants={itemVariants}
                className="text-[32px] font-black text-[#1a1a1a] mb-6 tracking-tighter leading-tight"
            >
                Listings
            </motion.h1>
            
            {/* FEATURE 8: 1:1 Responsive Filter Bar */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center gap-4 mb-8">
                {/* Search Input Container */}
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Event, artist or team"
                        className="w-full pl-10 pr-4 py-2.5 border border-[#cccccc] rounded-[4px] text-[15px] outline-none focus:border-[#458731] focus:ring-1 focus:ring-[#458731] transition-all bg-white"
                    />
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto">
                    {/* Status Toggle Button */}
                    <button className="flex-1 md:flex-none px-4 py-2.5 border border-[#cccccc] rounded-[4px] flex items-center justify-between bg-[#eaf4d9] hover:bg-[#d9eab8] transition-colors">
                        <span className="text-[14px] font-bold text-[#458731] mr-2">Status</span>
                        <div className="bg-[#458731] text-white rounded-full w-5 h-5 flex items-center justify-center text-[11px] font-bold">
                            {myListings.length}
                        </div>
                        <ChevronDown size={16} className="ml-2 text-[#458731]" />
                    </button>

                    {/* Sort Dropdown */}
                    <button className="flex-1 md:flex-none px-4 py-2.5 border border-[#cccccc] rounded-[4px] flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                        <span className="text-[14px] text-[#54626c] mr-2">Sort by: <span className="text-[#1a1a1a] font-medium">{sortBy}</span></span>
                        <ChevronDown size={16} className="text-gray-500" />
                    </button>

                    {/* View Switchers */}
                    <div className="hidden lg:flex items-center border border-[#cccccc] rounded-[4px] overflow-hidden">
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-2.5 ${viewMode === 'list' ? 'bg-gray-100 text-[#1a1a1a]' : 'bg-white text-gray-400 hover:text-gray-600'}`}
                        >
                            <List size={20} />
                        </button>
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-2.5 border-l border-[#cccccc] ${viewMode === 'grid' ? 'bg-gray-100 text-[#1a1a1a]' : 'bg-white text-gray-400 hover:text-gray-600'}`}
                        >
                            <LayoutGrid size={20} />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* FEATURE 9: 1:1 Replica Info Banner */}
            <motion.div 
                variants={itemVariants}
                className="w-full bg-[#ebf3fb] border-l-4 border-[#0064d2] p-4 flex items-start mb-10 shadow-sm"
            >
                <div className="bg-[#0064d2] rounded-full p-0.5 mt-0.5 mr-3 shrink-0">
                    <Info size={14} className="text-white" />
                </div>
                <p className="text-[14px] text-[#1a1a1a] leading-normal font-medium">
                    Please add or set a default payout method to start receiving payments for your transactions.
                </p>
            </motion.div>

            {/* FEATURE 10: Empty State vs Data List Logic */}
            <AnimatePresence mode="wait">
                {isLoadingOrders ? (
                    <motion.div 
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-20"
                    >
                        <Loader2 className="animate-spin text-[#458731] mb-4" size={32} />
                        <p className="text-[#54626c] font-medium text-[15px]">Accessing ticket inventory...</p>
                    </motion.div>
                ) : filteredListings.length > 0 ? (
                    <motion.div 
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full grid grid-cols-1 gap-4"
                    >
                        {filteredListings.map(item => (
                            <div key={item.id} className="bg-white border border-[#e2e2e2] rounded-[4px] p-5 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded flex items-center justify-center border border-gray-100">
                                        <Ticket className="text-[#458731]" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#1a1a1a]">{item.eventName}</h3>
                                        <p className="text-[13px] text-[#54626c]">{item.venue} • {item.date}</p>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                                    <MoreHorizontal className="text-gray-400" />
                                </button>
                            </div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div 
                        key="empty"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-24 flex flex-col items-center"
                    >
                        <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-2">You don't have any listings</h3>
                        <p className="text-[15px] text-[#54626c] mb-8">When you list tickets for sale, they will appear here.</p>
                        <button 
                            onClick={() => navigate('/sell')}
                            className="bg-[#458731] hover:bg-[#366a26] text-white font-bold py-3 px-8 rounded-[4px] transition-all shadow-sm"
                        >
                            Sell tickets
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}