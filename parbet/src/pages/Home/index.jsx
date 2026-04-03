import React from 'react';
import { useAppStore } from '../../store/useStore';
import { Wallet, Send, ArrowDownToLine, Grid, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
    const { balance } = useAppStore();

    return (
        <div className="p-6 md:p-10 animate-fade-in w-full max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <p className="text-sm text-brand-muted">Hello!</p>
                    <h1 className="text-xl font-bold">Brooklyn Simmons</h1>
                </div>
                <div className="w-12 h-12 rounded-full bg-brand-card border border-white/10 flex items-center justify-center overflow-hidden"><User size={20} className="text-brand-muted"/></div>
            </div>

            {/* Wallet Card */}
            <motion.div whileHover={{ scale: 0.98 }} className="w-full bg-gradient-to-br from-brand-primaryLight to-brand-primary rounded-[32px] p-6 mb-8 shadow-[0_15px_40px_rgba(29,122,242,0.3)] relative overflow-hidden">
                <div className="absolute right-[-20px] top-[-20px] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <p className="text-white/80 font-medium">Betting Wallet</p>
                    <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-white/30 backdrop-blur"></div>
                        <div className="w-6 h-6 rounded-full bg-white/50 backdrop-blur"></div>
                    </div>
                </div>
                <h2 className="text-4xl font-black tracking-tight mb-8 relative z-10">$ {balance.toFixed(3)}</h2>
                <div className="flex justify-between items-center text-sm font-mono text-white/80 relative z-10">
                    <span>**** **** **** 7890</span>
                    <span>08/28</span>
                </div>
            </motion.div>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-4 mb-10">
                {[ { icon: <Wallet/>, label: 'Deposit' }, { icon: <Send/>, label: 'Transfer' }, { icon: <ArrowDownToLine/>, label: 'Withdraw' }, { icon: <Grid/>, label: 'More' } ].map((btn, i) => (
                    <div key={i} className="flex flex-col items-center space-y-3 cursor-pointer group">
                        <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center bg-brand-card group-hover:bg-white/5 transition-colors">
                            {React.cloneElement(btn.icon, { size: 20, className: "text-white" })}
                        </div>
                        <span className="text-[11px] text-brand-muted font-medium">{btn.label}</span>
                    </div>
                ))}
            </div>

            {/* Recent Bets / Matches */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Recent Bets</h2>
                <select className="bg-transparent text-sm text-brand-muted outline-none cursor-pointer"><option>Last Week</option></select>
            </div>
            
            <div className="space-y-4">
                {[
                    { name: 'Champions League', desc: 'Real Madrid vs PSG', amount: -50.00, color: 'text-brand-red' },
                    { name: 'NBA Finals', desc: 'Lakers Spread +5.5', amount: +249.00, color: 'text-brand-green' },
                    { name: 'Esports Major', desc: 'CS:GO Fnatic Win', amount: -15.00, color: 'text-brand-red' }
                ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-brand-card rounded-2xl border border-white/5 hover:bg-brand-cardHover transition-colors cursor-pointer">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-brand-bg flex items-center justify-center border border-white/5 text-xs font-bold">{item.name[0]}</div>
                            <div>
                                <p className="font-bold text-sm">{item.name}</p>
                                <p className="text-xs text-brand-muted mt-0.5">{item.desc}</p>
                            </div>
                        </div>
                        <span className={`font-bold text-sm ${item.color}`}>{item.amount > 0 ? '+' : ''}$ {Math.abs(item.amount)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}