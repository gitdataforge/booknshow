import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Header() {
    const navigate = useNavigate();

    return (
        <header className="w-full bg-white py-4 px-5 z-50 relative font-sans shadow-sm border-b border-[#e2e2e2]">
            <div className="w-full max-w-[1200px] mx-auto flex items-center justify-between">
                
                {/* Left: Mobile Menu Link (Strictly matching image_31875a.png) */}
                <div className="w-1/3 flex justify-start">
                    <Link 
                        to="/menu" 
                        className="flex items-center text-[#54626c] text-[15px] font-medium hover:text-[#458731] transition-colors"
                    >
                        Menu <ChevronRight size={16} className="ml-1 text-[#54626c]" strokeWidth={2} />
                    </Link>
                </div>

                {/* Center: Parbet Logo (1:1 Viagogo Typography & Colors) */}
                <div 
                    onClick={() => navigate('/')} 
                    className="w-1/3 flex justify-center cursor-pointer"
                >
                    <h1 className="text-[32px] font-black tracking-tighter leading-none mt-1">
                        <span className="text-[#54626c]">par</span><span className="text-[#8cc63f]">bet</span>
                    </h1>
                </div>

                {/* Right: Solid Green User Profile Icon (Exact Replica) */}
                <div className="w-1/3 flex justify-end items-center">
                    <div 
                        onClick={() => navigate('/dashboard')}
                        className="cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center"
                    >
                        {/* 1:1 SVG mimicking the exact solid profile icon from the screenshot */}
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="#458731" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
                        </svg>
                    </div>
                </div>
                
            </div>
        </header>
    );
}