import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, ShieldCheck, Search } from 'lucide-react';
import { useAppStore } from '../store/useStore';

export default function DynamicFestivalMap({ onSectionSelect, activeSection }) {
    const { getSectionAggregates, userCurrency } = useAppStore();
    const aggregates = getSectionAggregates();
    const [scale, setScale] = useState(1);

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.3, 3));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.3, 0.5));

    const currencySymbol = useMemo(() => {
        switch(userCurrency) {
            case 'USD': return '$'; case 'GBP': return '£'; case 'EUR': return '€'; case 'AUD': return 'A$'; default: return '₹';
        }
    }, [userCurrency]);

    // Grid-based procedural placement for large General Admission Festival zones
    const mappedBadges = useMemo(() => {
        if (!aggregates || aggregates.length === 0) return [];
        const lowestPrice = Math.min(...aggregates.map(a => a.minPrice));

        return aggregates.map((agg, index) => {
            const cols = Math.ceil(Math.sqrt(aggregates.length));
            const row = Math.floor(index / cols);
            const col = index % cols;
            
            // Map into the massive central GA zone (x: 200-600, y: 300-700)
            const startX = 250;
            const startY = 350;
            const spacingX = 400 / Math.max(cols, 1);
            const spacingY = 300 / Math.max(Math.ceil(aggregates.length/cols), 1);
            
            const x = startX + (col * spacingX) + (Math.random() * 20 - 10); // Add slight organic scatter
            const y = startY + (row * spacingY) + (Math.random() * 20 - 10);

            return { ...agg, x, y, isBestPrice: agg.minPrice === lowestPrice };
        });
    }, [aggregates]);

    return (
        <div className="relative w-full h-full overflow-hidden bg-[#F4F6F8] rounded-none lg:rounded-l-[24px]">
            <div className="absolute top-6 left-6 right-24 z-40 flex justify-between items-start pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full border border-gray-200 flex items-center shadow-sm pointer-events-auto cursor-pointer">
                    <Search size={16} className="text-gray-500 mr-2"/>
                    <span className="text-[14px] font-bold text-brand-text">Search this area</span>
                </div>
            </div>

            <div className="absolute top-6 right-6 z-40 flex flex-col bg-white rounded-[12px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-gray-200 overflow-hidden">
                <button onClick={handleZoomIn} className="p-3 hover:bg-gray-50 border-b border-gray-200 text-brand-text"><Plus size={20}/></button>
                <button onClick={handleZoomOut} className="p-3 hover:bg-gray-50 text-brand-text"><Minus size={20}/></button>
            </div>

            <motion.div
                drag dragConstraints={{ left: -800 * scale, right: 800 * scale, top: -800 * scale, bottom: 800 * scale }}
                dragElastic={0.1} animate={{ scale }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing origin-center"
            >
                <div className="relative w-[800px] h-[800px]">
                    <svg viewBox="0 0 800 800" className="w-full h-full pointer-events-none drop-shadow-xl opacity-95">
                        <rect x="50" y="50" width="700" height="700" rx="40" fill="#FFFFFF" stroke="#EAEAEA" strokeWidth="4"/>
                        {/* Main Stage */}
                        <rect x="200" y="100" width="400" height="150" fill="#1D2B36" rx="10"/>
                        <text x="400" y="185" fill="white" fontSize="28" fontWeight="bold" textAnchor="middle">MAIN STAGE</text>
                        
                        {/* VIP Left & Right Tents */}
                        <rect x="80" y="300" width="100" height="350" fill="#E2E8F0" rx="10"/>
                        <text x="130" y="475" fill="#4A5560" fontSize="18" fontWeight="bold" textAnchor="middle" transform="rotate(-90 130,475)">VIP WEST</text>
                        
                        <rect x="620" y="300" width="100" height="350" fill="#E2E8F0" rx="10"/>
                        <text x="670" y="475" fill="#4A5560" fontSize="18" fontWeight="bold" textAnchor="middle" transform="rotate(90 670,475)">VIP EAST</text>
                        
                        {/* Huge General Admission Zone */}
                        <rect x="200" y="300" width="400" height="400" fill="#EAF4D9" stroke="#C5E1A5" strokeWidth="4" strokeDasharray="15 15" rx="20"/>
                        <text x="400" y="730" fill="#A3D17A" fontSize="24" fontWeight="bold" textAnchor="middle">GENERAL ADMISSION</text>
                    </svg>

                    {mappedBadges.map((badge) => {
                        const isSelected = activeSection === badge.section;
                        return (
                            <div
                                key={badge.section}
                                onClick={(e) => { e.stopPropagation(); onSectionSelect(badge.section === activeSection ? null : badge.section); }}
                                className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-[10px] shadow-lg cursor-pointer transition-all hover:scale-110 hover:z-50 flex flex-col items-center justify-center min-w-[70px] px-3 py-2 text-center border-[2.5px] ${
                                    badge.isBestPrice ? 'bg-[#1D2B36] border-[#1D2B36] text-white z-40' : isSelected ? 'bg-white border-[#E91E63] text-gray-900 z-40 scale-105' : 'bg-white border-transparent text-gray-900 z-30'
                                }`}
                                style={{ left: `${(badge.x / 800) * 100}%`, top: `${(badge.y / 800) * 100}%` }}
                            >
                                <span className={`font-black text-[15px] leading-none mb-0.5 ${isSelected && !badge.isBestPrice ? 'text-[#E91E63]' : ''}`}>
                                    {currencySymbol}{badge.minPrice.toLocaleString()}
                                </span>
                                {badge.isBestPrice ? (
                                    <span className="text-[11px] font-bold text-gray-300 leading-none">Best price</span>
                                ) : (
                                    <span className="text-[12px] font-bold leading-none text-[#E91E63]">{badge.totalQuantity} left</span>
                                )}
                                <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent ${
                                    badge.isBestPrice ? 'border-t-[#1D2B36]' : isSelected ? 'border-t-[#E91E63]' : 'border-t-white drop-shadow-sm'
                                }`}></div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
            <div className="absolute bottom-6 left-6 z-40 pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-[10px] border border-gray-200 flex items-center shadow-sm">
                    <ShieldCheck size={16} className="text-[#114C2A] mr-2"/>
                    <span className="text-[12px] font-bold text-[#114C2A] uppercase tracking-wide">100% Guaranteed</span>
                </div>
            </div>
        </div>
    );
}