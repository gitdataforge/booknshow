import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Mail, Share2 } from 'lucide-react';

/**
 * GLOBAL REBRAND: Booknshow Identity Application (Phase 6 Share Modal)
 * Enforced Colors: #FFFFFF, #E7364D, #333333, #EB5B6E, #FAD8DC, #A3A3A3, #626262
 * FEATURE 1: Framer Motion Hardware-Accelerated Overlay
 * FEATURE 2: Native Clipboard API integration with fallback wrapper
 * FEATURE 3: Expanding 9-Section Layout
 * FEATURE 4: Strict Event Title Resolution
 */

export default function ShareEventModal({ isOpen, onClose, eventData }) {
    const [isCopied, setIsCopied] = useState(false);
    const [shareUrl, setShareUrl] = useState('');

    useEffect(() => {
        if (eventData) {
            setShareUrl(`${window.location.origin}/event?id=${eventData.id}`);
        }
    }, [eventData, isOpen]);

    // Strict dynamic title resolver to ensure we always have a real event name
    const getStrictEventName = () => {
        if (!eventData) return 'this upcoming event';
        if (eventData.title) return eventData.title;
        if (eventData.eventName) return eventData.eventName;
        if (eventData.t1 && eventData.t2) return `${eventData.t1} vs ${eventData.t2}`;
        return 'this upcoming event';
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            const textArea = document.createElement("textarea");
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand("copy");
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            } catch (fallbackErr) {
                console.error('Fallback copy failed', fallbackErr);
            }
            document.body.removeChild(textArea);
        }
    };

    const handleSocialShare = (platform) => {
        const strictTitle = getStrictEventName();
        const text = encodeURIComponent(`Get tickets for ${strictTitle} on Booknshow!`);
        const url = encodeURIComponent(shareUrl);
        
        let shareEndpoint = '';
        switch (platform) {
            case 'twitter':
                shareEndpoint = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                break;
            case 'whatsapp':
                shareEndpoint = `https://api.whatsapp.com/send?text=${text} ${url}`;
                break;
            case 'facebook':
                shareEndpoint = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'email':
                shareEndpoint = `mailto:?subject=${encodeURIComponent(`Tickets: ${strictTitle}`)}&body=${text} ${url}`;
                break;
            default:
                return;
        }
        window.open(shareEndpoint, '_blank', 'noopener,noreferrer');
    };

    // Optimized Inline SVGs for Social Icons (Resolves Lucide Export Issues)
    const WhatsAppIcon = () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.63 1.434h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    );

    const XIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    );

    const FacebookIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
    );

    if (!eventData) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                // SECTION 1: Fixed Backdrop
                <div className="fixed inset-0 bg-[#333333]/80 z-[300] flex items-center justify-center backdrop-blur-sm p-4 font-sans">
                    
                    {/* SECTION 2: Modal Container */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-[#FFFFFF] rounded-[24px] p-6 md:p-8 w-full max-w-[420px] shadow-[0_20px_60px_rgba(51,51,51,0.2)] relative overflow-hidden border border-[#A3A3A3]/20"
                    >
                        {/* SECTION 3: Ambient Illustration */}
                        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#FAD8DC]/30 rounded-full blur-[60px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                        <button 
                            onClick={onClose} 
                            className="absolute top-6 right-6 text-[#A3A3A3] hover:text-[#E7364D] transition-colors z-10 bg-[#F5F5F5] rounded-full p-1 border border-[#A3A3A3]/20"
                        >
                            <X size={20} />
                        </button>
                        
                        {/* SECTION 4: Header */}
                        <h2 className="text-[24px] font-black text-[#333333] mb-2 pr-8 leading-tight relative z-10 flex items-center gap-2">
                            <Share2 size={24} className="text-[#E7364D]" /> Share Event
                        </h2>
                        
                        {/* SECTION 5: Sub-header (STRICTLY CATCHES REAL EVENT TITLE) */}
                        <p className="text-[14px] text-[#626262] font-medium mb-8 relative z-10">
                            {getStrictEventName()}
                        </p>
                        
                        {/* SECTION 6: Social Grid Array */}
                        <div className="grid grid-cols-4 gap-4 mb-8 relative z-10">
                            <button onClick={() => handleSocialShare('whatsapp')} className="flex flex-col items-center justify-center group">
                                <div className="w-14 h-14 rounded-full bg-[#F5F5F5] border border-[#A3A3A3]/30 text-[#1DB954] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#1DB954]/10 transition-all mb-2 shadow-sm">
                                    <WhatsAppIcon />
                                </div>
                                <span className="text-[11px] font-bold text-[#626262] group-hover:text-[#333333]">WhatsApp</span>
                            </button>
                            <button onClick={() => handleSocialShare('twitter')} className="flex flex-col items-center justify-center group">
                                <div className="w-14 h-14 rounded-full bg-[#F5F5F5] border border-[#A3A3A3]/30 text-[#333333] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#333333]/10 transition-all mb-2 shadow-sm">
                                    <XIcon />
                                </div>
                                <span className="text-[11px] font-bold text-[#626262] group-hover:text-[#333333]">X / Twitter</span>
                            </button>
                            <button onClick={() => handleSocialShare('facebook')} className="flex flex-col items-center justify-center group">
                                <div className="w-14 h-14 rounded-full bg-[#F5F5F5] border border-[#A3A3A3]/30 text-[#1877F2] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#1877F2]/10 transition-all mb-2 shadow-sm">
                                    <FacebookIcon />
                                </div>
                                <span className="text-[11px] font-bold text-[#626262] group-hover:text-[#333333]">Facebook</span>
                            </button>
                            <button onClick={() => handleSocialShare('email')} className="flex flex-col items-center justify-center group">
                                <div className="w-14 h-14 rounded-full bg-[#F5F5F5] border border-[#A3A3A3]/30 text-[#E7364D] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#FAD8DC]/40 transition-all mb-2 shadow-sm">
                                    <Mail size={22} />
                                </div>
                                <span className="text-[11px] font-bold text-[#626262] group-hover:text-[#333333]">Email</span>
                            </button>
                        </div>

                        {/* SECTION 7, 8, 9: Clipboard Input, Trigger, Wrapper */}
                        <div className="flex items-center bg-[#F5F5F5] border border-[#A3A3A3]/30 rounded-[12px] p-1.5 shadow-inner relative z-10">
                            <div className="flex-1 px-3 truncate text-[14px] text-[#A3A3A3] font-medium select-all">
                                {shareUrl}
                            </div>
                            <button 
                                onClick={handleCopy}
                                className={`flex items-center justify-center px-5 py-3 rounded-[8px] font-bold text-[13px] transition-all min-w-[100px] ${
                                    isCopied 
                                        ? 'bg-[#333333] text-[#FFFFFF] shadow-sm' 
                                        : 'bg-[#FFFFFF] text-[#333333] border border-[#A3A3A3]/30 hover:border-[#E7364D] hover:text-[#E7364D]'
                                }`}
                            >
                                {isCopied ? (
                                    <><Check size={14} className="mr-1.5 text-[#E7364D]"/> Copied</>
                                ) : (
                                    <><Copy size={14} className="mr-1.5"/> Copy Link</>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}