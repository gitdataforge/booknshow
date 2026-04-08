import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

export default function Header() {
    const navigate = useNavigate();

    return (
        <header className="w-full bg-white py-5 px-6 md:px-10 z-50 relative font-sans border-b border-transparent">
            <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                
                {/* Left: Parbet Logo (1:1 Viagogo Typography Replica) */}
                <div 
                    onClick={() => navigate('/')} 
                    className="cursor-pointer shrink-0"
                >
                    <h1 className="text-[28px] md:text-[32px] font-black tracking-tighter text-[#1a1a1a] hover:text-[#458731] transition-colors">
                        parbet
                    </h1>
                </div>

                {/* Right: Minimalist Seller Navigation (Strictly 4 Elements) */}
                <div className="flex items-center space-x-5 md:space-x-8">
                    <Link 
                        to="/sell" 
                        className="text-[14px] md:text-[15px] font-bold text-[#1a1a1a] hover:text-[#458731] transition-colors"
                    >
                        Sell
                    </Link>
                    
                    <Link 
                        to="/dashboard" 
                        className="text-[14px] md:text-[15px] font-bold text-[#1a1a1a] hover:text-[#458731] transition-colors whitespace-nowrap"
                    >
                        My Tickets
                    </Link>
                    
                    <Link 
                        to="/login" 
                        className="text-[14px] md:text-[15px] font-bold text-[#1a1a1a] hover:text-[#458731] transition-colors whitespace-nowrap"
                    >
                        Sign In
                    </Link>
                    
                    {/* Green Circular User Profile Icon */}
                    <div 
                        onClick={() => navigate('/dashboard')}
                        className="w-9 h-9 rounded-full bg-[#458731] flex items-center justify-center cursor-pointer hover:scale-105 hover:bg-[#366a26] transition-all shadow-sm shrink-0"
                    >
                        <User size={20} className="text-white fill-current" />
                    </div>
                </div>
                
            </div>
        </header>
    );
}