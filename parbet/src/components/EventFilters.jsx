import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Eye, TrendingUp, TrendingDown } from 'lucide-react';
import { useAppStore } from '../store/useStore';

export default function EventFilters({ 
    isOpen, onClose, 
    instantDownloadOnly, setInstantDownloadOnly,
    clearViewOnly, setClearViewOnly,
    sortOrder, setSortOrder,
    filteredCount
}) {
    const { userCurrency } = useAppStore();

    // Resolve proper localized currency symbol dynamically
    const currencySymbol = useMemo(() => {
        switch(userCurrency) {
            case 'USD': return '$';
            case 'GBP': return '£';
            case 'EUR': return '€';
            case 'AUD': return 'A$';
            default: return '₹';
        }
    }, [userCurrency]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 z-[150] backdrop-blur-sm" 
                        onClick={onClose} 
                    />
                    <motion.div 
                        initial={{ x: '100%' }} 
                        animate={{ x: 0 }} 
                        exit={{ x: '100%' }} 
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full sm:w-[350px] bg-white z-[160] shadow-2xl flex flex-col"
                    >
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white z-10">
                            <h2 className="text-xl font-black text-brand-text">Filters</h2>
                            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                                <X size={18} className="text-gray-600"/>
                            </button>
                        </div>
                        
                        <div className="p-6 flex-1 overflow-y-auto space-y-8 bg-[#F8F9FA]">
                            
                            {/* Sort Ordering */}
                            <div>
                                <h3 className="font-bold text-brand-text mb-3 text-[15px]">Sort By</h3>
                                <div className="flex bg-gray-200 p-1 rounded-xl shadow-inner">
                                    <button 
                                        onClick={() => setSortOrder('asc')} 
                                        className={`flex-1 py-2.5 flex items-center justify-center text-sm font-bold rounded-lg transition-all ${sortOrder === 'asc' ? 'bg-white text-brand-text shadow-sm' : 'text-gray-500 hover:text-brand-text'}`}
                                    >
                                        <TrendingDown size={16} className="mr-2"/> Lowest Price
                                    </button>
                                    <button 
                                        onClick={() => setSortOrder('desc')} 
                                        className={`flex-1 py-2.5 flex items-center justify-center text-sm font-bold rounded-lg transition-all ${sortOrder === 'desc' ? 'bg-white text-brand-text shadow-sm' : 'text-gray-500 hover:text-brand-text'}`}
                                    >
                                        <TrendingUp size={16} className="mr-2"/> Highest Price
                                    </button>
                                </div>
                            </div>

                            {/* Ticket Features Toggles */}
                            <div className="space-y-4 pt-4 border-t border-gray-200">
                                <h3 className="font-bold text-brand-text text-[15px] mb-2">Ticket Features</h3>
                                <label className={`flex items-center justify-between cursor-pointer p-4 bg-white rounded-xl border transition-colors shadow-sm ${instantDownloadOnly ? 'border-[#458731]' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <span className="font-bold text-brand-text text-sm flex items-center"><Zap size={18} className="text-[#114C2A] mr-3 fill-[#114C2A]"/> Instant Download</span>
                                    <input 
                                        type="checkbox" 
                                        checked={instantDownloadOnly}
                                        onChange={(e) => setInstantDownloadOnly(e.target.checked)}
                                        className="w-5 h-5 rounded border-gray-300 text-[#114C2A] focus:ring-[#114C2A] accent-[#114C2A] cursor-pointer" 
                                    />
                                </label>
                                <label className={`flex items-center justify-between cursor-pointer p-4 bg-white rounded-xl border transition-colors shadow-sm ${clearViewOnly ? 'border-[#458731]' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <span className="font-bold text-brand-text text-sm flex items-center"><Eye size={18} className="text-gray-600 mr-3"/> Clear View Only</span>
                                    <input 
                                        type="checkbox" 
                                        checked={clearViewOnly}
                                        onChange={(e) => setClearViewOnly(e.target.checked)}
                                        className="w-5 h-5 rounded border-gray-300 text-[#114C2A] focus:ring-[#114C2A] accent-[#114C2A] cursor-pointer" 
                                    />
                                </label>
                            </div>

                            {/* Dynamic Localized Price Range */}
                            <div className="pt-4 border-t border-gray-200">
                                <h3 className="font-bold text-brand-text mb-4 text-[15px]">Price Range</h3>
                                <div className="flex items-center space-x-4">
                                    <div className="relative w-full">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">{currencySymbol}</span>
                                        <input 
                                            type="number" 
                                            placeholder="Min" 
                                            className="w-full pl-8 p-3.5 border border-gray-300 rounded-xl outline-none focus:border-[#114C2A] focus:ring-1 focus:ring-[#114C2A] font-bold text-brand-text bg-white shadow-sm" 
                                        />
                                    </div>
                                    <span className="text-gray-400 font-bold">-</span>
                                    <div className="relative w-full">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">{currencySymbol}</span>
                                        <input 
                                            type="number" 
                                            placeholder="Max" 
                                            className="w-full pl-8 p-3.5 border border-gray-300 rounded-xl outline-none focus:border-[#114C2A] focus:ring-1 focus:ring-[#114C2A] font-bold text-brand-text bg-white shadow-sm" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 border-t border-gray-200 bg-white">
                            <button onClick={onClose} className="w-full bg-[#114C2A] text-white font-bold py-4 rounded-xl hover:bg-[#0c361d] transition-colors shadow-[0_4px_15px_rgba(17,76,42,0.3)]">
                                Show {filteredCount} Tickets
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}