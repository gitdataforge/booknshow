import React, { useMemo } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronRight, Settings, Ticket, DollarSign, CreditCard, Wallet, HelpCircle, MessageSquare } from 'lucide-react';
import { useSellerStore } from '../store/useSellerStore';
import FeedbackTab from '../components/FeedbackTab';

export default function ProfileLayout() {
    // FEATURE 1: Secure Identity Extraction
    const { user } = useSellerStore();
    
    // FEATURE 2: Active Route Detection Engine
    const location = useLocation();
    const navigate = useNavigate();

    // FEATURE 3: 1:1 Viagogo Navigation Hierarchy (Seller Specific)
    const navGroups = useMemo(() => [
        {
            title: 'Manage Inventory',
            links: [
                { name: 'Profile Overview', path: '/profile', icon: <User size={18} />, exact: true },
                { name: 'My Listings', path: '/profile/listings', icon: <Ticket size={18} /> },
                { name: 'My Sales', path: '/profile/sales', icon: <DollarSign size={18} /> },
                { name: 'Payments', path: '/profile/payments', icon: <CreditCard size={18} /> }
            ]
        },
        {
            title: 'Account & Finance',
            links: [
                { name: 'Settings', path: '/profile/settings', icon: <Settings size={18} /> },
                { name: 'Wallet', path: '/profile/wallet', icon: <Wallet size={18} /> }
            ]
        },
        {
            title: 'Help & Support',
            links: [
                { name: 'Customer Support', path: '/profile/support', icon: <MessageSquare size={18} /> },
                { name: 'View FAQs', path: '/profile/faqs', icon: <HelpCircle size={18} /> }
            ]
        }
    ], []);

    // Flatten links for mobile select dropdown
    const allLinks = navGroups.flatMap(group => group.links);
    
    // Check if link is active based on exact or partial matching
    const isActive = (linkPath, exact) => {
        if (exact) return location.pathname === linkPath || location.pathname === `${linkPath}/`;
        return location.pathname.startsWith(linkPath);
    };

    // FEATURE 4: Framer Motion Staggered Physics for Sidebar
    const sidebarVariants = {
        hidden: { opacity: 0, x: -20 },
        show: { 
            opacity: 1, 
            x: 0,
            transition: { staggerChildren: 0.05, duration: 0.4, ease: 'easeOut' }
        }
    };

    const linkVariants = {
        hidden: { opacity: 0, x: -10 },
        show: { opacity: 1, x: 0 }
    };

    // FEATURE 5: Outlet Transition Physics
    const pageVariants = {
        initial: { opacity: 0, y: 10 },
        in: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
        out: { opacity: 0, y: -10, transition: { duration: 0.2 } }
    };

    return (
        <div className="w-full min-h-screen bg-[#f8f9fa] font-sans relative">
            {/* FEATURE 6: Global Feedback Tab Injection */}
            <FeedbackTab />

            <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-12">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    
                    {/* FEATURE 7: Mobile-Native Synchronization Dropdown */}
                    <div className="lg:hidden w-full mb-4">
                        <div className="relative">
                            <select
                                value={location.pathname}
                                onChange={(e) => navigate(e.target.value)}
                                className="w-full appearance-none bg-white border border-[#cccccc] rounded-[4px] px-4 py-3.5 text-[15px] font-bold text-[#1a1a1a] outline-none shadow-sm focus:border-[#458731] transition-all"
                            >
                                {allLinks.map(link => (
                                    <option key={link.path} value={link.path}>
                                        {link.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1a1a1a] pointer-events-none rotate-90" size={20} />
                        </div>
                    </div>

                    {/* FEATURE 8: Sticky Desktop Sidebar (1:1 Viagogo Gray Navigation) */}
                    <motion.aside 
                        variants={sidebarVariants}
                        initial="hidden"
                        animate="show"
                        className="hidden lg:block w-[280px] shrink-0 sticky top-24 self-start"
                    >
                        {/* FEATURE 9: Real-Time Dynamic Welcome Plate */}
                        <div className="bg-white border border-[#e2e2e2] rounded-[4px] p-6 mb-6 shadow-sm">
                            <div className="w-12 h-12 bg-[#1a1a1a] text-white rounded-full flex items-center justify-center font-bold text-[18px] mb-4">
                                {(user?.displayName || user?.email || 'S')[0].toUpperCase()}
                            </div>
                            <h2 className="text-[18px] font-black text-[#1a1a1a] tracking-tight leading-tight truncate">
                                Welcome, {user?.displayName || user?.email?.split('@')[0] || 'Seller'}
                            </h2>
                            <p className="text-[13px] text-[#54626c] mt-1">Seller Dashboard</p>
                        </div>

                        {/* FEATURE 10: Nested Navigation Groups */}
                        <nav className="space-y-6">
                            {navGroups.map((group, idx) => (
                                <div key={idx}>
                                    <h3 className="text-[12px] font-bold text-[#54626c] uppercase tracking-widest mb-3 px-2">
                                        {group.title}
                                    </h3>
                                    <ul className="space-y-1">
                                        {group.links.map((link) => {
                                            const active = isActive(link.path, link.exact);
                                            return (
                                                <motion.li key={link.name} variants={linkVariants}>
                                                    <Link
                                                        to={link.path}
                                                        className={`flex items-center w-full text-left px-4 py-2.5 rounded-[4px] text-[14px] font-bold transition-all ${
                                                            active 
                                                            ? 'bg-white text-[#458731] shadow-sm border border-[#e2e2e2]' 
                                                            : 'text-[#1a1a1a] hover:bg-gray-200/50 border border-transparent'
                                                        }`}
                                                    >
                                                        <span className={`mr-3 ${active ? 'text-[#458731]' : 'text-[#54626c]'}`}>
                                                            {link.icon}
                                                        </span>
                                                        {link.name}
                                                    </Link>
                                                </motion.li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </nav>
                    </motion.aside>

                    {/* FEATURE 11: Dynamic Nested Route Outlet with AnimatePresence */}
                    <main className="flex-1 w-full min-w-0">
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
            </div>
        </div>
    );
}