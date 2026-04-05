import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useStore';

export default function EmailConfirmationModal({ isOpen, onConfirm, onCancel }) {
    const { checkoutFormData } = useAppStore();
    const email = checkoutFormData.contact.email || 'your-email@example.com';

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/70 z-[400] flex items-center justify-center backdrop-blur-md p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="bg-white rounded-[24px] p-8 w-full max-w-[420px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden text-center"
                    >
                        {/* Status Graphic / Icon Placeholder if needed, but strictly matching image_f22d65.png */}
                        <div className="mb-6">
                            <h2 className="text-[24px] font-black text-brand-text leading-tight mb-4">
                                Is this your email address?
                            </h2>
                            
                            <div className="bg-[#F0F7FF] py-4 px-6 rounded-[16px] border border-[#D0E5FF] mb-4">
                                <p className="text-[18px] font-black text-[#1D2B36] break-all">
                                    {email}
                                </p>
                            </div>

                            <p className="text-[14px] text-gray-500 font-medium leading-relaxed px-2">
                                We will send your booking confirmation and your mobile tickets to this address. It's very important that it is correct.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={onConfirm}
                                className="w-full bg-[#114C2A] text-white font-black py-4 rounded-[14px] hover:bg-[#0c361d] transition-all text-[17px] shadow-lg shadow-[#114C2A]/20 transform active:scale-[0.98]"
                            >
                                Yes
                            </button>
                            <button 
                                onClick={onCancel}
                                className="w-full bg-white text-brand-text font-bold py-4 rounded-[14px] border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all text-[17px] transform active:scale-[0.98]"
                            >
                                No
                            </button>
                        </div>

                        {/* Visual progress indicator or branding accent */}
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#114C2A] to-[#458731]"></div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}