import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    ChevronDown, 
    HelpCircle, 
    ThumbsUp, 
    ThumbsDown, 
    MessageSquare, 
    X,
    ArrowRight,
    Bot,
    Send,
    User,
    Sparkles,
    ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMainStore } from '../../store/useMainStore';

/**
 * GLOBAL REBRAND: Booknshow Identity Application (Phase 11 AI FAQ Hub)
 * Enforced Colors: #FFFFFF, #E7364D, #333333, #EB5B6E, #FAD8DC, #A3A3A3, #626262
 * FEATURE 1: Real-Time AI Smart Reply Engine (NLP Fuzzy Matching)
 * FEATURE 2: Production-Grade Marketplace Dictionary
 * FEATURE 3: Split-View AI Chat & Traditional Accordion UI
 * FEATURE 4: Framer Motion Staggered Chat Physics & Typing Indicators
 * FEATURE 5: Interactive User Feedback State Logic
 * FEATURE 6: Ambient Illustrative Backgrounds
 * FEATURE 7: Embedded Booknshow Vector Identity
 * FEATURE 8: Automated Support Escalation Routing
 */

// Booknshow High-Fidelity SVG Logo
const BooknshowLogo = ({ className = "h-8" }) => (
    <svg viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="10" y="70" fontFamily="Inter, sans-serif" fontSize="64" fontWeight="800" fill="#333333" letterSpacing="-2">book</text>
        <g transform="translate(170, 10) rotate(-12)">
            <path d="M0,0 L16,10 L32,0 L48,10 L64,0 L80,10 L80,95 L60,95 A20,20 0 0,0 20,95 L0,95 Z" fill="#E7364D" />
            <text x="21" y="72" fontFamily="Inter, sans-serif" fontSize="60" fontWeight="900" fill="#FFFFFF">n</text>
        </g>
        <text x="250" y="70" fontFamily="Inter, sans-serif" fontSize="64" fontWeight="800" fill="#333333" letterSpacing="-2">show</text>
    </svg>
);

