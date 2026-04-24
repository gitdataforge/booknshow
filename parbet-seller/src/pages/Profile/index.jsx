import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useSellerStore } from '../../store/useSellerStore';

export default function ProfileOverview() {
    const navigate = useNavigate();
    
    // FEATURE 1: Production-Grade Data Extraction
    // Connects directly to the live Firebase-backed Zustand store
    const { 
        user, 
        orders = [], 
        listings = [], 
        sales = [], 
        isLoading 
    } = useSellerStore();

    // FEATURE 2: Strict Auth Guard Interceptor
    // Prevents permission-denied crashes by halting execution and redirecting unauthorized users
    useEffect(() => {
        if (!isLoading && !user) {
            console.warn("[Parbet Security] Unauthenticated dashboard access blocked. Redirecting.");
            navigate('/login', { replace: true });
        }
    }, [user, isLoading, navigate]);

    // FEATURE 3: Mathematical Inventory Engine
    const activeListingsCount = useMemo(() => {
        return listings.filter(l => l.status === 'active').length;
    }, [listings]);

    // FEATURE 4: Framer Motion Staggered Physics
    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } }
    };

    // FEATURE 5: Protected Render Gate
    if (isLoading || !user) {
        return (
            <div className="w-full h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-[#1a1a1a] mb-5" size={36} />
                <div className="flex items-center gap-2 text-[13px] font-black text-[#54626c] tracking-widest uppercase bg-[#f8f9fa] px-4 py-2 rounded-full border border-[#e2e2e2]">
                    <ShieldAlert size={14} className="text-[#8cc63f]" />
                    {isLoading ? 'Syncing Secure Ledger...' : 'Authenticating Session...'}
                </div>
            </div>
        );
    }

    return (
        <motion.div 
            initial="hidden"
            animate="show"
            variants={container}
            className="w-full font-sans max-w-[900px] pb-20"
        >
            {/* FEATURE 6: 1:1 Viagogo Main Header */}
            <motion.h1 variants={item} className="text-[28px] md:text-[32px] font-black text-[#1a1a1a] tracking-tight leading-tight mb-6">
                Profile
            </motion.h1>

            {/* FEATURE 7: Orders Module */}
            <motion.div variants={item} className="bg-white border border-[#cccccc] rounded-[4px] p-5 shadow-sm mb-4">
                <div className="pb-3 border-b border-[#e2e2e2] mb-4">
                    <h3 className="text-[18px] font-bold text-[#1a1a1a]">Orders</h3>
                </div>
                {orders.length === 0 ? (
                    <p className="text-[15px] text-[#1a1a1a] mb-6">You don't have any upcoming events scheduled right now</p>
                ) : (
                    <p className="text-[15px] text-[#1a1a1a] mb-6">You have {orders.length} upcoming event{orders.length > 1 ? 's' : ''} scheduled right now</p>
                )}
                <div className="text-center">
                    <button 
                        onClick={() => navigate('/profile/orders')} 
                        className="text-[15px] text-[#0064d2] hover:underline"
                    >
                        View all orders
                    </button>
                </div>
            </motion.div>

            {/* FEATURE 8: Listings Module */}
            <motion.div variants={item} className="bg-white border border-[#cccccc] rounded-[4px] p-5 shadow-sm mb-4">
                <div className="pb-3 border-b border-[#e2e2e2] mb-4">
                    <h3 className="text-[18px] font-bold text-[#1a1a1a]">Listings</h3>
                </div>
                {activeListingsCount === 0 ? (
                    <p className="text-[15px] text-[#1a1a1a] mb-6">You don't have any listings right now</p>
                ) : (
                    <p className="text-[15px] text-[#1a1a1a] mb-6">You have {activeListingsCount} active listing{activeListingsCount > 1 ? 's' : ''} right now</p>
                )}
                <div className="text-center">
                    <button 
                        onClick={() => navigate('/profile/listings')} 
                        className="text-[15px] text-[#0064d2] hover:underline"
                    >
                        View all listings
                    </button>
                </div>
            </motion.div>

            {/* FEATURE 9: Sales Module */}
            <motion.div variants={item} className="bg-white border border-[#cccccc] rounded-[4px] p-5 shadow-sm mb-4">
                <div className="pb-3 border-b border-[#e2e2e2] mb-4">
                    <h3 className="text-[18px] font-bold text-[#1a1a1a]">Sales</h3>
                </div>
                {sales.length === 0 ? (
                    <p className="text-[15px] text-[#1a1a1a] mb-6">You don't have any sales right now</p>
                ) : (
                    <p className="text-[15px] text-[#1a1a1a] mb-6">You have {sales.length} confirmed sale{sales.length > 1 ? 's' : ''} right now</p>
                )}
                <div className="text-center">
                    <button 
                        onClick={() => navigate('/profile/sales')} 
                        className="text-[15px] text-[#0064d2] hover:underline"
                    >
                        View all sales
                    </button>
                </div>
            </motion.div>

            {/* FEATURE 10: Payments Module (Specific Green Link Override) */}
            <motion.div variants={item} className="bg-white border border-[#cccccc] rounded-[4px] p-5 shadow-sm mb-4">
                <div className="pb-3 border-b border-[#e2e2e2] mb-3">
                    <h3 className="text-[18px] font-bold text-[#1a1a1a]">Payments</h3>
                </div>
                <div className="text-left">
                    <button 
                        onClick={() => navigate('/profile/payments')} 
                        className="text-[15px] text-[#458731] hover:underline"
                    >
                        View payment statuses
                    </button>
                </div>
            </motion.div>

            {/* FEATURE 11: Contact Info Module (Split Grid Replica) */}
            <motion.div variants={item} className="bg-white border border-[#cccccc] rounded-[4px] p-5 shadow-sm mb-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end pb-3 border-b border-[#e2e2e2] mb-4 gap-3">
                    <h3 className="text-[18px] font-bold text-[#1a1a1a]">Contact Info</h3>
                    <div className="flex flex-wrap items-center gap-3 text-[14px] text-[#458731]">
                        <button onClick={() => navigate('/profile/settings')} className="hover:underline">Edit contact info</button>
                        <span className="text-[#cccccc] hidden md:inline">|</span>
                        <button onClick={() => navigate('/profile/settings')} className="hover:underline">Edit address</button>
                        <span className="text-[#cccccc] hidden md:inline">|</span>
                        <button onClick={() => navigate('/profile/settings')} className="hover:underline">Change password</button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[15px] text-[#54626c]">
                    <div>
                        <p>{user?.displayName || 'Seller Profile'}</p>
                    </div>
                    <div>
                        <p className="mb-1">{user?.phoneNumber || '+91 8329004424'}</p>
                        <p>{user?.email}</p>
                    </div>
                </div>
            </motion.div>

        </motion.div>
    );
}