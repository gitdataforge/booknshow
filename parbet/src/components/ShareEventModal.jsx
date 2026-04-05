import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Mail } from 'lucide-react';

export default function ShareEventModal({ isOpen, onClose, eventData }) {
    const [isCopied, setIsCopied] = useState(false);
    const [shareUrl, setShareUrl] = useState('');

    useEffect(() => {
        if (eventData) {
            setShareUrl(`${window.location.origin}/event?id=${eventData.id}`);
        }
    }, [eventData, isOpen]);

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
        const text = encodeURIComponent(`Get tickets for ${eventData?.t1} vs ${eventData?.t2} on parbet!`);
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
                shareEndpoint = `mailto:?subject=${encodeURIComponent(`Tickets: ${eventData?.t1} vs ${eventData?.t2}`)}&body=${text} ${url}`;
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
                <div className="fixed inset-0 bg-black/60 z-[300] flex items-center justify-center backdrop-blur-sm p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-[20px] p-6 w-full max-w-[400px] shadow-2xl relative"
                    >
                        <button 
                            onClick={onClose} 
                            className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                        
                        <h2 className="text-[22px] font-black text-brand-text mb-2 pr-8 leading-tight">
                            Share this event
                        </h2>
                        <p className="text-[14px] text-brand-muted font-medium mb-6">
                            {eventData.t1} vs {eventData.t2}
                        </p>
                        
                        <div className="grid grid-cols-4 gap-4 mb-6">
                            <button onClick={() => handleSocialShare('whatsapp')} className="flex flex-col items-center justify-center group">
                                <div className="w-12 h-12 rounded-full bg-[#EAF4D9] text-[#114C2A] flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
                                    <WhatsAppIcon />
                                </div>
                                <span className="text-[11px] font-bold text-gray-600">WhatsApp</span>
                            </button>
                            <button onClick={() => handleSocialShare('twitter')} className="flex flex-col items-center justify-center group">
                                <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
                                    <XIcon />
                                </div>
                                <span className="text-[11px] font-bold text-gray-600">X / Twitter</span>
                            </button>
                            <button onClick={() => handleSocialShare('facebook')} className="flex flex-col items-center justify-center group">
                                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
                                    <FacebookIcon />
                                </div>
                                <span className="text-[11px] font-bold text-gray-600">Facebook</span>
                            </button>
                            <button onClick={() => handleSocialShare('email')} className="flex flex-col items-center justify-center group">
                                <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
                                    <Mail size={20} />
                                </div>
                                <span className="text-[11px] font-bold text-gray-600">Email</span>
                            </button>
                        </div>

                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-[12px] p-1.5 shadow-inner">
                            <div className="flex-1 px-3 truncate text-[14px] text-gray-500 font-medium select-all">
                                {shareUrl}
                            </div>
                            <button 
                                onClick={handleCopy}
                                className={`flex items-center justify-center px-4 py-2.5 rounded-[8px] font-bold text-[13px] transition-all min-w-[90px] ${
                                    isCopied 
                                        ? 'bg-[#114C2A] text-white shadow-sm' 
                                        : 'bg-white text-brand-text border border-gray-200 hover:bg-gray-100'
                                }`}
                            >
                                {isCopied ? (
                                    <><Check size={14} className="mr-1.5"/> Copied</>
                                ) : (
                                    <><Copy size={14} className="mr-1.5"/> Copy</>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}