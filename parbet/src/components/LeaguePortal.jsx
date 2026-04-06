import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useStore';
import { Trophy } from 'lucide-react';

/**
 * LeaguePortal: Square grid sports portals with SVG background patterns.
 * Strictly powers the "League Spotlight" section using real API filters.
 */
export default function LeaguePortal({ name, icon: Icon, color, query }) {
    const { setSearchQuery } = useAppStore();

    return (
        <motion.div 
            whileHover={{ y: -8, shadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}
            onClick={() => setSearchQuery(query || name)}
            className="aspect-square rounded-[32px] p-6 relative overflow-hidden cursor-pointer group border border-gray-100 shadow-sm"
            style={{ backgroundColor: color }}
        >
            {/* High-end SVG Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg width="100%" height="100%">
                    <pattern id={`pattern-${name}`} width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="black" strokeWidth="1" />
                    </pattern>
                    <rect width="100%" height="100%" fill={`url(#pattern-${name})`} />
                </svg>
            </div>

            <div className="h-full flex flex-col justify-between relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                    {Icon ? <Icon size={28} /> : <Trophy size={28} />}
                </div>
                <div>
                    <h3 className="text-white text-2xl font-black leading-tight tracking-tighter">
                        {name}
                    </h3>
                    <div className="flex items-center text-white/60 text-xs font-bold mt-2 uppercase tracking-widest">
                        Browse Tickets →
                    </div>
                </div>
            </div>
        </motion.div>
    );
}