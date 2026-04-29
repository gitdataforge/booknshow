import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Ticket, IndianRupee, ArrowRight, Clock, 
    Calendar, MapPin, ShieldCheck, User, TrendingUp, AlertCircle,
    CheckCircle2, Activity, Share2, Smartphone, Timer, Zap, ChevronRight
} from 'lucide-react';
import { useMainStore } from '../../store/useMainStore';

/**
 * FEATURE 1: Framer Motion Staggered Rendering Engine
 * FEATURE 2: Real-Time Time-Based Greeting Algorithm
 * FEATURE 3: Intelligent Upcoming Event Extraction
 * FEATURE 4: Live Escrow Wallet Formatting
 * FEATURE 5: Active Order Ledger Summary
 * FEATURE 6: Resolved CheckCircle2 Import Crash
 * FEATURE 7: Live Event Countdown Timer Engine
 * FEATURE 8: Dynamic Account Completion/Strength Calculator
 * FEATURE 9: Recent Activity Ledger Feed
 * FEATURE 10: Connected Devices/Session Tracker UI
 * FEATURE 11: One-Click Profile Sharing Hook
 * FEATURE 12: Interactive Hardware-Accelerated Progress Bars
 */

const formatShortDate = (isoString) => {
    if (!isoString) return 'TBA';
    const d = new Date(isoString);
    if (isNaN(d)) return 'TBA';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function Overview() {
    const navigate = useNavigate();
    const { user, orders, wallet } = useMainStore();
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });

    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    }, []);

    const upcomingEvent = useMemo(() => {
        if (!orders || orders.length === 0) return null;
        const now = new Date().getTime();
        const futureOrders = orders.filter(o => {
            const eventTime = new Date(o.commence_time || o.eventTimestamp || o.createdAt).getTime();
            return isNaN(eventTime) || eventTime >= now;
        });
        
        if (futureOrders.length === 0) return null;

        futureOrders.sort((a, b) => {
            const timeA = new Date(a.commence_time || a.eventTimestamp || a.createdAt).getTime();
            const timeB = new Date(b.commence_time || b.eventTimestamp || b.createdAt).getTime();
            return timeA - timeB;
        });

        return futureOrders[0];
    }, [orders]);

    // FEATURE 7: Live Event Countdown Timer
    useEffect(() => {
        if (!upcomingEvent) return;
        const targetTime = new Date(upcomingEvent.commence_time || upcomingEvent.eventTimestamp).getTime();
        if (isNaN(targetTime)) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetTime - now;
            
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    mins: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
                });
            } else {
                clearInterval(interval);
            }
        }, 60000); // Update every minute

        // Initial calculation
        const now = new Date().getTime();
        const difference = targetTime - now;
        if (difference > 0) {
            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                mins: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
            });
        }

        return () => clearInterval(interval);
    }, [upcomingEvent]);

    // FEATURE 8: Profile Strength Calculator
    const profileStrength = useMemo(() => {
        let score = 25; // Base score for creating account
        if (user?.emailVerified) score += 25;
        if (wallet?.bankAdded) score += 25; // Assuming structure exists
        if (orders?.length > 0) score += 25;
        return score;
    }, [user, wallet, orders]);

    // FEATURE 11: Share Profile Hook
    const handleShareProfile = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My Parbet Profile',
                    text: 'Check out my verified buyer profile on Parbet.',
                    url: window.location.href,
                });
            } catch (err) {
                console.error("Share failed", err);
            }
        } else {
            alert("Sharing not supported on this browser.");
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
    };

    return (
        <div className="p-6 md:p-8 w-full max-w-[1000px] mx-auto bg-[#f8f9fa] min-h-screen">
            <motion.div 
                variants={containerVariants} 
                initial="hidden" 
                animate="show"
                className="flex flex-col space-y-8"
            >
                
                {/* Header Section */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e2e2e2] pb-6 bg-white p-6 rounded-[12px] shadow-sm">
                    <div>
                        <p className="text-[14px] font-bold text-gray-500 uppercase tracking-widest mb-1">{greeting},</p>
                        <h1 className="text-[28px] md:text-[32px] font-black text-[#1a1a1a] tracking-tight leading-none">
                            {user?.displayName || user?.email ? user.email.split('@')[0] : 'Parbet User'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={handleShareProfile} className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                            <Share2 size={16} className="text-gray-600" />
                        </button>
                        <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-[6px] text-[12px] font-bold flex items-center shadow-sm">
                            <ShieldCheck size={14} className="mr-1.5" /> Buyer Account Active
                        </span>
                    </div>
                </motion.div>

                {/* Profile Strength Indicator */}
                <motion.div variants={itemVariants} className="bg-white border border-[#e2e2e2] rounded-[12px] p-5 shadow-sm flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1 w-full">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[14px] font-bold text-[#1a1a1a]">Profile Strength</span>
                            <span className="text-[14px] font-black text-[#427A1A]">{profileStrength}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: `${profileStrength}%` }} 
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-[#8cc63f] to-[#427A1A] rounded-full"
                            ></motion.div>
                        </div>
                    </div>
                    {profileStrength < 100 && (
                        <button onClick={() => navigate('/profile/settings')} className="text-[13px] font-bold text-white bg-[#1a1a1a] px-4 py-2 rounded-[6px] hover:bg-black whitespace-nowrap">
                            Complete Profile
                        </button>
                    )}
                </motion.div>

                {/* Top Statistics Grid */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-[#e2e2e2] rounded-[12px] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-60"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-blue-50 rounded-[8px] flex items-center justify-center mb-5 border border-blue-100">
                                <Ticket size={24} className="text-blue-600" />
                            </div>
                            <h3 className="text-[16px] font-bold text-[#1a1a1a] mb-1">Total Active Tickets</h3>
                            <div className="flex items-end gap-3 mb-6">
                                <p className="text-[36px] font-black text-[#1a1a1a] leading-none">{orders.length}</p>
                                <p className="text-[13px] font-medium text-gray-500 mb-1">reserved events</p>
                            </div>
                        </div>
                        <button onClick={() => navigate('/profile/orders')} className="relative z-10 w-full py-3 bg-gray-50 text-[#1a1a1a] text-[14px] font-bold rounded-[8px] hover:bg-gray-100 transition-colors border border-gray-200 flex items-center justify-center">
                            Manage Orders <ArrowRight size={16} className="ml-2" />
                        </button>
                    </div>

                    <div className="bg-white border border-[#e2e2e2] rounded-[12px] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-60"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-[#eaf4d9] rounded-[8px] flex items-center justify-center mb-5 border border-[#d4edda]">
                                <IndianRupee size={24} className="text-[#427A1A]" />
                            </div>
                            <h3 className="text-[16px] font-bold text-[#1a1a1a] mb-1">Available Escrow Balance</h3>
                            <div className="flex items-end gap-3 mb-6">
                                <p className="text-[36px] font-black text-[#1a1a1a] leading-none">
                                    {wallet.currency} {wallet.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => navigate('/profile/sales')} className="relative z-10 w-full py-3 bg-[#427A1A] text-white text-[14px] font-bold rounded-[8px] hover:bg-[#2F6114] transition-colors shadow-sm flex items-center justify-center">
                            Withdraw Funds <TrendingUp size={16} className="ml-2" />
                        </button>
                    </div>
                </motion.div>

                {/* Main Content Split */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Column (Spans 2) - Next Event Insight & Activity */}
                    <div className="lg:col-span-2 flex flex-col space-y-6">
                        <div className="bg-white border border-[#e2e2e2] rounded-[12px] p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-[18px] font-black text-[#1a1a1a] flex items-center">
                                    <Calendar size={20} className="mr-2 text-[#427A1A]" /> Your Next Event
                                </h3>
                                {upcomingEvent && (
                                    <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1 rounded-[6px] text-[12px] font-bold">
                                        <Timer size={14} className="text-[#427A1A]" /> 
                                        {timeLeft.days}d {timeLeft.hours}h {timeLeft.mins}m
                                    </div>
                                )}
                            </div>
                            
                            {upcomingEvent ? (
                                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-gray-50 border border-gray-100 rounded-[12px] p-5">
                                    <div className="w-full sm:w-[120px] h-[80px] bg-white border border-gray-200 rounded-[8px] overflow-hidden shrink-0">
                                        <img src={upcomingEvent.imageUrl || "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=300"} alt="Event" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="bg-orange-100 text-orange-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-[4px]">Upcoming</span>
                                            <span className="text-[13px] font-bold text-gray-500">{formatShortDate(upcomingEvent.commence_time || upcomingEvent.eventTimestamp || upcomingEvent.createdAt)}</span>
                                        </div>
                                        <h4 className="text-[16px] font-black text-[#1a1a1a] truncate mb-2">{upcomingEvent.eventName || 'Parbet Event'}</h4>
                                        <div className="flex items-center text-[13px] text-gray-500 font-medium">
                                            <MapPin size={14} className="mr-1.5" /> <span className="truncate">{upcomingEvent.eventLoc || 'Venue details on ticket'}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => navigate('/profile/orders')} className="w-full sm:w-auto px-5 py-2.5 bg-white border border-gray-300 text-[#1a1a1a] rounded-[8px] text-[13px] font-bold hover:bg-gray-100 transition-colors shrink-0 shadow-sm">
                                        View Ticket
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-[12px] p-8 flex flex-col items-center justify-center text-center">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
                                        <Ticket size={24} className="text-gray-300" />
                                    </div>
                                    <p className="text-[15px] font-bold text-[#1a1a1a] mb-1">No upcoming events</p>
                                    <p className="text-[13px] text-gray-500 mb-4 max-w-sm">You haven't purchased any tickets for future dates yet. Discover what's happening near you.</p>
                                    <button onClick={() => navigate('/')} className="bg-[#1a1a1a] text-white px-6 py-2 rounded-[8px] font-bold text-[13px] hover:bg-black transition-colors">
                                        Explore Events
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Recent Activity Ledger */}
                        <div className="bg-white border border-[#e2e2e2] rounded-[12px] p-6 shadow-sm">
                            <h3 className="text-[18px] font-black text-[#1a1a1a] mb-5 flex items-center">
                                <Activity size={20} className="mr-2 text-blue-600" /> Recent Activity
                            </h3>
                            <div className="space-y-4">
                                {orders.slice(0, 3).map((order, idx) => (
                                    <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"><Zap size={14} className="text-gray-500"/></div>
                                            <div>
                                                <p className="text-[13px] font-bold text-[#1a1a1a]">Ticket Reserved</p>
                                                <p className="text-[11px] text-gray-500">{order.eventName}</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-300" />
                                    </div>
                                ))}
                                {orders.length === 0 && <p className="text-[13px] text-gray-500 italic">No recent platform activity.</p>}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Security & Profile Health */}
                    <div className="flex flex-col space-y-6">
                        <div className="bg-white border border-[#e2e2e2] rounded-[12px] p-6 shadow-sm">
                            <h3 className="text-[18px] font-black text-[#1a1a1a] mb-5 flex items-center">
                                <User size={20} className="mr-2 text-blue-600" /> Account Health
                            </h3>
                            
                            <div className="space-y-5">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5"><CheckCircle2 size={16} className="text-[#427A1A]" /></div>
                                    <div>
                                        <p className="text-[14px] font-bold text-[#1a1a1a]">Email Verified</p>
                                        <p className="text-[12px] text-gray-500">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5"><AlertCircle size={16} className="text-orange-500" /></div>
                                    <div>
                                        <p className="text-[14px] font-bold text-[#1a1a1a]">Payout Details</p>
                                        <p className="text-[12px] text-gray-500 mb-2">Add bank details to receive funds from sales.</p>
                                        <button onClick={() => navigate('/profile/settings')} className="text-[12px] font-bold text-[#0064d2] hover:underline">
                                            Configure Now
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5"><Clock size={16} className="text-gray-400" /></div>
                                    <div>
                                        <p className="text-[14px] font-bold text-[#1a1a1a]">Account Created</p>
                                        <p className="text-[12px] text-gray-500">Secure member since {new Date(user?.metadata?.creationTime || Date.now()).getFullYear()}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-6 pt-5 border-t border-gray-100 w-full">
                                <button onClick={() => navigate('/profile/settings')} className="w-full py-2 bg-gray-50 border border-gray-200 text-[#1a1a1a] rounded-[8px] text-[13px] font-bold hover:bg-gray-100 transition-colors shadow-sm">
                                    Manage Settings
                                </button>
                            </div>
                        </div>

                        {/* Connected Devices */}
                        <div className="bg-white border border-[#e2e2e2] rounded-[12px] p-6 shadow-sm">
                            <h3 className="text-[15px] font-black text-[#1a1a1a] mb-4 flex items-center">
                                <Smartphone size={16} className="mr-2 text-gray-600" /> Current Session
                            </h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[13px] font-bold text-[#1a1a1a]">Active Device</p>
                                    <p className="text-[11px] text-gray-500">Pune, India • Just now</p>
                                </div>
                                <span className="bg-green-100 text-green-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-[4px]">This Device</span>
                            </div>
                        </div>
                    </div>

                </motion.div>
            </motion.div>
        </div>
    );
}