import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, User, X, Menu, ChevronRight, ChevronLeft, Bell, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useStore';
import { useMainStore } from '../store/useMainStore';
import SearchDropdown from './SearchDropdown';

/**
 * GLOBAL REBRAND: Booknshow Identity Application
 * Enforced Colors: Carnation (#F84464), Wild Sand (#F5F5F5), Ebony Clay (#1F2533)
 * * FEATURE 1: 1:1 Viagogo/Booknshow Enterprise Desktop Layout Replication
 * FEATURE 2: Strict Keyword Enforcement Engine
 * FEATURE 3: Dynamic Auto-Correction & Route-Aware UI Isolation
 * FEATURE 4: Hardware-Accelerated Mobile Drawer with Nested Navigation
 * FEATURE 5: SVG Vector Re-creation of Uploaded Logo
 * FEATURE 6: Intelligent Click-Outside Dropdown Architecture
 * FEATURE 7: Real-Time Authentication Hydration
 * FEATURE 8: Top Black Disclaimer Banner (Ebony Clay Variant)
 * FEATURE 9: Strict 3-Color DOM Palette Enforcement
 * FEATURE 10: Scroll-Lock Mobile Interaction Physics
 */

export const BooknshowLogo = ({ className = "h-8" }) => (
    <svg viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="10" y="70" fontFamily="Inter, sans-serif" fontSize="64" fontWeight="800" fill="#1F2533" letterSpacing="-2">book</text>
        <g transform="translate(170, 10) rotate(-12)">
            <path d="M0,0 L16,10 L32,0 L48,10 L64,0 L80,10 L80,95 L60,95 A20,20 0 0,0 20,95 L0,95 Z" fill="#F84464" />
            <text x="21" y="72" fontFamily="Inter, sans-serif" fontSize="60" fontWeight="900" fill="#F5F5F5">n</text>
        </g>
        <text x="250" y="70" fontFamily="Inter, sans-serif" fontSize="64" fontWeight="800" fill="#1F2533" letterSpacing="-2">show</text>
    </svg>
);

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation(); 
    const { 
        searchQuery, 
        setSearchQuery,
        isSearchExpanded,
        setSearchExpanded,
        setExploreCategory
    } = useAppStore();
    
    const { isAuthenticated } = useMainStore();

    // UI ISOLATION LOGIC
    const isProfilePage = location.pathname.startsWith('/profile');
    const isExplorePage = location.pathname === '/explore';

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [menuView, setMenuView] = useState('main'); 
    
    // Dropdown States for 1:1 UI
    const [activeDropdown, setActiveDropdown] = useState(null);
    const dropdownRef = useRef(null);

    // Click outside handler for dropdowns
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Scroll Lock logic for mobile drawer
    useEffect(() => {
        if (mobileMenuOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [mobileMenuOpen]);

    // Reset nested view when drawer closes
    useEffect(() => {
        if (!mobileMenuOpen) setTimeout(() => setMenuView('main'), 300);
    }, [mobileMenuOpen]);

    const handleNavigation = (path) => {
        setMobileMenuOpen(false); 
        setActiveDropdown(null);
        if (isAuthenticated) navigate(path);
        else navigate('/login');
    };

    const handleStrictSearchSubmit = (e) => {
        if (e.key === 'Enter') {
            const q = searchQuery.toLowerCase();
            const allowed = ['ipl', 'cricket', 'kabaddi', 'world cup'];
            const isValid = allowed.some(valid => q.includes(valid));
            
            if (!isValid && q.trim() !== '') setSearchQuery('IPL'); 
            
            navigate('/explore');
            setSearchExpanded(false);
            e.target.blur();
        }
    };

    return (
        <>
            <header className="w-full bg-[#F5F5F5] font-sans sticky top-0 z-50 border-b border-[#1F2533]/10">
                
                {/* 1. TOP DISCLAIMER BANNER */}
                {!isProfilePage && !isExplorePage && (
                    <div className="w-full bg-[#1F2533] py-1.5 text-center px-4">
                        <p className="text-[13px] text-[#F5F5F5] font-medium tracking-wide">
                            We're the world's largest marketplace for buying and reselling tickets. Resale ticket prices may be above or below face value.
                        </p>
                    </div>
                )}

                {/* 2. MAIN DESKTOP HEADER */}
                <div className="hidden lg:flex max-w-[1400px] w-full mx-auto px-6 py-4 items-center justify-between">
                    
                    {/* Left Section: Logo + Category Links */}
                    <div className="flex items-center gap-8 shrink-0">
                        <div onClick={() => navigate('/')} className="cursor-pointer hover:opacity-80 transition-opacity">
                            <BooknshowLogo className="h-[36px]" />
                        </div>
                        <nav className="flex items-center gap-6 text-[15px] font-bold text-[#1F2533]">
                            <button onClick={() => { setExploreCategory('Sports'); navigate('/explore'); }} className="hover:text-[#F84464] transition-colors">Sports</button>
                            <button onClick={() => { setExploreCategory('Concerts'); navigate('/explore'); }} className="hover:text-[#F84464] transition-colors">Concerts</button>
                            <button onClick={() => { setExploreCategory('Theatre'); navigate('/explore'); }} className="hover:text-[#F84464] transition-colors">Theatre</button>
                            <button onClick={() => { setExploreCategory('Top Cities'); navigate('/explore'); }} className="hover:text-[#F84464] transition-colors">Top Cities</button>
                        </nav>
                    </div>

                    {/* Center Section: Search Bar */}
                    <div className="flex-1 max-w-[600px] mx-8 relative">
                        <div className="flex items-center w-full border border-[#1F2533]/20 rounded-[8px] px-5 py-2.5 bg-[#F5F5F5] transition-all hover:border-[#1F2533] focus-within:border-[#F84464] focus-within:shadow-[0_0_0_1px_#F84464]">
                            <Search size={20} className="text-[#1F2533] mr-3 font-bold" strokeWidth={2.5} />
                            <input 
                                type="text" 
                                placeholder="Search events, artists, teams and more" 
                                className="w-full outline-none text-[15px] font-medium text-[#1F2533] placeholder-[#1F2533]/50 bg-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleStrictSearchSubmit}
                                onFocus={() => setSearchExpanded(true)}
                                onBlur={() => setTimeout(() => setSearchExpanded(false), 200)}
                            />
                        </div>
                        {isSearchExpanded && !isExplorePage && <SearchDropdown />}
                    </div>

                    {/* Right Section: Actions & Dropdowns */}
                    <div className="flex items-center gap-6 text-[15px] font-bold text-[#1F2533] shrink-0" ref={dropdownRef}>
                        <button onClick={() => navigate('/explore')} className="hover:text-[#F84464] transition-colors">Explore</button>
                        <button onClick={() => window.location.href = 'https://parbet-seller-44902.web.app'} className="hover:text-[#F84464] transition-colors">Sell</button>
                        <button onClick={() => handleNavigation('/profile/settings')} className="hover:text-[#F84464] transition-colors">Favourites</button>
                        
                        {/* My Tickets Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => activeDropdown === 'tickets' ? setActiveDropdown(null) : setActiveDropdown('tickets')} 
                                className={`flex items-center gap-1 transition-colors ${activeDropdown === 'tickets' ? 'text-[#F84464]' : 'hover:text-[#F84464]'}`}
                            >
                                My Tickets
                            </button>
                            <AnimatePresence>
                                {activeDropdown === 'tickets' && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-[calc(100%+12px)] right-0 w-48 bg-[#F5F5F5] rounded-[12px] shadow-[0_4px_20px_rgba(31,37,51,0.15)] border border-[#1F2533]/10 py-3 z-[100] flex flex-col">
                                        <button onClick={() => handleNavigation('/profile/orders')} className="text-left px-5 py-2.5 text-[15px] font-medium text-[#1F2533] hover:text-[#F84464] hover:bg-[#1F2533]/5 transition-colors">Orders</button>
                                        <button onClick={() => handleNavigation('/profile/listings')} className="text-left px-5 py-2.5 text-[15px] font-medium text-[#1F2533] hover:text-[#F84464] hover:bg-[#1F2533]/5 transition-colors">My Listings</button>
                                        <button onClick={() => handleNavigation('/profile/sales')} className="text-left px-5 py-2.5 text-[15px] font-medium text-[#1F2533] hover:text-[#F84464] hover:bg-[#1F2533]/5 transition-colors">My Sales</button>
                                        <button onClick={() => handleNavigation('/profile/payments')} className="text-left px-5 py-2.5 text-[15px] font-medium text-[#1F2533] hover:text-[#F84464] hover:bg-[#1F2533]/5 transition-colors">Payments</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => activeDropdown === 'profile' ? setActiveDropdown(null) : setActiveDropdown('profile')} 
                                className={`transition-colors ${activeDropdown === 'profile' ? 'text-[#F84464]' : 'hover:text-[#F84464]'}`}
                            >
                                Profile
                            </button>
                            <AnimatePresence>
                                {activeDropdown === 'profile' && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-[calc(100%+12px)] right-0 w-48 bg-[#F5F5F5] rounded-[12px] shadow-[0_4px_20px_rgba(31,37,51,0.15)] border border-[#1F2533]/10 py-3 z-[100] flex flex-col">
                                        <button onClick={() => handleNavigation('/profile')} className="text-left px-5 py-2.5 text-[15px] font-medium text-[#1F2533] hover:text-[#F84464] hover:bg-[#1F2533]/5 transition-colors">My Hub</button>
                                        <button onClick={() => handleNavigation('/profile/settings')} className="text-left px-5 py-2.5 text-[15px] font-medium text-[#1F2533] hover:text-[#F84464] hover:bg-[#1F2533]/5 transition-colors">Settings</button>
                                        <button onClick={() => { setActiveDropdown(null); navigate('/login'); }} className="text-left px-5 py-2.5 text-[15px] font-medium text-[#1F2533] hover:text-[#F84464] hover:bg-[#1F2533]/5 transition-colors">Sign out</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Avatars */}
                        <div className="flex items-center gap-3 pl-2">
                            <div onClick={() => isAuthenticated ? handleNavigation('/profile') : navigate('/login')} className="w-10 h-10 rounded-full bg-[#F5F5F5] border border-[#1F2533]/20 flex items-center justify-center cursor-pointer hover:border-[#F84464] hover:text-[#F84464] transition-colors text-[#1F2533]">
                                <User size={18} className="fill-current" />
                            </div>
                            <div className="relative">
                                <div onClick={() => activeDropdown === 'notifications' ? setActiveDropdown(null) : setActiveDropdown('notifications')} className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors border ${activeDropdown === 'notifications' ? 'border-[#F84464] text-[#F84464] bg-[#1F2533]/5' : 'border-[#1F2533]/20 text-[#1F2533] hover:border-[#F84464] hover:text-[#F84464]'}`}>
                                    <Bell size={18} />
                                </div>
                                <AnimatePresence>
                                    {activeDropdown === 'notifications' && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-[calc(100%+12px)] right-0 w-80 bg-[#F5F5F5] rounded-[12px] shadow-[0_4px_20px_rgba(31,37,51,0.15)] border border-[#1F2533]/10 flex flex-col z-[100] overflow-hidden cursor-default">
                                            <div className="px-5 py-4 border-b border-[#1F2533]/10 font-bold text-[18px] text-[#1F2533]">Notifications</div>
                                            <div className="py-16 flex flex-col items-center justify-center text-[#1F2533]/50 gap-3">
                                                <Bell size={36} className="text-[#1F2533]/30" />
                                                <span className="text-[16px] font-medium text-[#1F2533]/70">No notifications</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. MOBILE HEADER (Compact View) */}
                <div className="lg:hidden w-full px-4 py-3 flex items-center justify-between">
                    <button onClick={() => setMobileMenuOpen(true)} className="focus:outline-none p-2 -ml-2 text-[#1F2533]">
                        <Menu size={26} strokeWidth={2} />
                    </button>
                    
                    <div onClick={() => navigate('/')} className="cursor-pointer">
                        <BooknshowLogo className="h-[28px]" />
                    </div>
                    
                    <div className="w-10 flex justify-end">
                        <div onClick={() => isAuthenticated ? navigate('/profile') : navigate('/login')} className="w-9 h-9 rounded-full bg-[#F5F5F5] border border-[#1F2533]/20 flex items-center justify-center cursor-pointer text-[#1F2533]">
                            <User size={18} className="fill-current" />
                        </div>
                    </div>
                </div>

                {/* MOBILE SEARCH BAR */}
                {!isProfilePage && !isExplorePage && (
                    <div className="lg:hidden w-full px-4 pb-4">
                        <div className="relative flex items-center bg-[#F5F5F5] border border-[#1F2533]/20 rounded-[8px] px-4 py-2 w-full focus-within:border-[#F84464] focus-within:shadow-[0_0_0_1px_#F84464]">
                            <Search size={18} className="text-[#1F2533] mr-2 font-bold" strokeWidth={2.5} />
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleStrictSearchSubmit}
                                onFocus={() => setSearchExpanded(true)}
                                onBlur={() => setTimeout(() => setSearchExpanded(false), 200)}
                                placeholder="Search events..." 
                                className="bg-transparent outline-none flex-1 text-[15px] font-medium text-[#1F2533] placeholder-[#1F2533]/50"
                            />
                            {isSearchExpanded && <SearchDropdown />}
                        </div>
                    </div>
                )}
            </header>

            {/* 4. MOBILE DRAWER OVERLAY */}
            <div className={`lg:hidden fixed inset-0 z-[999] ${mobileMenuOpen ? 'visible' : 'invisible pointer-events-none'}`}>
                <div 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`absolute inset-0 bg-[#1F2533]/80 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                />

                <div className={`absolute top-0 left-0 bottom-0 w-[85%] max-w-[340px] bg-[#F5F5F5] flex flex-col shadow-[20px_0_60px_rgba(31,37,51,0.3)] transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    
                    <div className="flex items-center justify-between px-6 py-5 border-b border-[#1F2533]/10 shrink-0 min-h-[70px] bg-[#F5F5F5]">
                        {menuView === 'main' ? (
                            <>
                                <BooknshowLogo className="h-[24px]" />
                                <button onClick={() => setMobileMenuOpen(false)} className="p-2 -mr-2 rounded-full hover:bg-[#1F2533]/5 transition-colors text-[#1F2533]">
                                    <X size={24} strokeWidth={2} />
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setMenuView('main')} className="flex items-center text-[#1F2533] font-black text-[18px] w-full">
                                <ChevronLeft size={24} className="mr-3 text-[#1F2533]/50" />
                                {menuView === 'sell' ? 'Sell on Booknshow' : 'My Tickets'}
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto w-full custom-scrollbar bg-[#F5F5F5]">
                        {menuView === 'main' && (
                            <ul className="flex flex-col w-full py-2">
                                {!isAuthenticated && (
                                    <li onClick={() => handleNavigation('/login')} className="px-6 py-[16px] text-[16px] text-[#1F2533] font-bold cursor-pointer hover:bg-[#1F2533]/5 hover:text-[#F84464] transition-colors">
                                        Sign In
                                    </li>
                                )}
                                <li onClick={() => setMenuView('sell')} className="px-6 py-[16px] text-[16px] text-[#1F2533] font-bold flex justify-between items-center cursor-pointer hover:bg-[#1F2533]/5 hover:text-[#F84464] transition-colors">
                                    Sell <ChevronRight size={20} className="text-[#1F2533]/30" />
                                </li>
                                <li onClick={() => handleNavigation('/profile/settings')} className="px-6 py-[16px] text-[16px] text-[#1F2533] font-bold cursor-pointer hover:bg-[#1F2533]/5 hover:text-[#F84464] transition-colors">
                                    Favorites
                                </li>
                                <li onClick={() => setMenuView('tickets')} className="px-6 py-[16px] text-[16px] text-[#1F2533] font-bold flex justify-between items-center cursor-pointer hover:bg-[#1F2533]/5 hover:text-[#F84464] transition-colors">
                                    My Tickets <ChevronRight size={20} className="text-[#1F2533]/30" />
                                </li>
                                <li onClick={() => { setMobileMenuOpen(false); navigate('/explore'); }} className="px-6 py-[16px] text-[16px] text-[#1F2533] font-bold cursor-pointer hover:bg-[#1F2533]/5 hover:text-[#F84464] transition-colors">
                                    Explore
                                </li>
                            </ul>
                        )}

                        {menuView === 'sell' && (
                            <ul className="flex flex-col w-full py-2">
                                <li onClick={() => window.location.href = 'https://parbet-seller-44902.web.app'} className="px-6 py-[16px] text-[16px] text-[#1F2533] font-bold cursor-pointer hover:bg-[#1F2533]/5 hover:text-[#F84464] transition-colors">
                                    Sell Tickets
                                </li>
                                <li onClick={() => handleNavigation('/profile/orders')} className="px-6 py-[16px] text-[16px] text-[#1F2533] font-bold cursor-pointer hover:bg-[#1F2533]/5 hover:text-[#F84464] transition-colors">
                                    My Tickets
                                </li>
                                <li onClick={() => handleNavigation('/profile/sales')} className="px-6 py-[16px] text-[16px] text-[#1F2533] font-bold cursor-pointer hover:bg-[#1F2533]/5 hover:text-[#F84464] transition-colors">
                                    My Sales
                                </li>
                            </ul>
                        )}

                        {menuView === 'tickets' && (
                            <ul className="flex flex-col w-full py-2">
                                <li onClick={() => handleNavigation('/profile/orders')} className="px-6 py-[16px] text-[16px] text-[#1F2533] font-bold cursor-pointer hover:bg-[#1F2533]/5 hover:text-[#F84464] transition-colors">
                                    Orders
                                </li>
                                <li onClick={() => handleNavigation('/profile/listings')} className="px-6 py-[16px] text-[16px] text-[#1F2533] font-bold cursor-pointer hover:bg-[#1F2533]/5 hover:text-[#F84464] transition-colors">
                                    My Listings
                                </li>
                                <li onClick={() => handleNavigation('/profile/sales')} className="px-6 py-[16px] text-[16px] text-[#1F2533] font-bold cursor-pointer hover:bg-[#1F2533]/5 hover:text-[#F84464] transition-colors">
                                    My Sales
                                </li>
                                <li onClick={() => handleNavigation('/profile/payments')} className="px-6 py-[16px] text-[16px] text-[#1F2533] font-bold cursor-pointer hover:bg-[#1F2533]/5 hover:text-[#F84464] transition-colors">
                                    Payments
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}