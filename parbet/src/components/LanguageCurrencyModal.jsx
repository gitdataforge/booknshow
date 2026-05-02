import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, DollarSign, AlertCircle, Info } from 'lucide-react';
import { useAppStore } from '../store/useStore';

/**
 * GLOBAL REBRAND: Booknshow Identity Application (Phase 6 Localization Modal)
 * Enforced Colors: #FFFFFF, #E7364D, #333333, #EB5B6E, #FAD8DC, #A3A3A3, #626262
 * FEATURE 1: Framer Motion Hardware-Accelerated Overlay
 * FEATURE 2: Local State Buffering (Confirm before apply)
 * FEATURE 3: Live Real-Time Currency Conversion Hook logic
 * FEATURE 4: Expanded 8-Section Layout
 */

export default function LanguageCurrencyModal({ isOpen, onClose }) {
    const { userLanguage, setUserLanguage, userCurrency, setUserCurrency } = useAppStore();

    // Local state buffers to hold selections before strictly confirming
    const [localLang, setLocalLang] = useState(userLanguage || 'EN');
    const [localCurr, setLocalCurr] = useState(userCurrency || 'USD');

    // Sync local state precisely when modal opens to reflect current global store
    useEffect(() => {
        if (isOpen) {
            setLocalLang(userLanguage || 'EN');
            setLocalCurr(userCurrency || 'USD');
        }
    }, [isOpen, userLanguage, userCurrency]);

    const handleConfirm = () => {
        setUserLanguage(localLang);
        setUserCurrency(localCurr);
        onClose();
    };

    const languages = [
        { code: 'EN', label: 'English (UK)' },
        { code: 'EN-US', label: 'English (US)' },
        { code: 'HI', label: 'Hindi (India)' },
        { code: 'ES', label: 'Spanish (Spain)' },
        { code: 'FR', label: 'French (France)' },
        { code: 'DE', label: 'German (Germany)' }
    ];

    const currencies = [
        { code: 'USD', label: 'United States Dollar (USD)' },
        { code: 'INR', label: 'Indian Rupee (INR)' },
        { code: 'GBP', label: 'British Pound (GBP)' },
        { code: 'EUR', label: 'Euro (EUR)' },
        { code: 'AUD', label: 'Australian Dollar (AUD)' },
        { code: 'CAD', label: 'Canadian Dollar (CAD)' }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                // SECTION 1: Fixed Backdrop
                <div className="fixed inset-0 bg-[#333333]/80 z-[300] flex items-center justify-center backdrop-blur-sm p-4">
                    
                    {/* SECTION 2: Modal Container */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-[#FFFFFF] rounded-[24px] p-6 md:p-8 w-full max-w-[480px] shadow-[0_20px_60px_rgba(51,51,51,0.2)] relative overflow-hidden border border-[#A3A3A3]/20"
                    >
                        {/* SECTION 3: Ambient Illustration */}
                        <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-[#FAD8DC]/30 rounded-full blur-[70px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
                        
                        <button 
                            onClick={onClose} 
                            className="absolute top-6 right-6 text-[#A3A3A3] hover:text-[#E7364D] transition-colors z-10 bg-[#F5F5F5] rounded-full p-1 border border-[#A3A3A3]/20"
                        >
                            <X size={20} />
                        </button>
                        
                        {/* SECTION 4: Header */}
                        <h2 className="text-[24px] font-black text-[#333333] mb-6 pr-8 relative z-10 flex items-center gap-2">
                            <Globe size={24} className="text-[#E7364D]" /> Settings
                        </h2>
                        
                        <div className="space-y-6 mb-8 relative z-10">
                            
                            {/* SECTION 5: Language Dropdown */}
                            <div className="flex flex-col bg-[#F5F5F5] p-4 rounded-[12px] border border-[#A3A3A3]/20">
                                <label className="text-[13px] font-black text-[#626262] uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                    <Globe size={14}/> Language
                                </label>
                                <div className="relative">
                                    <select 
                                        value={localLang}
                                        onChange={(e) => setLocalLang(e.target.value)}
                                        className="w-full appearance-none bg-[#FFFFFF] border border-[#A3A3A3]/50 text-[#333333] font-bold text-[15px] rounded-[8px] px-4 py-3.5 outline-none focus:border-[#E7364D] focus:ring-1 focus:ring-[#E7364D] transition-all cursor-pointer shadow-sm"
                                    >
                                        {languages.map(lang => (
                                            <option key={lang.code} value={lang.code}>{lang.label}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#A3A3A3]">
                                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 6: Currency Dropdown */}
                            <div className="flex flex-col bg-[#F5F5F5] p-4 rounded-[12px] border border-[#A3A3A3]/20">
                                <label className="text-[13px] font-black text-[#626262] uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                    <DollarSign size={14}/> Currency
                                </label>
                                <div className="relative">
                                    <select 
                                        value={localCurr}
                                        onChange={(e) => setLocalCurr(e.target.value)}
                                        className="w-full appearance-none bg-[#FFFFFF] border border-[#A3A3A3]/50 text-[#333333] font-bold text-[15px] rounded-[8px] px-4 py-3.5 outline-none focus:border-[#E7364D] focus:ring-1 focus:ring-[#E7364D] transition-all cursor-pointer shadow-sm"
                                    >
                                        {currencies.map(curr => (
                                            <option key={curr.code} value={curr.code}>{curr.label}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#A3A3A3]">
                                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 7: Info Warning */}
                        <div className="flex items-start gap-3 p-4 bg-[#FAD8DC]/20 border border-[#E7364D]/20 rounded-[12px] mb-8 relative z-10">
                            <Info size={18} className="text-[#E7364D] mt-0.5 shrink-0" />
                            <div>
                                <h4 className="text-[13px] font-bold text-[#333333] mb-1">Live Exchange Rates</h4>
                                <p className="text-[12px] text-[#626262] leading-relaxed">
                                    Changing your currency updates all ticket prices globally in real-time. Final checkout may be subject to your bank's exact exchange rates.
                                </p>
                            </div>
                        </div>
                        
                        {/* SECTION 8: Action Button */}
                        <button 
                            onClick={handleConfirm}
                            className="w-full bg-[#333333] text-[#FFFFFF] font-black py-4 rounded-[12px] hover:bg-[#E7364D] transition-colors text-[16px] shadow-[0_8px_20px_rgba(51,51,51,0.2)] relative z-10"
                        >
                            Save Preferences
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}