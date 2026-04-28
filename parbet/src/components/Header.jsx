import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, User, X, Menu, ChevronRight, ChevronLeft, Bell, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useStore';
import SearchDropdown from './SearchDropdown';

/**
 * FEATURE 1: 1:1 Viagogo Enterprise Desktop Layout Replication
 * FEATURE 2: Strict Keyword Enforcement Engine (Locks queries to IPL, Cricket, Kabaddi, World Cup)
 * FEATURE 3: Dynamic Auto-Correction
 * FEATURE 4: Isolated Profile Routing
 * FEATURE 5: Hardware-Accelerated Mobile Drawer
 * FEATURE 6: Cross-Network Seller Bridge (Secure routing to parbet-seller)
 * FEATURE 7: Viagogo Exact Dropdown Architecture (Profile, My Tickets, Notifications)
 * FEATURE 8: Top Black Disclaimer Banner (1:1 styling)
 */

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation(); 
    const { 
        isAuthenticated, 
        searchQuery, 
        setSearchQuery,
        isSearchExpanded,
        setSearchExpanded,
        setExploreCategory
    } = useAppStore();

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
            <header className="w-full bg-white font-sans sticky top-0 z-50 border-b border-gray-200">
                
                {/* 1. TOP BLACK DISCLAIMER BANNER (1:1 Viagogo Replica) */}
                {!isProfilePage && !isExplorePage && (
                    <div className="w-full bg-black py-1.5 text-center px-4">
                        <p className="text-[13px] text-white font-medium tracking-wide">
                            We're the world's largest marketplace for buying and reselling tickets. Resale ticket prices may be above or below face value.
                        </p>
                    </div>
                )}

                {/* 2. MAIN DESKTOP HEADER (1:1 Viagogo Layout) */}
                <div className="hidden lg:flex max-w-[1400px] w-full mx-auto px-6 py-4 items-center justify-between">
                    
                    {/* Left Section: Logo + Category Links */}
                    <div className="flex items-center gap-8 shrink-0">
                        <h1 onClick={() => navigate('/')} className="text-[32px] font-black tracking-tighter text-[#1a1a1a] cursor-pointer hover:text-[#8cc63f] transition-colors leading-none">
                            parbet
                        </h1>
                        <nav className="flex items-center gap-6 text-[15px] text-[#1a1a1a]">
                            <button onClick={() => { setExploreCategory('Sports'); navigate('/explore'); }} className="hover:underline underline-offset-4 decoration-2">Sports</button>
                            <button onClick={() => { setExploreCategory('Concerts'); navigate('/explore'); }} className="hover:underline underline-offset-4 decoration-2">Concerts</button>
                            <button onClick={() => { setExploreCategory('Theatre'); navigate('/explore'); }} className="hover:underline underline-offset-4 decoration-2">Theatre</button>
                            <button onClick={() => { setExploreCategory('Top Cities'); navigate('/explore'); }} className="hover:underline underline-offset-4 decoration-2">Top Cities</button>
                        </nav>
                    </div>

                    {/* Center Section: Search Bar */}
                    <div className="flex-1 max-w-[600px] mx-8 relative">
                        <div className="flex items-center w-full border border-gray-300 rounded-full px-5 py-2.5 bg-white transition-all hover:border-[#1a1a1a] focus-within:border-[#1a1a1a] focus-within:shadow-[0_0_0_1px_#1a1a1a]">
                            <Search size={22} className="text-[#3B7A1A] mr-3 font-bold" strokeWidth={2.5} />
                            <input 
                                type="text" 
                                placeholder="Search events, artists, teams and more" 
                                className="w-full outline-none text-[15px] font-medium text-[#1a1a1a] placeholder-gray-500"
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
                    <div className="flex items-center gap-6 text-[15px] text-[#1a1a1a] shrink-0" ref={dropdownRef}>
                        <button onClick={() => navigate('/explore')} className="hover:underline underline-offset-4 decoration-2">Explore</button>
                        <button onClick={() => window.location.href = 'https://parbet-seller-44902.web.app'} className="hover:underline underline-offset-4 decoration-2">Sell</button>
                        <button onClick={() => handleNavigation('/profile/settings')} className="hover:underline underline-offset-4 decoration-2">Favourites</button>
                        
                        {/* My Tickets Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => activeDropdown === 'tickets' ? setActiveDropdown(null) : setActiveDropdown('tickets')} 
                                className="hover:underline underline-offset-4 decoration-2 flex items-center gap-1"
                            >
                                My Tickets
                            </button>
                            {activeDropdown === 'tickets' && (
                                <div className="absolute top-[calc(100%+12px)] right-0 w-48 bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 py-3 z-[100] flex flex-col">
                                    <button onClick={() => handleNavigation('/profile/orders')} className="text-left px-5 py-2.5 text-[15px] hover:text-[#427A1A] transition-colors">Orders</button>
                                    <button onClick={() => handleNavigation('/profile/listings')} className="text-left px-5 py-2.5 text-[15px] hover:text-[#427A1A] transition-colors">My Listings</button>
                                    <button onClick={() => handleNavigation('/profile/sales')} className="text-left px-5 py-2.5 text-[15px] hover:text-[#427A1A] transition-colors">My Sales</button>
                                    <button onClick={() => handleNavigation('/profile/payments')} className="text-left px-5 py-2.5 text-[15px] hover:text-[#427A1A] transition-colors">Payments</button>
                                </div>
                            )}
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => activeDropdown === 'profile' ? setActiveDropdown(null) : setActiveDropdown('profile')} 
                                className="hover:underline underline-offset-4 decoration-2"
                            >
                                Profile
                            </button>
                            {activeDropdown === 'profile' && (
                                <div className="absolute top-[calc(100%+12px)] right-0 w-48 bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 py-3 z-[100] flex flex-col">
                                    <button onClick={() => handleNavigation('/profile')} className="text-left px-5 py-2.5 text-[15px] hover:text-[#427A1A] transition-colors">My Hub</button>
                                    <button onClick={() => handleNavigation('/profile/settings')} className="text-left px-5 py-2.5 text-[15px] hover:text-[#427A1A] transition-colors">Settings</button>
                                    <button onClick={() => { setActiveDropdown(null); navigate('/login'); }} className="text-left px-5 py-2.5 text-[15px] hover:text-[#427A1A] transition-colors">Sign out</button>
                                </div>
                            )}
                        </div>

                        {/* Avatars */}
                        <div className="flex items-center gap-3 pl-2">
                            <div onClick={() => isAuthenticated ? handleNavigation('/profile') : navigate('/login')} className="w-10 h-10 rounded-full bg-[#f2f4f7] flex items-center justify-center cursor-pointer hover:bg-[#e4e6eb] transition-colors">
                                <User size={18} className="text-[#1a1a1a] fill-current" />
                            </div>
                            <div className="relative">
                                <div onClick={() => activeDropdown === 'notifications' ? setActiveDropdown(null) : setActiveDropdown('notifications')} className="w-10 h-10 rounded-full bg-[#f2f4f7] flex items-center justify-center cursor-pointer hover:bg-[#e4e6eb] transition-colors">
                                    <Bell size={18} className="text-[#1a1a1a]" />
                                </div>
                                {activeDropdown === 'notifications' && (
                                    <div className="absolute top-[calc(100%+12px)] right-0 w-80 bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col z-[100] overflow-hidden cursor-default">
                                        <div className="px-5 py-4 border-b border-gray-100 font-bold text-[18px] text-[#1a1a1a]">Notifications</div>
                                        <div className="py-16 flex flex-col items-center justify-center text-gray-500 gap-3">
                                            <Bell size={36} className="text-gray-400" />
                                            <span className="text-[16px] font-medium text-[#54626c]">No notifications</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. MOBILE HEADER (Compact View) */}
                <div className="lg:hidden w-full px-4 py-3 flex items-center justify-between">
                    <button onClick={() => setMobileMenuOpen(true)} className="focus:outline-none p-2 -ml-2">
                        <Menu size={26} className="text-[#1a1a1a]" strokeWidth={2} />
                    </button>
                    
                    <h1 onClick={() => navigate('/')} className="text-[26px] font-black tracking-tighter text-[#1a1a1a] cursor-pointer">
                        parbet
                    </h1>
                    
                    <div className="w-10 flex justify-end">
                        <div onClick={() => isAuthenticated ? navigate('/profile') : navigate('/login')} className="w-9 h-9 rounded-full bg-[#f2f4f7] flex items-center justify-center cursor-pointer">
                            <User size={18} className="text-[#1a1a1a] fill-current" />
                        </div>
                    </div>
                </div>

                {/* MOBILE SEARCH BAR */}
                {!isProfilePage && !isExplorePage && (
                    <div className="lg:hidden w-full px-4 pb-4">
                        <div className="relative flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 w-full focus-within:border-[#1a1a1a] focus-within:shadow-[0_0_0_1px_#1a1a1a]">
                            <Search size={18} className="text-[#3B7A1A] mr-2" strokeWidth={2.5} />
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleStrictSearchSubmit}
                                onFocus={() => setSearchExpanded(true)}
                                onBlur={() => setTimeout(() => setSearchExpanded(false), 200)}
                                placeholder="Search events..." 
                                className="bg-transparent outline-none flex-1 text-[15px] font-medium text-[#1a1a1a]"
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
                    className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                />

                <div className={`absolute top-0 left-0 bottom-0 w-[85%] max-w-[340px] bg-white flex flex-col shadow-[20px_0_60px_rgba(0,0,0,0.3)] transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 shrink-0 min-h-[70px]">
                        {menuView === 'main' ? (
                            <>
                                <h2 className="text-[26px] font-black tracking-tighter text-[#1a1a1a]">parbet</h2>
                                <button onClick={() => setMobileMenuOpen(false)} className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors">
                                    <X size={24} className="text-gray-500" strokeWidth={2} />
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setMenuView('main')} className="flex items-center text-[#1a1a1a] font-black text-[18px] w-full">
                                <ChevronLeft size={24} className="mr-3 text-gray-500" />
                                {menuView === 'sell' ? 'Sell on Parbet' : 'My Tickets'}
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto w-full custom-scrollbar bg-white">
                        {menuView === 'main' && (
                            <ul className="flex flex-col w-full py-2">
                                {!isAuthenticated && (
                                    <li onClick={() => handleNavigation('/login')} className="px-6 py-[16px] text-[16px] text-[#1a1a1a] font-bold cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors">
                                        Sign In
                                    </li>
                                )}
                                <li onClick={() => setMenuView('sell')} className="px-6 py-[16px] text-[16px] text-[#1a1a1a] font-bold flex justify-between items-center cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors">
                                    Sell <ChevronRight size={20} className="text-gray-400" />
                                </li>
                                <li onClick={() => handleNavigation('/profile/settings')} className="px-6 py-[16px] text-[16px] text-[#1a1a1a] font-bold cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors">
                                    Favorites
                                </li>
                                <li onClick={() => setMenuView('tickets')} className="px-6 py-[16px] text-[16px] text-[#1a1a1a] font-bold flex justify-between items-center cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors">
                                    My Tickets <ChevronRight size={20} className="text-gray-400" />
                                </li>
                                <li onClick={() => { setMobileMenuOpen(false); navigate('/explore'); }} className="px-6 py-[16px] text-[16px] text-[#1a1a1a] font-bold cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors">
                                    Explore
                                </li>
                            </ul>
                        )}

                        {menuView === 'sell' && (
                            <ul className="flex flex-col w-full py-2">
                                <li onClick={() => window.location.href = 'https://parbet-seller-44902.web.app'} className="px-6 py-[16px] text-[16px] text-[#1a1a1a] font-bold cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors">
                                    Sell Tickets
                                </li>
                                <li onClick={() => handleNavigation('/profile/orders')} className="px-6 py-[16px] text-[16px] text-[#1a1a1a] font-bold cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors">
                                    My Tickets
                                </li>
                                <li onClick={() => handleNavigation('/profile/sales')} className="px-6 py-[16px] text-[16px] text-[#1a1a1a] font-bold cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors">
                                    My Sales
                                </li>
                            </ul>
                        )}

                        {menuView === 'tickets' && (
                            <ul className="flex flex-col w-full py-2">
                                <li onClick={() => handleNavigation('/profile/orders')} className="px-6 py-[16px] text-[16px] text-[#1a1a1a] font-bold cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors">
                                    Orders
                                </li>
                                <li onClick={() => handleNavigation('/profile/listings')} className="px-6 py-[16px] text-[16px] text-[#1a1a1a] font-bold cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors">
                                    My Listings
                                </li>
                                <li onClick={() => handleNavigation('/profile/sales')} className="px-6 py-[16px] text-[16px] text-[#1a1a1a] font-bold cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors">
                                    My Sales
                                </li>
                                <li onClick={() => handleNavigation('/profile/payments')} className="px-6 py-[16px] text-[16px] text-[#1a1a1a] font-bold cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors">
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