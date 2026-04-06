import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Info } from 'lucide-react';
import { useAppStore } from '../store/useStore';

/**
 * VenueCard: Strictly real-world logic for distance.
 * Calculates KM distance from User GPS coordinates to Venue lat/lon.
 */
export default function VenueCard({ venue }) {
    const { strictLocation } = useAppStore();

    // Haversine formula for strictly accurate geographical distance
    const distanceKm = useMemo(() => {
        if (!strictLocation.lat || !venue.lat) return null;
        
        const R = 6371; // Earth radius
        const dLat = (venue.lat - strictLocation.lat) * (Math.PI / 180);
        const dLon = (venue.lon - strictLocation.lon) * (Math.PI / 180);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(strictLocation.lat * (Math.PI / 180)) * Math.cos(venue.lat * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(1);
    }, [strictLocation, venue]);

    return (
        <motion.div 
            whileHover={{ scale: 1.01 }}
            className="w-full bg-white border border-gray-200 rounded-[24px] p-5 flex flex-col md:flex-row items-center justify-between shadow-sm hover:shadow-md transition-all"
        >
            <div className="flex items-center space-x-6 w-full">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden border border-gray-100">
                    <img src={venue.img || 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=200&q=80'} className="w-full h-full object-cover" alt={venue.name}/>
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#1a1a1a] tracking-tight">{venue.name}</h3>
                    <div className="flex items-center mt-1 text-gray-500 text-sm font-medium">
                        <MapPin size={14} className="mr-1.5 opacity-60" />
                        {venue.address}
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-6 mt-6 md:mt-0 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                <div className="text-right">
                    <span className="block text-[10px] text-gray-400 font-black uppercase tracking-widest">Proximity</span>
                    <span className="text-[#458731] font-black text-lg">
                        {distanceKm ? `${distanceKm} KM` : 'Detecting...'}
                    </span>
                </div>
                <button className="bg-[#1a1a1a] text-white p-3.5 rounded-2xl hover:bg-[#333] transition-colors shadow-lg">
                    <Navigation size={20} className="-rotate-45" />
                </button>
            </div>
        </motion.div>
    );
}