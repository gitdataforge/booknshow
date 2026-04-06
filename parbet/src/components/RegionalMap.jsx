import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useStore';
import { MapPin, Info } from 'lucide-react';

/**
 * RegionalMap: Interactive SVG map of India for city jumping.
 * Strictly coded paths with coordinate hotspots.
 */
export default function RegionalMap() {
    const { setManualLocation } = useAppStore();
    const [hoveredCity, setHoveredCity] = useState(null);

    const hotspots = [
        { name: "Mumbai", x: "25%", y: "65%", state: "Maharashtra" },
        { name: "Delhi", x: "35%", y: "25%", state: "Delhi NCR" },
        { name: "Bengaluru", x: "32%", y: "82%", state: "Karnataka" },
        { name: "Kolkata", x: "75%", y: "55%", state: "West Bengal" },
        { name: "Pune", x: "27%", y: "68%", state: "Maharashtra" }
    ];

    return (
        <div className="w-full bg-[#111] rounded-[32px] p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center justify-between border border-white/5">
            <div className="md:w-1/2 mb-12 md:mb-0">
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-6">
                    Find events <span className="text-[#8bc53f]">across India</span>
                </h2>
                <p className="text-white/50 font-medium mb-8 text-lg leading-relaxed">
                    Interactive regional jumping. Hover over hotspots to see active event counts in real-time.
                </p>
                
                <div className="flex flex-wrap gap-3">
                    {hotspots.map(city => (
                        <button 
                            key={city.name}
                            onClick={() => setManualLocation(city.name)}
                            className="bg-white/5 hover:bg-[#458731] text-white border border-white/10 px-5 py-2 rounded-xl text-sm font-bold transition-all"
                        >
                            {city.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="md:w-[450px] aspect-[4/5] bg-white/5 rounded-3xl relative p-4 flex items-center justify-center border border-white/10 overflow-hidden">
                {/* Simplified India SVG Outline */}
                <svg viewBox="0 0 100 120" className="w-full h-full fill-white/10 stroke-white/20">
                    <path d="M30,10 L70,10 L80,30 L90,60 L75,110 L50,115 L20,110 L10,60 Z" />
                </svg>

                {hotspots.map(city => (
                    <div 
                        key={city.name}
                        style={{ left: city.x, top: city.y }}
                        className="absolute"
                        onMouseEnter={() => setHoveredCity(city)}
                        onMouseLeave={() => setHoveredCity(null)}
                        onClick={() => setManualLocation(city.name)}
                    >
                        <motion.div 
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="w-3 h-3 bg-[#8bc53f] rounded-full shadow-[0_0_15px_#8bc53f] cursor-pointer"
                        />
                        
                        <AnimatePresence>
                            {hoveredCity?.name === city.name && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: -45 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="absolute -translate-x-1/2 left-1/2 bg-white rounded-xl p-3 shadow-2xl z-50 whitespace-nowrap border border-gray-100"
                                >
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 rounded-full bg-[#458731] animate-pulse" />
                                        <span className="font-black text-[#1a1a1a] text-sm">{city.name}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 tracking-tighter">{city.state}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
}