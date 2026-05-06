import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldCheck, LayoutDashboard, Ticket, Tags, IndianRupee, 
    CreditCard, Settings, Wallet, LifeBuoy, HelpCircle,
    ChevronLeft, ChevronRight
} from 'lucide-react';

// INJECTIONS
import FeedbackTab from '../components/FeedbackTab';
import ProfileHeader from '../components/ProfileHeader'; 
// CRITICAL FIX: Removed the redundant local <Footer /> import to prevent double stacking. 
// The global App.jsx footer will handle the absolute bottom placement automatically.

/**
 * GLOBAL REBRAND: Booknshow Identity Application (Phase 12 Animated Profile Layout)
 * Enforced Colors: #FFFFFF, #E7364D, #333333, #EB5B6E, #FAD8DC, #A3A3A3, #626262
 * FEATURE 1: 1:1 Booknshow UI Clone Header Injection
 * FEATURE 2: Real-time Firebase Identity Extraction & Parsing
 * FEATURE 3: Strict Active State Sidebar Highlighting
 * FEATURE 4: Collapsible Desktop Sidebar with Hardware-Accelerated Width Physics
 * FEATURE 5: Double-Footer Bug Resolution (Relies strictly on Global App Footer)
 */

// Ambient illustrative background specifically for the desktop sidebar
const SidebarAmbientBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
            className="absolute top-[0%] left-[-20%] w-[150%] h-[200px] rounded-full bg-[#FAD8DC] opacity-30 blur-[60px]"
            animate={{ y: [0, 20, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
    </div>
);

export default function ProfileLayout() {
    const location = useLocation();
    
    // Real Identity State Management
    const [userInitials, setUserInitials] = useState('GU');
    const [userDisplayName, setUserDisplayName] = useState('Guest User');
    
    // FEATURE 4: Sidebar Collapse State
    const [isCollapsed, setIsCollapsed] = useState(false);

    // FEATURE 2: Real-time Firebase Identity Extraction & Parsing
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // Extract real email or display name
                const identifier = user.displayName || user.email || 'Anonymous Seller';
                
                // Format the display name (breaking it into the stacked look)
                setUserDisplayName(identifier.split('@')[0]);

                // Generate initials mathematically
                const nameParts = identifier.replace(/[^a-zA-Z ]/g, " ").trim().split(' ');
                let initials = 'GU';
                if (nameParts.length >= 2) {
                    initials = (nameParts[0][0] + nameParts[1][0]).toUpperCase();
                } else if (nameParts[0].length >= 2) {
                    initials = (nameParts[0].substring(0, 2)).toUpperCase();
                }
                setUserInitials(initials);
            } else {
                setUserInitials('GU');
                setUserDisplayName('Guest User');
            }
        });

        return () => unsubscribe();
    }, []);

    // Strict Multi-Page Navigation Configuration with Icons
    const navLinks = [
        { path: '/profile', label: 'Hub Overview', icon: <LayoutDashboard size={20} /> },
        { path: '/profile/orders', label: 'My Orders', icon: <Ticket size={20} /> },
        { path: '/profile/listings', label: 'My Listings', icon: <Tags size={20} /> },
        { path: '/profile/sales', label: 'My Sales', icon: <IndianRupee size={20} /> },
        { path: '/profile/payments', label: 'Payments', icon: <CreditCard size={20} /> },
        { path: '/profile/settings', label: 'Settings', icon: <Settings size={20} /> },
        { path: '/profile/wallet', label: 'Wallet', icon: <Wallet size={20} /> },
        { path: '/profile/support', label: 'Support Tickets', icon: <LifeBuoy size={20} /> },
        { path: '/profile/faqs', label: 'Smart FAQs', icon: <HelpCircle size={20} /> }
    ];

    return (
        <div className="flex flex-col w-full min-h-screen bg-[#FFFFFF] font-sans relative">
            
            {/* INJECTED PROFILE HEADER */}
            <ProfileHeader />

            {/* Container for Sidebar and Main Content */}
            <div className="flex w-full flex-1 mt-[72px]">
                
                {/* SECTION 1: Desktop Collapsible Sidebar */}
                <motion.aside 
                    initial={false}
                    animate={{ width: isCollapsed ? 80 : 260 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="hidden md:flex flex-col bg-[#F5F5F5] border-r border-[#A3A3A3]/20 shrink-0 relative overflow-visible shadow-[inset_-10px_0_20px_rgba(51,51,51,0.02)] z-20"
                >
                    <SidebarAmbientBackground />
                    
                    {/* Toggle Button */}
                    <button 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="absolute -right-3.5 top-6 w-7 h-7 bg-[#FFFFFF] border border-[#A3A3A3]/30 rounded-full flex items-center justify-center z-50 hover:border-[#E7364D] hover:text-[#E7364D] transition-colors shadow-sm text-[#333333]"
                    >
                        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                    
                    {/* SECTION 2: User Identity Block */}
                    <div className={`py-8 flex flex-col items-center justify-center border-b border-[#A3A3A3]/20 relative z-10 bg-[#FFFFFF]/60 backdrop-blur-md transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-4'}`}>
                        <motion.div 
                            animate={{ 
                                width: isCollapsed ? 48 : 84, 
                                height: isCollapsed ? 48 : 84,
                                fontSize: isCollapsed ? 16 : 24
                            }}
                            className="rounded-full bg-[#FFFFFF] border-2 border-[#E7364D]/30 flex items-center justify-center font-black text-[#E7364D] mb-3 tracking-tight shadow-sm shrink-0"
                        >
                            {userInitials}
                        </motion.div>
                        
                        <AnimatePresence mode="wait">
                            {!isCollapsed && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex flex-col items-center overflow-hidden"
                                >
                                    <div className="text-[16px] font-black text-[#333333] text-center break-words w-full leading-tight">
                                        {userDisplayName}
                                    </div>
                                    <div className="flex items-center gap-1 mt-1.5 text-[#A3A3A3]">
                                        <ShieldCheck size={14} className="text-[#E7364D]" />
                                        <span className="text-[11px] font-bold uppercase tracking-widest whitespace-nowrap">Verified Buyer</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* SECTION 3: Profile Navigation Links */}
                    <nav className="flex flex-col py-4 w-full relative z-10 flex-1 bg-transparent overflow-y-auto custom-scrollbar overflow-x-hidden">
                        {navLinks.map((link) => {
                            // Strict Active State Matching
                            const isActive = link.path === '/profile' 
                                ? location.pathname === '/profile' || location.pathname === '/profile/'
                                : location.pathname.startsWith(link.path);

                            return (
                                <Link 
                                    key={link.path}
                                    to={link.path}
                                    className={`w-full py-3.5 transition-all flex items-center group relative ${
                                        isCollapsed ? 'justify-center px-0' : 'justify-between px-6'
                                    } ${
                                        isActive 
                                        ? 'bg-[#FFFFFF] text-[#E7364D] font-black shadow-[inset_4px_0_0_#E7364D] border-y border-[#A3A3A3]/10' 
                                        : 'text-[#626262] font-medium hover:bg-[#FAD8DC]/20 hover:text-[#333333]'
                                    }`}
                                    title={isCollapsed ? link.label : ""}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className={`${isActive ? 'text-[#E7364D]' : 'text-[#A3A3A3] group-hover:text-[#333333]'} transition-colors`}>
                                            {link.icon}
                                        </span>
                                        <AnimatePresence>
                                            {!isCollapsed && (
                                                <motion.span 
                                                    initial={{ opacity: 0, width: 0 }}
                                                    animate={{ opacity: 1, width: 'auto' }}
                                                    exit={{ opacity: 0, width: 0 }}
                                                    className="text-[14px] whitespace-nowrap overflow-hidden"
                                                >
                                                    {link.label}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    {!isCollapsed && isActive && (
                                        <motion.div layoutId="activeDot" className="w-1.5 h-1.5 rounded-full bg-[#E7364D] shrink-0"></motion.div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                    
                    {/* SECTION 4: Sidebar Footer */}
                    <div className="p-6 border-t border-[#A3A3A3]/20 flex justify-center relative z-10">
                        <AnimatePresence mode="wait">
                            {!isCollapsed ? (
                                <motion.span 
                                    key="full"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest whitespace-nowrap"
                                >
                                    Booknshow Secure
                                </motion.span>
                            ) : (
                                <motion.span 
                                    key="icon"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                >
                                    <ShieldCheck size={18} className="text-[#A3A3A3]" />
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.aside>

                {/* SECTION 5: RESPONSIVE MAIN CONTENT AREA */}
                {/* Note: min-h-[calc(100vh-72px)] ensures this wrapper pushes the global footer down naturally */}
                <main className="flex-1 w-full bg-[#FFFFFF] relative flex flex-col min-h-[calc(100vh-72px)] overflow-x-hidden z-10">
                    <div className="flex-1 w-full max-w-[1200px] p-5 md:p-10 mx-auto">
                        
                        {/* FEATURE 4: Framer Motion AnimatePresence for Child Routes */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* The specific page content (Orders, Listings, etc.) renders here dynamically */}
                                <Outlet />
                            </motion.div>
                        </AnimatePresence>
                        
                    </div>
                </main>
            </div>

            {/* GLOBAL INJECTION: Persistent Real-Time Feedback Tab */}
            <FeedbackTab />
            
        </div>
    );
}