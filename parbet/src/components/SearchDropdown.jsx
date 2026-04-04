import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Calendar, X } from 'lucide-react';
import { useAppStore } from '../store/useStore';

export default function SearchDropdown() {
    const navigate = useNavigate();
    const { 
        isSearchExpanded, 
        setSearchExpanded, 
        trendingPerformers, 
        searchQuery,
        setSearchQuery,
        liveMatches,
        recentSearches,
        addRecentSearch,
        clearRecentSearches
    } = useAppStore();

    // Handle clicking a performer/trending item or a recent search string
    const handlePerformerClick = (searchString) => {
        setSearchQuery(searchString);
        addRecentSearch(searchString); // Save to persisted history
        setSearchExpanded(false);
        
        // Find direct match or route to explore page as a general search
        const directMatch = liveMatches.find(m => 
            m.t1.toLowerCase() === searchString.toLowerCase() || 
            m.t2.toLowerCase() === searchString.toLowerCase() ||
            m.league.toLowerCase() === searchString.toLowerCase()
        );

        if (directMatch) {
            navigate(`/event?id=${directMatch.id}`);
        } else {
            navigate('/explore');
        }
    };

    // Handle clicking a specific event from live suggestions
    const handleEventClick = (event) => {
        addRecentSearch(`${event.t1} vs ${event.t2}`);
        setSearchExpanded(false);
        navigate(`/event?id=${event.id}`);
    };

    // Filter real-time API data based on current active typing
    const query = searchQuery.trim().toLowerCase();
    const liveSuggestions = query 
        ? liveMatches.filter(m => 
            m.t1.toLowerCase().includes(query) || 
            m.t2.toLowerCase().includes(query) ||
            m.league.toLowerCase().includes(query)
          ).slice(0, 8) // Limit to top 8 suggestions to maintain UI cleanliness
        : [];

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
                    <div className="px-3 md:px-5 pt-4 pb-3 max-h-[450px] overflow-y-auto hide-scrollbar">
                        
                        {/* STATE 1: EMPTY QUERY -> SHOW RECENTS & TRENDING */}
                        {!query ? (
                            <>
                                {/* Recent Searches Section */}
                                {recentSearches && recentSearches.length > 0 && (
                                    <div className="mb-6">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="text-[13px] font-bold text-gray-500 uppercase tracking-widest px-2">
                                                Recent Searches
                                            </h4>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); clearRecentSearches(); }}
                                                className="text-[12px] font-bold text-brand-primary hover:text-[#2d5c20] transition-colors px-2"
                                            >
                                                Clear
                                            </button>
                                        </div>
                                        <div className="flex flex-col">
                                            {recentSearches.map((item, idx) => (
                                                <button
                                                    key={`recent-${idx}`}
                                                    onClick={() => handlePerformerClick(item)}
                                                    className="flex items-center px-2 py-3 rounded-xl hover:bg-gray-50 transition-colors group w-full text-left"
                                                >
                                                    <Clock size={18} className="text-gray-400 mr-3 group-hover:text-brand-primary transition-colors flex-shrink-0" />
                                                    <span className="text-[15px] font-medium text-brand-text truncate">
                                                        {item}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Trending Performers Section */}
                                <div>
                                    <h4 className="text-[13px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">
                                        Trending Performers
                                    </h4>
                                    <div className="flex flex-col space-y-1">
                                        {trendingPerformers.length > 0 ? (
                                            trendingPerformers.slice(0, 6).map((performer, idx) => (
                                                <button
                                                    key={`performer-${idx}`}
                                                    onClick={() => handlePerformerClick(performer.name)}
                                                    className="flex items-center p-2 rounded-xl hover:bg-gray-50 transition-colors group w-full text-left"
                                                >
                                                    {/* Dynamic Rounded Square Thumbnail */}
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 mr-4 flex-shrink-0 border border-gray-200 shadow-sm">
                                                        <img 
                                                            src={`https://loremflickr.com/100/100/${encodeURIComponent(performer.name.split(' ')[0])},sports/all`} 
                                                            alt={performer.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                            onError={(e) => {
                                                                e.target.src = "https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=100&q=80";
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-[16px] font-bold text-brand-text group-hover:text-brand-primary transition-colors truncate">
                                                        {performer.name}
                                                    </span>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="p-6 text-center">
                                                <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                                <p className="text-sm text-brand-muted font-medium">Scanning live performers...</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* STATE 2: ACTIVE TYPING -> SHOW REAL-TIME API SUGGESTIONS */
                            <div>
                                <h4 className="text-[13px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">
                                    Event Suggestions
                                </h4>
                                <div className="flex flex-col space-y-1">
                                    {liveSuggestions.length > 0 ? (
                                        liveSuggestions.map((event, idx) => (
                                            <button
                                                key={`suggestion-${idx}`}
                                                onClick={() => handleEventClick(event)}
                                                className="flex flex-col p-3 rounded-xl hover:bg-gray-50 transition-colors group w-full text-left border border-transparent hover:border-gray-200"
                                            >
                                                <span className="text-[15px] font-bold text-brand-text group-hover:text-brand-primary transition-colors truncate w-full mb-1">
                                                    {event.t1} vs {event.t2}
                                                </span>
                                                <div className="flex items-center text-[12px] text-brand-muted">
                                                    <Calendar size={12} className="mr-1.5 flex-shrink-0" />
                                                    <span className="mr-3 whitespace-nowrap">{event.dow}, {event.day} {event.month}</span>
                                                    <MapPin size={12} className="mr-1.5 flex-shrink-0" />
                                                    <span className="truncate">{event.loc}</span>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center">
                                            <p className="text-[15px] text-brand-text font-medium mb-1">No events found matching "{searchQuery}"</p>
                                            <p className="text-[13px] text-brand-muted">Try checking for typos or searching a different team/city.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                    {/* Subtle footer indicator if list is long */}
                    <div className="h-4 bg-gradient-to-t from-white to-transparent absolute bottom-0 left-0 right-0 pointer-events-none" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}