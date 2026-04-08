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

    return (
        <div className="flex items-center space-x-2 md:space-x-3 mb-6 px-4 overflow-visible relative mt-4 z-20">
            {/* Navigation Pointer Icon (From Image 2) */}
            <div className="w-10 h-10 rounded-[10px] bg-[#458731] flex items-center justify-center flex-shrink-0 cursor-pointer shadow-sm hover:bg-[#366a26] transition-colors">
                <NavigationIcon size={18} className="text-white fill-white -rotate-45" />
            </div>
            
            {/* Active Location Dropdown Pill */}
            <div className="relative shrink-0">
                <button 
                    onClick={() => setLocationDropdownOpen(!isLocationDropdownOpen)} 
                    className="bg-[#eaf5e1] border border-[#458731] text-[#114C2A] px-4 py-2 h-10 rounded-[10px] text-sm font-bold flex items-center justify-center whitespace-nowrap shadow-sm hover:bg-[#dcf0cd] transition-colors"
                >
                    <MapPin size={16} className="mr-2 text-[#458731]"/> 
                    {userCity !== 'Loading...' ? userCity : 'Detecting...'} 
                    <ChevronDown size={16} className={`ml-2 transition-transform text-[#458731] ${isLocationDropdownOpen ? 'rotate-180' : ''}`}/>
                </button>
                <LocationDropdown />
            </div>

            {/* Date Selection Pill */}
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 h-10 rounded-[10px] text-sm font-bold flex items-center justify-center whitespace-nowrap hover:bg-gray-50 transition-colors shadow-sm shrink-0">
                <Calendar size={16} className="mr-2 text-gray-400"/> 
                All dates 
                <ChevronDown size={16} className="ml-2 text-gray-400"/>
            </button>

            {/* Vertical Divider */}
            <div className="w-px h-8 bg-gray-300 mx-1 md:mx-2 shrink-0"></div>

            {/* Strict Category Toggles (Cricket & Kabaddi) */}
            <div className="flex items-center space-x-2.5 overflow-x-auto hide-scrollbar pb-1 pr-4 md:pr-0">
                <button 
                    onClick={() => setSearchQuery('')} 
                    className={`px-5 py-2 h-10 rounded-[10px] text-sm font-bold shrink-0 transition-all shadow-sm border ${!searchQuery ? 'bg-[#eaf5e1] border-[#458731] text-[#114C2A]' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                    All types
                </button>
                <button 
                    onClick={() => setSearchQuery('Cricket')} 
                    className={`px-5 py-2 h-10 rounded-[10px] text-sm font-bold shrink-0 transition-all shadow-sm border ${searchQuery === 'Cricket' ? 'bg-[#eaf5e1] border-[#458731] text-[#114C2A]' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                    Cricket
                </button>
                <button 
                    onClick={() => setSearchQuery('Kabaddi')} 
                    className={`px-5 py-2 h-10 rounded-[10px] text-sm font-bold shrink-0 transition-all shadow-sm border ${searchQuery === 'Kabaddi' ? 'bg-[#eaf5e1] border-[#458731] text-[#114C2A]' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                    Kabaddi
                </button>
            </div>
        </div>
    );
}