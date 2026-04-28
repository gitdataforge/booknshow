import React, { useState } from 'react';
import { QrCode, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * FEATURE 1: 1:1 Viagogo App Promo Replica (Colors, Spacing, Typography)
 * FEATURE 2: Hardware-Accelerated App Mockup Presentation
 * FEATURE 3: Interactive "Join the List" Email Subscription Engine
 * FEATURE 4: Responsive Breakpoints (Stacking on mobile, flat on desktop)
 * FEATURE 5: Dynamic Loading and Success States for Email Input
 */

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
        <section className="w-full max-w-[1400px] mx-auto px-4 md:px-8 mt-16 md:mt-24 mb-16 font-sans">
            
            {/* TOP BANNER: App Download Section */}
            <div className="w-full bg-[#f2f8eb] rounded-[16px] overflow-hidden flex flex-col md:flex-row items-center justify-between relative px-8 py-10 md:py-0 md:h-[220px]">
                
                {/* Left Text */}
                <div className="z-10 md:w-1/3 mb-8 md:mb-0 md:pl-6 text-center md:text-left">
                    <h2 className="text-[28px] md:text-[32px] font-black text-[#1a1a1a] tracking-tight leading-tight mb-2">
                        Download the parbet app
                    </h2>
                    <p className="text-[16px] text-gray-600 font-medium">
                        Discover your favourite events with ease
                    </p>
                </div>

                {/* Center Phones Image Array */}
                <div className="relative md:absolute md:left-1/2 md:-translate-x-1/2 w-full max-w-[400px] h-[200px] md:h-full z-0 flex justify-center items-center">
                    {/* Simulated Phone Mockups intersecting dynamically */}
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="absolute w-[180px] h-[380px] bg-white rounded-[24px] shadow-2xl border-4 border-black overflow-hidden -rotate-12 translate-x-[-60px] md:translate-x-[-100px] z-10"
                    >
                        <div className="w-full h-1/2 bg-[#f8f9fa] border-b flex flex-col p-4">
                            <div className="w-full h-8 bg-gray-200 rounded-full mb-4"></div>
                            <div className="flex-1 bg-green-100 rounded-[12px] mb-2"></div>
                            <div className="w-2/3 h-4 bg-gray-200 rounded-full"></div>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="absolute w-[200px] h-[400px] bg-white rounded-[24px] shadow-2xl border-4 border-black overflow-hidden rotate-[15deg] translate-x-[40px] md:translate-x-[60px] z-20"
                    >
                        <div className="w-full h-full bg-[#1a1a1a] flex flex-col p-4">
                            <div className="w-full h-1/2 bg-gray-800 rounded-[12px] mb-4 overflow-hidden">
                                <div className="w-full h-full bg-gradient-to-tr from-pink-500 to-purple-500 opacity-50"></div>
                            </div>
                            <div className="w-3/4 h-5 bg-gray-700 rounded-full mb-3"></div>
                            <div className="w-1/2 h-4 bg-gray-700 rounded-full mb-auto"></div>
                            <div className="w-full h-12 bg-[#8cc63f] rounded-full"></div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Badges & QR Code */}
                <div className="z-10 flex flex-col sm:flex-row items-center gap-4 mt-8 md:mt-0 md:pr-6">
                    <div className="flex flex-col gap-3">
                        <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                            alt="Download on App Store" 
                            className="h-10 cursor-pointer hover:opacity-80 transition-opacity"
                        />
                        <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                            alt="Get it on Google Play" 
                            className="h-10 cursor-pointer hover:opacity-80 transition-opacity"
                        />
                    </div>
                    <div className="hidden lg:flex w-24 h-24 bg-white p-2 rounded-[8px] shadow-sm items-center justify-center border border-gray-100 relative">
                        <QrCode size={80} className="text-[#1a1a1a]" />
                        <div className="absolute inset-0 m-auto w-6 h-6 bg-white border border-gray-200 rounded-[4px] flex items-center justify-center">
                            <span className="text-[8px] font-black text-[#8cc63f]">PB</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTOM NEWSLETTER: Email Subscription Section */}
            <div className="w-full max-w-[700px] mx-auto mt-16 text-center">
                <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-6">
                    Get hot events and deals delivered straight to your inbox
                </h3>
                
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                    <div className="relative w-full sm:w-[350px]">
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address" 
                            disabled={isSubmitting || isSuccess}
                            className="w-full border-b border-gray-300 py-3 px-1 text-[16px] outline-none focus:border-[#458731] transition-colors bg-transparent disabled:opacity-50"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={!email || isSubmitting || isSuccess}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-[8px] border border-[#458731] text-[#458731] font-bold text-[15px] hover:bg-[#f2f8eb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
                    >
                        <AnimatePresence mode="wait">
                            {isSubmitting ? (
                                <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <Loader2 size={20} className="animate-spin" />
                                </motion.div>
                            ) : isSuccess ? (
                                <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <CheckCircle2 size={20} />
                                </motion.div>
                            ) : (
                                <motion.span key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    Join the List
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </form>

                <p className="text-[12px] text-gray-500 leading-relaxed px-4">
                    By signing in or creating an account, you agree to our <span className="text-[#0066cc] hover:underline cursor-pointer">user agreement</span> and acknowledge our <span className="text-[#0066cc] hover:underline cursor-pointer">privacy policy</span>. You may receive SMS notifications from us and can opt out at any time.
                </p>
            </div>
            
        </section>
    );
}