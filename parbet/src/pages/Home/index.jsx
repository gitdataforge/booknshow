import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Heart, ShieldCheck } from 'lucide-react';

const matches = [
    { id: 1, month: "Apr", day: "4", dow: "Sat", league: "Indian Premier League", t1: "Delhi Capitals", t2: "Mumbai Indians", time: "3:30 PM", loc: "Delhi, India • Arun Jaitley Stadium", odds: "1.85", tag: "Hottest event on our site", tagColor: "text-brand-accent bg-brand-primaryLight" },
    { id: 2, month: "Apr", day: "4", dow: "Sat", league: "Indian Premier League", t1: "Gujarat Titans", t2: "Rajasthan Royals", time: "7:30 PM", loc: "Ahmedabad, India • Narendra Modi Stadium", odds: "2.10", tag: "Today", tagColor: "text-brand-muted bg-brand-panel" },
    { id: 3, month: "Apr", day: "5", dow: "Sun", league: "Indian Premier League", t1: "Sunrisers Hyderabad", t2: "Lucknow Super Giants", time: "3:30 PM", loc: "Hyderabad, India • Rajiv Gandhi Stadium", odds: "1.95", tag: "Tomorrow", tagColor: "text-brand-muted bg-brand-panel" },
    { id: 4, month: "Apr", day: "5", dow: "Sun", league: "Indian Premier League", t1: "Royal Challengers Bengaluru", t2: "Chennai Super Kings", time: "7:30 PM", loc: "Bengaluru, India • M. Chinnaswamy Stadium", odds: "1.75", tag: "Selling Fast", tagColor: "text-brand-red bg-red-50" }
];

export default function Home() {
    return (
        <div className="animate-fade-in w-full pb-20">
            {/* Title Section */}
            <div className="flex justify-between items-end mb-6">
                <h1 className="text-4xl md:text-5xl font-black text-brand-text leading-tight">Indian Premier<br/>League Betting</h1>
                <button className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center hover:bg-brand-panel transition-colors"><Heart size={18} className="text-brand-muted"/></button>
            </div>

            {/* Filters Row */}
            <div className="flex space-x-3 mb-8 overflow-x-auto hide-scrollbar">
                <button className="bg-brand-text text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center whitespace-nowrap"><MapPin size={16} className="mr-2"/> Pune</button>
                <button className="bg-white border border-brand-border text-brand-text px-4 py-2 rounded-xl text-sm font-bold flex items-center whitespace-nowrap"><Calendar size={16} className="mr-2"/> All dates</button>
                <button className="bg-white border border-brand-border text-brand-text px-4 py-2 rounded-xl text-sm font-bold flex items-center whitespace-nowrap">Price</button>
            </div>

            {/* Hero Banner (Green Patterned) */}
            <div className="w-full h-64 md:h-80 bg-brand-primary rounded-3xl overflow-hidden mb-10 relative flex items-center shadow-lg">
                <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCI+CjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNMCAwbDQwIDQwbC00MCA0MHoiIGZpbGw9IiM0NTg3MzEiLz4KPHBhdGggZD0iTTQwIDBsNDAgNDBsLTQwIDQweiIgZmlsbD0iI0U2RjJEOSIvPgo8L3N2Zz4=')]"></div>
                <div className="relative z-10 p-8 md:p-12 w-full flex justify-between items-center">
                    <div>
                        <h2 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">WORLD<br/>CUP</h2>
                        <button className="border border-white/30 text-white hover:bg-white/10 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors">See Markets</button>
                    </div>
                </div>
                <button className="absolute top-6 right-6 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center hover:bg-black/50 transition-colors z-20"><Heart size={18} className="text-white"/></button>
            </div>

            <h3 className="font-bold text-lg mb-4">63 events available</h3>

            {/* Viagogo Style Match List */}
            <div className="space-y-4 mb-12">
                {matches.map(m => (
                    <motion.div whileHover={{ scale: 1.01 }} key={m.id} className="bg-white border border-brand-border rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center hover:shadow-md transition-all cursor-pointer">
                        {/* Desktop Layout Inner Flex */}
                        <div className="flex flex-1 items-center">
                            {/* Date Block */}
                            <div className="flex flex-col items-center justify-center pr-4 md:pr-6 border-r border-brand-border min-w-[70px]">
                                <span className="text-sm font-bold text-brand-muted">{m.month}</span>
                                <span className="text-2xl font-black text-brand-text my-0.5">{m.day}</span>
                                <span className="text-xs text-brand-muted">{m.dow}</span>
                            </div>
                            
                            {/* Match Info */}
                            <div className="pl-4 md:pl-6 flex-1">
                                <h3 className="text-lg font-bold text-brand-text leading-tight mb-1">{m.t1} vs {m.t2}</h3>
                                <p className="text-sm text-brand-muted mb-2">{m.time} • {m.loc}</p>
                                <div className="flex space-x-2">
                                    {m.tag && <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${m.tagColor}`}>{m.tag}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons / Odds (Mobile stacks below, Desktop pushes right) */}
                        <div className="mt-4 md:mt-0 flex space-x-2 w-full md:w-auto">
                             <button className="flex-1 md:flex-none border border-brand-border rounded-xl px-6 py-2.5 font-bold text-sm text-brand-text hover:bg-brand-panel transition-colors shadow-sm">Odds: {m.odds}</button>
                             <button className="flex-1 md:flex-none bg-brand-text text-white rounded-xl px-6 py-2.5 font-bold text-sm hover:bg-brand-text/90 transition-colors shadow-sm">Place Bet</button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer Trust Elements */}
            <div className="border-t border-brand-border pt-10 flex flex-col md:flex-row justify-between">
                <div>
                    <div className="flex items-center space-x-2 mb-4">
                        <ShieldCheck size={32} className="text-brand-accent"/>
                        <div>
                            <h4 className="font-bold text-lg text-brand-text">parbet guarantee</h4>
                        </div>
                    </div>
                    <ul className="space-y-2 text-sm font-bold text-brand-muted">
                        <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-brand-accent mr-2"></div> World class security checks</li>
                        <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-brand-accent mr-2"></div> Transparent pricing</li>
                        <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-brand-accent mr-2"></div> 100% order guarantee</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}