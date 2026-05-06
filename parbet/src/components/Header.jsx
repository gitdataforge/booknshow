import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, User, X, Menu, ChevronRight, ChevronLeft, Bell, MapPin, MessageSquare, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useStore';
import { useMainStore } from '../store/useMainStore';
import SearchDropdown from './SearchDropdown';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * GLOBAL REBRAND: Booknshow Identity Application
 * Enforced Colors: #FFFFFF, #E7364D, #333333, #EB5B6E, #FAD8DC, #A3A3A3, #626262
 * FEATURE 1: 1:1 Enterprise Desktop Layout Replication
 * FEATURE 2: Strict Keyword Enforcement Engine
 * FEATURE 3: Dynamic Auto-Correction & Route-Aware UI Isolation
 * FEATURE 4: Hardware-Accelerated Mobile Drawer with Nested Navigation
 * FEATURE 5: SVG Vector Re-creation of Uploaded Logo (Red/White)
 * FEATURE 6: Intelligent Click-Outside Dropdown Architecture
 * FEATURE 7: Real-Time Authentication Hydration
 * FEATURE 8: Top Disclaimer Banner (#333333 Variant)
 * FEATURE 9: Strict 7-Color DOM Palette Enforcement
 * FEATURE 10: Scroll-Lock Mobile Interaction Physics
 * FEATURE 11: Real-Time Support Notifications Engine
 */

export const BooknshowLogo = ({ className = "h-8" }) => (
    <svg viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="10" y="70" fontFamily="Inter, sans-serif" fontSize="64" fontWeight="800" fill="#333333" letterSpacing="-2">book</text>
        <g transform="translate(170, 10) rotate(-12)">
            <path d="M0,0 L16,10 L32,0 L48,10 L64,0 L80,10 L80,95 L60,95 A20,20 0 0,0 20,95 L0,95 Z" fill="#E7364D" />
            <text x="21" y="72" fontFamily="Inter, sans-serif" fontSize="60" fontWeight="900" fill="#FFFFFF">n</text>
        </g>
        <text x="250" y="70" fontFamily="Inter, sans-serif" fontSize="64" fontWeight="800" fill="#333333" letterSpacing="-2">show</text>
    </svg>
);

const formatNotificationTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    if (isNaN(d)) return 'Just now';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

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
    
    const { isAuthenticated, user } = useMainStore();

    // UI ISOLATION LOGIC
    const isProfilePage = location.pathname.startsWith('/profile');
    const isExplorePage = location.pathname === '/explore';

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [menuView, setMenuView] = useState('main'); 
    
    // Dropdown States for 1:1 UI
    const [activeDropdown, setActiveDropdown] = useState(null);
    const dropdownRef = useRef(null);

    // FEATURE 11: Real-Time Notifications State
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'parbet-44902';

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

    // FEATURE 11: Notification Listener
    useEffect(() => {
        if (!isAuthenticated || !user?.uid) return;

        const notificationsRef = collection(db, 'artifacts', appId, 'notifications');
        const q = query(
            notificationsRef, 
            where('userId', '==', user.uid),
            orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = [];
            let unread = 0;
            snapshot.forEach((doc) => {
                const data = { id: doc.id, ...doc.data() };
                fetched.push(data);
                if (!data.isRead) unread++;
            });
            setNotifications(fetched);
            setUnreadCount(unread);
        }, (error) => {
            console.error("Notification Sync Error:", error);
        });

        return () => unsubscribe();
    }, [isAuthenticated, user, appId]);

    const handleNavigation = (path) => {
        setMobileMenuOpen(false); 
        setActiveDropdown(null);
        if (isAuthenticated) navigate(path);
        else navigate('/login');
    };

    const handleNotificationClick = async (notif) => {
        // Mark as read in Firestore
        if (!notif.isRead) {
            try {
                const notifRef = doc(db, 'artifacts', appId, 'notifications', notif.id);
                await updateDoc(notifRef, { isRead: true });
            } catch (err) {
                console.error("Failed to mark notification as read:", err);
            }
        }
        
        // Navigate to tickets page and close dropdown
        setActiveDropdown(null);
        navigate('/profile/tickets');
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
            <header className="w-full bg-[#FFFFFF] font-sans sticky top-0 z-50 border-b border-[#A3A3A3]/30 shadow-sm">
                
                {/* 1. TOP DISCLAIMER BANNER */}
                {!isProfilePage && !isExplorePage && (
                    <div className="w-full bg-[#333333] py-1.5 text-center px-4">
                        <p className="text-[13px] text-[#FFFFFF] font-medium tracking-wide">
                            We're the world's largest marketplace for buying and reselling tickets. Resale ticket prices may be above or below face value.
                        </p>
                    </div>
                )}

                {/* 2. MAIN DESKTOP HEADER */}
                <div className="hidden lg:flex max-w-[1400px] w-full mx-auto px-6 py-4 items-center justify-between bg-[#FFFFFF]">
                    
                    {/* Left Section: Logo + Category Links */}
                    <div className="flex items-center gap-8 shrink-0">
                        <div onClick={() => navigate('/')} className="cursor-pointer hover:opacity-80 transition-opacity">
                            <BooknshowLogo className="h-[36px]" />
                        </div>
                        <nav className="flex items-center gap-6 text-[15px] font-bold text-[#333333]">
                            <button onClick={() => { setExploreCategory('Sports'); navigate('/explore'); }} className="hover:text-[#E7364D] transition-colors">Sports</button>
                            <button onClick={() => { setExploreCategory('Concerts'); navigate('/explore'); }} className="hover:text-[#E7364D] transition-colors">Concerts</button>
                            <button onClick={() => { setExploreCategory('Theatre'); navigate('/explore'); }} className="hover:text-[#E7364D] transition-colors">Theatre</button>
                            <button onClick={() => { setExploreCategory('Top Cities'); navigate('/explore'); }} className="hover:text-[#E7364D] transition-colors">Top Cities</button>
                        </nav>
                    </div>

                    {/* Center Section: Search Bar */}
                    <div className="flex-1 max-w-[600px] mx-8 relative">
                        <div className="flex items-center w-full border border-[#A3A3A3]/50 rounded-[8px] px-5 py-2.5 bg-[#FFFFFF] transition-all hover:border-[#626262] focus-within:border-[#E7364D] focus-within:shadow-[0_0_0_2px_#FAD8DC]">
                            <Search size={20} className="text-[#333333] mr-3 font-bold" strokeWidth={2.5} />
                            <input 
                                type="text" 
                                placeholder="Search events, artists, teams and more" 
                                className="w-full outline-none text-[15px] font-medium text-[#333333] placeholder-[#A3A3A3] bg-transparent"
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
                    <div className="flex items-center gap-6 text-[15px] font-bold text-[#333333] shrink-0" ref={dropdownRef}>
                        <button onClick={() => navigate('/explore')} className="hover:text-[#E7364D] transition-colors">Explore</button>
                        <button onClick={() => window.location.href = 'https://seller-booknshow.web.app'} className="hover:text-[#E7364D] transition-colors">Sell</button>
                        <button onClick={() => handleNavigation('/profile/settings')} className="hover:text-[#E7364D] transition-colors">Favourites</button>
                        
                        {/* My Tickets Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => activeDropdown === 'tickets' ? setActiveDropdown(null) : setActiveDropdown('tickets')} 
                                className={`flex items-center gap-1 transition-colors ${activeDropdown === 'tickets' ? 'text-[#E7364D]' : 'hover:text-[#E7364D]'}`}
                            >
                                My Tickets
                            </button>
                            <AnimatePresence>
                                {activeDropdown === 'tickets' && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-[calc(100%+12px)] right-0 w-48 bg-[#FFFFFF] rounded-[12px] shadow-[0_4px_20px_rgba(51,51,51,0.15)] border border-[#A3A3A3]/20 py-3 z-[100] flex flex-col">
                                        <button onClick={() => handleNavigation('/profile/orders')} className="text-left px-5 py-2.5 text-[15px] font-medium text-[#626262] hover:text-[#E7364D] hover:bg-[#FAD8DC]/30 transition-colors">Orders</button>
                                        <button onClick={() => handleNavigation('/profile/listings')} className="text-left px-5 py-2.5 text-[15px] font-medium text-[#626262] hover:text-[#E7364D] hover:bg-[#FAD8DC]/30 transition-colors">My Listings</button>
                                        <button onClick={() => handleNavigation('/profile/sales')} className="text-left px-5 py-2.5 text-[15px] font-medium text-[#626262] hover:text-[#E7364D] hover:bg-[#FAD8DC]/30 transition-colors">My Sales</button>
                                        <button onClick={() => handleNavigation('/profile/payments')} className="text-left px-5 py-2.5 text-[15px] font-medium text-[#626262] hover:text-[#E7364D] hover:bg-[#FAD8DC]/30 transition-colors">Payments</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => activeDropdown === 'profile' ? setActiveDropdown(null) : setActiveDropdown('profile')} 
                                className={`transition-colors ${activeDropdown === 'profile' ? 'text-[#E7364D]' : 'hover:text-[#E7364D]'}`}
                            >
                                Profile
                            </button>
                            <AnimatePresence>
                                {activeDropdown === 'profile' && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-[calc(100%+12px)] right-0 w-48 bg-[#FFFFFF] rounded-[12px] shadow-[0_4px_20px_rgba(51,51,51,0.15)] border border-[#A3A3A3]/20 py-3 z-[100] flex flex-col">
                                        <button onClick={() => handleNavigation('/profile')} className="text-left px-5 py-2.5 text-[15px] font-medium text-[#626262] hover:text-[#E7364D] hover:bg-[#FAD8DC]/30 transition-colors">My Hub</button>
                                        <button onClick={() => handleNavigation('/profile/settings')} className="text-left px-5 py-2.5 text-[15px] font-medium text-[#626262] hover:text-[#E7364D] hover:bg-[#FAD8DC]/30 transition-colors">Settings</button>
                                        <button onClick={() => { setActiveDropdown(null); navigate('/login'); }} className="text-left px-5 py-2.5 text-[15px] font-medium text-[#626262] hover:text-[#E7364D] hover:bg-[#FAD8DC]/30 transition-colors">Sign out</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Avatars */}
                        <div className="flex items-center gap-3 pl-2">
                            <div onClick={() => isAuthenticated ? handleNavigation('/profile') : navigate('/login')} className="w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#A3A3A3]/50 flex items-center justify-center cursor-pointer hover:border-[#E7364D] hover:text-[#E7364D] transition-colors text-[#333333]">
                                <User size={18} className="fill-current" />
                            </div>
                            
                            {/* FEATURE 11: Real-Time Notification Bell Dropdown */}
                            <div className="relative">
                                <div 
                                    onClick={() => isAuthenticated ? (activeDropdown === 'notifications' ? setActiveDropdown(null) : setActiveDropdown('notifications')) : navigate('/login')} 
                                    className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors border relative ${activeDropdown === 'notifications' ? 'border-[#E7364D] text-[#E7364D] bg-[#FAD8DC]/30' : 'border-[#A3A3A3]/50 text-[#333333] hover:border-[#E7364D] hover:text-[#E7364D]'}`}
                                >
                                    <Bell size={18} />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#E7364D] text-[9px] font-black text-[#FFFFFF] shadow-sm">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </div>
                                <AnimatePresence>
                                    {activeDropdown === 'notifications' && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-[calc(100%+12px)] right-0 w-[350px] bg-[#FFFFFF] rounded-[12px] shadow-[0_8px_30px_rgba(51,51,51,0.15)] border border-[#A3A3A3]/20 flex flex-col z-[100] overflow-hidden">
                                            <div className="px-5 py-4 border-b border-[#A3A3A3]/20 flex items-center justify-between bg-[#FAFAFA]">
                                                <span className="font-black text-[16px] text-[#333333]">Notifications</span>
                                                <span className="text-[12px] font-bold text-[#A3A3A3]">{unreadCount} unread</span>
                                            </div>
                                            <div className="flex flex-col max-h-[400px] overflow-y-auto custom-scrollbar">
                                                {notifications.length > 0 ? (
                                                    notifications.map(notif => (
                                                        <button 
                                                            key={notif.id}
                                                            onClick={() => handleNotificationClick(notif)}
                                                            className={`text-left px-5 py-4 border-b border-[#A3A3A3]/10 last:border-0 transition-colors hover:bg-[#FAFAFA] flex items-start gap-4 ${!notif.isRead ? 'bg-[#FAD8DC]/10' : ''}`}
                                                        >
                                                            <div className={`mt-1 rounded-full p-2 shrink-0 ${!notif.isRead ? 'bg-[#E7364D] text-[#FFFFFF]' : 'bg-[#F5F5F5] text-[#A3A3A3]'}`}>
                                                                <MessageSquare size={14} />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className={`text-[14px] leading-tight mb-1 ${!notif.isRead ? 'font-black text-[#333333]' : 'font-bold text-[#626262]'}`}>{notif.title}</p>
                                                                <p className={`text-[13px] leading-relaxed mb-2 ${!notif.isRead ? 'font-medium text-[#333333]' : 'font-medium text-[#A3A3A3]'}`}>{notif.message}</p>
                                                                <p className="text-[11px] font-bold text-[#A3A3A3] flex items-center"><Clock size={10} className="mr-1"/> {formatNotificationTime(notif.timestamp)}</p>
                                                            </div>
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="py-16 flex flex-col items-center justify-center text-[#626262] gap-3">
                                                        <Bell size={36} className="text-[#A3A3A3] opacity-50" />
                                                        <span className="text-[14px] font-bold text-[#A3A3A3]">You're all caught up!</span>
                                                    </div>
                                                )}
                                            </div>
                                            {notifications.length > 0 && (
                                                <button onClick={() => handleNavigation('/profile/tickets')} className="py-3 bg-[#F5F5F5] text-[13px] font-black text-[#E7364D] hover:bg-[#FAD8DC]/30 transition-colors border-t border-[#A3A3A3]/20">
                                                    View Support Dashboard
                                                </button>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. MOBILE HEADER (Compact View) */}
                <div className="lg:hidden w-full px-4 py-3 flex items-center justify-between bg-[#FFFFFF]">
                    <button onClick={() => setMobileMenuOpen(true)} className="focus:outline-none p-2 -ml-2 text-[#333333]">
                        <Menu size={26} strokeWidth={2} />
                    </button>
                    
                    <div onClick={() => navigate('/')} className="cursor-pointer">
                        <BooknshowLogo className="h-[28px]" />
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div onClick={() => isAuthenticated ? (activeDropdown === 'mobileNotifications' ? setActiveDropdown(null) : setActiveDropdown('mobileNotifications')) : navigate('/login')} className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer text-[#333333] border border-[#A3A3A3]/50">
                                <Bell size={18} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#E7364D] text-[9px] font-black text-[#FFFFFF] shadow-sm">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </div>
                            <AnimatePresence>
                                {activeDropdown === 'mobileNotifications' && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-[calc(100%+12px)] right-0 w-[300px] bg-[#FFFFFF] rounded-[12px] shadow-[0_8px_30px_rgba(51,51,51,0.15)] border border-[#A3A3A3]/20 flex flex-col z-[100] overflow-hidden">
                                        <div className="px-4 py-3 border-b border-[#A3A3A3]/20 bg-[#FAFAFA]"><span className="font-black text-[15px] text-[#333333]">Notifications</span></div>
                                        <div className="flex flex-col max-h-[300px] overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.map(notif => (
                                                    <button key={notif.id} onClick={() => handleNotificationClick(notif)} className={`text-left px-4 py-3 border-b border-[#A3A3A3]/10 flex gap-3 ${!notif.isRead ? 'bg-[#FAD8DC]/10' : ''}`}>
                                                        <MessageSquare size={14} className={`mt-1 ${!notif.isRead ? 'text-[#E7364D]' : 'text-[#A3A3A3]'}`} />
                                                        <div>
                                                            <p className={`text-[13px] leading-tight mb-1 ${!notif.isRead ? 'font-black text-[#333333]' : 'font-bold text-[#626262]'}`}>{notif.title}</p>
                                                            <p className="text-[10px] font-bold text-[#A3A3A3]"><Clock size={10} className="inline mr-1"/>{formatNotificationTime(notif.timestamp)}</p>
                                                        </div>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="py-10 text-center text-[#A3A3A3] text-[13px] font-bold">No notifications</div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div onClick={() => isAuthenticated ? navigate('/profile') : navigate('/login')} className="w-9 h-9 rounded-full bg-[#FFFFFF] border border-[#A3A3A3]/50 flex items-center justify-center cursor-pointer text-[#333333]">
                            <User size={18} className="fill-current" />
                        </div>
                    </div>
                </div>

                {/* MOBILE SEARCH BAR */}
                {!isProfilePage && !isExplorePage && (
                    <div className="lg:hidden w-full px-4 pb-4 bg-[#FFFFFF]">
                        <div className="relative flex items-center bg-[#FFFFFF] border border-[#A3A3A3]/50 rounded-[8px] px-4 py-2 w-full focus-within:border-[#E7364D] focus-within:shadow-[0_0_0_2px_#FAD8DC]">
                            <Search size={18} className="text-[#333333] mr-2 font-bold" strokeWidth={2.5} />
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleStrictSearchSubmit}
                                onFocus={() => setSearchExpanded(true)}
                                onBlur={() => setTimeout(() => setSearchExpanded(false), 200)}
                                placeholder="Search events..." 
                                className="bg-transparent outline-none flex-1 text-[15px] font-medium text-[#333333] placeholder-[#A3A3A3]"
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
                    className={`absolute inset-0 bg-[#333333]/80 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                />

                <div className={`absolute top-0 left-0 bottom-0 w-[85%] max-w-[340px] bg-[#FFFFFF] flex flex-col shadow-[20px_0_60px_rgba(51,51,51,0.3)] transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    
                    <div className="flex items-center justify-between px-6 py-5 border-b border-[#A3A3A3]/30 shrink-0 min-h-[70px] bg-[#FFFFFF]">
                        {menuView === 'main' ? (
                            <>
                                <BooknshowLogo className="h-[24px]" />
                                <button onClick={() => setMobileMenuOpen(false)} className="p-2 -mr-2 rounded-full hover:bg-[#FAD8DC]/50 transition-colors text-[#333333]">
                                    <X size={24} strokeWidth={2} />
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setMenuView('main')} className="flex items-center text-[#333333] font-black text-[18px] w-full">
                                <ChevronLeft size={24} className="mr-3 text-[#626262]" />
                                {menuView === 'sell' ? 'Sell on Booknshow' : 'My Tickets'}
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto w-full custom-scrollbar bg-[#FFFFFF]">
                        {menuView === 'main' && (
                            <ul className="flex flex-col w-full py-2">
                                {!isAuthenticated && (
                                    <li onClick={() => handleNavigation('/login')} className="px-6 py-[16px] text-[16px] text-[#333333] font-bold cursor-pointer hover:bg-[#FAD8DC]/20 hover:text-[#E7364D] transition-colors">
                                        Sign In
                                    </li>
                                )}
                                <li onClick={() => setMenuView('sell')} className="px-6 py-[16px] text-[16px] text-[#333333] font-bold flex justify-between items-center cursor-pointer hover:bg-[#FAD8DC]/20 hover:text-[#E7364D] transition-colors">
                                    Sell <ChevronRight size={20} className="text-[#A3A3A3]" />
                                </li>
                                <li onClick={() => handleNavigation('/profile/settings')} className="px-6 py-[16px] text-[16px] text-[#333333] font-bold cursor-pointer hover:bg-[#FAD8DC]/20 hover:text-[#E7364D] transition-colors">
                                    Favorites
                                </li>
                                <li onClick={() => setMenuView('tickets')} className="px-6 py-[16px] text-[16px] text-[#333333] font-bold flex justify-between items-center cursor-pointer hover:bg-[#FAD8DC]/20 hover:text-[#E7364D] transition-colors">
                                    My Tickets <ChevronRight size={20} className="text-[#A3A3A3]" />
                                </li>
                                <li onClick={() => { setMobileMenuOpen(false); navigate('/explore'); }} className="px-6 py-[16px] text-[16px] text-[#333333] font-bold cursor-pointer hover:bg-[#FAD8DC]/20 hover:text-[#E7364D] transition-colors">
                                    Explore
                                </li>
                            </ul>
                        )}

                        {menuView === 'sell' && (
                            <ul className="flex flex-col w-full py-2">
                                <li onClick={() => window.location.href = 'https://seller-booknshow.web.app'} className="px-6 py-[16px] text-[16px] text-[#333333] font-bold cursor-pointer hover:bg-[#FAD8DC]/20 hover:text-[#E7364D] transition-colors">
                                    Sell Tickets
                                </li>
                                <li onClick={() => handleNavigation('/profile/orders')} className="px-6 py-[16px] text-[16px] text-[#333333] font-bold cursor-pointer hover:bg-[#FAD8DC]/20 hover:text-[#E7364D] transition-colors">
                                    My Tickets
                                </li>
                                <li onClick={() => handleNavigation('/profile/sales')} className="px-6 py-[16px] text-[16px] text-[#333333] font-bold cursor-pointer hover:bg-[#FAD8DC]/20 hover:text-[#E7364D] transition-colors">
                                    My Sales
                                </li>
                            </ul>
                        )}

                        {menuView === 'tickets' && (
                            <ul className="flex flex-col w-full py-2">
                                <li onClick={() => handleNavigation('/profile/orders')} className="px-6 py-[16px] text-[16px] text-[#333333] font-bold cursor-pointer hover:bg-[#FAD8DC]/20 hover:text-[#E7364D] transition-colors">
                                    Orders
                                </li>
                                <li onClick={() => handleNavigation('/profile/listings')} className="px-6 py-[16px] text-[16px] text-[#333333] font-bold cursor-pointer hover:bg-[#FAD8DC]/20 hover:text-[#E7364D] transition-colors">
                                    My Listings
                                </li>
                                <li onClick={() => handleNavigation('/profile/sales')} className="px-6 py-[16px] text-[16px] text-[#333333] font-bold cursor-pointer hover:bg-[#FAD8DC]/20 hover:text-[#E7364D] transition-colors">
                                    My Sales
                                </li>
                                <li onClick={() => handleNavigation('/profile/payments')} className="px-6 py-[16px] text-[16px] text-[#333333] font-bold cursor-pointer hover:bg-[#FAD8DC]/20 hover:text-[#E7364D] transition-colors">
                                    Payments
                                </li>
                                {/* NEW: Route to the Support Tickets page from Mobile nested menu */}
                                <li onClick={() => handleNavigation('/profile/tickets')} className="px-6 py-[16px] text-[16px] text-[#333333] font-bold cursor-pointer hover:bg-[#FAD8DC]/20 hover:text-[#E7364D] transition-colors">
                                    Support History
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}