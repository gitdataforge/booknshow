import React from 'react';
import { ChevronLeft, MoreHorizontal, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Discovery() {
    const navigate = useNavigate();
    return (
        <div className="p-6 md:p-10 animate-fade-in w-full max-w-4xl mx-auto h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <button onClick={()=>navigate('/')} className="w-10 h-10 rounded-full bg-brand-card border border-white/5 flex items-center justify-center"><ChevronLeft size={18}/></button>
                <h1 className="text-lg font-bold">Statistics</h1>
                <button className="w-10 h-10 rounded-full bg-brand-card border border-white/5 flex items-center justify-center"><MoreHorizontal size={18}/></button>
            </div>

            {/* Time Toggle */}
            <div className="flex bg-brand-card rounded-2xl p-1 mb-8 border border-white/5">
                <button className="flex-1 py-2 text-sm text-brand-muted font-medium rounded-xl">Day</button>
                <button className="flex-1 py-2 text-sm text-brand-muted font-medium rounded-xl">Month</button>
                <button className="flex-1 py-2 text-sm font-bold bg-brand-bg rounded-xl shadow-sm">Year</button>
            </div>

            {/* Legend */}
            <div className="flex space-x-6 mb-12 px-2">
                <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-brand-primary"></div><span className="text-xs font-medium">$ 7,786.00 Won</span></div>
                <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-brand-green"></div><span className="text-xs font-medium">$ 4,200.00 Lost</span></div>
            </div>

            {/* Spline Chart Mockup */}
            <div className="relative w-full h-48 mb-8 border-b border-white/10 flex items-end justify-between px-2">
                {/* SVG Curve */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M0,50 Q20,80 40,40 T80,60 T100,30" fill="none" stroke="#7000FF" strokeWidth="2" className="opacity-50 drop-shadow-[0_0_10px_rgba(112,0,255,0.8)]"/>
                </svg>
                {/* Highlight Pillar */}
                <div className="absolute left-[38%] bottom-0 w-12 h-[60%] bg-gradient-to-t from-brand-green/0 via-brand-green/40 to-brand-green rounded-t-full flex justify-center">
                    <div className="w-3 h-3 bg-white rounded-full mt-[-6px] shadow-[0_0_15px_#fff]"></div>
                    <div className="absolute top-[-35px] bg-white text-black text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">$ 7,786.00</div>
                </div>
                {/* X Axis */}
                {['Oct','Nov','Dec','Jan','Feb','Mar','Apr','May'].map((m,i) => (
                    <span key={i} className={`text-[10px] pb-2 ${i === 2 ? 'text-brand-green font-bold' : 'text-brand-muted'}`}>{m}</span>
                ))}
            </div>

            {/* Search */}
            <div className="flex items-center bg-brand-card rounded-2xl px-4 py-3 border border-white/5 mb-8">
                <Search size={18} className="text-brand-muted mr-3"/>
                <input type="text" placeholder="Search bets..." className="bg-transparent outline-none flex-1 text-sm text-white placeholder-brand-muted"/>
            </div>

            {/* Transactions List */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Transactions</h2>
                <span className="text-xs text-brand-muted cursor-pointer flex items-center">Income <ChevronLeft size={12} className="ml-1 -rotate-90"/></span>
            </div>
            
            <div className="space-y-4 flex-1">
                {[
                    { name: 'Kathryn Murphy', date: '31 Dec - 19:55 PM', amount: -999, color: 'text-brand-red' },
                    { name: 'Jenny Wilson', date: '30 Dec - 14:30 PM', amount: +249, color: 'text-brand-green' }
                ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-brand-card border border-white/10 flex items-center justify-center text-xs font-bold">{item.name[0]}</div>
                            <div>
                                <p className="font-bold text-sm">{item.name}</p>
                                <p className="text-[10px] text-brand-muted mt-0.5">{item.date}</p>
                            </div>
                        </div>
                        <span className={`font-bold text-sm ${item.color}`}>{item.amount > 0 ? '+' : ''}$ {Math.abs(item.amount)}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}