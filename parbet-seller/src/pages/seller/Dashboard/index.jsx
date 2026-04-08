import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, TrendingUp, Calendar, MapPin, Loader2, PlusCircle, List } from 'lucide-react';
import { useSellerStore } from '../../../store/useSellerStore';

// ------------------------------------------------------------------
// COMPONENT 1: Real-Time Sales Analytics Widget
// ------------------------------------------------------------------
const SalesAnalytics = ({ listings }) => {
    // Dynamically calculate metrics based on 100% real Firebase data
    const totalListings = listings.length;
    const totalTickets = listings.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const potentialRevenue = listings.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-[8px] border border-gray-200 p-6 flex items-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="w-12 h-12 bg-[#EAF4D9] rounded-full flex items-center justify-center mr-4 shrink-0">
                    <List className="text-[#458731]" size={24} />
                </div>
                <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-[#54626c] uppercase tracking-wider mb-1">Active Listings</span>
                    <span className="text-[28px] font-black text-[#1a1a1a] leading-none">{totalListings}</span>
                </div>
            </div>

            <div className="bg-white rounded-[8px] border border-gray-200 p-6 flex items-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mr-4 shrink-0">
                    <Ticket className="text-blue-600" size={24} />
                </div>
                <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-[#54626c] uppercase tracking-wider mb-1">Tickets for Sale</span>
                    <span className="text-[28px] font-black text-[#1a1a1a] leading-none">{totalTickets}</span>
                </div>
            </div>

            <div className="bg-white rounded-[8px] border border-gray-200 p-6 flex items-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mr-4 shrink-0">
                    <TrendingUp className="text-gray-600" size={24} />
                </div>
                <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-[#54626c] uppercase tracking-wider mb-1">Potential Revenue</span>
                    <span className="text-[28px] font-black text-[#1a1a1a] leading-none">₹{potentialRevenue.toLocaleString('en-IN')}</span>
                </div>
            </div>
        </div>
    );
};

// ------------------------------------------------------------------
// COMPONENT 2: Real-Time Ticket Data Grid
// ------------------------------------------------------------------
const TicketListTable = ({ listings, isLoading }) => {
    if (isLoading) {
        return (
            <div className="w-full bg-white rounded-[8px] border border-gray-200 p-16 flex flex-col items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <Loader2 className="animate-spin text-[#458731] mb-4" size={32} />
                <p className="text-[15px] font-medium text-[#54626c]">Syncing live tickets from global network...</p>
            </div>
        );
    }

    if (!listings || listings.length === 0) {
        return (
            <div className="w-full bg-white rounded-[8px] border border-gray-200 p-16 flex flex-col items-center justify-center text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-5 border border-gray-100">
                    <Ticket className="text-gray-400" size={32} />
                </div>
                <h3 className="text-[22px] font-black text-[#1a1a1a] mb-2 tracking-tight">No active listings</h3>
                <p className="text-[15px] text-[#54626c] max-w-md font-medium">You haven't listed any tickets yet. Search for an IPL event on the homepage to start selling.</p>
            </div>
        );
    }

    return (
        <div className="w-full bg-white rounded-[8px] border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-[#54626c] text-[12px] uppercase tracking-wider font-bold">
                            <th className="px-6 py-4 whitespace-nowrap">Event Details</th>
                            <th className="px-6 py-4 whitespace-nowrap">Date & Location</th>
                            <th className="px-6 py-4 whitespace-nowrap">Qty</th>
                            <th className="px-6 py-4 whitespace-nowrap">Price / Ticket</th>
                            <th className="px-6 py-4 whitespace-nowrap">Network Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {listings.map(listing => (
                            <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-[14px] font-bold text-[#1a1a1a]">{listing.t1} {listing.t2 ? `vs ${listing.t2}` : ''}</span>
                                        <span className="text-[12px] text-gray-500 mt-1 font-medium">{listing.league}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-[13px] text-[#1a1a1a] font-medium flex items-center"><Calendar size={13} className="mr-2 text-gray-400"/> {new Date(listing.commence_time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                        <span className="text-[12px] text-gray-500 mt-1.5 flex items-center"><MapPin size={13} className="mr-2 text-gray-400"/> {listing.loc}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-[14px] font-black text-[#1a1a1a]">{listing.quantity}</td>
                                <td className="px-6 py-5 text-[14px] font-black text-[#1a1a1a]">₹{listing.price.toLocaleString('en-IN')}</td>
                                <td className="px-6 py-5">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold bg-[#EAF4D9] text-[#114C2A] uppercase tracking-wider shadow-sm border border-[#c1e19d]">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#458731] mr-2 animate-pulse"></span>
                                        Active
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ------------------------------------------------------------------
// COMPONENT 3: Master Dashboard Layout
// ------------------------------------------------------------------
export default function Dashboard() {
    const { fetchMyListings, myListings, isLoadingListings } = useSellerStore();
    const navigate = useNavigate();

    // Trigger the real-time Firebase network sync the moment the dashboard loads
    useEffect(() => {
        fetchMyListings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen bg-[#f8f9fa] py-8 md:py-12 px-4 md:px-8 font-sans flex-1">
            <div className="max-w-[1200px] mx-auto">
                
                {/* Header Block */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
                    <div>
                        <h1 className="text-[32px] md:text-[40px] font-black text-[#1a1a1a] tracking-tight leading-tight mb-2">
                            My Tickets
                        </h1>
                        <p className="text-[16px] text-[#54626c] font-medium">
                            Manage your real-time inventory on the parbet global marketplace.
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate('/')}
                        className="mt-6 md:mt-0 bg-[#458731] hover:bg-[#366a26] text-white font-bold px-6 py-3.5 rounded-[8px] text-[15px] transition-colors shadow-sm flex items-center w-full md:w-auto justify-center"
                    >
                        <PlusCircle size={18} className="mr-2" /> List New Tickets
                    </button>
                </div>

                {/* Real-Time Analytics Widget */}
                <SalesAnalytics listings={myListings} />

                {/* Real-Time Data Grid */}
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-[20px] font-black text-[#1a1a1a] tracking-tight">Active Inventory</h2>
                </div>
                <TicketListTable listings={myListings} isLoading={isLoadingListings} />

            </div>
        </div>
    );
}