import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useAppStore } from '../store/useStore';

export default function EventRail({ title, events = [], layout = 'standard' }) {
    const navigate = useNavigate();
    const { isAuthenticated, openAuthModal, favorites, toggleFavorite } = useAppStore();

    // Do not render the rail if the API aggregator hasn't populated this specific array
    if (!events || events.length === 0) return null;

    const handleFavoriteClick = (e, item) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            openAuthModal();
        } else {
            toggleFavorite(item);
        }
    };

    const isFavorite = (id) => favorites?.some(f => f.id === id);

    return (
        <div className="mb-12 md:mb-16">
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl md:text-[26px] font-black text-brand-text tracking-tight">
                    {title}
                </h2>
            </div>
            
            {/* Horizontal native swipe container with hidden scrollbar */}
            <div className="flex overflow-x-auto hide-scrollbar space-x-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                {events.map((item) => (
                    <motion.div 
                        key={`rail-${item.id}`} 
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => navigate(`/event?id=${item.id}`)} 
                        className={`flex-shrink-0 cursor-pointer group ${layout === 'overlay' ? 'min-w-[260px] max-w-[260px]' : 'min-w-[240px] max-w-[240px] md:min-w-[280px] md:max-w-[280px]'}`}
                    >
                        {layout === 'overlay' ? (
                            /* Layout Mode: Overlay (For "Popular Categories" styling) */
                            <div className="relative w-full h-[180px] rounded-[16px] overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
                                <img 
                                    src={`https://loremflickr.com/600/400/${encodeURIComponent((item.league || item.t1 || 'event').split(' ')[0])},sports/all`} 
                                    alt={item.league || item.t1} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 pointer-events-none">
                                    <h3 className="font-bold text-white text-lg leading-tight drop-shadow-md truncate">
                                        {item.league || item.t1}
                                    </h3>
                                </div>
                            </div>
                        ) : (
                            /* Layout Mode: Standard (For "Recommended" and "Fans also love" styling) */
                            <>
                                <div className="relative w-full h-[160px] md:h-[180px] rounded-[16px] overflow-hidden mb-3 border border-gray-200 bg-gray-100 shadow-sm">
                                    <img 
                                        src={`https://loremflickr.com/600/400/${encodeURIComponent((item.t1 || 'event').split(' ')[0])},sports/all`} 
                                        alt={item.t1} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                    />
                                    <button 
                                        onClick={(e) => handleFavoriteClick(e, item)} 
                                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 backdrop-blur-sm z-10 transition-colors shadow-sm"
                                    >
                                        <Heart size={14} className={isFavorite(item.id) ? "fill-[#E91E63] text-[#E91E63]" : "text-white"}/>
                                    </button>
                                </div>
                                <h3 className="font-bold text-[#1D2B36] text-[16px] md:text-[17px] leading-tight group-hover:text-[#458731] transition-colors truncate">
                                    {item.t1} {item.t2 ? `vs ${item.t2}` : ''}
                                </h3>
                                <p className="text-[13px] text-gray-500 font-medium mt-1 truncate">
                                    {item.dow}, {item.day} {item.month} • {item.time}
                                </p>
                                <p className="text-[13px] font-bold text-gray-600 truncate mt-0.5">
                                    📍 {item.loc}
                                </p>
                            </>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}