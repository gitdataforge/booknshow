import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MessageSquare, 
    X, 
    Star, 
    Send, 
    CheckCircle2, 
    Loader2, 
    AlertCircle 
} from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function FeedbackTab() {
    // FEATURE 1: Complex UI State Machine
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [category, setCategory] = useState('');
    const [comment, setComment] = useState('');
    
    // FEATURE 2: Network & Submission States
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState(null);

    const modalRef = useRef(null);

    // FEATURE 3: Environmental Context Capture
    const currentUrl = window.location.pathname;

    // FEATURE 4: Click-Outside & Escape Key Listeners
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) closePanel();
        };
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) closePanel();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const closePanel = () => {
        setIsOpen(false);
        // FEATURE 5: State Reset Delay (Prevents visual pop during exit animation)
        setTimeout(() => {
            setRating(0);
            setCategory('');
            setComment('');
            setIsSuccess(false);
            setError(null);
        }, 300);
    };

    // FEATURE 6: Secure Firestore Submission Pipeline
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0 || !category || comment.trim().length === 0) {
            setError("Please complete all fields before submitting.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const appId = typeof __app_id !== 'undefined' ? __app_id : 'parbet-seller-app';
        const user = auth.currentUser;

        try {
            // STRICT PATH: Writing to public artifacts as per Rule 1
            const feedbackRef = collection(db, 'artifacts', appId, 'public', 'data', 'feedback');
            await addDoc(feedbackRef, {
                userId: user ? user.uid : 'anonymous_seller',
                email: user ? user.email : 'unauthenticated',
                rating,
                category,
                comment: comment.trim(),
                sourceUrl: currentUrl,
                userAgent: navigator.userAgent,
                timestamp: serverTimestamp(),
                domain: 'seller_network'
            });

            setIsSubmitting(false);
            setIsSuccess(true);
            
            // FEATURE 7: Auto-Dismissal Lifecycle
            setTimeout(() => {
                closePanel();
            }, 3000);
        } catch (err) {
            console.error("Feedback transmission failed:", err);
            setError("Failed to send feedback. Please check your connection.");
            setIsSubmitting(false);
        }
    };

    // FEATURE 8: Framer Motion Overlay & Slide Physics
    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    const panelVariants = {
        hidden: { x: '100%', opacity: 0.5 },
        visible: { 
            x: 0, 
            opacity: 1, 
            transition: { type: 'spring', damping: 25, stiffness: 200 } 
        },
        exit: { 
            x: '100%', 
            opacity: 0,
            transition: { type: 'tween', duration: 0.2 } 
        }
    };

    return (
        <>
            {/* FEATURE 9: Persistent Vertical Floating Trigger */}
            <motion.button
                initial={{ x: 50 }}
                animate={{ x: 0 }}
                whileHover={{ scale: 1.05, backgroundColor: '#366a26' }}
                onClick={() => setIsOpen(true)}
                className="fixed right-0 top-1/2 -translate-y-1/2 z-[9990] bg-[#1a1a1a] text-white py-4 px-2 rounded-l-md shadow-2xl flex flex-col items-center justify-center gap-2 group transition-colors"
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            >
                <MessageSquare size={16} className="rotate-90 group-hover:animate-pulse" />
                <span className="text-[13px] font-bold uppercase tracking-widest mt-2 rotate-180">Feedback</span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex justify-end"
                    >
                        <motion.div 
                            ref={modalRef}
                            variants={panelVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
                        >
                            {/* Header */}
                            <div className="bg-[#1a1a1a] text-white p-6 flex items-center justify-between shrink-0">
                                <div>
                                    <h2 className="text-[20px] font-black tracking-tight">Seller Feedback</h2>
                                    <p className="text-[13px] text-gray-300 mt-1">Help us improve your selling experience.</p>
                                </div>
                                <button 
                                    onClick={closePanel}
                                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f8f9fa]">
                                <AnimatePresence mode="wait">
                                    {isSuccess ? (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="h-full flex flex-col items-center justify-center text-center pb-20"
                                        >
                                            <div className="w-20 h-20 bg-[#eaf4d9] rounded-full flex items-center justify-center mb-6">
                                                <CheckCircle2 size={40} className="text-[#458731]" />
                                            </div>
                                            <h3 className="text-[24px] font-black text-[#1a1a1a] mb-2">Thank You!</h3>
                                            <p className="text-[15px] text-[#54626c]">
                                                Your feedback has been securely transmitted to our engineering team.
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <motion.form 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onSubmit={handleSubmit}
                                            className="space-y-8"
                                        >
                                            {/* FEATURE 10: Interactive Star Rating Engine */}
                                            <div>
                                                <label className="block text-[13px] font-bold text-[#54626c] uppercase mb-4">Overall Experience</label>
                                                <div className="flex items-center gap-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onMouseEnter={() => setHoveredRating(star)}
                                                            onMouseLeave={() => setHoveredRating(0)}
                                                            onClick={() => setRating(star)}
                                                            className="p-1 focus:outline-none transition-transform hover:scale-110"
                                                        >
                                                            <Star 
                                                                size={36} 
                                                                className={`transition-colors duration-200 ${
                                                                    (hoveredRating || rating) >= star 
                                                                    ? 'fill-yellow-400 text-yellow-400' 
                                                                    : 'fill-gray-200 text-gray-200'
                                                                }`} 
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* FEATURE 11: Dynamic Category Selector */}
                                            <div>
                                                <label className="block text-[13px] font-bold text-[#54626c] uppercase mb-4">Feedback Category</label>
                                                <div className="flex flex-wrap gap-3">
                                                    {['Bug Report', 'Feature Request', 'Listing Issue', 'Payment/Wallet', 'Other'].map(cat => (
                                                        <button
                                                            key={cat}
                                                            type="button"
                                                            onClick={() => setCategory(cat)}
                                                            className={`px-4 py-2.5 rounded-full text-[14px] font-medium transition-all border ${
                                                                category === cat 
                                                                ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' 
                                                                : 'bg-white text-[#54626c] border-[#cccccc] hover:border-[#1a1a1a]'
                                                            }`}
                                                        >
                                                            {cat}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* FEATURE 12: Real-time Character Monitored Textarea */}
                                            <div>
                                                <div className="flex justify-between items-end mb-2">
                                                    <label className="block text-[13px] font-bold text-[#54626c] uppercase">Detailed Comment</label>
                                                    <span className={`text-[12px] ${comment.length > 900 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                                                        {comment.length}/1000
                                                    </span>
                                                </div>
                                                <textarea 
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    maxLength={1000}
                                                    placeholder="Please provide specific details about your experience on this page..."
                                                    className="w-full h-40 bg-white border border-[#cccccc] rounded-[4px] px-4 py-3 text-[14px] text-[#1a1a1a] outline-none focus:border-[#458731] focus:ring-1 focus:ring-[#458731] transition-all resize-none shadow-sm"
                                                />
                                            </div>

                                            {error && (
                                                <div className="bg-red-50 text-red-600 p-3 rounded-[4px] text-[13px] font-medium flex items-center gap-2">
                                                    <AlertCircle size={16} /> {error}
                                                </div>
                                            )}

                                            {/* Submit Action */}
                                            <button 
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full bg-[#458731] hover:bg-[#366a26] disabled:bg-[#a5cba0] disabled:cursor-not-allowed text-white font-bold py-4 rounded-[4px] text-[15px] transition-all flex items-center justify-center gap-2 shadow-sm"
                                            >
                                                {isSubmitting ? (
                                                    <><Loader2 size={18} className="animate-spin" /> Transmitting...</>
                                                ) : (
                                                    <><Send size={18} /> Submit Feedback</>
                                                )}
                                            </button>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}