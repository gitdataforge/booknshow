import React, { useMemo, useState } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, X } from 'lucide-react';
import { useSellerStore } from '../store/useSellerStore';
import FeedbackTab from '../components/FeedbackTab';

export default function ProfileLayout() {
    // FEATURE 1: Secure Identity Extraction & Auth Actions
    const { user, logout } = useSellerStore();
    
    // FEATURE 2: Active Route Detection Engine & Mobile State
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // FEATURE 3: 1:1 Viagogo Flat Navigation Hierarchy
    const links = useMemo(() => [
        { name: 'Profile', path: '/profile', exact: true },
        { name: 'My Orders', path: '/profile/orders', exact: false },
        { name: 'My Listings', path: '/profile/listings', exact: false },
        { name: 'My Sales', path: '/profile/sales', exact: false },
        { name: 'Payments', path: '/profile/payments', exact: false },
        { name: 'Settings', path: '/profile/settings', exact: false },
        { name: 'Wallet', path: '/profile/wallet', exact: false },
        { name: 'Customer Support', path: '/profile/support', exact: false },
        { name: 'View FAQs', path: '/profile/faqs', exact: false }
    ], []);
    
    // Exact or partial route matching for active states
    const isActive = (linkPath, exact) => {
        if (exact) return location.pathname === linkPath || location.pathname === `${linkPath}/`;
        return location.pathname.startsWith(linkPath);
    };

    // FEATURE 4: Framer Motion Physics for Page Transitions
    const pageVariants = {
        initial: { opacity: 0, y: 10 },
        in: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
        out: { opacity: 0, y: -10, transition: { duration: 0.2 } }
    };

    // Initials Generator for Desktop Avatar
    const getInitials = (name, email) => {
        if (name) {
            const parts = name.split(' ');
            if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
            return name.substring(0, 2).toUpperCase();
        }
        if (email) return email.substring(0, 2).toUpperCase();
        return 'S';
    };

    return (
        <div className="w-full min-h-screen bg-white font-sans relative flex flex-col">
            {/* Global Feedback Tab Injection */}
            <FeedbackTab />

            {/* FEATURE 5: 1:1 Viagogo Mobile Header (Base State) */}
            <div className="lg:hidden w-full px-4 py-3 bg-white border-b border-[#e2e2e2] shadow-sm sticky top-0 z-40 flex items-center justify-between">
                <button onClick={() => setIsMobileMenuOpen(true)} className="p-1 text-[#54626c]">
                    {/* Authentic Dotted-List Hamburger SVG */}
                    <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <circle cx="3" cy="6" r="1"></circle>
                        <circle cx="3" cy="12" r="1"></circle>
                        <circle cx="3" cy="18" r="1"></circle>
                    </svg>
                </button>
                <div className="text-[26px] font-black tracking-tighter text-[#54626c]">
                    parbet <span className="text-[#71B12B]">seller</span>
                </div>
                <button className="w-9 h-9 bg-[#458731] rounded-full flex items-center justify-center text-white">
                    <User size={20} strokeWidth={2.5} />
                </button>
            </div>

            {/* FEATURE 6: Mobile Navigation Modal & Dark Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 lg:hidden flex flex-col backdrop-blur-[2px]"
                    >
                        {/* Fake Header inside overlay to mimic exact transition */}
                        <div className="w-full px-4 py-3 flex items-center justify-between">
                            <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                                <X size={24} className="text-[#54626c]" />
                            </button>
                            <div className="text-[26px] font-black tracking-tighter text-[#54626c] opacity-0">
                                parbet <span className="text-[#71B12B]">seller</span>
                            </div>
                            <button className="w-9 h-9 bg-[#458731] rounded-full flex items-center justify-center text-white shadow-md">
                                <User size={20} strokeWidth={2.5} />
                            </button>
                        </div>
                        
                        {/* White Dropdown Navigation Card */}
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="bg-white mx-4 mt-2 rounded-[8px] shadow-2xl overflow-hidden py-2 w-[280px]"
                        >
                            <div className="flex flex-col max-h-[70vh] overflow-y-auto no-scrollbar">
                                {links.map(link => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="px-6 py-3.5 text-[15px] text-[#1a1a1a] hover:bg-gray-50 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                
                                <div className="w-full h-[1px] bg-[#e2e2e2] my-2"></div>
                                
                                <button 
                                    onClick={() => { setIsMobileMenuOpen(false); navigate('/sell'); }}
                                    className="px-6 py-3.5 text-[15px] text-[#1a1a1a] text-left hover:bg-gray-50 transition-colors"
                                >
                                    Sell
                                </button>
                                <button 
                                    onClick={() => { setIsMobileMenuOpen(false); logout(); }}
                                    className="px-6 py-3.5 text-[15px] text-[#1a1a1a] text-left hover:bg-gray-50 transition-colors"
                                >
                                    Sign out
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Wrapper (Desktop Split, Mobile Stack) */}
            <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1400px] mx-auto bg-white border-x border-[#e2e2e2] shadow-sm">
                
                {/* FEATURE 7: Sticky Desktop Sidebar (1:1 Viagogo Replica) */}
                <aside className="hidden lg:flex flex-col w-[260px] xl:w-[300px] shrink-0 bg-[#f8f9fa] border-r border-[#e2e2e2] min-h-[calc(100vh-80px)]">
                    
                    {/* Viagogo Signature Avatar Plate */}
                    <div className="flex flex-col items-center py-10 px-6 border-b border-[#e2e2e2]">
                        <div className="w-20 h-20 bg-white text-[#1a1a1a] border border-[#e2e2e2] rounded-full flex items-center justify-center font-black text-[24px] mb-4 shadow-sm">
                            {getInitials(user?.displayName, user?.email)}
                        </div>
                        <h2 className="text-[17px] font-black text-[#1a1a1a] text-center break-words w-full leading-tight">
                            {user?.displayName || user?.email?.split('@')[0] || 'Seller'}
                        </h2>
                    </div>

                    {/* Viagogo Flat Navigation Menu */}
                    <nav className="flex-1 py-4">
                        <ul className="flex flex-col w-full">
                            {links.map((link) => {
                                const active = isActive(link.path, link.exact);
                                return (
                                    <li key={link.name} className="w-full">
                                        <Link
                                            to={link.path}
                                            className={`block w-full text-left px-8 py-3.5 text-[15px] transition-colors ${
                                                active 
                                                ? 'bg-[#71B12B] text-white font-black' 
                                                : 'text-[#333333] hover:bg-[#e2e2e2] font-normal'
                                            }`}
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </aside>

                {/* FEATURE 8: Dynamic Route Outlet Content */}
                <main className="flex-1 w-full min-w-0 bg-[#f4f4f4] lg:bg-white p-4 sm:p-6 md:p-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            className="w-full h-full"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
            {/* NOTE: Global footer has been intentionally eradicated per strict instructions. */}
        </div>
    );
}