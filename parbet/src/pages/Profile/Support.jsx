import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Receipt, Banknote, User, Ticket, ShoppingCart, 
    Settings, MessageCircle, Bot, ChevronDown, X, Send, 
    LifeBuoy, CheckCircle2, Loader2, PhoneCall
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useMainStore } from '../../store/useMainStore';

/**
 * GLOBAL REBRAND: Booknshow Identity Application (Phase 9 Support Hub)
 * Enforced Colors: #FFFFFF, #E7364D, #333333, #EB5B6E, #FAD8DC, #A3A3A3, #626262
 * FEATURE 1: Live Search Engine State
 * FEATURE 2: Accordion State Management
 * FEATURE 3: Real-Time WhatsApp Business Routing
 * FEATURE 4: Strict 1:1 Category Filtering State
 * FEATURE 5: Real Content Mapping (Booknshow Branding)
 * FEATURE 6: Live Search Filtering Logic
 * FEATURE 7: Framer Motion Staggered UI Engine
 * FEATURE 8: Ambient Illustrative Backgrounds
 * FEATURE 9: Real-Time Firestore Support Ticket Integration
 * FEATURE 10: Embedded Booknshow Vector Logo
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

// Ambient Illustrative Background
const AmbientBackground = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
            className="absolute top-[-5%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#FAD8DC] opacity-30 blur-[100px]"
            animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
            className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#EB5B6E] opacity-10 blur-[120px]"
            animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
    </div>
);

export default function Support() {
    const navigate = useNavigate();
    const { user } = useMainStore();
    
    // Core States
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');

    // Real-Time Ticket Form States
    const [ticketData, setTicketData] = useState({ subject: '', priority: 'Normal', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ticketSuccess, setTicketSuccess] = useState(false);

    const buyerFaqs = [
        { id: 'b1', q: 'Accept your mobile transfer tickets', a: 'Check your email for a transfer offer link from the team or primary ticketer. Click the link to accept the tickets into your primary ticketing account.' },
        { id: 'b2', q: 'When will I get my tickets?', a: 'Sellers have until the end of the day on your estimated delivery date to send tickets. You will receive an email the moment they are transferred.' },
        { id: 'b3', q: 'Find the email with your mobile transfer tickets', a: 'Search your inbox (and spam/junk folders) for emails from the team, venue, or ticketing provider (like Ticketmaster or AXS).' },
        { id: 'b4', q: 'Order delivery status', a: 'You can track the live status of your order at any time by visiting the "My Orders" tab in your profile.' },
        { id: 'b5', q: 'Resell your Booknshow tickets', a: 'If you can no longer attend, you can easily resell your tickets by clicking "Sell" on your order details page.' },
        { id: 'b6', q: 'Log in as a guest with your access code', a: 'Use the access code provided in your confirmation email to securely view your order details without a registered account.' },
        { id: 'b7', q: 'The event is today and I still don\'t have my tickets', a: 'Please contact our urgent support line immediately. Our FanProtect Guarantee ensures you get in or get your money back.' },
        { id: 'b8', q: 'AXS ticket access and troubleshooting', a: 'Ensure you have the AXS mobile app installed and are logged in with the exact same email address used for your Booknshow purchase.' },
        { id: 'b9', q: 'Postponed, rescheduled, or canceled events', a: 'If an event is canceled, you will receive a full refund. If rescheduled, your tickets remain valid for the new date.' },
        { id: 'b10', q: 'Need to cancel a purchase', a: 'All sales are final. We cannot cancel or refund an order once it is placed. You can, however, resell your tickets on our platform.' }
    ];

    const sellerFaqs = [
        { id: 's1', q: 'Get paid for sold tickets', a: 'Payouts are processed 5-8 business days after the event occurs to ensure the buyer successfully attended.' },
        { id: 's2', q: 'Send or retransfer mobile transfer or AXS tickets', a: 'Log into your primary ticketing account and use the "Transfer" feature to send the tickets to the buyer\'s email address provided in your sale details.' },
        { id: 's3', q: 'Selling tickets on Booknshow', a: 'Click the "Sell" button, find your event, select your ticket details, set your price, and wait for a buyer!' },
        { id: 's4', q: 'Deliver tickets to buyers', a: 'Follow the specific delivery instructions provided when your tickets sold. Ensure you confirm the transfer in your Booknshow account.' },
        { id: 's5', q: 'Booknshow\'s fees to sell tickets', a: 'It is free to list tickets. A fulfillment fee is deducted from your payout only when your tickets successfully sell.' },
        { id: 's6', q: 'Ticket delivery deadlines', a: 'You must deliver the tickets by the "In-Hand Date" you selected during the listing process to avoid penalties.' },
        { id: 's7', q: 'List mobile transfer or AXS tickets', a: 'Select "Mobile Transfer" as your delivery method when creating your listing. You will transfer them only after they sell.' },
        { id: 's8', q: 'Deliver e-tickets and barcode tickets', a: 'Upload the original PDF files or enter the barcodes directly into your Booknshow sales page.' },
        { id: 's9', q: 'Preupload E-ticket and barcode tickets', a: 'Pre-uploading ensures instant delivery to the buyer, which makes your listing more attractive and often sell faster.' },
        { id: 's10', q: 'How to tell if your tickets sold on Booknshow', a: 'We will send you an email instantly. You can also monitor your active sales in the "My Sales" tab.' },
        { id: 's11', q: 'Don\'t see my listing on the site', a: 'Listings can take up to 15 minutes to appear on the interactive map. Check your "My Listings" tab to ensure it is active.' }
    ];

    const combinedFaqs = useMemo(() => [...buyerFaqs, ...sellerFaqs], []);
    
    const displayFaqs = useMemo(() => {
        if (!searchQuery.trim()) return null;
        return combinedFaqs.filter(faq => 
            faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
            faq.a.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, combinedFaqs]);

    // Real-Time Ticket Submission Engine
    const handleTicketSubmit = async (e) => {
        e.preventDefault();
        if (!ticketData.subject || !ticketData.message) return;
        
        setIsSubmitting(true);
        try {
            const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
            const ticketsRef = collection(db, 'artifacts', appId, 'support_tickets');
            
            await addDoc(ticketsRef, {
                userId: user?.uid || 'guest',
                email: user?.email || 'unregistered',
                subject: ticketData.subject,
                priority: ticketData.priority,
                message: ticketData.message,
                status: 'Open',
                createdAt: serverTimestamp()
            });
            
            setTicketSuccess(true);
            setTicketData({ subject: '', priority: 'Normal', message: '' });
            setTimeout(() => setTicketSuccess(false), 5000);
        } catch (error) {
            console.error("Support Ticket Submission Failed:", error);
            alert("Failed to submit ticket. Please try WhatsApp support.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // WhatsApp Live Chat Router
    const openWhatsAppSupport = () => {
        const message = encodeURIComponent(`Hi Booknshow Support, I need assistance with my account (${user?.email || 'Guest'}).`);
        window.open(`https://wa.me/+918329004424?text=${message}`, '_blank');
    };

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 120 } } };

    return (
        <div className="w-full font-sans bg-transparent relative min-h-screen">
            <AmbientBackground />
            
            {/* Dark Hero Search Banner */}
            <div 
                className="w-full h-[220px] md:h-[280px] bg-cover bg-center relative flex flex-col items-center justify-center px-4 z-10 shadow-lg"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1540039155733-d7c22c2b0e3d?q=80&w=2000&auto=format&fit=crop")' }}
            >
                <div className="absolute inset-0 bg-[#333333]/80 backdrop-blur-[2px]" />
                <div className="relative z-10 w-full max-w-[800px] flex flex-col items-center">
                    <h1 className="text-[#FFFFFF] text-[28px] md:text-[36px] font-black tracking-tighter mb-6 text-center">
                        Welcome to Booknshow Support
                    </h1>
                    <div className="w-full relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3A3A3]" size={20} />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search Booknshow Support"
                            className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-[#FFFFFF] rounded-full text-[15px] md:text-[16px] text-[#333333] font-bold outline-none shadow-lg focus:ring-2 focus:ring-[#E7364D] transition-all"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-[#E7364D]">
                                <X size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-[1000px] mx-auto px-4 pb-20 relative z-20">
                
                {/* Quick Action Routing Cards */}
                <motion.div 
                    initial="hidden" animate="show" variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 -mt-8 mb-10"
                >
                    {[
                        { title: 'My Orders', icon: <Receipt size={32} className="text-[#E7364D] group-hover:scale-110 transition-transform" />, path: '/profile/orders' },
                        { title: 'My Sales', icon: <Banknote size={32} className="text-[#E7364D] group-hover:scale-110 transition-transform" />, path: '/profile/sales' },
                        { title: 'My Account', icon: <User size={32} className="text-[#E7364D] group-hover:scale-110 transition-transform" />, path: '/profile/settings' }
                    ].map((card) => (
                        <motion.div 
                            key={card.title} variants={itemVariants}
                            onClick={() => navigate(card.path)}
                            className="bg-[#FFFFFF] rounded-[12px] shadow-[0_8px_30px_rgba(51,51,51,0.06)] border border-[#A3A3A3]/20 p-6 md:p-8 flex flex-col items-center justify-center cursor-pointer hover:-translate-y-1 hover:border-[#E7364D]/50 transition-all group"
                        >
                            <div className="mb-4">{card.icon}</div>
                            <h3 className="text-[16px] font-black text-[#333333]">{card.title}</h3>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                    
                    {/* Left Column: FAQs & Search */}
                    <div className="lg:col-span-2">
                        {/* Browse By Category Grid */}
                        <motion.div initial="hidden" animate="show" variants={containerVariants} className="mb-12">
                            <motion.h2 variants={itemVariants} className="text-[20px] font-black text-[#333333] mb-4">Browse by Category</motion.h2>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { title: 'Where are my tickets?', icon: <Ticket size={20} className={activeCategory === 'Where are my tickets?' ? "text-[#E7364D]" : "text-[#A3A3A3]"}/> },
                                    { title: 'Buying', icon: <ShoppingCart size={20} className={activeCategory === 'Buying' ? "text-[#E7364D]" : "text-[#A3A3A3]"}/> },
                                    { title: 'Selling', icon: <Banknote size={20} className={activeCategory === 'Selling' ? "text-[#E7364D]" : "text-[#A3A3A3]"}/> },
                                    { title: 'Account & Settings', icon: <Settings size={20} className={activeCategory === 'Account & Settings' ? "text-[#E7364D]" : "text-[#A3A3A3]"}/> }
                                ].map((cat) => (
                                    <motion.button 
                                        key={cat.title} variants={itemVariants}
                                        onClick={() => setActiveCategory(cat.title)}
                                        className={`flex flex-col md:flex-row items-start md:items-center gap-3 p-4 rounded-[12px] border transition-all shadow-sm ${activeCategory === cat.title ? 'border-[#E7364D] bg-[#FAD8DC]/30' : 'border-[#A3A3A3]/20 bg-[#FFFFFF] hover:border-[#E7364D]/50'}`}
                                    >
                                        {cat.icon}
                                        <span className={`text-[14px] font-bold text-left leading-tight ${activeCategory === cat.title ? 'text-[#E7364D]' : 'text-[#333333]'}`}>{cat.title}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Dynamic Logic - Search Results vs Split FAQs */}
                        <div className="w-full mb-12">
                            {displayFaqs !== null ? (
                                <div className="w-full bg-[#FFFFFF] p-6 rounded-[16px] shadow-sm border border-[#A3A3A3]/20">
                                    <h2 className="text-[20px] font-black text-[#333333] mb-6 flex items-center"><Search className="mr-2 text-[#E7364D]"/> Search Results</h2>
                                    {displayFaqs.length > 0 ? (
                                        <div className="space-y-2">
                                            {displayFaqs.map(faq => (
                                                <FaqItem key={faq.id} faq={faq} isExpanded={expandedId === faq.id} onToggle={() => setExpandedId(expandedId === faq.id ? null : faq.id)} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 bg-[#FAFAFA] border border-[#A3A3A3]/20 rounded-[8px]">
                                            <p className="text-[#626262] font-medium">No answers found for "{searchQuery}". Try a different keyword.</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-12">
                                    <div className="bg-[#FFFFFF] p-6 rounded-[16px] shadow-sm border border-[#A3A3A3]/20">
                                        <h2 className="text-[20px] font-black text-[#333333] mb-6 flex items-center"><ShoppingCart className="mr-2 text-[#E7364D]"/> Top Buyer Answers</h2>
                                        <div className="space-y-1">
                                            {buyerFaqs.map(faq => (
                                                <FaqItem key={faq.id} faq={faq} isExpanded={expandedId === faq.id} onToggle={() => setExpandedId(expandedId === faq.id ? null : faq.id)} />
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="bg-[#FFFFFF] p-6 rounded-[16px] shadow-sm border border-[#A3A3A3]/20">
                                        <h2 className="text-[20px] font-black text-[#333333] mb-6 flex items-center"><Banknote className="mr-2 text-[#E7364D]"/> Top Seller Answers</h2>
                                        <div className="space-y-1">
                                            {sellerFaqs.map(faq => (
                                                <FaqItem key={faq.id} faq={faq} isExpanded={expandedId === faq.id} onToggle={() => setExpandedId(expandedId === faq.id ? null : faq.id)} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Support Ticket Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[16px] p-6 shadow-[0_8px_30px_rgba(51,51,51,0.06)] sticky top-[100px]">
                            <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#A3A3A3]/20">
                                <h3 className="text-[20px] font-black text-[#333333] flex items-center">
                                    <LifeBuoy className="mr-2 text-[#E7364D]" /> Contact Support
                                </h3>
                                <BooknshowLogo className="h-6 opacity-80" />
                            </div>

                            <AnimatePresence mode="wait">
                                {ticketSuccess ? (
                                    <motion.div 
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="py-10 flex flex-col items-center justify-center text-center"
                                    >
                                        <div className="w-16 h-16 bg-[#FAD8DC]/50 rounded-full flex items-center justify-center mb-4">
                                            <CheckCircle2 size={32} className="text-[#E7364D]" />
                                        </div>
                                        <h4 className="text-[18px] font-black text-[#333333] mb-2">Ticket Submitted</h4>
                                        <p className="text-[13px] text-[#626262] font-medium">Our support team will respond to {user?.email || 'your email'} shortly.</p>
                                    </motion.div>
                                ) : (
                                    <motion.form 
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onSubmit={handleTicketSubmit} 
                                        className="space-y-5"
                                    >
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest">Issue Subject</label>
                                            <input 
                                                required
                                                type="text" 
                                                value={ticketData.subject}
                                                onChange={(e) => setTicketData({...ticketData, subject: e.target.value})}
                                                className="w-full bg-[#F5F5F5] border border-[#A3A3A3]/30 rounded-[8px] px-4 py-3 text-[14px] text-[#333333] font-bold focus:bg-[#FFFFFF] focus:border-[#E7364D] outline-none transition-colors"
                                                placeholder="Brief description of issue"
                                            />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest">Priority Level</label>
                                            <select 
                                                value={ticketData.priority}
                                                onChange={(e) => setTicketData({...ticketData, priority: e.target.value})}
                                                className="w-full bg-[#F5F5F5] border border-[#A3A3A3]/30 rounded-[8px] px-4 py-3 text-[14px] text-[#333333] font-bold focus:bg-[#FFFFFF] focus:border-[#E7364D] outline-none transition-colors cursor-pointer appearance-none"
                                            >
                                                <option value="Normal">Normal</option>
                                                <option value="High">High (Event within 48 hours)</option>
                                                <option value="Urgent">Urgent (Event is today)</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest">Detailed Message</label>
                                            <textarea 
                                                required
                                                value={ticketData.message}
                                                onChange={(e) => setTicketData({...ticketData, message: e.target.value})}
                                                className="w-full bg-[#F5F5F5] border border-[#A3A3A3]/30 rounded-[8px] px-4 py-3 text-[14px] text-[#333333] font-medium focus:bg-[#FFFFFF] focus:border-[#E7364D] outline-none transition-colors min-h-[120px] resize-none"
                                                placeholder="Provide Order ID and specifics..."
                                            ></textarea>
                                        </div>

                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className="w-full bg-[#333333] text-[#FFFFFF] py-3.5 rounded-[8px] font-black text-[14px] hover:bg-[#E7364D] transition-colors flex items-center justify-center shadow-md disabled:opacity-50"
                                        >
                                            {isSubmitting ? <Loader2 size={18} className="animate-spin mr-2" /> : <Send size={18} className="mr-2" />}
                                            Submit Ticket
                                        </button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Live WhatsApp Business Router (Floating FAB) */}
            <button 
                onClick={openWhatsAppSupport}
                className="fixed bottom-6 right-6 z-[60] bg-[#E7364D] hover:bg-[#333333] text-[#FFFFFF] rounded-full md:rounded-[12px] flex items-center justify-center md:justify-between p-4 md:px-5 md:py-3.5 shadow-[0_10px_30px_rgba(231,54,77,0.4)] transition-all hover:scale-105 group"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-[#FFFFFF]/20 p-1.5 rounded-full"><PhoneCall size={20} className="group-hover:animate-pulse" /></div>
                    <div className="hidden md:block text-left pr-2">
                        <p className="text-[14px] font-black leading-tight">Live Chat</p>
                        <p className="text-[11px] font-bold opacity-90 leading-tight">WhatsApp Support</p>
                    </div>
                </div>
            </button>
        </div>
    );
}

// Reusable FAQ Accordion Component
const FaqItem = ({ faq, isExpanded, onToggle }) => (
    <div className="border-b border-[#A3A3A3]/20 last:border-0">
        <button 
            onClick={onToggle}
            className="w-full flex items-start text-left py-4 group transition-colors hover:bg-[#FAFAFA] px-4 -mx-4 rounded-[8px]"
        >
            <MessageCircle size={18} className="text-[#E7364D] mr-3 mt-0.5 shrink-0" strokeWidth={2} />
            <span className="text-[14px] font-bold text-[#333333] group-hover:text-[#E7364D] transition-colors flex-1">{faq.q}</span>
            <ChevronDown size={18} className={`text-[#A3A3A3] ml-2 shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#E7364D]' : ''}`} />
        </button>
        <AnimatePresence>
            {isExpanded && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                >
                    <div className="bg-[#FAFAFA] border-l-2 border-[#E7364D] ml-5 mb-4 p-4 rounded-r-[8px]">
                        <p className="text-[14px] text-[#626262] font-medium leading-relaxed">
                            {faq.a}
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);