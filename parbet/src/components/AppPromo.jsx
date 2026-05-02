import React, { useState } from 'react';
import { QrCode, Mail, Loader2, CheckCircle2, ShieldCheck, Ticket, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * GLOBAL REBRAND: Booknshow Identity Application (Phase 4 App Promo)
 * Enforced Colors: #FFFFFF, #E7364D, #333333, #EB5B6E, #FAD8DC, #A3A3A3, #626262
 * FEATURE 1: 1:1 Booknshow App Promo Replica
 * FEATURE 2: Hardware-Accelerated App Mockup Presentation (Mobile Overflow FIX)
 * FEATURE 3: Interactive "Join the List" Email Subscription Engine
 * FEATURE 4: Responsive Breakpoints (Stacking on mobile, flat on desktop)
 * FEATURE 5: Dynamic Loading and Success States for Email Input
 * FEATURE 6: Illustrative Background Animations
 * FEATURE 7: Value Proposition Grid (3-Column Features)
 */

// SECTION 1: Illustrative Background Animation
const PromoBackgroundAnimation = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
            className="absolute top-[-50%] left-[-10%] w-[60%] h-[150%] rounded-full bg-[#FAD8DC] opacity-30 blur-[80px]"
            animate={{ x: [0, 30, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
            className="absolute bottom-[-50%] right-[-10%] w-[50%] h-[150%] rounded-full bg-[#EB5B6E] opacity-10 blur-[100px]"
            animate={{ x: [0, -30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
    </div>
);

export default function AppPromo() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email || !email.includes('@')) return;
        
        setIsSubmitting(true);
        // Simulate API call for newsletter subscription
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            setTimeout(() => {
                setEmail('');
                setIsSuccess(false);
            }, 3000);
        }, 1200);
    };

    return (
        <section className="w-full max-w-[1400px] mx-auto px-4 md:px-8 mt-16 md:mt-24 mb-16 font-sans relative z-10">
            
            {/* SECTION 2: TOP BANNER (App Download Section) */}
            <div className="w-full bg-[#FFFFFF] border border-[#A3A3A3]/20 shadow-[0_10px_40px_rgba(51,51,51,0.08)] rounded-[20px] overflow-hidden flex flex-col md:flex-row items-center justify-between relative px-6 py-10 md:px-10 md:py-0 md:h-[280px]">
                
                <PromoBackgroundAnimation />

                {/* SECTION 3: Left Text Copy */}
                <div className="z-10 w-full md:w-1/3 mb-6 md:mb-0 text-center md:text-left">
                    <h2 className="text-[28px] md:text-[36px] font-black text-[#333333] tracking-tight leading-tight mb-2">
                        Download the <span className="text-[#E7364D]">Booknshow</span> app
                    </h2>
                    <p className="text-[16px] text-[#626262] font-medium">
                        Discover your favourite events and manage tickets with ease.
                    </p>
                </div>

                {/* SECTION 4: Center Phones Image Array (CRITICAL MOBILE FIX) */}
                <div className="relative w-full md:w-1/3 h-[240px] md:h-full z-10 flex justify-center items-center overflow-visible md:overflow-hidden my-4 md:my-0">
                    
                    {/* Back Phone (Light) */}
                    <motion.div 
                        initial={{ y: 20, opacity: 0, rotate: -10 }}
                        whileInView={{ y: 0, opacity: 1, rotate: -12 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="absolute w-[140px] md:w-[160px] h-[300px] md:h-[340px] bg-[#FFFFFF] rounded-[24px] shadow-lg border-4 border-[#A3A3A3]/30 overflow-hidden translate-x-[-40px] md:translate-x-[-60px] mt-10 md:mt-16 z-10"
                    >
                        <div className="w-full h-1/2 bg-[#F5F5F5] border-b border-[#A3A3A3]/20 flex flex-col p-4">
                            <div className="w-full h-6 bg-[#A3A3A3]/20 rounded-full mb-4"></div>
                            <div className="flex-1 bg-[#FAD8DC]/40 rounded-[12px] mb-2 border border-[#E7364D]/10"></div>
                            <div className="w-2/3 h-3 bg-[#A3A3A3]/20 rounded-full"></div>
                        </div>
                    </motion.div>
                    
                    {/* Front Phone (Dark) */}
                    <motion.div 
                        initial={{ y: 30, opacity: 0, rotate: 10 }}
                        whileInView={{ y: 0, opacity: 1, rotate: 12 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="absolute w-[150px] md:w-[170px] h-[320px] md:h-[360px] bg-[#333333] rounded-[24px] shadow-2xl border-4 border-[#333333] overflow-hidden translate-x-[40px] md:translate-x-[60px] mt-10 md:mt-16 z-20"
                    >
                        <div className="w-full h-full bg-[#1a1a1a] flex flex-col p-4 relative">
                            {/* Inner Screen Gradient */}
                            <div className="w-full h-[45%] bg-[#333333] rounded-[12px] mb-4 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#E7364D] to-[#EB5B6E] opacity-80"></div>
                            </div>
                            <div className="w-3/4 h-4 bg-[#626262] rounded-full mb-3"></div>
                            <div className="w-1/2 h-3 bg-[#626262] rounded-full mb-auto"></div>
                            <div className="w-full h-10 bg-[#E7364D] rounded-full shadow-md"></div>
                        </div>
                    </motion.div>
                </div>

                {/* SECTION 5: Right Badges & QR Code */}
                <div className="z-10 w-full md:w-1/3 flex flex-col sm:flex-row items-center justify-center md:justify-end gap-5 mt-6 md:mt-0">
                    <div className="flex flex-row md:flex-col gap-3">
                        <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                            alt="Download on App Store" 
                            className="h-10 md:h-12 cursor-pointer hover:opacity-80 hover:scale-105 transition-all shadow-sm rounded-[8px]"
                        />
                        <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                            alt="Get it on Google Play" 
                            className="h-10 md:h-12 cursor-pointer hover:opacity-80 hover:scale-105 transition-all shadow-sm rounded-[8px]"
                        />
                    </div>
                    <div className="hidden lg:flex w-[100px] h-[100px] bg-[#FFFFFF] p-2 rounded-[12px] shadow-md items-center justify-center border border-[#A3A3A3]/20 relative">
                        <QrCode size={84} className="text-[#333333]" />
                        <div className="absolute inset-0 m-auto w-7 h-7 bg-[#FFFFFF] border border-[#A3A3A3]/30 rounded-[6px] flex items-center justify-center shadow-sm">
                            <span className="text-[9px] font-black text-[#E7364D] leading-none">BS</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 6: Value Proposition Grid */}
            <div className="w-full max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-16 px-4">
                <div className="flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-[#FAD8DC]/30 flex items-center justify-center mb-3 text-[#E7364D]">
                        <Zap size={24} />
                    </div>
                    <h4 className="text-[16px] font-black text-[#333333] mb-1">Instant Booking</h4>
                    <p className="text-[13px] text-[#626262] font-medium">Secure your seats in seconds with our lightning-fast mobile checkout.</p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-[#F5F5F5] border border-[#A3A3A3]/20 flex items-center justify-center mb-3 text-[#333333]">
                        <Ticket size={24} />
                    </div>
                    <h4 className="text-[16px] font-black text-[#333333] mb-1">Digital Tickets</h4>
                    <p className="text-[13px] text-[#626262] font-medium">Access your E-Tickets offline directly from your app wallet.</p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-[#FAD8DC]/30 flex items-center justify-center mb-3 text-[#E7364D]">
                        <ShieldCheck size={24} />
                    </div>
                    <h4 className="text-[16px] font-black text-[#333333] mb-1">100% Guaranteed</h4>
                    <p className="text-[13px] text-[#626262] font-medium">Every ticket is verified and backed by our comprehensive buyer guarantee.</p>
                </div>
            </div>

            {/* SECTION 7: BOTTOM NEWSLETTER (Email Subscription Section) */}
            <div className="w-full max-w-[700px] mx-auto text-center border-t border-[#A3A3A3]/20 pt-16">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F5F5F5] mb-4 text-[#333333]">
                    <Mail size={24} />
                </div>
                <h3 className="text-[20px] md:text-[24px] font-black text-[#333333] mb-2 tracking-tight">
                    Get hot events and deals delivered straight to your inbox
                </h3>
                <p className="text-[14px] text-[#626262] mb-8">
                    Join the Booknshow newsletter for exclusive pre-sales and discounts.
                </p>
                
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                    <div className="relative w-full sm:w-[350px]">
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address" 
                            disabled={isSubmitting || isSuccess}
                            className="w-full border-b-2 border-[#A3A3A3]/30 py-3 px-2 text-[16px] text-[#333333] placeholder-[#A3A3A3] outline-none focus:border-[#E7364D] transition-colors bg-transparent disabled:opacity-50"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={!email || isSubmitting || isSuccess}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-[12px] bg-[#E7364D] text-[#FFFFFF] font-black text-[15px] hover:bg-[#EB5B6E] shadow-[0_8px_20px_rgba(231,54,77,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
                    >
                        <AnimatePresence mode="wait">
                            {isSubmitting ? (
                                <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <Loader2 size={20} className="animate-spin" />
                                </motion.div>
                            ) : isSuccess ? (
                                <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center">
                                    <CheckCircle2 size={20} className="mr-2" /> Subscribed
                                </motion.div>
                            ) : (
                                <motion.span key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    Join the List
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </form>

                <p className="text-[12px] text-[#A3A3A3] leading-relaxed px-4">
                    By signing in or creating an account, you agree to our <span className="text-[#626262] font-bold hover:text-[#E7364D] hover:underline cursor-pointer transition-colors">user agreement</span> and acknowledge our <span className="text-[#626262] font-bold hover:text-[#E7364D] hover:underline cursor-pointer transition-colors">privacy policy</span>. You may receive email notifications from us and can opt out at any time.
                </p>
            </div>
            
        </section>
    );
}