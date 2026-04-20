import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    CheckCircle2, Ticket, MessageCircle, Download, 
    ChevronRight, ShieldCheck, Mail, ArrowRight, Copy, Check
} from 'lucide-react';

/**
 * FEATURE 1: Secure URL Parameter Extraction (Order/Payment ID)
 * FEATURE 2: Dynamic WhatsApp API Payload Generator
 * FEATURE 3: Hardware-Accelerated Success Animations
 * FEATURE 4: Clipboard Copy Utility for Reference ID
 * FEATURE 5: Next Steps Timeline
 * FEATURE 6: Responsive Mobile-First Completion UI
 * FEATURE 7: Strict Enterprise Palette Enforcement
 */

export default function OrderConfirmation() {
    const navigate = useNavigate();
    // Support both /order-confirmation/:id and /order-confirmation?id=... routing styles
    const { id: paramId } = useParams();
    const [searchParams] = useSearchParams();
    const orderId = paramId || searchParams.get('payment_id') || searchParams.get('id') || 'PENDING_VERIFICATION';

    const [copied, setCopied] = useState(false);

    // FEATURE 4: Clipboard Copy Utility
    const handleCopyId = () => {
        navigator.clipboard.writeText(orderId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // FEATURE 2: Dynamic WhatsApp API Payload Generator
    const handleWhatsAppSupport = () => {
        // REPLACE this with the client's actual WhatsApp Business Number (include country code, no + or spaces)
        const supportPhoneNumber = "919876543210"; 
        
        // Construct a highly readable, pre-filled support message
        const message = `Hello Parbet Support, 👋\n\nI just completed a booking and need some assistance with my tickets.\n\n*My Secure Reference ID:*\n\`${orderId}\`\n\nPlease let me know the delivery status of my order.\n\nThank you!`;
        
        // Encode the payload for the secure wa.me API router
        const whatsappUrl = `https://wa.me/${supportPhoneNumber}?text=${encodeURIComponent(message)}`;
        
        // Open WhatsApp in a new secure tab (works natively on both Desktop Web and Mobile Apps)
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    };

    // FEATURE 3: Framer Motion Staggered Animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1, 
            transition: { staggerChildren: 0.15, delayChildren: 0.2 } 
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } }
    };

    // Force scroll to top on load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-sans text-[#1a1a1a] flex flex-col relative overflow-hidden">
            
            {/* Background Aesthetic */}
            <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#eaf4d9] to-[#f8f9fa] z-0"></div>

            {/* Header */}
            <div className="w-full bg-white/80 backdrop-blur-md border-b border-[#e2e2e2] sticky top-0 z-40 px-4 py-4 md:px-8 shadow-sm">
                <div className="max-w-[1200px] mx-auto flex justify-between items-center">
                    <h1 onClick={() => navigate('/')} className="text-[24px] font-black tracking-tighter text-[#1a1a1a] cursor-pointer flex items-center">
                        <ShieldCheck size={28} className="mr-2 text-[#8cc63f]" /> par<span className="text-[#8cc63f]">bet</span>
                    </h1>
                </div>
            </div>

            <main className="flex-1 w-full max-w-[600px] mx-auto px-4 py-12 z-10 flex flex-col items-center">
                
                <motion.div 
                    variants={containerVariants} 
                    initial="hidden" 
                    animate="visible"
                    className="w-full flex flex-col items-center text-center"
                >
                    {/* Success Icon */}
                    <motion.div 
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="w-24 h-24 bg-[#8cc63f] rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(140,198,63,0.3)] mb-6 border-4 border-white"
                    >
                        <CheckCircle2 size={48} className="text-white" strokeWidth={3} />
                    </motion.div>

                    <motion.h2 variants={itemVariants} className="text-[32px] md:text-[36px] font-black tracking-tight leading-tight mb-3">
                        Payment Successful!
                    </motion.h2>
                    
                    <motion.p variants={itemVariants} className="text-[16px] text-[#54626c] font-medium max-w-[400px] mb-10 leading-relaxed">
                        Your transaction is secure and your tickets are officially reserved. We've sent a confirmation to your registered email.
                    </motion.p>

                    {/* Reference ID Card */}
                    <motion.div variants={itemVariants} className="w-full bg-white border border-[#e2e2e2] rounded-[16px] p-6 shadow-sm mb-8">
                        <p className="text-[12px] font-black text-[#9ca3af] uppercase tracking-widest mb-2">Secure Reference ID</p>
                        <div className="flex items-center justify-between bg-[#f8f9fa] border border-[#e2e2e2] rounded-[8px] p-4">
                            <code className="text-[15px] font-black text-[#1a1a1a] tracking-wider break-all text-left">
                                {orderId}
                            </code>
                            <button 
                                onClick={handleCopyId}
                                className="ml-4 p-2 bg-white border border-[#e2e2e2] rounded-[6px] hover:border-[#8cc63f] transition-colors shrink-0"
                                title="Copy ID"
                            >
                                {copied ? <Check size={18} className="text-[#8cc63f]" /> : <Copy size={18} className="text-[#54626c]" />}
                            </button>
                        </div>
                    </motion.div>

                    {/* Next Steps Timeline */}
                    <motion.div variants={itemVariants} className="w-full bg-white border border-[#e2e2e2] rounded-[16px] p-6 shadow-sm text-left mb-8">
                        <h3 className="text-[18px] font-black mb-6">What happens next?</h3>
                        
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:h-full before:w-[2px] before:bg-gradient-to-b before:from-[#8cc63f] before:via-[#e2e2e2] before:to-transparent">
                            <div className="relative flex items-start gap-4">
                                <div className="absolute left-0 w-6 h-6 bg-[#8cc63f] rounded-full border-4 border-white flex items-center justify-center shadow-sm z-10"><Check size={10} className="text-white"/></div>
                                <div className="pl-10">
                                    <h4 className="text-[15px] font-bold text-[#1a1a1a]">Order Confirmed</h4>
                                    <p className="text-[13px] text-[#54626c] font-medium mt-1">Your payment has been locked safely in Parbet Escrow.</p>
                                </div>
                            </div>
                            <div className="relative flex items-start gap-4">
                                <div className="absolute left-0 w-6 h-6 bg-[#e2e2e2] rounded-full border-4 border-white flex items-center justify-center z-10"></div>
                                <div className="pl-10">
                                    <h4 className="text-[15px] font-bold text-[#1a1a1a]">Seller Notified</h4>
                                    <p className="text-[13px] text-[#54626c] font-medium mt-1">The seller has been instructed to transfer the tickets to your email address.</p>
                                </div>
                            </div>
                            <div className="relative flex items-start gap-4">
                                <div className="absolute left-0 w-6 h-6 bg-[#e2e2e2] rounded-full border-4 border-white flex items-center justify-center z-10"></div>
                                <div className="pl-10">
                                    <h4 className="text-[15px] font-bold text-[#1a1a1a]">Ticket Delivery</h4>
                                    <p className="text-[13px] text-[#54626c] font-medium mt-1">You will receive an email from the venue (e.g., Ticketmaster) to accept the transfer.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div variants={itemVariants} className="w-full space-y-4">
                        <button 
                            onClick={() => navigate('/profile/orders')}
                            className="w-full bg-[#1a1a1a] text-white font-black py-4 rounded-[12px] text-[16px] shadow-md hover:bg-black transition-all flex items-center justify-center gap-2"
                        >
                            <Ticket size={20} /> Track My Tickets
                        </button>

                        {/* FEATURE 2: WhatsApp Support Button */}
                        <button 
                            onClick={handleWhatsAppSupport}
                            className="w-full bg-[#25D366]/10 text-[#128C7E] border border-[#25D366]/30 font-black py-4 rounded-[12px] text-[16px] hover:bg-[#25D366]/20 transition-all flex items-center justify-center gap-2"
                        >
                            <MessageCircle size={20} /> WhatsApp Customer Support
                        </button>
                    </motion.div>

                </motion.div>
            </main>
        </div>
    );
}