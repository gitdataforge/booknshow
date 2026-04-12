import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileMenu() {
    const navigate = useNavigate();

    return (
        <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-[100] bg-white w-full h-full font-sans flex flex-col"
        >
            {/* 1:1 Replica Menu Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e2e2e2]">
                {/* Parbet Logo (Viagogo Typography Match) */}
                <h1 
                    onClick={() => navigate('/')} 
                    className="text-[32px] font-black tracking-tighter leading-none cursor-pointer"
                >
                    <span className="text-[#54626c]">par</span><span className="text-[#8cc63f]">bet</span>
                </h1>
                
                {/* Close Button - Routes back to previous screen */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2 -mr-2 text-[#54626c] hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X size={24} strokeWidth={1.5} />
                </button>
            </div>

            {/* 1:1 Replica Navigation List */}
            <nav className="flex flex-col px-5 pt-2">
                
                {/* Sell Menu Link (Routes to the submenu page) */}
                <Link 
                    to="/menu/sell" 
                    className="flex items-center justify-between py-4 border-b border-[#e2e2e2] group active:bg-gray-50 transition-colors"
                >
                    <span className="text-[17px] text-[#54626c] font-medium group-hover:text-[#458731] transition-colors">Sell</span>
                    <ChevronRight size={20} className="text-[#54626c] group-hover:text-[#458731] transition-colors" strokeWidth={2} />
                </Link>

                {/* Dashboard Link */}
                <Link 
                    to="/dashboard" 
                    className="flex items-center justify-between py-4 border-b border-[#e2e2e2] group active:bg-gray-50 transition-colors"
                >
                    <span className="text-[17px] text-[#54626c] font-medium group-hover:text-[#458731] transition-colors">My Tickets</span>
                    <ChevronRight size={20} className="text-[#54626c] group-hover:text-[#458731] transition-colors" strokeWidth={2} />
                </Link>

                {/* Profile Link (Routes to Dashboard for now) */}
                <Link 
                    to="/dashboard" 
                    className="flex items-center justify-between py-4 border-b border-[#e2e2e2] group active:bg-gray-50 transition-colors"
                >
                    <span className="text-[17px] text-[#54626c] font-medium group-hover:text-[#458731] transition-colors">Profile</span>
                    <ChevronRight size={20} className="text-[#54626c] group-hover:text-[#458731] transition-colors" strokeWidth={2} />
                </Link>

                {/* 1:1 Replica Spaced Footer Link */}
                <div className="mt-2">
                    <Link 
                        to="#" 
                        className="flex items-center justify-between py-4 group active:bg-gray-50 transition-colors"
                    >
                        <span className="text-[17px] text-[#54626c] font-medium group-hover:text-[#458731] transition-colors">Have Questions?</span>
                    </Link>
                </div>
                
            </nav>
        </motion.div>
    );
}