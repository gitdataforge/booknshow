import React, { useMemo } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Facebook, Twitter } from 'lucide-react';
import { useSellerStore } from '../store/useSellerStore';
import FeedbackTab from '../components/FeedbackTab';

export default function ProfileLayout() {
    // FEATURE 1: Secure Identity Extraction
    const { user } = useSellerStore();
    
    // FEATURE 2: Active Route Detection Engine
    const location = useLocation();
    const navigate = useNavigate();

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

    // FEATURE 4: Framer Motion Physics
    const pageVariants = {
        initial: { opacity: 0, y: 10 },
        in: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
        out: { opacity: 0, y: -10, transition: { duration: 0.2 } }
    };

    // Initials Generator for Avatar
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

            {/* Main Content Wrapper (Desktop Split, Mobile Stack) */}
            <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1400px] mx-auto bg-white border-x border-[#e2e2e2] shadow-sm">
                
                {/* FEATURE 5: Mobile-Native Synchronization Dropdown */}
                <div className="lg:hidden w-full p-4 bg-[#f8f9fa] border-b border-[#e2e2e2] shadow-sm sticky top-0 z-40">
                    <div className="relative">
                        <select
                            value={location.pathname}
                            onChange={(e) => navigate(e.target.value)}
                            className="w-full appearance-none bg-white border border-[#cccccc] rounded-[4px] px-4 py-3.5 text-[16px] font-bold text-[#1a1a1a] outline-none shadow-sm focus:border-[#458731] transition-all"
                        >
                            {links.map(link => (
                                <option key={link.path} value={link.path}>
                                    {link.name}
                                </option>
                            ))}
                        </select>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1a1a1a] pointer-events-none rotate-90" size={20} />
                    </div>
                </div>

                {/* FEATURE 6: Sticky Desktop Sidebar (1:1 Viagogo Replica) */}
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

                {/* FEATURE 7: Dynamic Route Outlet Content */}
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

            {/* FEATURE 8: 1:1 Replica Global Footer */}
            <footer className="w-full border-t border-[#e2e2e2] bg-[#f8f9fa] mt-auto">
                <div className="max-w-[1200px] mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 border-b border-[#cccccc] pb-10">
                        
                        {/* Column 1: Our Company */}
                        <div>
                            <h3 className="text-[16px] font-black text-[#54626c] mb-6">Our Company</h3>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-[14px] text-[#54626c] hover:underline">About Us</a></li>
                                <li><a href="#" className="text-[14px] text-[#54626c] hover:underline">Affiliate Programme</a></li>
                                <li><a href="#" className="text-[14px] text-[#54626c] hover:underline">Careers</a></li>
                                <li><a href="#" className="text-[14px] text-[#54626c] hover:underline">Corporate Service</a></li>
                            </ul>
                        </div>

                        {/* Column 2: Help */}
                        <div>
                            <h3 className="text-[16px] font-black text-[#54626c] mb-6">Have Questions?</h3>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-[14px] text-[#54626c] hover:underline">Help Centre</a></li>
                            </ul>
                        </div>

                        {/* Column 3: Region Selectors */}
                        <div>
                            <h3 className="text-[16px] font-black text-[#54626c] mb-6">Live events all over the world</h3>
                            <div className="space-y-3">
                                {/* Country Selector */}
                                <div className="relative">
                                    <select className="w-full appearance-none bg-white border border-[#cccccc] rounded-[4px] px-4 py-3 text-[14px] text-[#54626c] outline-none hover:border-[#1a1a1a] cursor-pointer transition-colors">
                                        <option>🇺🇸 United States</option>
                                        <option>🇮🇳 India</option>
                                        <option>🇬🇧 United Kingdom</option>
                                    </select>
                                </div>
                                {/* Language & Currency Combo */}
                                <div className="bg-white border border-[#cccccc] rounded-[4px] overflow-hidden">
                                    <div className="px-4 py-3 border-b border-[#e2e2e2] cursor-pointer hover:bg-gray-50 transition-colors">
                                        <p className="text-[14px] text-[#54626c] flex items-center gap-2"><span className="font-serif">文A</span> English (UK)</p>
                                    </div>
                                    <div className="px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors">
                                        <p className="text-[14px] text-[#54626c]">Rs. Indian Rupee</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Bottom Strip */}
                    <div className="pt-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                        <div className="flex gap-6 order-1 md:order-2">
                            <a href="#" className="text-[#54626c] hover:text-[#1a1a1a] transition-colors"><Facebook size={24} /></a>
                            <a href="#" className="text-[#54626c] hover:text-[#1a1a1a] transition-colors"><Twitter size={24} /></a>
                        </div>
                        <div className="text-[12px] text-[#54626c] leading-relaxed max-w-3xl order-2 md:order-1 text-center md:text-left">
                            <p className="mb-1">
                                Copyright © Parbet Entertainment Inc 2026 <a href="#" className="text-[#0064d2] hover:underline font-medium">Company Details</a>
                            </p>
                            <p>
                                Use of this web site constitutes acceptance of the <a href="#" className="text-[#0064d2] hover:underline font-medium">Terms and Conditions</a> and <a href="#" className="text-[#0064d2] hover:underline font-medium">Privacy Policy</a> and <a href="#" className="text-[#0064d2] hover:underline font-medium">Cookies Policy</a>
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}