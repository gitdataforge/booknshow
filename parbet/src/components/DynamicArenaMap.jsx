import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, ShieldCheck, Search } from 'lucide-react';
import { useAppStore } from '../store/useStore';

export default function DynamicArenaMap({ onSectionSelect, activeSection }) {
    const { getSectionAggregates, userCurrency } = useAppStore();
    const aggregates = getSectionAggregates();
    const [scale, setScale] = useState(1);

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.3, 3));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.3, 0.5));

    const currencySymbol = useMemo(() => {
        switch(userCurrency) {
            case 'USD': return '$';
            case 'GBP': return '£';
            case 'EUR': return '€';
            case 'AUD': return 'A$';
            default: return '₹';
        }
    }, [userCurrency]);

    // Elliptical positioning for Arena layouts
    const mappedBadges = useMemo(() => {
        if (!aggregates || aggregates.length === 0) return [];
        const lowestPrice = Math.min(...aggregates.map(a => a.minPrice));

        return aggregates.map((agg, index) => {
            const itemsPerRing = 16;
            const ringIndex = Math.floor(index / itemsPerRing);
            const posInRing = index % itemsPerRing;
            const currentRingTotal = Math.min(itemsPerRing, aggregates.length - ringIndex * itemsPerRing);
            
            const angle = (posInRing / currentRingTotal) * 2 * Math.PI;
            
            // Arena shapes are wider than they are tall (Elliptical geometry)
            const radiusX = 220 + (ringIndex * 80);
            const radiusY = 160 + (ringIndex * 70);
            
            const cx = 400;
            const cy = 400;
            
            const x = cx + radiusX * Math.cos(angle);
            const y = cy + radiusY * Math.sin(angle);

            return { ...agg, x, y, isBestPrice: agg.minPrice === lowestPrice };
        });
    }, [aggregates]);

    return (
        <div className="relative w-full h-full overflow-hidden bg-[#F4F6F8] rounded-none lg:rounded-l-[24px]">
            <div className="absolute top-6 left-6 right-24 z-40 flex justify-between items-start pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full border border-gray-200 flex items-center shadow-sm pointer-events-auto cursor-pointer hover:shadow-md transition-shadow">
                    <Search size={16} className="text-gray-500 mr-2"/>
                    <span className="text-[14px] font-bold text-brand-text">Search this area</span>
                </div>
            </div>

            <div className="absolute top-6 right-6 z-40 flex flex-col bg-white rounded-[12px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-gray-200 overflow-hidden">
                <button onClick={handleZoomIn} className="p-3 hover:bg-gray-50 border-b border-gray-200 transition-colors text-brand-text">
                    <Plus size={20}/>
                </button>
                <button onClick={handleZoomOut} className="p-3 hover:bg-gray-50 transition-colors text-brand-text">
                    <Minus size={20}/>
                </button>
            </div>

            <motion.div
                drag dragConstraints={{ left: -800 * scale, right: 800 * scale, top: -800 * scale, bottom: 800 * scale }}
                dragElastic={0.1} animate={{ scale }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing origin-center"
            >
                <div className="relative w-[800px] h-[800px]">
                    <svg viewBox="0 0 800 800" className="w-full h-full pointer-events-none drop-shadow-xl opacity-95">
                        {/* Arena Outer Bounds */}
                        <rect x="50" y="100" width="700" height="600" rx="250" fill="#FFFFFF" stroke="#EAEAEA" strokeWidth="4"/>
                        {/* Outer Tier */}
                        <rect x="100" y="150" width="600" height="500" rx="200" fill="none" stroke="#E2E8F0" strokeWidth="50" strokeDasharray="30 10"/>
                        {/* Middle Tier */}
                        <rect x="160" y="210" width="480" height="380" rx="150" fill="none" stroke="#A3D17A" strokeWidth="40" strokeDasharray="25 8"/>
                        {/* Lower Tier */}
                        <rect x="220" y="270" width="360" height="260" rx="100" fill="none" stroke="#C5E1A5" strokeWidth="35" strokeDasharray="20 6"/>
                        {/* Court/Floor */}
                        <rect x="300" y="330" width="200" height="140" rx="10" fill="#E2C792" stroke="#D1B072" strokeWidth="4"/>
                        <circle cx="400" cy="400" r="25" fill="none" stroke="#D1B072" strokeWidth="3"/>
                        <line x1="400" y1="330" x2="400" y2="470" stroke="#D1B072" strokeWidth="3"/>
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