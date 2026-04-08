import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useStore';

export default function NavHoverMenu({ isOpen, category, name, onMouseEnter, onMouseLeave }) {
    const navigate = useNavigate();
    const { liveMatches, setSearchQuery, setExploreCategory } = useAppStore();

    // ============================================================================
    // AUTHENTIC REAL-WORLD FALLBACKS (Strictly No "Team A/B")
    // Guarantees UI immersion and layout integrity if the API is still hydrating
    // ============================================================================
    const fallbackCricket = [
        "Mumbai Indians", "Chennai Super Kings", "Royal Challengers Bangalore", 
        "Kolkata Knight Riders", "Delhi Capitals", "Gujarat Titans", "Team India"
    ];
    
    const fallbackKabaddi = [
        "Patna Pirates", "Puneri Paltan", "Jaipur Pink Panthers", 
        "Bengaluru Bulls", "U Mumba", "Dabang Delhi KC"
    ];
    
    const fallbackTournaments = [
        "TATA IPL 2026", "ICC T20 World Cup", "Pro Kabaddi League", "The Ashes"
    ];

    const fallbackCities = [
        "Mumbai", "Bengaluru", "Chennai", "Delhi", "Pune", "Kolkata", "Ahmedabad"
    ];

    // Real-time Data Extraction Logic mapped perfectly to the hovered column name
    const listItems = useMemo(() => {
        if (!liveMatches || liveMatches.length === 0) {
            if (name === 'Kabaddi') return fallbackKabaddi;
            if (name === 'Top Cities') return fallbackCities;
            if (name === 'Tournaments') return fallbackTournaments;
            return fallbackCricket; // Default to cricket
        }

        // 1. Handle Top Cities
        if (name === 'Top Cities') {
            const cities = new Set();
            liveMatches.forEach(m => {
                if (m.loc) {
                    const city = m.loc.split(/,|•/)[0].trim();
                    if (city && city !== 'Verified Venue' && city !== 'Global') cities.add(city);
                }
            });
            const cityArr = Array.from(cities).slice(0, 10);
            return cityArr.length > 0 ? cityArr : fallbackCities;
        }

        // 2. Filter base data depending on the specific tab hovered
        let filteredMatches = liveMatches;
        
        if (name === 'Cricket') {
            filteredMatches = liveMatches.filter(m => {
                const str = `${m.t1} ${m.t2} ${m.league} ${m.sport}`.toLowerCase();
                return str.includes('cricket') || str.includes('ipl') || str.includes('t20') || str.includes('icc') || str.includes('odi') || str.includes('test');
            });
        } else if (name === 'Kabaddi') {
            filteredMatches = liveMatches.filter(m => {
                const str = `${m.t1} ${m.t2} ${m.league} ${m.sport}`.toLowerCase();
                return str.includes('kabaddi') || str.includes('pkl');
            });
        } else if (name === 'Tournaments') {
            const leagues = new Set();
            liveMatches.forEach(m => {
                if (m.league && !m.league.toLowerCase().includes('team a') && !m.league.toLowerCase().includes('team b')) leagues.add(m.league);
            });
            const tourneys = Array.from(leagues).slice(0, 10);
            return tourneys.length > 0 ? tourneys : fallbackTournaments;
        }

        // 3. Extract exact names while ruthlessly dropping "Team A/B" API defaults
        const entities = new Set();
        filteredMatches.forEach(m => {
            const t1 = m.t1 || '';
            const t2 = m.t2 || '';
            
            // STRICT SCRUBBING: Ignore generic API fallbacks
            if (t1 && !t1.toLowerCase().includes('team a') && !t1.toLowerCase().includes('team b')) entities.add(t1);
            if (t2 && !t2.toLowerCase().includes('team a') && !t2.toLowerCase().includes('team b')) entities.add(t2);
        });
        
        const sportsArr = Array.from(entities).slice(0, 10);
        
        // 4. Return sanitized data or context-aware fallback
        if (sportsArr.length > 0) return sportsArr;
        
        if (name === 'Kabaddi') return fallbackKabaddi;
        if (name === 'Tournaments') return fallbackTournaments;
        return fallbackCricket;
        
    }, [liveMatches, name]);

    const handleItemClick = (item) => {
        setSearchQuery(item);
        setExploreCategory('All Events');
        onMouseLeave();
        navigate('/explore');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    className="absolute top-full mt-2 left-0 w-[240px] bg-white rounded-[8px] shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-gray-200 z-[200] py-2 flex flex-col overflow-hidden"
                >
                    {/* Invisible bridge to prevent mouse leave gap drops */}
                    <div className="absolute -top-4 left-0 right-0 h-4 bg-transparent" />
                    
                    {listItems.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleItemClick(item)}
                            className="w-full text-left px-5 py-2.5 text-[14px] text-[#333] hover:bg-[#f0f7ea] transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
                        >
                            {item}
                        </button>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
}