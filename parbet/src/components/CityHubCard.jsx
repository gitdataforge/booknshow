import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useStore';

/**
 * CityHubCard: High-end vertical card with hover-scale animations.
 * Strictly triggers global state update on click to re-fetch feeds.
 */
export default function CityHubCard({ name, img, country }) {
    const { setManualLocation } = useAppStore();

    return (
        <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setManualLocation(name)}
            className="min-w-[180px] h-[260px] rounded-[24px] relative overflow-hidden cursor-pointer group shadow-xl border border-gray-100"
        >
            <img 
                src={img} 
                alt={name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            
            <div className="absolute bottom-5 left-5 right-5">
                <span className="text-white/60 text-[10px] font-black uppercase tracking-widest block mb-1">
                    {country}
                </span>
                <h3 className="text-white text-xl font-black leading-none tracking-tight">
                    {name}
                </h3>
                <div className="w-0 h-1 bg-[#8bc53f] mt-3 transition-all duration-300 group-hover:w-full rounded-full" />
            </div>
        </motion.div>
    );
}