import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, X, Menu, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAppStore } from '../store/useStore';
import SearchDropdown from './SearchDropdown';
import NavHoverMenu from './NavHoverMenu';

// High-end Green User SVG Icon Component
const UserProfileIcon = ({ onClick, isAuthenticated }) => (
    <div 
        onClick={onClick}
        className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105 shadow-sm ${isAuthenticated ? 'bg-[#114C2A]' : 'bg-[#458731]'}`}
    >
        <User size={20} className="text-white fill-current" />
    </div>
);

export default function Header() {
    const navigate = useNavigate();
    const { 
        isAuthenticated, 
        searchQuery, 
        setSearchQuery,
        isSearchExpanded,
        setSearchExpanded,
        setExploreCategory
    } = useAppStore();

    // FIX: Track by unique 'name' instead of shared 'category' to prevent overlaps
    const [hoveredName, setHoveredName] = useState(null);
    
    // Mobile Drawer States
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [menuView, setMenuView] = useState('main'); // 'main', 'sell', 'tickets'

    // Reset nested view when drawer closes
    useEffect(() => {
        if (!mobileMenuOpen) {
            setTimeout(() => setMenuView('main'), 300);
        }
    }, [mobileMenuOpen]);

    /**
     * STRICT NAVIGATION GUARD
     * Redirects to standalone /login page for all unauthenticated requests.
     */
    const handleNavigation = (path) => {
        setMobileMenuOpen(false); 
        if (isAuthenticated) {
            navigate(path);
        } else {
            navigate('/login');
        }
    };

    // STRICT CONTENT REPLICATION: Cricket & Kabaddi Focus
    const topNavLinks = [
        { name: 'Cricket', category: 'Sports' },
        { name: 'Kabaddi', category: 'Sports' },
        { name: 'Tournaments', category: 'Sports' }, 
        { name: 'Top Cities', category: 'Top Cities' }
    ];

    return (
        <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 font-sans">
            {/* 1. TOP DISCLAIMER BANNER (Exact Replica) */}
            <div className="w-full bg-white py-2 border-b border-gray-100 text-center">
                <p className="text-[11px] md:text-[13px] text-gray-500 font-medium px-4 leading-tight">
                    We're the world's largest secondary marketplace for tickets to live events. Prices are set by sellers and may be below or above face value.
                </p>
            </div>

            {/* 2. MAIN LOGO & NAV ROW */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between relative z-50 bg-white">
                
                {/* MOBILE VIEW: Left Hamburger (Exact 3-line gray icon) */}
                <div className="lg:hidden w-10 flex justify-start">
                    <button onClick={() => setMobileMenuOpen(true)} className="focus:outline-none">
                        <Menu size={26} className="text-gray-600" strokeWidth={1.5} />
                    </button>
                </div>

                {/* DESKTOP VIEW: Left Aligned Logo & Links */}
                <div className="hidden lg:flex items-center space-x-8">
                    <h1 onClick={() => navigate('/')} className="text-[28px] font-black tracking-tighter text-[#1a1a1a] cursor-pointer hover:text-[#458731] transition-colors">
                        parbet
                    </h1>
                    <nav className="flex items-center space-x-6 text-[15px] font-medium text-[#1a1a1a] relative z-[200]">
                        {topNavLinks.map((link) => (
                            <div 
                                key={link.name}
                                className="relative py-3 cursor-pointer"
                                onMouseEnter={() => setHoveredName(link.name)}
                                onMouseLeave={() => setHoveredName(null)}
                            >
                                <button 
                                    onClick={() => { 
                                        if (link.category) {
                                            setExploreCategory(link.category); 
                                            navigate('/explore'); 
                                        }
                                    }} 
                                    className={`transition-colors pointer-events-none ${hoveredName === link.name ? 'text-[#458731]' : 'hover:text-[#458731]'}`}
                                >
                                    {link.name}
                                </button>
                                {link.category && (
                                    <NavHoverMenu 
                                        isOpen={hoveredName === link.name} 
                                        category={link.category}
                                        name={link.name}
                                        onMouseEnter={() => setHoveredName(link.name)}
                                        onMouseLeave={() => setHoveredName(null)}
                                    />
                                )}
                            </div>
                        ))}
                    </nav>
                </div>

                {/* MOBILE VIEW: Centered Logo */}
                <div className="lg:hidden flex-1 flex justify-center">
                    <h1 onClick={() => navigate('/')} className="text-[24px] font-black tracking-tighter text-[#1a1a1a] cursor-pointer">
                        parbet
                    </h1>
                </div>

                {/* RIGHT TOOLS (Desktop Utility or Mobile Profile) */}
                <div className="flex items-center space-x-4 md:space-x-6">
                    <nav className="hidden lg:flex items-center space-x-6 text-[15px] font-medium text-[#1a1a1a]">
                        <button onClick={() => navigate('/explore')} className="hover:text-[#458731] transition-colors">Explore</button>
                        <button onClick={() => handleNavigation('/sell')} className="hover:text-[#458731] transition-colors">Sell</button>
                        <button onClick={() => handleNavigation('/dashboard')} className="hover:text-[#458731] transition-colors">Favorites</button>
                        <button onClick={() => handleNavigation('/dashboard')} className="hover:text-[#458731] transition-colors whitespace-nowrap">My Tickets</button>
                        {!isAuthenticated && (
                            <button onClick={() => navigate('/login')} className="hover:text-[#458731] transition-colors whitespace-nowrap">Sign In</button>
                        )}
                    </nav>

                    {/* Profile Icon: Far Right */}
                    <div className="w-10 flex justify-end">
                        <UserProfileIcon 
                            isAuthenticated={isAuthenticated} 
                            onClick={() => isAuthenticated ? navigate('/dashboard') : navigate('/login')} 
                        />
                    </div>
                </div>
            </div>

            {/* 3. FLOATING SEARCH BAR (Pill Shape) */}
            <div className={`max-w-[850px] mx-auto px-4 pb-4 md:pb-8 relative z-40 w-full transition-opacity duration-200 ${mobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <div className={`relative flex items-center bg-white border rounded-full px-5 py-2.5 md:py-3.5 w-full transition-all duration-300 ${isSearchExpanded ? 'shadow-[0_10px_30px_rgba(0,0,0,0.12)] border-gray-300' : 'border-gray-200 shadow-sm focus-within:shadow-[0_8px_25px_rgba(0,0,0,0.08)] focus-within:border-[#458731]'}`}>
                    <Search size={18} className="text-gray-400 md:text-[#458731] mr-3 font-bold"/>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setSearchExpanded(true)}
                        onBlur={() => setTimeout(() => setSearchExpanded(false), 200)}
                        placeholder="Search events, artists, teams and more" 
                        className="bg-transparent outline-none flex-1 text-[14px] md:text-[16px] text-[#1a1a1a] placeholder-gray-500 font-medium"
                    />
                    <SearchDropdown />
                </div>
            </div>

            {/* =====================================================================
                4. MOBILE DRAWER OVERLAY (1:1 Native Sliding Nested Interaction)
                ===================================================================== */}
            <div className={`lg:hidden fixed inset-0 z-[100] ${mobileMenuOpen ? 'visible' : 'invisible pointer-events-none'}`}>
                
                {/* Dark Translucent Backdrop */}
                <div 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                />

                {/* Left Sliding White Panel */}
                <div className={`absolute top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    
                    {/* Drawer Header (Dynamic based on State) */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0 min-h-[60px]">
                        {menuView === 'main' ? (
                            <>
                                <h2 className="text-[24px] font-black tracking-tighter text-[#1a1a1a]">parbet</h2>
                                <button onClick={() => setMobileMenuOpen(false)} className="p-1">
                                    <X size={24} className="text-gray-500" strokeWidth={1.5} />
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setMenuView('main')} className="flex items-center text-[#1a1a1a] font-bold text-[16px] w-full">
                                <ChevronLeft size={20} className="mr-3 text-gray-600" />
                                {menuView === 'sell' ? 'Sell' : 'My Tickets'}
                            </button>
                        )}
                    </div>

                    {/* Drawer Content (Dynamic State Machine) */}
                    <div className="flex-1 overflow-y-auto w-full">
                        {/* STATE 1: Main View */}
                        {menuView === 'main' && (
                            <ul className="flex flex-col w-full">
                                {!isAuthenticated && (
                                    <li onClick={() => handleNavigation('/login')} className="px-5 py-[14px] border-b border-gray-100 text-[15px] text-[#54626c] font-medium cursor-pointer active:bg-gray-50">
                                        Sign In
                                    </li>
                                )}
                                <li onClick={() => setMenuView('sell')} className="px-5 py-[14px] border-b border-gray-100 text-[15px] text-[#54626c] font-medium flex justify-between items-center cursor-pointer active:bg-gray-50">
                                    Sell <ChevronRight size={18} className="text-gray-400" />
                                </li>
                                <li onClick={() => handleNavigation('/dashboard')} className="px-5 py-[14px] border-b border-gray-100 text-[15px] text-[#54626c] font-medium cursor-pointer active:bg-gray-50">
                                    Favorites
                                </li>
                                <li onClick={() => setMenuView('tickets')} className="px-5 py-[14px] border-b border-gray-100 text-[15px] text-[#54626c] font-medium flex justify-between items-center cursor-pointer active:bg-gray-50">
                                    My Tickets <ChevronRight size={18} className="text-gray-400" />
                                </li>
                                <li onClick={() => { setMobileMenuOpen(false); navigate('/explore'); }} className="px-5 py-[14px] border-b border-gray-100 text-[15px] text-[#54626c] font-medium cursor-pointer active:bg-gray-50">
                                    Explore
                                </li>
                            </ul>
                        )}

                        {/* STATE 2: Sell View */}
                        {menuView === 'sell' && (
                            <ul className="flex flex-col w-full">
                                <li onClick={() => handleNavigation('/sell')} className="px-5 py-[14px] border-b border-gray-100 text-[15px] text-[#54626c] font-medium cursor-pointer active:bg-gray-50">
                                    Sell Tickets
                                </li>
                                <li onClick={() => handleNavigation('/dashboard')} className="px-5 py-[14px] border-b border-gray-100 text-[15px] text-[#54626c] font-medium cursor-pointer active:bg-gray-50">
                                    My Tickets
                                </li>
                                <li onClick={() => handleNavigation('/dashboard')} className="px-5 py-[14px] border-b border-gray-100 text-[15px] text-[#54626c] font-medium cursor-pointer active:bg-gray-50">
                                    My Sales
                                </li>
                            </ul>
                        )}

                        {/* STATE 3: Tickets View */}
                        {menuView === 'tickets' && (
                            <ul className="flex flex-col w-full">
                                <li onClick={() => handleNavigation('/dashboard')} className="px-5 py-[14px] border-b border-gray-100 text-[15px] text-[#54626c] font-medium cursor-pointer active:bg-gray-50">
                                    Orders
                                </li>
                                <li onClick={() => handleNavigation('/dashboard')} className="px-5 py-[14px] border-b border-gray-100 text-[15px] text-[#54626c] font-medium cursor-pointer active:bg-gray-50">
                                    My Listings
                                </li>
                                <li onClick={() => handleNavigation('/dashboard')} className="px-5 py-[14px] border-b border-gray-100 text-[15px] text-[#54626c] font-medium cursor-pointer active:bg-gray-50">
                                    My Sales
                                </li>
                                <li onClick={() => handleNavigation('/dashboard')} className="px-5 py-[14px] border-b border-gray-100 text-[15px] text-[#54626c] font-medium cursor-pointer active:bg-gray-50">
                                    Payments
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}