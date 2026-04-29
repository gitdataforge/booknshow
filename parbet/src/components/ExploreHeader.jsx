import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, User, Menu, MapPin, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useStore';
import { useMainStore } from '../store/useMainStore';
import SearchDropdown from './SearchDropdown';
import { BooknshowLogo } from './Header'; // Re-using the master SVG logo

/**
 * GLOBAL REBRAND: Booknshow Identity Application
 * Enforced Colors: Carnation (#F84464), Wild Sand (#F5F5F5), Ebony Clay (#1F2533)
 * * FEATURE 1: 1:1 Booknshow Enterprise Mega-Header Replication
 * FEATURE 2: Scroll-Responsive Physics (Shrinks and shadows on scroll)
 * FEATURE 3: Hardware-Accelerated Mobile Drawer (Framer Motion)
 * FEATURE 4: Dynamic Category Horizontal Slider with Active States
 * FEATURE 5: SVG Vector Logo Integration
 * FEATURE 6: Cross-Network Seller Bridge (Secure routing)
 * FEATURE 7: Real-Time Authentication Hydration (User Icon States)
 * FEATURE 8: Strict Keyword Enforcement Search Engine
 * FEATURE 9: Scroll-Lock Mobile Interaction Physics
 * FEATURE 10: Animated Search Expansion Sub-Module
 */

