import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Clock, MapPin, Zap } from 'lucide-react';
import { useAppStore } from '../store/useStore';
import { getIplTeamImage } from '../utils/iplTeamImages';

// Real-time urgency calculator
const getUrgencyBadge = (commenceTime) => {
    const now = new Date();
    const eventDate = new Date(commenceTime);
    const diffMs = eventDate - now;
    
    if (diffMs < 0) return { text: "Live or Ended", color: "bg-gray-100 text-gray-600 border-gray-200" };
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours === 0) return { text: `Starts in ${diffMins} mins!`, color: "bg-[#FFF1F2] text-[#E91E63] border-[#FDA4AF] animate-pulse" };
    if (diffHours < 24) return { text: `Starts in ${diffHours}h ${diffMins}m`, color: "bg-[#FFF7ED] text-[#E11D48] border-[#FECDD3]" };
    if (diffHours < 48) return { text: "Tomorrow", color: "bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]" };
    
    const diffDays = Math.floor(diffHours / 24);
    return { text: `In ${diffDays} days`, color: "bg-[#F8FAFC] text-[#14532D] border-[#DCFCE7]" };
};

export default function IplMatchCard({ event }) {
    const navigate = useNavigate();
    const { isAuthenticated, openAuthModal, favorites, toggleFavorite } = useAppStore();

    if (!event || !event.t1 || !event.t2) return null;

    const isFavorite = favorites?.some(f => f.id === event.id);
    const urgency = getUrgencyBadge(event.commence_time);
    
    // Map standard OddsAPI/CricAPI output directly to high-res SVGs
    const t1Logo = getIplTeamImage(event.t1);
    const t2Logo = getIplTeamImage(event.t2);
    
    // Simulate real market dynamics
    const startingPrice = Math.floor(parseFloat(event.odds || 1.5) * 800 + 400).toLocaleString();

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        if (!isAuthenticated) openAuthModal();
        else toggleFavorite(event);
    };

    return (
        <motion.div 
            whileHover={{ y: -6, shadow: "0 20px 40px -15px rgba(0,0,0,0.15)" }}
            onClick={() => navigate(`/event?id=${event.id}`)}
            className="bg-white rounded-[20px] overflow-hidden border border-gray-200 shadow-sm cursor-pointer transition-all flex flex-col group relative"
        >
            {/* Header: Urgency & Favorite */}
            <div className="px-4 pt-4 pb-2 flex justify-between items-start z-10">
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center shadow-sm ${urgency.color}`}>
                    {urgency.text.includes('Starts in') ? <Zap size={10} className="mr-1"/> : <Clock size={10} className="mr-1"/>}
                    {urgency.text}
                </div>
                <button 
                    onClick={handleFavoriteClick}
                    className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm z-20"
                >
                    <Heart size={15} className={isFavorite ? "fill-[#E91E63] text-[#E91E63]" : "text-gray-400"} />
                </button>
            </div>

            {/* Matchup Arena */}
            <div className="relative px-6 py-4 flex items-center justify-between">
                {/* Team 1 */}
                <div className="flex flex-col items-center w-[40%] relative z-10">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full p-2 shadow-md border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <img src={t1Logo} alt={event.t1} className="w-full h-full object-contain" />
                    </div>
                    <span className="mt-3 text-[13px] font-bold text-center leading-tight text-[#1D2B36] line-clamp-2">
                        {event.t1}
                    </span>
                </div>

                {/* VS Badge */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="bg-gradient-to-br from-gray-900 to-black text-white text-[12px] font-black italic px-3 py-1.5 rounded-lg shadow-lg skew-x-[-10deg]">
                        <span className="block skew-x-[10deg]">VS</span>
                    </div>
                </div>

                {/* Team 2 */}
                <div className="flex flex-col items-center w-[40%] relative z-10">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full p-2 shadow-md border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <img src={t2Logo} alt={event.t2} className="w-full h-full object-contain" />
                    </div>
                    <span className="mt-3 text-[13px] font-bold text-center leading-tight text-[#1D2B36] line-clamp-2">
                        {event.t2}
                    </span>
                </div>
                
                {/* Background Decor */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50 pointer-events-none"></div>
            </div>

            {/* Details Footer */}
            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex flex-col gap-2 mt-auto">
                <div className="flex items-center text-gray-500 text-[12px] font-medium">
                    <MapPin size={12} className="mr-1.5 opacity-70"/>
                    <span className="truncate">{event.loc}</span>
                </div>
                <div className="flex items-center text-gray-500 text-[12px] font-medium">
                    <Clock size={12} className="mr-1.5 opacity-70"/>
                    <span className="truncate">{event.dow}, {event.day} {event.month} • {event.time}</span>
                </div>
                
                <div className="mt-2 flex items-end justify-between pt-3 border-t border-gray-200">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Starting from</span>
                        <span className="text-[16px] font-black text-[#114C2A]">₹{startingPrice}</span>
                    </div>
                    <button className="text-[12px] font-bold text-[#114C2A] bg-[#EAF4D9] px-3 py-1.5 rounded-full hover:bg-[#D9EBBF] transition-colors border border-[#C5E1A5]">
                        See tickets
                    </button>
                </div>
            </div>
        </motion.div>
    );
}