import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Heart, RefreshCw, AlertCircle, Info, Download, QrCode } from 'lucide-react';
import { useAppStore } from '../../store/useStore';

// --- MOCK DATA FOR NEW RAILS --- //
const recentlyViewed = [
    { id: 1, title: 'Stand-Up Comedy Show', img: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjEyNTI5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiM2Qzc1N0QiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjM2ZW0iPkNvbWVkeTwvdGV4dD48L3N2Zz4=' },
    { id: 2, title: 'Indian Premier League', img: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTE0QzJBIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiNFNkYyRDkiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjM2ZW0iPkNyaWNrZXQ8L3RleHQ+PC9zdmc+' },
    { id: 3, title: 'The Masters', img: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDU4NzMxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiNGRkYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjM2ZW0iPkdvbGY8L3RleHQ+PC9zdmc+' },
    { id: 4, title: 'Mumbai Indians', img: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMUQ3QUYyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiNGRkYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjM2ZW0iPlRlYW08L3RleHQ+PC9zdmc+' },
];

const recommended = [
    { id: 1, title: 'Vir Das', date: 'Fri, 15 May • 18:30', loc: '1 event near you', img: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMkEwODQ1Ii8+PC9zdmc+' },
    { id: 2, title: 'Stand-Up Comedy Show', date: 'Sat, 11 Apr • 19:00', loc: '1 event near you', img: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjM0QyQzRGIi8+PC9zdmc+' },
    { id: 3, title: 'Kanan Gill', date: 'Sat, 09 May • 17:00', loc: '1 event near you', img: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMUMyNjM4Ii8+PC9zdmc+' },
    { id: 4, title: 'Biswa Kalyan Rath', date: 'Sat, 30 May • 14:00', loc: '2 events near you', img: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNEQ0RDREIi8+PC9zdmc+' },
];

const popularCategories = [
    { id: 1, title: 'Pop', img: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzgxRDM4Ii8+PC9zdmc+' },
    { id: 2, title: 'Rock Music', img: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMkIzQTVBIi8+PC9zdmc+' },
    { id: 3, title: 'Football', img: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjM0E2QzNCIi8+PC9zdmc+' },
    { id: 4, title: 'Formula 1', img: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTkxQTE4Ii8+PC9zdmc+' },
];


export default function Home() {
    const { 
        isAuthenticated, 
        openAuthModal,
        liveMatches,
        isLoadingMatches,
        apiError,
        userCity,
        fetchLocationAndMatches
    } = useAppStore();

    useEffect(() => {
        fetchLocationAndMatches();
    }, [fetchLocationAndMatches]);

    const handleRestrictedAction = (actionName) => {
        if (!isAuthenticated) openAuthModal();
        else console.log(`Executing secure real-time action: ${actionName}`);
    };

    return (
        <div className="animate-fade-in w-full pb-20 overflow-x-hidden">
            
            {/* Top Categories Filters (Viagogo Style) */}
            <div className="flex items-center space-x-3 mb-8 overflow-x-auto hide-scrollbar pb-2 pt-2 border-b border-gray-100">
                <button className="bg-[#E6F2D9] text-[#114C2A] px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap">All types</button>
                <button className="bg-white border border-gray-200 text-brand-text px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-50 transition-colors">Sports</button>
                <button className="bg-white border border-gray-200 text-brand-text px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-50 transition-colors">Concerts</button>
                <button className="bg-white border border-gray-200 text-brand-text px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-50 transition-colors">Theatre & Comedy</button>
            </div>

            {/* SPOTIFY BANNER */}
            <div className="w-full bg-black rounded-xl p-4 md:p-6 mb-12 flex flex-col md:flex-row justify-between items-center text-white cursor-pointer hover:bg-gray-900 transition-colors">
                <div className="flex items-center mb-4 md:mb-0 space-x-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-[#1DB954] rounded-full flex items-center justify-center">
                            {/* Simplified Spotify Icon */}
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="black"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.36.18.54.84.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.239.54-.959.72-1.56.3z"/></svg>
                        </div>
                        <span className="font-bold text-xl tracking-tight">Spotify</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-tight">Connect your Spotify account and sync your favorite artists</h3>
                        <p className="text-sm text-gray-400">Discover events from who you actually listen to</p>
                    </div>
                </div>
                <button className="bg-[#1DB954] text-black font-bold px-6 py-2.5 rounded-full text-sm hover:bg-[#1ed760] transition-colors w-full md:w-auto">
                    Connect Spotify
                </button>
            </div>

            {/* RECENTLY VIEWED RAIL */}
            <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-brand-text">Recently viewed</h2>
                    <button className="border border-gray-300 px-4 py-1.5 rounded-lg text-sm font-bold text-brand-text hover:bg-gray-50">Edit</button>
                </div>
                <div className="flex overflow-x-auto hide-scrollbar space-x-4 pb-4">
                    {recentlyViewed.map(item => (
                        <div key={item.id} className="min-w-[280px] max-w-[280px] flex-shrink-0 cursor-pointer group">
                            <div className="relative w-full h-[160px] rounded-xl overflow-hidden mb-3">
                                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 backdrop-blur-sm z-10 transition-colors">
                                    <Heart size={14} className="text-white"/>
                                </button>
                            </div>
                            <h3 className="font-bold text-brand-text text-base leading-tight group-hover:underline">{item.title}</h3>
                        </div>
                    ))}
                </div>
            </div>

            {/* RECOMMENDED FOR YOU RAIL */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-brand-text mb-6">Recommended for you</h2>
                <div className="flex overflow-x-auto hide-scrollbar space-x-4 pb-4">
                    {recommended.map(item => (
                        <div key={item.id} className="min-w-[240px] max-w-[240px] flex-shrink-0 cursor-pointer group">
                            <div className="relative w-full h-[180px] rounded-xl overflow-hidden mb-3">
                                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 backdrop-blur-sm z-10 transition-colors">
                                    <Heart size={14} className="text-white"/>
                                </button>
                            </div>
                            <h3 className="font-bold text-brand-text text-base leading-tight group-hover:underline mb-1">{item.title}</h3>
                            <p className="text-sm text-brand-muted">{item.date}</p>
                            <p className="text-sm font-bold text-brand-muted">{item.loc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* POPULAR CATEGORIES RAIL */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-brand-text mb-6">Popular categories</h2>
                <div className="flex overflow-x-auto hide-scrollbar space-x-4 pb-4">
                    {popularCategories.map(item => (
                        <div key={item.id} className="min-w-[260px] max-w-[260px] flex-shrink-0 cursor-pointer group relative h-[180px] rounded-xl overflow-hidden">
                            <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            {/* Gradient Overlay for Text Readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                                <h3 className="font-bold text-white text-lg leading-tight">{item.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ARTIST TOUR SUBSCRIPTION BANNER */}
            <div className="w-full border border-gray-200 rounded-xl p-4 mb-12 flex flex-col md:flex-row justify-between items-center bg-white cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-6 mb-4 md:mb-0 w-full md:w-auto">
                    {/* Overlapping Avatars */}
                    <div className="flex -space-x-4">
                        <div className="w-14 h-14 rounded-full border-2 border-white bg-pink-500 z-30 overflow-hidden"><img src={popularCategories[0].img} className="w-full h-full object-cover opacity-50" /></div>
                        <div className="w-14 h-14 rounded-full border-2 border-white bg-blue-500 z-20 overflow-hidden"><img src={popularCategories[1].img} className="w-full h-full object-cover opacity-50" /></div>
                        <div className="w-14 h-14 rounded-full border-2 border-white bg-yellow-500 z-10 overflow-hidden"><img src={popularCategories[2].img} className="w-full h-full object-cover opacity-50" /></div>
                    </div>
                    <h3 className="font-bold text-lg md:text-xl text-brand-text">Discover when your favourite artists are on tour</h3>
                </div>
                <button className="bg-[#212529] text-white font-bold px-8 py-3 rounded-xl text-sm hover:bg-black transition-colors w-full md:w-auto">
                    Subscribe
                </button>
            </div>

            {/* COMEDY RAIL */}
            <div className="mb-16">
                <h2 className="text-2xl font-bold text-brand-text mb-6">Comedy</h2>
                <div className="flex overflow-x-auto hide-scrollbar space-x-4 pb-4">
                    {recommended.map((item, idx) => (
                        <div key={`comedy-${item.id}`} className="min-w-[240px] max-w-[240px] flex-shrink-0 cursor-pointer group">
                            <div className="relative w-full h-[180px] rounded-xl overflow-hidden mb-3">
                                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" style={{ filter: `hue-rotate(${idx * 40}deg)` }}/>
                                <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 backdrop-blur-sm z-10 transition-colors">
                                    <Heart size={14} className="text-white"/>
                                </button>
                            </div>
                            <h3 className="font-bold text-brand-text text-base leading-tight group-hover:underline mb-1">{item.title}</h3>
                            <p className="text-sm text-brand-muted">{item.date}</p>
                            <p className="text-sm font-bold text-brand-muted">{item.loc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* THE ODDS API REAL-TIME INTEGRATION (TICKETING STYLE) */}
            <div className="mb-16">
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-2xl font-bold text-brand-text tracking-tight">Live Sports Events</h2>
                </div>

                <div className="flex space-x-3 mb-6 overflow-x-auto hide-scrollbar pb-2">
                    <button className="bg-[#114C2A] text-white px-4 py-2.5 rounded-full text-sm font-bold flex items-center whitespace-nowrap shadow-sm">
                        <MapPin size={16} className="mr-2"/> {userCity}
                    </button>
                    <button onClick={fetchLocationAndMatches} className="bg-white border border-brand-border text-[#458731] px-4 py-2.5 rounded-full text-sm font-bold flex items-center whitespace-nowrap hover:bg-[#E6F2D9] transition-colors shadow-sm">
                        <RefreshCw size={14} className={`mr-2 ${isLoadingMatches ? 'animate-spin' : ''}`}/> Refresh Data
                    </button>
                </div>

                <h3 className="font-bold text-base text-brand-text mb-4">
                    {isLoadingMatches ? 'Scanning for events...' : `${liveMatches.length} events in ${userCity === 'All Cities' ? 'all locations' : userCity}`}
                </h3>

                <div className="space-y-4 mb-8">
                    {apiError && (
                        <div className="w-full bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                            <AlertCircle size={32} className="text-brand-red mb-3" />
                            <h3 className="font-bold text-lg text-brand-text mb-1">Live Data Feed Offline</h3>
                            <p className="text-sm text-brand-muted">{apiError}</p>
                        </div>
                    )}

                    {isLoadingMatches && !apiError && (
                        <div className="w-full border border-brand-border rounded-2xl p-12 flex flex-col items-center justify-center">
                            <div className="w-8 h-8 border-4 border-[#114C2A] border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-sm font-bold text-brand-text">Loading events...</p>
                        </div>
                    )}

                    {!isLoadingMatches && !apiError && liveMatches.map(m => (
                        <motion.div 
                            whileHover={{ scale: 1.002, borderColor: '#ccc' }} 
                            key={m.id} 
                            className="bg-white border border-[#DEE2E6] rounded-[16px] p-4 flex flex-col md:flex-row md:items-center hover:shadow-md transition-all cursor-pointer"
                        >
                            <div className="flex flex-1 items-center">
                                <div className="flex flex-col items-center justify-center pr-4 md:pr-6 border-r border-[#DEE2E6] min-w-[70px]">
                                    <span className="text-xs font-bold text-brand-text">{m.month}</span>
                                    <span className="text-2xl font-black text-brand-text my-0">{m.day}</span>
                                    <span className="text-xs text-brand-muted">{m.dow}</span>
                                </div>
                                
                                <div className="pl-4 md:pl-6 flex-1">
                                    <h3 className="text-[17px] font-bold text-brand-text leading-tight mb-1">{m.t1} vs {m.t2}</h3>
                                    <p className="text-[13px] text-brand-muted flex items-center mb-2">
                                        {m.time} • 🇮🇳 {m.loc}
                                    </p>
                                    <div className="flex space-x-2 items-center">
                                        <div className="flex items-center text-brand-text bg-brand-panel px-2 py-1 rounded text-xs font-medium border border-[#DEE2E6]">
                                            <Calendar size={12} className="mr-1.5 opacity-60"/> Today
                                        </div>
                                        {m.tag && (
                                            <div className={`flex items-center px-2 py-1 rounded text-xs font-bold border border-transparent ${m.tagColor}`}>
                                                <Info size={12} className="mr-1.5"/> {m.tag}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 md:mt-0 flex flex-col items-end w-full md:w-auto border-t border-[#DEE2E6] md:border-t-0 pt-4 md:pt-0">
                                 <span className="text-xs text-brand-muted font-bold mb-2 md:mb-1 w-full text-center md:text-right">Odds: {m.odds}</span>
                                 <button 
                                    onClick={() => handleRestrictedAction(`See Tickets for ${m.t1}`)}
                                    className="w-full md:w-auto bg-white border border-gray-300 text-brand-text rounded-lg px-6 py-2 font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm"
                                 >
                                     See tickets
                                 </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* APP DOWNLOAD BANNER */}
            <div className="w-full bg-[#E6F2D9] rounded-2xl overflow-hidden p-8 md:p-12 flex flex-col md:flex-row justify-between items-center relative min-h-[200px]">
                <div className="md:w-1/2 z-10 mb-8 md:mb-0 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-black text-[#114C2A] mb-2 tracking-tight">Download the parbet app</h2>
                    <p className="text-lg text-[#114C2A]/80 font-medium">Discover your favourite events with ease</p>
                </div>
                
                {/* Simulated App Mockups (Absolute Center) */}
                <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px]">
                    <div className="absolute w-[150px] h-[280px] bg-black rounded-3xl border-[6px] border-gray-800 shadow-2xl rotate-[-15deg] translate-x-10 translate-y-10 overflow-hidden">
                        <div className="w-full h-full bg-[#E6F2D9] opacity-50"></div>
                    </div>
                    <div className="absolute w-[150px] h-[280px] bg-black rounded-3xl border-[6px] border-gray-800 shadow-2xl rotate-[15deg] translate-x-24 -translate-y-4 overflow-hidden">
                         <div className="w-full h-full bg-[#458731] opacity-50"></div>
                    </div>
                </div>

                <div className="flex items-center space-x-4 z-10">
                    <button className="bg-black text-white px-4 py-2 rounded-xl flex items-center hover:bg-gray-900 transition-colors h-[50px]">
                        <Download size={24} className="mr-2" />
                        <div className="text-left leading-none">
                            <span className="text-[10px] block opacity-80">Download on the</span>
                            <span className="text-sm font-bold">App Store</span>
                        </div>
                    </button>
                    <button className="bg-black text-white px-4 py-2 rounded-xl flex items-center hover:bg-gray-900 transition-colors h-[50px]">
                        <Download size={24} className="mr-2" />
                        <div className="text-left leading-none">
                            <span className="text-[10px] block opacity-80">GET IT ON</span>
                            <span className="text-sm font-bold">Google Play</span>
                        </div>
                    </button>
                    <div className="hidden md:flex bg-white p-2 rounded-xl h-[50px] items-center justify-center border border-gray-200">
                        <QrCode size={36} className="text-black"/>
                    </div>
                </div>
            </div>

        </div>
    );
}