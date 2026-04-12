import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Info, Package, Calendar, MapPin, Loader2 } from 'lucide-react';
import { useMainStore } from '../../store/useMainStore';

export default function Orders() {
    // FEATURE 1: State Management for 1:1 Sub-Tabs
    const [activeTab, setActiveTab] = useState('Current');
    
    // FEATURE 2: Real-Time Data Extraction
    const { orders, isLoadingOrders } = useMainStore();

    // FEATURE 3: Logical Data Filtering (Production Rules)
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const isFinished = ['delivered', 'cancelled', 'completed'].includes(order.status?.toLowerCase());
            return activeTab === 'Current' ? !isFinished : isFinished;
        });
    }, [orders, activeTab]);

    // FEATURE 4: Staggered Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="w-full font-sans max-w-[900px] pb-20"
        >
            {/* FEATURE 5: Strict Typography & Header Mapping */}
            <motion.h1 
                variants={itemVariants}
                className="text-[32px] font-black text-[#1a1a1a] mb-2 tracking-tighter leading-tight"
            >
                Orders
            </motion.h1>
            
            {/* FEATURE 6: Interactive Tab Navigation Logic */}
            <motion.div variants={itemVariants} className="flex border-b border-[#e2e2e2] mb-8">
                {['Current', 'Past'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-3 px-1 mr-8 text-[15px] font-bold transition-all border-b-2 ${
                            activeTab === tab 
                            ? 'border-[#458731] text-[#458731]' 
                            : 'border-transparent text-[#54626c] hover:text-[#1a1a1a]'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </motion.div>

            {/* FEATURE 7: Real-Time Loading State Logic */}
            {isLoadingOrders ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white">
                    <Loader2 className="animate-spin text-[#458731] mb-4" size={32} />
                    <p className="text-[#54626c] font-medium text-[14px]">Fetching order manifest...</p>
                </div>
            ) : filteredOrders.length > 0 ? (
                /* FEATURE 8: Populated Orders List (Real Logic) */
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <motion.div 
                            key={order.id}
                            variants={itemVariants}
                            className="bg-white border border-[#e2e2e2] rounded-[4px] p-5 flex flex-col md:flex-row justify-between hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div className="flex items-start space-x-4">
                                <div className="bg-[#f8f9fa] p-3 rounded">
                                    <Package size={24} className="text-[#458731]" />
                                </div>
                                <div>
                                    <h4 className="text-[16px] font-bold text-[#1a1a1a]">{order.eventName || 'Event Tickets'}</h4>
                                    <div className="flex flex-col space-y-1 mt-1">
                                        <div className="flex items-center text-[13px] text-[#54626c]">
                                            <Calendar size={14} className="mr-1.5" /> {order.eventDate || 'TBD'}
                                        </div>
                                        <div className="flex items-center text-[13px] text-[#54626c]">
                                            <MapPin size={14} className="mr-1.5" /> {order.venue || 'Global Venue'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 flex flex-col md:items-end justify-center">
                                <span className={`px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider ${
                                    order.status === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-[#eaf4d9] text-[#458731]'
                                }`}>
                                    {order.status}
                                </span>
                                <p className="text-[14px] font-black text-[#1a1a1a] mt-2">Order ID: #{order.id.substring(0,8).toUpperCase()}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                /* FEATURE 9 & 10: 1:1 Replica Troubleshooting & Empty State Mapping */
                <motion.div variants={itemVariants} className="w-full flex flex-col">
                    <div className="w-full border border-[#e2e2e2] rounded-[4px] p-8 mb-10 bg-white shadow-sm">
                        <h3 className="text-[16px] font-bold text-[#1a1a1a] mb-6">Don't see your orders? Here's what you can do:</h3>
                        
                        <div className="space-y-8">
                            <section>
                                <p className="text-[14px] font-bold text-[#1a1a1a] mb-4">Check your email address</p>
                                <ul className="space-y-4">
                                    <li className="flex items-start text-[14px] text-[#1a1a1a] leading-normal">
                                        <ChevronRight size={18} className="text-[#458731] mr-3 mt-0.5 shrink-0" strokeWidth={3} />
                                        Ensure the email used for purchase matches the email on this account
                                    </li>
                                    <li className="flex items-start text-[14px] text-[#1a1a1a] leading-normal">
                                        <ChevronRight size={18} className="text-[#458731] mr-3 mt-0.5 shrink-0" strokeWidth={3} />
                                        If different, sign out and sign back in with the correct email
                                    </li>
                                </ul>
                            </section>

                            <section>
                                <p className="text-[14px] font-bold text-[#1a1a1a] mb-4">If the email on this account is correct, you might have checked out as a guest</p>
                                <ul className="space-y-4">
                                    <li className="flex items-start text-[14px] text-[#1a1a1a] leading-normal">
                                        <ChevronRight size={18} className="text-[#458731] mr-3 mt-0.5 shrink-0" strokeWidth={3} />
                                        Find your Guest Access Code in the order confirmation email
                                    </li>
                                    <li className="flex items-start text-[14px] text-[#1a1a1a] leading-normal">
                                        <ChevronRight size={18} className="text-[#458731] mr-3 mt-0.5 shrink-0" strokeWidth={3} />
                                        Sign out, click 'Sign In', and select 'Guest Purchase? Find your order'
                                    </li>
                                    <li className="flex items-start text-[14px] text-[#1a1a1a] leading-normal">
                                        <ChevronRight size={18} className="text-[#458731] mr-3 mt-0.5 shrink-0" strokeWidth={3} />
                                        Enter your email and access code to view your order
                                    </li>
                                </ul>
                            </section>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}