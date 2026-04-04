import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useStore';

export default function SearchDropdown() {
    const navigate = useNavigate();
    const { 
        isSearchExpanded, 
        setSearchExpanded, 
        trendingPerformers, 
        setSearchQuery,
        liveMatches 
    } = useAppStore();

    // Handle clicking a performer
    const handlePerformerClick = (performerName) => {
        // 1. Set global search query to this performer
        setSearchQuery(performerName);
        
        // 2. Find if there's a direct match to navigate to
        const directMatch = liveMatches.find(m => 
            m.t1 === performerName || m.t2 === performerName
        );

        if (directMatch) {
            navigate(`/event?id=${directMatch.id}`);
        }
        
        // 3. Close the expansion
        setSearchExpanded(false);
    };

    return (
        <AnimatePresence>
            {isSearchExpanded && (
                <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-[110%] left-0 right-0 bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 z-[100] overflow-hidden p-2"
                    onMouseDown={(e) => e.preventDefault()} // Prevent blur from closing before click registers
                >
                    <div className="px-5 pt-5 pb-3">
                        <h4 className="text-[13px] font-bold text-gray-500 uppercase tracking-widest mb-4">
                            Trending Performers
                        </h4>
                        
                        <div className="flex flex-col space-y-1 max-h-[450px] overflow-y-auto hide-scrollbar">
                            {trendingPerformers.length > 0 ? (
                                trendingPerformers.map((performer, idx) => (
                                    <button
                                        key={`performer-${idx}`}
                                        onClick={() => handlePerformerClick(performer.name)}
                                        className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors group w-full text-left"
                                    >
                                        {/* Dynamic Rounded Square Thumbnail */}
                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 mr-4 flex-shrink-0 border border-gray-100">
                                            <img 
                                                src={`https://loremflickr.com/100/100/${performer.name.replace(/\s+/g, '-')},sports/all`} 
                                                alt={performer.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                onError={(e) => {
                                                    e.target.src = "https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=100&q=80";
                                                }}
                                            />
                                        </div>
                                        
                                        <span className="text-[16px] font-bold text-brand-text group-hover:text-brand-primary transition-colors">
                                            {performer.name}
                                        </span>
                                    </button>
                                ))
                            ) : (
                                <div className="p-8 text-center">
                                    <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                    <p className="text-sm text-brand-muted font-medium">Scanning live performers...</p>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Subtle footer indicator if list is long */}
                    <div className="h-4 bg-gradient-to-t from-white to-transparent absolute bottom-0 left-0 right-0 pointer-events-none" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}