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

// FEATURE 1: Production-Grade Marketplace Dictionary
const faqDatabase = [
    { id: 'q1', category: 'Buying', question: 'How do I know my tickets are authentic?', answer: 'We back every order with our 100% Buyer Guarantee. We rigorously vet our sellers and require them to provide valid ticket information before listing. If there is ever an issue at the gate, we will provide comparable replacement tickets or a full refund.' },
    { id: 'q2', category: 'Delivery', question: 'When will I receive my tickets?', answer: 'Sellers have until the end of the day on your expected delivery date to transfer the tickets. Most tickets are transferred digitally within 24 hours of the event. If your tickets are mobile transfer, you will receive an email with instructions on how to securely accept them.' },
    { id: 'q3', category: 'Selling', question: 'When do I get paid for my sales?', answer: 'To ensure marketplace security, payments are processed 5-8 business days after the event officially takes place. This window ensures the buyer successfully attended the event with the tickets provided. You can track this in the "My Sales" tab.' },
    { id: 'q4', category: 'Payments', question: 'What payout methods are supported?', answer: 'We currently support direct Bank Transfer (NEFT/IMPS) and PayPal for global sellers. Please ensure your details in the "Settings > Payment and Payout Options" tab are accurate to prevent payment delays.' },
    { id: 'q5', category: 'Buying', question: 'Why is my order status showing as "Pending"?', answer: 'A "Pending" status means your payment has been secured, and the seller has been notified to transfer the tickets. The status will update to "Delivered" once the seller initiates the transfer to your email.' },
    { id: 'q6', category: 'Account', question: 'How do I change my account email or password?', answer: 'You can update your account security keys and display name directly in the "Settings" tab. Navigate to the "Security Center" to trigger a password reset or 2FA update.' }
];

const categories = ['All Topics', 'Buying', 'Selling', 'Delivery', 'Payments', 'Account'];

