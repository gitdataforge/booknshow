import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Heart, RefreshCw, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../store/useStore';

export default function Home() {
    const { 
        isAuthenticated, 
        openAuthModal,
        liveMatches,
        isLoadingMatches,
        apiError,
        fetchLiveMatches
    } = useAppStore();

    // Trigger real-time API fetch on load
    useEffect(() => {
        fetchLiveMatches();
    }, [fetchLiveMatches]);

    // Centralized function to intercept guest users
    const handleRestrictedAction = (actionName) => {
        if (!isAuthenticated) {
            openAuthModal();
        } else {
            console.log(`Executing secure action: ${actionName}`);
            // If authenticated, execute the real betting logic or navigation here
        }
    };

    return (
        <div className="animate-fade-in w-full pb-10">
            {/* Title Section */}
            <div className="flex justify-between items-end mb-6">
                <h1 className="text-4xl md:text-5xl font-black text-brand-text leading-tight tracking-tight">Global Live<br/>Sports Tickets</h1>
                <button 
                    onClick={() => handleRestrictedAction('Save to Favourites')}
                    className="w-10 h-10 rounded-full border-2 border-brand-border flex items-center justify-center hover:bg-brand-panel transition-colors"
                >
                    <Heart size={18} className="text-brand-muted"/>
                </button>
            </div>

            {/* Filters Row */}
            <div className="flex space-x-3 mb-8 overflow-x-auto hide-scrollbar pb-2">
                <button className="bg-brand-text text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center whitespace-nowrap shadow-md"><MapPin size={16} className="mr-2"/> Global</button>
                <button className="bg-white border-2 border-brand-border text-brand-text px-5 py-2.5 rounded-xl text-sm font-bold flex items-center whitespace-nowrap hover:bg-brand-panel transition-colors"><Calendar size={16} className="mr-2"/> All dates</button>
                <button onClick={fetchLiveMatches} className="bg-white border-2 border-brand-border text-[#114C2A] px-5 py-2.5 rounded-xl text-sm font-bold flex items-center whitespace-nowrap hover:bg-[#E6F2D9] transition-colors shadow-sm">
                    <RefreshCw size={16} className={`mr-2 ${isLoadingMatches ? 'animate-spin' : ''}`}/> Refresh Live Odds
                </button>
            </div>

            {/* Hero Banner (Green Patterned) */}
            <div className="w-full h-64 md:h-[350px] bg-brand-primary rounded-[32px] overflow-hidden mb-12 relative flex items-center shadow-xl">
                <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCI+CjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNMCAwbDQwIDQwbC00MCA0MHoiIGZpbGw9IiM0NTg3MzEiLz4KPHBhdGggZD0iTTQwIDBsNDAgNDBsLTQwIDQweiIgZmlsbD0iI0U2RjJEOSIvPgo8L3N2Zz4=')]"></div>
                <div className="relative z-10 p-8 md:p-12 w-full flex justify-between items-center">
                    <div>
                        <h2 className="text-5xl md:text-[80px] font-black text-white mb-6 tracking-tighter leading-none">PREMIER<br/>LEAGUE</h2>
                        <button 
                            onClick={() => handleRestrictedAction('View Premier League Markets')}
                            className="border-2 border-white/40 text-white hover:bg-white/10 px-8 py-3.5 rounded-xl font-bold text-sm transition-colors backdrop-blur-sm"
                        >
                            See Tickets
                        </button>
                    </div>
                </div>
                <button 
                    onClick={() => handleRestrictedAction('Favourite Premier League')}
                    className="absolute top-6 right-6 w-10 h-10 bg-black/40 rounded-full flex items-center justify-center hover:bg-black/60 transition-colors backdrop-blur-md z-20"
                >
                    <Heart size={18} className="text-white"/>
                </button>
            </div>

            <h3 className="font-bold text-xl text-brand-text mb-6 tracking-tight">
                {isLoadingMatches ? 'Scanning global networks...' : `${liveMatches.length} real events available globally`}
            </h3>

            {/* Dynamic Real-Time Match List */}
            <div className="space-y-4 mb-8">
                {apiError && (
                    <div className="w-full bg-red-50 border-2 border-red-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                        <AlertCircle size={32} className="text-brand-red mb-3" />
                        <h3 className="font-bold text-lg text-brand-text mb-1">Live Data Feed Offline</h3>
                        <p className="text-sm text-brand-muted mb-4">{apiError}</p>
                        <p className="text-xs font-bold text-brand-text">Please ensure VITE_ODDS_API_KEY is set in your .env.local file.</p>
                    </div>
                )}

                {isLoadingMatches && !apiError && (
                    <div className="w-full border-2 border-brand-border border-dashed rounded-2xl p-12 flex flex-col items-center justify-center">
                        <div className="w-10 h-10 border-4 border-[#114C2A] border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-sm font-bold text-brand-muted">Fetching real-time global fixtures and odds...</p>
                    </div>
                )}

                {!isLoadingMatches && !apiError && liveMatches.map(m => (
                    <motion.div 
                        whileHover={{ scale: 1.005, y: -2 }} 
                        key={m.id} 
                        className="bg-white border-2 border-brand-border rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center hover:border-brand-primary/30 hover:shadow-lg transition-all cursor-pointer"
                    >
                        {/* Desktop Layout Inner Flex */}
                        <div className="flex flex-1 items-center">
                            {/* Date Block */}
                            <div className="flex flex-col items-center justify-center pr-4 md:pr-6 border-r-2 border-brand-border min-w-[70px]">
                                <span className="text-sm font-bold text-brand-muted uppercase tracking-wider">{m.month}</span>
                                <span className="text-3xl font-black text-brand-text my-0.5">{m.day}</span>
                                <span className="text-xs font-bold text-brand-muted uppercase tracking-wider">{m.dow}</span>
                            </div>
                            
                            {/* Match Info */}
                            <div className="pl-4 md:pl-6 flex-1">
                                <p className="text-xs font-bold text-[#114C2A] mb-1 uppercase tracking-wider">{m.league}</p>
                                <h3 className="text-lg md:text-xl font-black text-brand-text leading-tight mb-1 tracking-tight">{m.t1} vs {m.t2}</h3>
                                <p className="text-sm font-medium text-brand-muted mb-3">{m.time} • {m.loc}</p>
                                <div className="flex space-x-2">
                                    {m.tag && <span className={`text-[10px] font-bold px-2.5 py-1.5 rounded-md uppercase tracking-wider ${m.tagColor}`}>{m.tag}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons / Odds */}
                        <div className="mt-5 md:mt-0 flex space-x-3 w-full md:w-auto">
                             <button 
                                onClick={() => handleRestrictedAction(`View Live Odds for ${m.t1} vs ${m.t2}`)}
                                className="flex-1 md:flex-none border-2 border-brand-border rounded-xl px-6 py-3 font-bold text-sm text-brand-text hover:bg-brand-panel transition-colors shadow-sm"
                             >
                                 Home Odds: {m.odds}
                             </button>
                             <button 
                                onClick={() => handleRestrictedAction(`Place Bet on ${m.t1} vs ${m.t2}`)}
                                className="flex-1 md:flex-none bg-brand-text text-white rounded-xl px-8 py-3 font-bold text-sm hover:bg-brand-text/90 transition-colors shadow-sm"
                             >
                                 Place Bet
                             </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}