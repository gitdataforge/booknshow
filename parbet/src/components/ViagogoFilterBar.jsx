import React from 'react';
import { MapPin, Calendar, ChevronDown, Navigation as NavigationIcon } from 'lucide-react';
import { useAppStore } from '../store/useStore';
import LocationDropdown from './LocationDropdown';

export default function ViagogoFilterBar() {
    const { 
        userCity, 
        searchQuery, 
        setSearchQuery,
        isLocationDropdownOpen,
        setLocationDropdownOpen
    } = useAppStore();

    // Exact 1:1 Replica Styling Classes for Mobile Chips
    const activeClass = "bg-[#eff4eb] border-[#114C2A] text-[#114C2A]";
    const inactiveClass = "bg-white border-[#cccccc] text-[#333] hover:bg-gray-50";

    return (
        <div className="flex items-center w-full px-4 overflow-visible relative z-20 font-sans">
            
            {/* Desktop-Only Location & Date Controls (Hidden on Mobile to perfectly match image_db9a7e.png) */}
            <div className="hidden md:flex items-center space-x-3 mr-4">
                {/* Navigation Pointer Icon */}
                <div className="w-[38px] h-[38px] rounded-[8px] bg-[#114C2A] flex items-center justify-center flex-shrink-0 cursor-pointer shadow-sm hover:bg-[#0c361d] transition-colors">
                    <NavigationIcon size={16} className="text-white fill-white -rotate-45" />
                </div>
                
                {/* Active Location Dropdown Pill */}
                <div className="relative shrink-0">
                    <button 
                        onClick={() => setLocationDropdownOpen(!isLocationDropdownOpen)} 
                        className="bg-white border border-[#cccccc] text-[#333] px-4 py-2 h-[38px] rounded-[8px] text-[14px] font-medium flex items-center justify-center whitespace-nowrap shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        <MapPin size={16} className="mr-2 text-[#333]"/> 
                        {userCity !== 'Loading...' ? userCity : 'Detecting...'} 
                        <ChevronDown size={16} className={`ml-2 transition-transform text-[#333] ${isLocationDropdownOpen ? 'rotate-180' : ''}`}/>
                    </button>
                    <LocationDropdown />
                </div>

                {/* Date Selection Pill */}
                <button className="bg-white border border-[#cccccc] text-[#333] px-4 py-2 h-[38px] rounded-[8px] text-[14px] font-medium flex items-center justify-center whitespace-nowrap hover:bg-gray-50 transition-colors shadow-sm shrink-0">
                    <Calendar size={16} className="mr-2 text-[#333]"/> 
                    All dates 
                    <ChevronDown size={16} className="ml-2 text-[#333]"/>
                </button>

                {/* Vertical Divider */}
                <div className="w-px h-6 bg-gray-300 mx-1 shrink-0"></div>
            </div>

            {/* Mobile & Desktop Scrollable Filter Chips (1:1 Replica) */}
            {/* Note: -mx-4 px-4 enables full-bleed scrolling on mobile edges */}
            <div className="flex items-center space-x-2.5 overflow-x-auto hide-scrollbar w-full pb-1 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
                <button 
                    onClick={() => setSearchQuery('')} 
                    className={`px-5 py-2 rounded-[8px] text-[14px] font-medium shrink-0 transition-all border shadow-sm md:shadow-none ${!searchQuery ? activeClass : inactiveClass}`}
                >
                    All types
                </button>
                <button 
                    onClick={() => setSearchQuery('Cricket')} 
                    className={`px-5 py-2 rounded-[8px] text-[14px] font-medium shrink-0 transition-all border shadow-sm md:shadow-none ${searchQuery === 'Cricket' ? activeClass : inactiveClass}`}
                >
                    Cricket
                </button>
                <button 
                    onClick={() => setSearchQuery('Kabaddi')} 
                    className={`px-5 py-2 rounded-[8px] text-[14px] font-medium shrink-0 transition-all border shadow-sm md:shadow-none ${searchQuery === 'Kabaddi' ? activeClass : inactiveClass}`}
                >
                    Kabaddi
                </button>
                <button 
                    onClick={() => setSearchQuery('Tournaments')} 
                    className={`px-5 py-2 rounded-[8px] text-[14px] font-medium shrink-0 transition-all border shadow-sm md:shadow-none ${searchQuery === 'Tournaments' ? activeClass : inactiveClass}`}
                >
                    Tournaments
                </button>
            </div>
        </div>
    );
}