// Production-Grade Marketplace Dictionary
const faqDatabase = [
    { id: 'q1', category: 'Buying', keywords: ['authentic', 'real', 'fake', 'guarantee', 'valid', 'scam'], question: 'How do I know my tickets are authentic?', answer: 'We back every order with our 100% Buyer Guarantee. We rigorously vet our sellers and require them to provide valid ticket information before listing. If there is ever an issue at the gate, we will provide comparable replacement tickets or a full refund.' },
    { id: 'q2', category: 'Delivery', keywords: ['when', 'receive', 'get', 'delivery', 'time', 'digital', 'transfer'], question: 'When will I receive my tickets?', answer: 'Sellers have until the end of the day on your expected delivery date to transfer the tickets. Most tickets are transferred digitally within 24 hours of the event. If your tickets are mobile transfer, you will receive an email with instructions on how to securely accept them.' },
    { id: 'q3', category: 'Selling', keywords: ['paid', 'money', 'payout', 'when do i get', 'selling'], question: 'When do I get paid for my sales?', answer: 'To ensure marketplace security, payments are processed 5-8 business days after the event officially takes place. This window ensures the buyer successfully attended the event with the tickets provided. You can track this in the "My Sales" tab.' },
    { id: 'q4', category: 'Payments', keywords: ['method', 'bank', 'paypal', 'support', 'payout options', 'neft'], question: 'What payout methods are supported?', answer: 'We currently support direct Bank Transfer (NEFT/IMPS) and PayPal for global sellers. Please ensure your details in the "Settings > Payment and Payout Options" tab are accurate to prevent payment delays.' },
    { id: 'q5', category: 'Buying', keywords: ['pending', 'status', 'order', 'why is my'], question: 'Why is my order status showing as "Pending"?', answer: 'A "Pending" status means your payment has been secured, and the seller has been notified to transfer the tickets. The status will update to "Delivered" once the seller initiates the transfer to your email.' },
    { id: 'q6', category: 'Account', keywords: ['change', 'email', 'password', 'reset', '2fa', 'security'], question: 'How do I change my account email or password?', answer: 'You can update your account security keys and display name directly in the "Settings" tab. Navigate to the "Security Center" to trigger a password reset or 2FA update.' }
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
    const { user } = useMainStore();
    
    // Core Knowledge Base States
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All Topics');
    const [expandedId, setExpandedId] = useState(null);
    const [feedbackState, setFeedbackState] = useState({});

    // AI Chat Engine States
    const [chatMessages, setChatMessages] = useState([
        { id: 1, role: 'ai', text: `Hi ${user?.displayName?.split(' ')[0] || 'there'}! I'm the Booknshow Smart Assistant. Ask me anything about tickets, payouts, or your account.`, timestamp: new Date() }
    ]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [isAiTyping, setIsAiTyping] = useState(false);
    const chatEndRef = useRef(null);

    // Auto-scroll Chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, isAiTyping]);

    // Filtering Logic for Static FAQ
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

    // Functional Smart Reply Logic Engine
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!currentMessage.trim()) return;

        const userText = currentMessage.trim();
        const newUserMsg = { id: Date.now(), role: 'user', text: userText, timestamp: new Date() };
        
        setChatMessages(prev => [...prev, newUserMsg]);
        setCurrentMessage('');
        setIsAiTyping(true);

        // Smart Matching Algorithm
        setTimeout(() => {
            const normalizedText = userText.toLowerCase();
            let bestMatch = null;
            let highestScore = 0;

            faqDatabase.forEach(faq => {
                let score = 0;
                faq.keywords.forEach(kw => {
                    if (normalizedText.includes(kw)) score += 1;
                });
                if (score > highestScore) {
                    highestScore = score;
                    bestMatch = faq;
                }
            });

            let aiResponseText = '';
            if (highestScore > 0 && bestMatch) {
                aiResponseText = `**${bestMatch.question}**\n\n${bestMatch.answer}`;
            } else {
                aiResponseText = "I couldn't find an exact match for your question in our database. I recommend opening a direct support ticket so our human team can assist you.";
            }

            setChatMessages(prev => [...prev, { 
                id: Date.now() + 1, 
                role: 'ai', 
                text: aiResponseText, 
                isEscalation: highestScore === 0,
                timestamp: new Date() 
            }]);
            setIsAiTyping(false);
        }, 1200); // Simulate network/thinking delay
    };

    // Animation Configs
    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 120 } } };

    return (
        <div className="w-full font-sans max-w-[1200px] mx-auto pb-20 pt-8 relative min-h-screen px-4 md:px-8">
            <AmbientBackground />
            
            <motion.div 
                initial="hidden"
                animate="show"
                variants={containerVariants}
                className="relative z-10 w-full"
            >
                {/* Header Typography */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <motion.h1 variants={itemVariants} className="text-[32px] md:text-[40px] font-black text-[#333333] mb-3 tracking-tighter leading-tight flex items-center">
                            <Sparkles className="mr-3 text-[#E7364D]" size={36} /> Smart Help Center
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-[#626262] text-[15px] font-medium max-w-2xl">
                            Chat with our AI assistant for instant answers, or browse the traditional knowledge base below.
                        </motion.p>
                    </div>
                    <motion.div variants={itemVariants} className="hidden md:block">
                        <BooknshowLogo className="h-8 opacity-80" />
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    
                    {/* LEFT COLUMN: AI SMART CHAT ENGINE */}
                    <motion.div variants={itemVariants} className="bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[16px] shadow-[0_8px_30px_rgba(51,51,51,0.06)] flex flex-col h-[600px] overflow-hidden sticky top-6">
                        <div className="bg-[#FAFAFA] border-b border-[#A3A3A3]/20 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#FAD8DC]/30 border border-[#E7364D]/20 rounded-full flex items-center justify-center">
                                    <Bot size={20} className="text-[#E7364D]" />
                                </div>
                                <div>
                                    <h2 className="text-[16px] font-black text-[#333333] leading-tight">Booknshow AI</h2>
                                    <p className="text-[12px] font-bold text-[#A3A3A3] flex items-center">
                                        <span className="w-2 h-2 rounded-full bg-[#E7364D] mr-1.5 animate-pulse"></span> Online
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#FFFFFF] flex flex-col gap-4">
                            <AnimatePresence>
                                {chatMessages.map((msg) => (
                                    <motion.div 
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
                                    >
                                        <div className="flex items-center gap-2 mb-1 px-1">
                                            <span className="text-[11px] font-bold text-[#A3A3A3]">
                                                {msg.role === 'user' ? 'You' : 'Smart Assistant'}
                                            </span>
                                            <span className="text-[10px] font-medium text-[#A3A3A3]/70">
                                                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                        <div className={`p-4 rounded-[12px] text-[14px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-[#333333] text-[#FFFFFF] rounded-tr-[4px]' : 'bg-[#FAFAFA] border border-[#A3A3A3]/20 text-[#333333] font-medium rounded-tl-[4px] whitespace-pre-wrap'}`}>
                                            {msg.text.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="font-black text-[#E7364D] block mb-2">{part}</strong> : part)}
                                        </div>
                                        
                                        {/* Auto-Escalation UI Component */}
                                        {msg.isEscalation && (
                                            <button 
                                                onClick={() => navigate('/profile/support')}
                                                className="mt-3 bg-[#E7364D] text-[#FFFFFF] px-4 py-2 rounded-[8px] text-[12px] font-bold flex items-center shadow-sm hover:bg-[#EB5B6E] transition-colors"
                                            >
                                                Open Support Ticket <ArrowRight size={14} className="ml-1.5" />
                                            </button>
                                        )}
                                    </motion.div>
                                ))}
                                {isAiTyping && (
                                    <motion.div 
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="self-start bg-[#FAFAFA] border border-[#A3A3A3]/20 p-4 rounded-[12px] rounded-tl-[4px] flex items-center gap-1.5"
                                    >
                                        <div className="w-2 h-2 bg-[#A3A3A3] rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-[#A3A3A3] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-[#A3A3A3] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div ref={chatEndRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className="p-4 bg-[#FAFAFA] border-t border-[#A3A3A3]/20">
                            <div className="relative flex items-center">
                                <input 
                                    type="text" 
                                    value={currentMessage}
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                    placeholder="Ask the AI a question..."
                                    className="w-full bg-[#FFFFFF] border border-[#A3A3A3]/30 rounded-full pl-5 pr-12 py-3.5 text-[14px] font-bold text-[#333333] outline-none focus:border-[#E7364D] transition-colors shadow-sm"
                                />
                                <button 
                                    type="submit"
                                    disabled={!currentMessage.trim() || isAiTyping}
                                    className="absolute right-2 w-10 h-10 bg-[#E7364D] text-[#FFFFFF] rounded-full flex items-center justify-center hover:bg-[#333333] transition-colors disabled:opacity-50 disabled:hover:bg-[#E7364D]"
                                >
                                    <Send size={16} className="ml-0.5" />
                                </button>
                            </div>
                        </form>
                    </motion.div>

                    {/* RIGHT COLUMN: TRADITIONAL KNOWLEDGE BASE */}
                    <div className="flex flex-col gap-6">
                        {/* Live Search Input */}
                        <motion.div variants={itemVariants} className="relative w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3A3A3]" size={20} />
                            <input 
                                type="text" 
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setExpandedId(null);
                                }}
                                placeholder="Manually search articles..."
                                className="w-full pl-12 pr-10 py-4 border border-[#A3A3A3]/20 rounded-[12px] text-[15px] outline-none focus:border-[#E7364D] transition-all bg-[#FFFFFF] shadow-sm font-bold text-[#333333]"
                            />
                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-[#E7364D] transition-colors">
                                    <X size={20} />
                                </button>
                            )}
                        </motion.div>

                        {/* Category Tab Routing */}
                        <motion.div variants={itemVariants} className="flex overflow-x-auto no-scrollbar scroll-smooth pb-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        setActiveCategory(category);
                                        setExpandedId(null);
                                    }}
                                    className={`py-2 px-4 mr-2 text-[13px] whitespace-nowrap transition-all rounded-full border shadow-sm ${
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
                        <motion.div variants={itemVariants} className="w-full bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[16px] shadow-[0_4px_20px_rgba(51,51,51,0.04)] overflow-hidden min-h-[300px]">
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
                                                    <span className={`text-[14px] pr-4 transition-colors ${expandedId === faq.id ? 'font-black text-[#E7364D]' : 'font-bold text-[#333333] group-hover:text-[#E7364D]'}`}>
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
                                                                    <span className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest">Was this helpful?</span>
                                                                    <div className="flex gap-2">
                                                                        <button 
                                                                            onClick={(e) => handleFeedback(faq.id, true, e)}
                                                                            className={`p-2 rounded-full transition-colors border shadow-sm ${feedbackState[faq.id] === true ? 'bg-[#FAD8DC]/50 text-[#E7364D] border-[#E7364D]/50' : 'bg-[#FFFFFF] border-[#A3A3A3]/20 text-[#A3A3A3] hover:text-[#333333] hover:border-[#333333]'}`}
                                                                        >
                                                                            <ThumbsUp size={14} />
                                                                        </button>
                                                                        <button 
                                                                            onClick={(e) => handleFeedback(faq.id, false, e)}
                                                                            className={`p-2 rounded-full transition-colors border shadow-sm ${feedbackState[faq.id] === false ? 'bg-[#333333] text-[#FFFFFF] border-[#333333]' : 'bg-[#FFFFFF] border-[#A3A3A3]/20 text-[#A3A3A3] hover:text-[#333333] hover:border-[#333333]'}`}
                                                                        >
                                                                            <ThumbsDown size={14} />
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
                                        className="flex flex-col items-center justify-center py-16 px-6 text-center bg-[#FAFAFA]"
                                    >
                                        <div className="w-12 h-12 bg-[#FFFFFF] border border-[#A3A3A3]/20 shadow-sm rounded-full flex items-center justify-center mb-4">
                                            <HelpCircle size={24} className="text-[#E7364D]" />
                                        </div>
                                        <h3 className="text-[16px] font-black text-[#333333] mb-2">No articles found</h3>
                                        <p className="text-[13px] font-medium text-[#626262] mb-5 max-w-xs">
                                            Try asking the AI Assistant on the left, or clear your search terms.
                                        </p>
                                        <button 
                                            onClick={() => setSearchTerm('')}
                                            className="text-[#FFFFFF] bg-[#333333] font-bold text-[13px] px-5 py-2.5 rounded-[8px] hover:bg-[#E7364D] transition-colors shadow-sm"
                                        >
                                            Clear Filters
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                        
                        {/* Final Support Escalation Block */}
                        <motion.div 
                            variants={itemVariants}
                            className="p-6 bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[16px] shadow-sm flex items-center justify-between gap-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-[#FAD8DC]/30 p-3 rounded-full shrink-0">
                                    <ShieldCheck size={20} className="text-[#E7364D]" />
                                </div>
                                <div>
                                    <h4 className="text-[15px] font-black text-[#333333] mb-0.5">Account Issues?</h4>
                                    <p className="text-[12px] font-medium text-[#626262]">Open a secure support ticket.</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => navigate('/profile/support')}
                                className="w-10 h-10 shrink-0 bg-[#333333] hover:bg-[#E7364D] text-[#FFFFFF] rounded-full transition-colors flex items-center justify-center shadow-md"
                            >
                                <ArrowRight size={16} />
                            </button>
                        </motion.div>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}