export default function Faqs() {
    const navigate = useNavigate();
    
    // FEATURE 2: Complex State Engine for Search & Accordions
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All Topics');
    const [expandedId, setExpandedId] = useState(null);
    const [feedbackState, setFeedbackState] = useState({}); // Tracks helpful/not-helpful clicks

    // FEATURE 3: Real-Time Multi-Condition Filtering Logic
    const filteredFaqs = useMemo(() => {
        return faqDatabase.filter(faq => {
            const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = activeCategory === 'All Topics' || faq.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, activeCategory]);

    // FEATURE 4: Strict Accordion Toggle Logic (Auto-close siblings)
    const toggleAccordion = (id) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    // FEATURE 5: Interactive User Feedback State Logic
    const handleFeedback = (id, isHelpful, e) => {
        e.stopPropagation(); // Prevent accordion toggle
        setFeedbackState(prev => ({ ...prev, [id]: isHelpful }));
    };

    // FEATURE 6: Framer Motion Staggered Physics
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 120 } }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="w-full font-sans max-w-[900px] pb-20"
        >
            {/* FEATURE 7: Strict Viagogo Header Typography */}
            <motion.h1 
                variants={itemVariants}
                className="text-[32px] font-black text-[#1a1a1a] mb-2 tracking-tighter leading-tight"
            >
                Frequently Asked Questions
            </motion.h1>
            <motion.p variants={itemVariants} className="text-[#54626c] text-[15px] mb-8">
                Find answers to common questions about buying, selling, and managing your account.
            </motion.p>

            {/* FEATURE 8: Live Search Input with Instant Clear */}
            <motion.div variants={itemVariants} className="relative w-full mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#54626c]" size={20} />
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setExpandedId(null); // Reset accordion on search
                    }}
                    placeholder="Search for an answer..."
                    className="w-full pl-12 pr-10 py-4 border border-[#cccccc] rounded-[8px] text-[16px] outline-none focus:border-[#458731] focus:ring-1 focus:ring-[#458731] transition-all bg-white shadow-sm font-medium"
                />
                {searchTerm && (
                    <button 
                        onClick={() => setSearchTerm('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X size={18} />
                    </button>
                )}
            </motion.div>

            {/* FEATURE 9: Category Tab Routing System */}
            <motion.div variants={itemVariants} className="flex overflow-x-auto border-b border-[#e2e2e2] mb-8 no-scrollbar scroll-smooth pb-1">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => {
                            setActiveCategory(category);
                            setExpandedId(null);
                        }}
                        className={`py-2 px-4 mr-2 text-[14px] whitespace-nowrap transition-all rounded-full border ${
                            activeCategory === category 
                            ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] font-bold' 
                            : 'bg-white text-[#54626c] border-[#cccccc] hover:border-[#1a1a1a] hover:text-[#1a1a1a] font-medium'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </motion.div>

            {/* FEATURE 10: Smooth Accordion List & Empty State Handling */}
            <div className="w-full bg-white border border-[#e2e2e2] rounded-[8px] shadow-sm overflow-hidden min-h-[300px]">
                <AnimatePresence mode="wait">
                    {filteredFaqs.length > 0 ? (
                        <motion.div 
                            key="faq-list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="divide-y divide-[#e2e2e2]"
                        >
                            {filteredFaqs.map((faq) => (
                                <div key={faq.id} className="w-full">
                                    <button 
                                        onClick={() => toggleAccordion(faq.id)}
                                        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <span className={`text-[15px] pr-4 ${expandedId === faq.id ? 'font-bold text-[#458731]' : 'font-medium text-[#1a1a1a]'}`}>
                                            {faq.question}
                                        </span>
                                        <ChevronDown 
                                            size={20} 
                                            className={`text-gray-400 transition-transform duration-300 shrink-0 ${expandedId === faq.id ? 'rotate-180 text-[#458731]' : ''}`} 
                                        />
                                    </button>
                                    
                                    <AnimatePresence>
                                        {expandedId === faq.id && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                className="overflow-hidden bg-[#f8f9fa]"
                                            >
                                                <div className="px-6 py-5 border-t border-[#e2e2e2]">
                                                    <p className="text-[14px] text-[#1a1a1a] leading-relaxed mb-6">
                                                        {faq.answer}
                                                    </p>
                                                    
                                                    {/* FEATURE 11: Inline Feedback Module */}
                                                    <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                                                        <span className="text-[13px] font-bold text-[#54626c] uppercase tracking-wider">Was this helpful?</span>
                                                        <button 
                                                            onClick={(e) => handleFeedback(faq.id, true, e)}
                                                            className={`p-2 rounded-full transition-colors ${feedbackState[faq.id] === true ? 'bg-[#eaf4d9] text-[#458731]' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-100'}`}
                                                        >
                                                            <ThumbsUp size={16} />
                                                        </button>
                                                        <button 
                                                            onClick={(e) => handleFeedback(faq.id, false, e)}
                                                            className={`p-2 rounded-full transition-colors ${feedbackState[faq.id] === false ? 'bg-red-50 text-red-600' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-100'}`}
                                                        >
                                                            <ThumbsDown size={16} />
                                                        </button>
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
                            className="flex flex-col items-center justify-center py-24 px-6 text-center"
                        >
                            <div className="w-16 h-16 bg-[#f8f9fa] rounded-full flex items-center justify-center mb-4">
                                <HelpCircle size={28} className="text-gray-400" />
                            </div>
                            <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-2">No answers found</h3>
                            <p className="text-[15px] text-[#54626c] mb-6 max-w-sm">
                                We couldn't find any FAQs matching "{searchTerm}". Try adjusting your search or contact support.
                            </p>
                            <button 
                                onClick={() => setSearchTerm('')}
                                className="text-[#0064d2] font-bold hover:underline"
                            >
                                Clear search
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* FEATURE 12: Support Routing Escalation Block */}
            <motion.div 
                variants={itemVariants}
                className="mt-8 p-6 bg-white border border-[#e2e2e2] rounded-[8px] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
            >
                <div className="flex items-start gap-4">
                    <div className="bg-[#ebf3fb] p-3 rounded-full shrink-0">
                        <MessageSquare size={24} className="text-[#0064d2]" />
                    </div>
                    <div>
                        <h4 className="text-[16px] font-bold text-[#1a1a1a] mb-1">Still need help?</h4>
                        <p className="text-[14px] text-[#54626c]">Our customer service team is available 24/7 to resolve your issues.</p>
                    </div>
                </div>
                <button 
                    onClick={() => navigate('/profile/support')}
                    className="w-full md:w-auto px-6 py-3 bg-[#1a1a1a] hover:bg-[#333333] text-white text-[14px] font-bold rounded-[4px] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                >
                    Contact Support <ArrowRight size={16} />
                </button>
            </motion.div>
        </motion.div>
    );
}