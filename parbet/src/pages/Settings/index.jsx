import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useStore';
import { sendParbetEmail } from '../../lib/email';
import { ChevronLeft, Send, Activity, BarChart, Bell, Zap, Trophy, Shield, Settings as SettingsIcon, Mail } from 'lucide-react';

export default function Settings() {
    const navigate = useNavigate();
    const { balance, diamonds, user } = useAppStore();
    const [emailStatus, setEmailStatus] = useState('');

    const handleTestEmail = async () => {
        setEmailStatus('Sending...');
        const res = await sendParbetEmail({ to_name: 'Admin', message: `Ping from Settings.` });
        setEmailStatus(res.success ? 'Sent!' : 'Failed');
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-4 md:p-8 animate-fade-in">
            
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-8">
                <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-brand-card border border-white/5 flex items-center justify-center hover:bg-white/5 transition-colors"><ChevronLeft size={18}/></button>
                <h1 className="font-bold text-xl tracking-wide">Settings</h1>
                <div className="w-10"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-24 md:pb-8">
                
                <motion.div whileHover={{ scale: 0.99 }} className="bg-brand-card p-6 rounded-[24px] border border-white/5 shadow-lg md:col-span-2 bg-gradient-to-r from-brand-card to-brand-primary/10">
                    <Zap className="text-brand-primary mb-4" size={32} />
                    <h2 className="text-2xl font-black mb-2 text-white">Elevate Your Betting</h2>
                    <p className="text-sm text-brand-muted mb-6 max-w-md">Access premium features, manage your secure wallet, and control your global Parbet settings within the Settings module.</p>
                    <button className="bg-brand-primary hover:bg-brand-primaryLight text-white font-bold py-3 px-8 rounded-full text-sm transition-colors shadow-[0_0_20px_rgba(29,122,242,0.3)]">Configure Module</button>
                </motion.div>

                <div className="bg-brand-card p-6 rounded-[24px] border border-white/5">
                    <p className="text-[10px] text-brand-muted uppercase tracking-wider mb-2">Live Balance</p>
                    <p className="text-3xl font-black text-white">${balance.toFixed(2)}</p>
                </div>
                <div className="bg-brand-card p-6 rounded-[24px] border border-white/5">
                    <p className="text-[10px] text-brand-muted uppercase tracking-wider mb-2">Diamonds</p>
                    <p className="text-3xl font-black text-brand-accent">{diamonds}</p>
                </div>

                <div className="bg-brand-card rounded-[24px] border border-white/5 p-6 md:col-span-2">
                    <div className="flex items-center space-x-2 mb-6">
                        <Activity className="text-brand-green" size={20} />
                        <h3 className="font-bold text-lg">Live Data Sync</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex justify-between items-center p-4 bg-brand-bg rounded-xl border border-white/5">
                                <span className="text-sm font-medium text-brand-muted">Stream {i}</span>
                                <span className="text-brand-green text-[10px] font-bold animate-pulse uppercase tracking-wider">Syncing</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-brand-card rounded-[24px] border border-white/5 p-6">
                    <h3 className="font-bold mb-4 flex items-center text-sm"><SettingsIcon className="mr-2 text-brand-muted" size={16}/> Preferences</h3>
                    <p className="text-xs text-brand-muted mb-6 leading-relaxed">Toggle functionalities for the Settings environment. Changes sync instantly via Firestore rules.</p>
                    <div className="w-12 h-6 bg-brand-primary rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div></div>
                </div>

                <div className="bg-brand-card rounded-[24px] border border-white/5 p-6">
                    <h3 className="font-bold mb-4 flex items-center text-sm"><Mail className="mr-2 text-brand-muted" size={16}/> System Ping</h3>
                    <p className="text-xs text-brand-muted mb-6">Dispatch secure administrative notifications utilizing your global .env configuration.</p>
                    <button onClick={handleTestEmail} className="w-full bg-brand-bg border border-white/10 text-white font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 hover:bg-white/5 transition-colors">
                        <Send size={14} />
                        <span className="text-xs">{emailStatus || 'Ping Administrator'}</span>
                    </button>
                </div>

            </div>
        </div>
    );
}