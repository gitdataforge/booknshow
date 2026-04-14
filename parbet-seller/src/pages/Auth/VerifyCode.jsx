import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowLeft, MailCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { auth } from '../../lib/firebase';

// FEATURE: Import Zustand store to hit Vercel API on resend
import { useSellerStore } from '../../store/useSellerStore';

export default function VerifyCode() {
    const navigate = useNavigate();
    const { sendVerificationEmail } = useSellerStore();
    
    // FEATURE 1: Secure Session State Retrieval
    const [pendingData, setPendingData] = useState(null);

    // FEATURE 2: Network & UX States
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(60);
    const [isResending, setIsResending] = useState(false);

    // FEATURE 3: Lifecycle Security Guard
    useEffect(() => {
        const storedData = localStorage.getItem('parbet_pending_seller');
        if (!storedData) {
            navigate('/auth/signup');
            return;
        }
        setPendingData(JSON.parse(storedData));
    }, [navigate]);

    // FEATURE 4: Anti-Spam Countdown Physics
    useEffect(() => {
        let interval;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    // FEATURE 5: Real-Time Firebase Verification Polling Engine (Strict 3-Second Loop)
    useEffect(() => {
        const pollInterval = setInterval(async () => {
            const user = auth.currentUser;
            
            if (user) {
                try {
                    // Force Firebase to fetch the absolute latest user token/state from the server
                    await user.reload();
                    
                    // If the user clicked the link in the Vercel email, this becomes true
                    if (user.emailVerified) {
                        clearInterval(pollInterval);
                        localStorage.removeItem('parbet_pending_seller');
                        
                        // Instantly vault the user into the Seller Dashboard
                        navigate('/profile');
                    }
                } catch (err) {
                    console.error("Verification Polling Error:", err);
                }
            }
        }, 3000);

        // Cleanup the interval if the user leaves the page
        return () => clearInterval(pollInterval);
    }, [navigate]);

    // FEATURE 6: Secure Resend Pipeline (Routed via Vercel)
    const handleResend = async () => {
        if (resendTimer > 0 || isResending) return;
        setIsResending(true);
        setError('');

        try {
            await sendVerificationEmail(pendingData.email, pendingData.firstName);
            setResendTimer(60); // Restart anti-spam timer
        } catch (err) {
            console.error("Resend Failed:", err);
            setError("Failed to resend the verification link. Please try again later.");
        } finally {
            setIsResending(false);
        }
    };

    // FEATURE 7: Framer Motion Animation Physics
    const shakeAnimation = {
        shake: {
            x: [0, -10, 10, -10, 10, -5, 5, 0],
            transition: { duration: 0.4 }
        }
    };

    const pulseAnimation = {
        pulse: {
            scale: [1, 1.05, 1],
            boxShadow: [
                "0px 0px 0px 0px rgba(140, 198, 63, 0.4)",
                "0px 0px 0px 15px rgba(140, 198, 63, 0)",
                "0px 0px 0px 0px rgba(140, 198, 63, 0)"
            ],
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }
    };

    if (!pendingData) return null; // Wait for redirect if no data

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans relative">
            <div className="w-full max-w-[400px] px-4 py-8">
                
                {/* Back Button */}
                <button 
                    onClick={() => {
                        localStorage.removeItem('parbet_pending_seller');
                        navigate('/auth/signup');
                    }}
                    className="flex items-center text-[#0064d2] text-[14px] font-bold hover:underline mb-8"
                >
                    <ArrowLeft size={16} className="mr-1" /> Back to Signup
                </button>

                {/* Logo */}
                <div className="flex justify-center mb-10">
                    <h1 className="text-[42px] font-black tracking-tighter leading-none cursor-pointer" onClick={() => navigate('/')}>
                        <span className="text-[#54626c]">par</span><span className="text-[#8cc63f]">bet</span>
                    </h1>
                </div>

                <div className="text-center mb-8 flex flex-col items-center">
                    
                    {/* Animated Pulsing Icon */}
                    <motion.div 
                        variants={pulseAnimation}
                        animate="pulse"
                        className="w-20 h-20 bg-[#eaf4d9] rounded-full flex items-center justify-center mb-6 shadow-sm"
                    >
                        <MailCheck size={40} className="text-[#458731]" />
                    </motion.div>
                    
                    <h2 className="text-[26px] font-bold text-[#1a1a1a] mb-3 tracking-tight">Check your inbox</h2>
                    
                    <p className="text-[15px] text-[#54626c] leading-relaxed mb-6">
                        We've sent a secure verification link to<br/>
                        <strong className="text-[#1a1a1a]">{pendingData.email}</strong>
                    </p>

                    {/* Active Polling Status UI */}
                    <div className="bg-[#f8f9fa] border border-[#e2e2e2] rounded-[8px] p-5 w-full flex flex-col items-center justify-center gap-3">
                        <RefreshCw size={24} className="text-[#0064d2] animate-spin" />
                        <p className="text-[14px] font-bold text-[#1a1a1a]">Waiting for verification...</p>
                        <p className="text-[12px] text-[#54626c] px-4 leading-relaxed">
                            Please click the secure link in your email. This page will automatically update once verified.
                        </p>
                    </div>
                </div>

                {/* Error Banner */}
                <AnimatePresence>
                    {error && (
                        <motion.div 
                            variants={shakeAnimation}
                            animate="shake"
                            className="mb-6 p-3 bg-red-50 text-red-600 text-[13px] font-bold rounded border border-red-100 flex items-center justify-center gap-2"
                        >
                            <AlertCircle size={16} /> {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="text-center mt-8 border-t border-[#e2e2e2] pt-6">
                    <p className="text-[14px] text-[#54626c] font-medium">
                        Didn't receive the email?{' '}
                        {resendTimer > 0 ? (
                            <span className="text-[#1a1a1a]">Resend in {resendTimer}s</span>
                        ) : (
                            <button 
                                onClick={handleResend}
                                disabled={isResending}
                                className="text-[#0064d2] font-bold hover:underline"
                            >
                                {isResending ? 'Sending...' : 'Resend Link'}
                            </button>
                        )}
                    </p>
                </div>

            </div>
        </div>
    );
}