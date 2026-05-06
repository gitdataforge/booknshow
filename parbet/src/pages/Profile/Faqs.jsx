import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    ChevronDown, 
    HelpCircle, 
    ThumbsUp, 
    ThumbsDown, 
    MessageSquare, 
    X,
    ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * GLOBAL REBRAND: Booknshow Identity Application (Phase 10 FAQ Hub)
 * Enforced Colors: #FFFFFF, #E7364D, #333333, #EB5B6E, #FAD8DC, #A3A3A3, #626262
 * FEATURE 1: Production-Grade Marketplace Dictionary
 * FEATURE 2: Complex State Engine for Search & Accordions
 * FEATURE 3: Real-Time Multi-Condition Filtering Logic
 * FEATURE 4: Strict Accordion Toggle Logic
 * FEATURE 5: Interactive User Feedback State Logic
 * FEATURE 6: Framer Motion Staggered Physics
 * FEATURE 7: Ambient Illustrative Backgrounds
 * FEATURE 8: Booknshow Palette Integration (#E7364D, #FAD8DC)
 */

// Production-Grade Marketplace Dictionary
const faqDatabase = [
    { id: 'q1', category: 'Buying', question: 'How do I know my tickets are authentic?', answer: 'We back every order with our 100% Buyer Guarantee. We rigorously vet our sellers and require them to provide valid ticket information before listing. If there is ever an issue at the gate, we will provide comparable replacement tickets or a full refund.' },
    { id: 'q2', category: 'Delivery', question: 'When will I receive my tickets?', answer: 'Sellers have until the end of the day on your expected delivery date to transfer the tickets. Most tickets are transferred digitally within 24 hours of the event. If your tickets are mobile transfer, you will receive an email with instructions on how to securely accept them.' },
    { id: 'q3', category: 'Selling', question: 'When do I get paid for my sales?', answer: 'To ensure marketplace security, payments are processed 5-8 business days after the event officially takes place. This window ensures the buyer successfully attended the event with the tickets provided. You can track this in the "My Sales" tab.' },
    { id: 'q4', category: 'Payments', question: 'What payout methods are supported?', answer: 'We currently support direct Bank Transfer (NEFT/IMPS) and PayPal for global sellers. Please ensure your details in the "Settings > Payment and Payout Options" tab are accurate to prevent payment delays.' },
    { id: 'q5', category: 'Buying', question: 'Why is my order status showing as "Pending"?', answer: 'A "Pending" status means your payment has been secured, and the seller has been notified to transfer the tickets. The status will update to "Delivered" once the seller initiates the transfer to your email.' },
    { id: 'q6', category: 'Account', question: 'How do I change my account email or password?', answer: 'You can update your account security keys and display name directly in the "Settings" tab. Navigate to the "Security Center" to trigger a password reset or 2FA update.' }
];

const categories = ['All Topics', 'Buying', 'Selling', 'Delivery', 'Payments', 'Account'];

// Ambient Illustrative Background
const AmbientBackground = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
            className="absolute top-[10%] -left-[10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-[#FAD8DC] opacity-30 blur-[100px]"
            animate={{ x: [0, 40, 0], y: [0, 20, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
            className="absolute top-[40%] -right-[10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-[#EB5B6E] opacity-10 blur-[120px]"
            animate={{ x: [0, -30, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
    </div>
);

export default function Faqs() {
    const navigate = useNavigate();
    
    // Core States
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All Topics');
    const [expandedId, setExpandedId] = useState(null);
    const [feedbackState, setFeedbackState] = useState({});

    // Filtering Logic
    const filteredFaqs = useMemo(() => {
        return faqDatabase.filter(faq => {
            const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = activeCategory === 'All Topics' || faq.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, activeCategory]);

    const toggleAccordion = (id) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    const handleFeedback = (id, isHelpful, e) => {
        e.stopPropagation();
        setFeedbackState(prev => ({ ...prev, [id]: isHelpful }));
    };

    // Animation Configs
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 120 } }
    };

    return (
        <div className="w-full font-sans max-w-[1000px] mx-auto pb-20 pt-8 relative min-h-screen px-4 md:px-8">
            <AmbientBackground />
            
            <motion.div 
                initial="hidden"
                animate="show"
                variants={containerVariants}
                className="relative z-10 w-full"
            >
                {/* Header Typography */}
                <motion.h1 
                    variants={itemVariants}
                    className="text-[32px] md:text-[40px] font-black text-[#333333] mb-3 tracking-tighter leading-tight"
                >
                    Frequently Asked Questions
                </motion.h1>
                <motion.p variants={itemVariants} className="text-[#626262] text-[15px] font-medium mb-10 max-w-2xl">
                    Find answers to common questions about buying, selling, and managing your Booknshow account.
                </motion.p>

                {/* Live Search Input */}
                <motion.div variants={itemVariants} className="relative w-full max-w-2xl mb-10">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3A3A3]" size={20} />
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setExpandedId(null);
                        }}
                        placeholder="Search for an answer..."
                        className="w-full pl-12 pr-10 py-4 border-2 border-[#A3A3A3]/20 rounded-[12px] text-[16px] outline-none focus:border-[#E7364D] transition-all bg-[#FFFFFF] shadow-sm font-bold text-[#333333]"
                    />
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-[#E7364D] transition-colors"
                        >
                            <X size={20} />
                        </button>
                    )}
                </motion.div>

                {/* Category Tab Routing */}
                <motion.div variants={itemVariants} className="flex overflow-x-auto mb-8 no-scrollbar scroll-smooth pb-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => {
                                setActiveCategory(category);
                                setExpandedId(null);
                            }}
                            className={`py-2.5 px-5 mr-3 text-[14px] whitespace-nowrap transition-all rounded-full border shadow-sm ${
                                activeCategory === category 
                                ? 'bg-[#333333] text-[#FFFFFF] border-[#333333] font-black' 
                                : 'bg-[#FFFFFF] text-[#626262] border-[#A3A3A3]/30 hover:border-[#E7364D] hover:text-[#E7364D] font-bold'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </motion.div>

                {/* Accordion List & Empty State */}
                <div className="w-full bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[16px] shadow-[0_8px_30px_rgba(51,51,51,0.04)] overflow-hidden min-h-[300px]">
                    <AnimatePresence mode="wait">
                        {filteredFaqs.length > 0 ? (
                            <motion.div 
                                key="faq-list"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="divide-y divide-[#A3A3A3]/10"
                            >
                                {filteredFaqs.map((faq) => (
                                    <div key={faq.id} className="w-full group">
                                        <button 
                                            onClick={() => toggleAccordion(faq.id)}
                                            className={`w-full px-6 py-5 flex items-center justify-between text-left transition-colors ${expandedId === faq.id ? 'bg-[#FAFAFA]' : 'hover:bg-[#FAFAFA]'}`}
                                        >
                                            <span className={`text-[15px] pr-4 transition-colors ${expandedId === faq.id ? 'font-black text-[#E7364D]' : 'font-bold text-[#333333] group-hover:text-[#E7364D]'}`}>
                                                {faq.question}
                                            </span>
                                            <ChevronDown 
                                                size={20} 
                                                className={`text-[#A3A3A3] transition-transform duration-300 shrink-0 ${expandedId === faq.id ? 'rotate-180 text-[#E7364D]' : 'group-hover:text-[#E7364D]'}`} 
                                            />
                                        </button>
                                        
                                        <AnimatePresence>
                                            {expandedId === faq.id && (
                                                <motion.div 
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                    className="overflow-hidden bg-[#FAFAFA]"
                                                >
                                                    <div className="px-6 pb-6">
                                                        <div className="bg-[#FFFFFF] border-l-4 border-[#E7364D] p-5 rounded-r-[8px] shadow-sm mb-4">
                                                            <p className="text-[14px] text-[#626262] font-medium leading-relaxed">
                                                                {faq.answer}
                                                            </p>
                                                        </div>
                                                        
                                                        {/* Feedback Module */}
                                                        <div className="flex items-center gap-4 pt-2">
                                                            <span className="text-[12px] font-bold text-[#A3A3A3] uppercase tracking-widest">Was this helpful?</span>
                                                            <div className="flex gap-2">
                                                                <button 
                                                                    onClick={(e) => handleFeedback(faq.id, true, e)}
                                                                    className={`p-2 rounded-full transition-colors border shadow-sm ${feedbackState[faq.id] === true ? 'bg-[#FAD8DC]/50 text-[#E7364D] border-[#E7364D]/50' : 'bg-[#FFFFFF] border-[#A3A3A3]/20 text-[#A3A3A3] hover:text-[#333333] hover:border-[#333333]'}`}
                                                                >
                                                                    <ThumbsUp size={16} />
                                                                </button>
                                                                <button 
                                                                    onClick={(e) => handleFeedback(faq.id, false, e)}
                                                                    className={`p-2 rounded-full transition-colors border shadow-sm ${feedbackState[faq.id] === false ? 'bg-[#333333] text-[#FFFFFF] border-[#333333]' : 'bg-[#FFFFFF] border-[#A3A3A3]/20 text-[#A3A3A3] hover:text-[#333333] hover:border-[#333333]'}`}
                                                                >
                                                                    <ThumbsDown size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="empty-state"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-24 px-6 text-center bg-[#FAFAFA]"
                            >
                                <div className="w-16 h-16 bg-[#FFFFFF] border border-[#A3A3A3]/20 shadow-sm rounded-full flex items-center justify-center mb-5">
                                    <HelpCircle size={28} className="text-[#E7364D]" />
                                </div>
                                <h3 className="text-[18px] font-black text-[#333333] mb-2">No answers found</h3>
                                <p className="text-[14px] font-medium text-[#626262] mb-6 max-w-sm">
                                    We couldn't find any FAQs matching "{searchTerm}". Try adjusting your search or contact support.
                                </p>
                                <button 
                                    onClick={() => setSearchTerm('')}
                                    className="text-[#FFFFFF] bg-[#333333] font-bold text-[14px] px-6 py-2.5 rounded-[8px] hover:bg-[#E7364D] transition-colors shadow-sm"
                                >
                                    Clear Search
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Support Routing Escalation Block */}
                <motion.div 
                    variants={itemVariants}
                    className="mt-8 p-6 md:p-8 bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[16px] shadow-[0_8px_30px_rgba(51,51,51,0.06)] flex flex-col md:flex-row items-center justify-between gap-6"
                >
                    <div className="flex items-start gap-5">
                        <div className="bg-[#FAD8DC]/30 border border-[#E7364D]/20 p-4 rounded-full shrink-0">
                            <MessageSquare size={24} className="text-[#E7364D]" />
                        </div>
                        <div>
                            <h4 className="text-[18px] font-black text-[#333333] mb-1">Still need help?</h4>
                            <p className="text-[14px] font-medium text-[#626262]">Our customer service team is available 24/7 to resolve your issues.</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate('/profile/support')}
                        className="w-full md:w-auto px-8 py-3.5 bg-[#333333] hover:bg-[#E7364D] text-[#FFFFFF] text-[14px] font-bold rounded-[8px] transition-colors shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                        Contact Support <ArrowRight size={18} />
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
}