export default function ExploreHeader() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Global Stores
    const { 
        searchQuery, 
        setSearchQuery,
        isSearchExpanded,
        setSearchExpanded,
        exploreCategory,
        setExploreCategory
    } = useAppStore();
    
    const { isAuthenticated } = useMainStore();

    // UI States
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // FEATURE 2: Scroll-Responsive Physics
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // FEATURE 9: Scroll Lock logic for mobile drawer
    useEffect(() => {
        if (mobileMenuOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [mobileMenuOpen]);

    // FEATURE 8: Strict Search Submit
    const handleStrictSearchSubmit = (e) => {
        if (e.key === 'Enter') {
            const q = searchQuery.toLowerCase();
            const allowed = ['ipl', 'cricket', 'kabaddi', 'world cup'];
            const isValid = allowed.some(valid => q.includes(valid));
            
            if (!isValid && q.trim() !== '') setSearchQuery('IPL'); 
            
            if (location.pathname !== '/explore') navigate('/explore');
            setSearchExpanded(false);
            e.target.blur();
        }
    };

    const handleNavigation = (path) => {
        setMobileMenuOpen(false); 
        if (isAuthenticated) navigate(path);
        else navigate('/login');
    };

    const categories = ['Sports', 'Concerts', 'Theatre', 'Comedy', 'Festivals'];

    return (
        <header className={`w-full font-sans sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#F5F5F5] shadow-md border-b border-[#1F2533]/10' : 'bg-[#F5F5F5] border-b border-[#1F2533]/10'}`}>
            {/* Main Header Row */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
                
                {/* Mobile Menu & Logo */}
                <div className="flex items-center gap-4">
                    <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-[#1F2533] p-1 -ml-1">
                        <Menu size={26} strokeWidth={2} />
                    </button>
                    <div onClick={() => navigate('/')} className="cursor-pointer hover:opacity-80 transition-opacity">
                        <BooknshowLogo className="h-[28px] md:h-[36px]" />
                    </div>
                </div>

                {/* FEATURE 10: Central Search Bar (Responsive) */}
                <div className="hidden md:block flex-1 max-w-[700px] mx-8 relative">
                    <div className={`flex items-center w-full rounded-[8px] px-5 py-2.5 transition-all ${isScrolled ? 'bg-white border border-[#1F2533]/20 focus-within:border-[#F84464] focus-within:shadow-[0_0_0_1px_#F84464]' : 'bg-white border border-[#1F2533]/20 focus-within:border-[#F84464] focus-within:shadow-[0_0_0_1px_#F84464]'}`}>
                        <Search size={20} className="text-[#1F2533] mr-3 font-bold" strokeWidth={2.5} />
                        <input 
                            type="text" 
                            placeholder="Search by event, artist, or team..." 
                            className="w-full bg-transparent outline-none text-[15px] font-medium text-[#1F2533] placeholder-[#1F2533]/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleStrictSearchSubmit}
                            onFocus={() => setSearchExpanded(true)}
                            onBlur={() => setTimeout(() => setSearchExpanded(false), 200)}
                        />
                    </div>
                    <AnimatePresence>
                        {isSearchExpanded && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                <SearchDropdown />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-6">
                    <div className="hidden lg:flex items-center gap-2 text-[#1F2533] font-bold cursor-pointer hover:text-[#F84464] transition-colors text-[14px]">
                        <MapPin size={18} /> Pune
                    </div>
                    {/* FEATURE 6: Seller Bridge */}
                    <button onClick={() => window.location.href = 'https://parbet-seller-44902.web.app'} className="hidden md:block text-[#1F2533] font-bold hover:text-[#F84464] transition-colors text-[15px]">
                        Sell
                    </button>
                    {/* FEATURE 7: Auth Hydration */}
                    <div onClick={() => isAuthenticated ? navigate('/profile') : navigate('/login')} className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors bg-white border border-[#1F2533]/20 text-[#1F2533] hover:border-[#F84464] hover:text-[#F84464]`}>
                        <User size={18} className="fill-current" />
                    </div>
                </div>
            </div>

            {/* Mobile Search Row (Only visible if not scrolled) */}
            <AnimatePresence>
                {!isScrolled && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden w-full px-4 pb-4 overflow-hidden">
                        <div className="relative flex items-center bg-white border border-[#1F2533]/20 rounded-[8px] px-4 py-2.5 w-full focus-within:border-[#F84464] focus-within:shadow-[0_0_0_1px_#F84464]">
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
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FEATURE 4: Category Navigation Bar */}
            <div className={`w-full overflow-x-auto no-scrollbar border-t transition-colors duration-300 ${isScrolled ? 'border-[#1F2533]/10 bg-white' : 'border-[#1F2533]/10 bg-[#F5F5F5]'}`}>
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex items-center gap-8 py-3">
                    {categories.map((cat) => (
                        <button 
                            key={cat}
                            onClick={() => { setExploreCategory(cat); if(location.pathname !== '/explore') navigate('/explore'); }}
                            className={`whitespace-nowrap text-[14px] font-bold transition-all relative ${
                                exploreCategory === cat 
                                ? 'text-[#F84464]' 
                                : 'text-[#1F2533] hover:text-[#F84464]'
                            }`}
                        >
                            {cat}
                            {exploreCategory === cat && (
                                <motion.div layoutId="activeCategory" className="absolute -bottom-[13px] left-0 w-full h-[3px] bg-[#F84464]"></motion.div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* FEATURE 3: Hardware-Accelerated Mobile Drawer */}
            <div className={`lg:hidden fixed inset-0 z-[999] ${mobileMenuOpen ? 'visible' : 'invisible pointer-events-none'}`}>
                <div onClick={() => setMobileMenuOpen(false)} className={`absolute inset-0 bg-[#1F2533]/80 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} />
                <div className={`absolute top-0 left-0 bottom-0 w-[85%] max-w-[340px] bg-[#F5F5F5] flex flex-col shadow-[20px_0_60px_rgba(31,37,51,0.3)] transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex items-center justify-between px-6 py-5 border-b border-[#1F2533]/10 bg-white shrink-0 min-h-[70px]">
                        <BooknshowLogo className="h-[24px]" />
                        <button onClick={() => setMobileMenuOpen(false)} className="p-2 -mr-2 text-[#1F2533] hover:bg-[#1F2533]/5 rounded-full transition-colors"><X size={24} strokeWidth={2} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto w-full custom-scrollbar bg-[#F5F5F5]">
                        <ul className="flex flex-col w-full py-2">
                            {!isAuthenticated && (
                                <li onClick={() => handleNavigation('/login')} className="px-6 py-[16px] text-[16px] text-[#1F2533] font-bold cursor-pointer hover:bg-white hover:text-[#F84464] transition-colors">
                                    Sign In
                                </li>
                            )}
                            <li onClick={() => { setMobileMenuOpen(false); navigate('/profile'); }} className="px-6 py-[16px] text-[16px] text-[#1F2533] font-bold flex justify-between items-center cursor-pointer hover:bg-white hover:text-[#F84464] transition-colors">
                                My Profile <ChevronRight size={20} className="text-[#1F2533]/30" />
                            </li>
                            <li onClick={() => { setMobileMenuOpen(false); window.location.href = 'https://parbet-seller-44902.web.app'; }} className="px-6 py-[16px] text-[16px] text-[#1F2533] font-bold flex justify-between items-center cursor-pointer hover:bg-white hover:text-[#F84464] transition-colors">
                                Sell Tickets <ChevronRight size={20} className="text-[#1F2533]/30" />
                            </li>
                            <li onClick={() => handleNavigation('/profile/orders')} className="px-6 py-[16px] text-[16px] text-[#1F2533] font-bold cursor-pointer hover:bg-white hover:text-[#F84464] transition-colors">
                                My Tickets
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
}