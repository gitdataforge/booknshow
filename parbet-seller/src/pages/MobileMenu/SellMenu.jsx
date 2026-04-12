import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SellMenu() {
    const navigate = useNavigate();

    return (
        <motion.div 
            initial={{ x: '100%' }} // Slides in from the right to simulate drilling down
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-[110] bg-white w-full h-full font-sans flex flex-col"
        >
            {/* 1:1 Replica Sub-Menu Header */}
            <div 
                onClick={() => navigate(-1)}
                className="flex items-center px-5 py-4 border-b border-[#e2e2e2] cursor-pointer hover:bg-gray-50 transition-colors"
            >
                <ChevronLeft size={22} className="text-[#1a1a1a] mr-3" strokeWidth={2.5} />
                <h1 className="text-[18px] font-bold text-[#1a1a1a] tracking-tight">Sell</h1>
            </div>

            {/* 1:1 Replica Navigation List (No Chevrons) */}
            <nav className="flex flex-col px-5 pt-3">
                
                {/* Sell Tickets Link */}
                <Link 
                    to="/create-listing" 
                    className="py-3 group active:opacity-70 transition-opacity"
                >
                    <span className="text-[17px] text-[#54626c] font-medium group-hover:text-[#458731] transition-colors">
                        Sell Tickets
                    </span>
                </Link>

                {/* My Tickets Link */}
                <Link 
                    to="/dashboard" 
                    className="py-3 group active:opacity-70 transition-opacity"
                >
                    <span className="text-[17px] text-[#54626c] font-medium group-hover:text-[#458731] transition-colors">
                        My Tickets
                    </span>
                </Link>

                {/* My Sales Link */}
                <Link 
                    to="/dashboard" 
                    className="py-3 group active:opacity-70 transition-opacity"
                >
                    <span className="text-[17px] text-[#54626c] font-medium group-hover:text-[#458731] transition-colors">
                        My Sales
                    </span>
                </Link>
                
            </nav>
        </motion.div>
    );
}