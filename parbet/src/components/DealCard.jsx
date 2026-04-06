import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer, Zap, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * DealCard: Strictly real-time countdown logic for events starting within 48h.
 * No simulations. Uses actual commence_time from API.
 */
export default function DealCard({ event }) {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const calculateTime = () => {
            const difference = new Date(event.commence_time) - new Date();
            if (difference <= 0) {
                setTimeLeft('Live Now');
                return;
            }

            const hours = Math.floor((difference / (1000 * 60 * 60)));
            const mins = Math.floor((difference / 1000 / 60) % 60);
            const secs = Math.floor((difference / 1000) % 60);
            
            setTimeLeft(`${hours}h ${mins}m ${secs}s`);
        };

        const timer = setInterval(calculateTime, 1000);
        calculateTime();
        return () => clearInterval(timer);
    }, [event.commence_time]);

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            onClick={() => navigate(`/event?id=${event.id}`)}
            className="min-w-[300px] w-[300px] bg-[#1a1a1a] rounded-[20px] p-5 relative overflow-hidden group cursor-pointer shadow-2xl border border-white/5"
        >
            {/* Animated Glow Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#458731]/20 blur-[60px] -mr-10 -mt-10" />

            <div className="flex justify-between items-start mb-6">
                <div className="bg-[#458731] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center shadow-lg">
                    <Zap size={12} className="mr-1 fill-current" /> Fast Sell
                </div>
                <div className="text-white/40 group-hover:text-[#458731] transition-colors">
                    <ArrowUpRight size={20} />
                </div>
            </div>

            <h3 className="text-white font-bold text-lg leading-tight mb-2 line-clamp-2">
                {event.t1} {event.t2 ? `vs ${event.t2}` : ''}
            </h3>
            
            <p className="text-white/50 text-xs font-medium mb-6 flex items-center">
                <span className="truncate">{event.loc}</span>
            </p>

            <div className="bg-white/5 rounded-xl p-3 flex items-center justify-between border border-white/10">
                <div className="flex items-center text-[#8bc53f]">
                    <Timer size={16} className="mr-2" />
                    <span className="text-sm font-black tabular-nums">{timeLeft}</span>
                </div>
                <div className="text-right">
                    <span className="block text-[10px] text-white/40 font-bold uppercase">Starting from</span>
                    <span className="text-white font-black text-sm">₹{event.price || '999'}</span>
                </div>
            </div>
        </motion.div>
    );
}