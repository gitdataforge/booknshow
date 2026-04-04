import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useStore';

export default function NavHoverMenu({ isOpen, category, onMouseEnter, onMouseLeave }) {
    const navigate = useNavigate();
    const { liveMatches, setSearchQuery } = useAppStore();

    // Dynamically extract unique performers based on the hovered category strictly from the API
    const getCategoryPerformers = () => {
        if (!liveMatches || liveMatches.length === 0) return [];
        
        let filtered = liveMatches;
        
        // Map the API sport_title to our UI categories to filter correctly
        if (category === 'Sports') {
            filtered = liveMatches.filter(m => !m.league.toLowerCase().includes('music') && !m.league.toLowerCase().includes('politics'));
        } else if (category === 'Concerts') {
            filtered = liveMatches.filter(m => m.league.toLowerCase().includes('music') || m.league.toLowerCase().includes('concert'));
        } else if (category === 'Theatre') {
            filtered = liveMatches.filter(m => m.league.toLowerCase().includes('theatre') || m.league.toLowerCase().includes('broadway'));
        } else if (category === 'Festivals') {
            filtered = liveMatches.filter(m => m.league.toLowerCase().includes('festival'));
        }

        // Extract unique teams/artists natively from the live Odds API feed
        const performersSet = new Set();
        filtered.forEach(m => {
            // Some sports have team names, others might just be generic events, we capture t1/t2
            if (m.t1) performersSet.add(m.t1);
            if (m.t2) performersSet.add(m.t2);
        });

        // Return Top 8 strictly real performers to maintain clean UI scaling
        return Array.from(performersSet).slice(0, 8); 
    };

    const performers = getCategoryPerformers();

    const handleSelect = (performer) => {
        setSearchQuery(performer);
        navigate('/explore');
        onMouseLeave(); // Close menu upon selection
    };

    return (
        <AnimatePresence>
            {isOpen && performers.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    className="absolute top-full mt-4 w-[240px] bg-white rounded-[12px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-gray-100 py-3 z-50 overflow-hidden cursor-default"
                >
                    {/* Invisible bridge to prevent mouse leave gap */}
                    <div className="absolute -top-4 left-0 right-0 h-4 bg-transparent" />
                    
                    {performers.map((performer, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSelect(performer)}
                            className="w-full text-left px-5 py-2.5 text-[15px] font-medium text-[#3B4248] hover:bg-gray-50 hover:text-brand-text transition-colors truncate"
                        >
                            {performer}
                        </button>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
}