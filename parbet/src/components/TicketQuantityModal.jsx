import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users } from 'lucide-react';
import { useAppStore } from '../store/useStore';

export default function TicketQuantityModal({ sitTogether, setSitTogether }) {
    const { 
        isTicketQuantityModalOpen, 
        setTicketQuantityModalOpen, 
        selectedTicketQuantity, 
        setSelectedTicketQuantity 
    } = useAppStore();

    return (
        <AnimatePresence>
            {isTicketQuantityModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center backdrop-blur-sm p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-[24px] p-6 md:p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
                    >
                        <button onClick={() => setTicketQuantityModalOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={24} />
                        </button>
                        
                        <h2 className="text-2xl font-black text-brand-text mb-6 text-center mt-2">How many tickets?</h2>
                        
                        {/* Dynamic Quantity Selector */}
                        <div className="flex justify-center flex-wrap gap-3 mb-8">
                            {[1, 2, 3, 4, 5, '6+'].map(qty => {
                                const value = qty === '6+' ? 6 : qty;
                                const isSelected = selectedTicketQuantity === value;
                                return (
                                    <button
                                        key={qty}
                                        onClick={() => setSelectedTicketQuantity(value)}
                                        className={`w-14 h-14 rounded-full font-black text-lg transition-all border-2 ${
                                            isSelected 
                                                ? 'bg-[#114C2A] border-[#114C2A] text-white shadow-md transform scale-110' 
                                                : 'bg-white border-gray-200 text-brand-text hover:border-[#114C2A] hover:text-[#114C2A]'
                                        }`}
                                    >
                                        {qty}
                                    </button>
                                );
                            })}
                        </div>
                        
                        {/* Contiguous Seating Toggle */}
                        <div className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-xl mb-8 border border-gray-200">
                            <div className="flex items-center">
                                <Users size={20} className="text-[#114C2A] mr-3" />
                                <div>
                                    <h4 className="font-bold text-brand-text text-[15px] mb-0.5">We want to sit together</h4>
                                    <p className="text-[13px] text-brand-muted font-medium">Ensures your seats are adjacent</p>
                                </div>
                            </div>
                            
                            {/* Fully Functional Toggle Switch */}
                            <div 
                                onClick={() => setSitTogether(!sitTogether)}
                                className={`w-12 h-6 rounded-full relative cursor-pointer shadow-inner transition-colors duration-300 ${sitTogether ? 'bg-[#114C2A]' : 'bg-gray-300'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${sitTogether ? 'right-1' : 'left-1'}`}></div>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => setTicketQuantityModalOpen(false)} 
                            className="w-full bg-[#114C2A] text-white font-bold py-4 rounded-xl hover:bg-[#0c361d] transition-colors text-[17px] shadow-[0_4px_15px_rgba(17,76,42,0.3)]"
                        >
                            Continue
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}