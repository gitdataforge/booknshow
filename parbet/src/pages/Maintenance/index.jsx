import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Wrench, RefreshCw, Clock } from 'lucide-react';

export default function Maintenance() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Real-time clock logic to keep the user informed during downtime
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        // Simulate a brief network check delay before forcing a hard reload
        setTimeout(() => {
            window.location.reload();
        }, 800);
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ambient Animations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                    className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] border-[40px] border-gray-100 rounded-full opacity-50"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 50, ease: "linear" }}
                    className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] border-[30px] border-[#E6F2D9] rounded-full opacity-50"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 max-w-lg w-full bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center border border-gray-100"
            >
                {/* Animated Gear/Wrench Iconography */}
                <div className="flex justify-center mb-6 relative">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                        className="absolute"
                    >
                        <Settings size={64} className="text-[#E6F2D9]" />
                    </motion.div>
                    <Wrench size={32} className="text-[#458731] z-10 mt-4" />
                </div>

                <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">
                    par<span className="text-[#458731]">bet</span> is upgrading
                </h1>

                <p className="text-gray-600 font-medium mb-8 leading-relaxed">
                    We are currently performing scheduled maintenance to improve our global ticketing infrastructure. Normal operations will resume shortly.
                </p>

                {/* Real-time Server Clock */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-8 flex flex-col items-center justify-center border border-gray-100">
                    <div className="flex items-center text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">
                        <Clock size={14} className="mr-1.5" /> Current Server Time
                    </div>
                    <div className="text-2xl font-black text-gray-800 tracking-tight tabular-nums">
                        {currentTime.toLocaleTimeString('en-US', { hour12: true })}
                    </div>
                    <div className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-widest">
                        {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>

                {/* Interactive Status Checker */}
                <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="w-full bg-[#114C2A] text-white rounded-xl px-6 py-4 font-bold text-sm hover:bg-[#0c361d] transition-all shadow-md flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <RefreshCw size={18} className={`mr-2 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                    {isRefreshing ? 'Checking Status...' : 'Check Status & Refresh'}
                </button>
            </motion.div>

            {/* Footer Copyright overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="absolute bottom-8 z-10 text-center"
            >
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    © {new Date().getFullYear()} Parbet Global. All rights reserved.<br/>
                </p>
            </motion.div>
        </div>
    );
}