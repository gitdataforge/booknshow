import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Plus, 
    Filter, 
    MoreVertical, 
    Ticket, 
    Calendar, 
    MapPin, 
    AlertCircle, 
    CheckCircle2, 
    Trash2, 
    Edit3, 
    ExternalLink,
    TrendingUp,
    Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSellerStore } from '../../store/useSellerStore';

export default function Listings() {
    const navigate = useNavigate();
    
    // FEATURE 1: Secure Data Injection from Seller Engine
    const { listings = [], isLoading, deleteListing } = useSellerStore();

    // FEATURE 2: Complex Inventory State Machine
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('Active');
    const [selectedIds, setSelectedIds] = useState([]);

    // FEATURE 3: Real-Time Multi-Tab Filtering Logic
    const filteredListings = useMemo(() => {
        return listings.filter(item => {
            const matchesSearch = (item.eventName || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTab = 
                activeTab === 'All' ? true :
                activeTab === 'Active' ? item.status === 'active' :
                activeTab === 'Sold' ? item.status === 'sold' :
                activeTab === 'Expired' ? item.status === 'expired' : true;
            return matchesSearch && matchesTab;
        }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [listings, searchTerm, activeTab]);

    // FEATURE 4: Status Badge Logic Engine
    const renderStatus = (status) => {
        const styles = {
            active: 'bg-[#eaf4d9] text-[#458731]',
            sold: 'bg-[#ebf3fb] text-[#0064d2]',
            expired: 'bg-gray-100 text-gray-500',
            pending: 'bg-orange-50 text-orange-600'
        };
        const label = status?.charAt(0).toUpperCase() + status?.slice(1) || 'Active';
        return (
            <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest ${styles[status] || styles.active}`}>
                {label}
            </span>
        );
    };

    // FEATURE 5: Bulk Selection Toggle
    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    // FEATURE 6: Framer Motion Animation Physics
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.98, y: 10 },
        show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25 } }
    };

    if (isLoading) {
        return (
            <div className="w-full h-[60vh] flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#1a1a1a] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-[13px] font-bold text-[#54626c] tracking-widest uppercase">Syncing Inventory...</p>
            </div>
        );
    }

    return (
        <motion.div 
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="w-full font-sans max-w-[1100px] pb-20"
        >
            {/* FEATURE 7: Header with CTA Injection */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
                <div>
                    <h1 className="text-[32px] font-black text-[#1a1a1a] tracking-tighter leading-tight mb-2">My Listings</h1>
                    <p className="text-[#54626c] text-[15px]">Manage your tickets, adjust pricing, and track inventory health.</p>
                </div>
                <button 
                    onClick={() => navigate('/sell')}
                    className="flex items-center justify-center gap-2 bg-[#458731] hover:bg-[#366a26] text-white px-6 py-3 rounded-[4px] font-bold text-[14px] transition-all shadow-sm"
                >
                    <Plus size={18} /> Create New Listing
                </button>
            </div>

            {/* FEATURE 8: Inventory Analytics Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Active', value: listings.filter(l => l.status === 'active').length, icon: <TrendingUp size={14}/> },
                    { label: 'Sold', value: listings.filter(l => l.status === 'sold').length, icon: <CheckCircle2 size={14}/> },
                    { label: 'Expired', value: listings.filter(l => l.status === 'expired').length, icon: <Clock size={14}/> },
                    { label: 'Total Value', value: `₹${listings.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0)}`, icon: <Ticket size={14}/> }
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-[#e2e2e2] p-4 rounded-[4px] shadow-sm">
                        <div className="flex items-center gap-2 text-[#54626c] text-[11px] font-bold uppercase tracking-wider mb-1">
                            {stat.icon} {stat.label}
                        </div>
                        <div className="text-[20px] font-black text-[#1a1a1a]">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* FEATURE 9: Interactive Toolbelt (Search & Tabs) */}
            <div className="bg-white border border-[#e2e2e2] rounded-[4px] shadow-sm mb-6 overflow-hidden">
                <div className="flex flex-col md:flex-row border-b border-[#e2e2e2]">
                    <div className="flex-1 flex overflow-x-auto no-scrollbar">
                        {['Active', 'Sold', 'Expired', 'All'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-4 text-[14px] font-bold transition-all whitespace-nowrap border-b-2 ${
                                    activeTab === tab 
                                    ? 'border-[#458731] text-[#458731] bg-gray-50' 
                                    : 'border-transparent text-[#54626c] hover:text-[#1a1a1a] hover:bg-gray-50'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="p-2 md:w-80 border-t md:border-t-0 md:border-l border-[#e2e2e2]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Filter by event..."
                                className="w-full pl-10 pr-4 py-2 bg-[#f8f9fa] border border-[#cccccc] rounded-[4px] text-[14px] outline-none focus:border-[#458731] transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* FEATURE 10: Dynamic Listing Grid with Real-Time Mutations */}
                <div className="p-0">
                    <AnimatePresence mode="popLayout">
                        {filteredListings.length > 0 ? (
                            <div className="divide-y divide-[#e2e2e2]">
                                {filteredListings.map((item) => (
                                    <motion.div 
                                        key={item.id}
                                        variants={itemVariants}
                                        layout
                                        exit={{ opacity: 0, x: -20 }}
                                        className="p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-start gap-4 flex-1">
                                            <div 
                                                onClick={() => toggleSelect(item.id)}
                                                className={`w-5 h-5 rounded border mt-1 cursor-pointer flex items-center justify-center transition-all ${selectedIds.includes(item.id) ? 'bg-[#458731] border-[#458731]' : 'bg-white border-[#cccccc]'}`}
                                            >
                                                {selectedIds.includes(item.id) && <CheckCircle2 size={12} className="text-white" />}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                    <h3 className="text-[16px] font-black text-[#1a1a1a] truncate">{item.eventName || 'IPL 2026 Match'}</h3>
                                                    {renderStatus(item.status)}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-[13px] text-[#54626c]">
                                                    <span className="flex items-center gap-1"><Calendar size={14}/> {item.date || 'TBA'}</span>
                                                    <span className="flex items-center gap-1"><MapPin size={14}/> {item.venue || 'Local Stadium'}</span>
                                                    <span className="flex items-center gap-1 font-bold text-[#1a1a1a]">Section {item.section || 'Gen'} • Row {item.row || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                                            <div className="text-right">
                                                <div className="text-[12px] font-bold text-[#54626c] uppercase tracking-wider mb-0.5">List Price</div>
                                                <div className="text-[20px] font-black text-[#1a1a1a]">₹{item.price}</div>
                                            </div>
                                            
                                            {/* Action Menu */}
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => navigate(`/sell?edit=${item.id}`)}
                                                    className="p-2 text-gray-400 hover:text-[#458731] hover:bg-[#eaf4d9] rounded-full transition-all"
                                                    title="Edit Listing"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => deleteListing(item.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                                                    title="Remove Listing"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            /* FEATURE 11: Production-Grade Empty State */
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-20 px-6 flex flex-col items-center justify-center text-center"
                            >
                                <div className="w-16 h-16 bg-[#f8f9fa] rounded-full flex items-center justify-center mb-4">
                                    <Ticket size={28} className="text-gray-300" />
                                </div>
                                <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-2">No listings found</h3>
                                <p className="text-[15px] text-[#54626c] max-w-sm mb-8">
                                    {searchTerm || activeTab !== 'Active' 
                                        ? "Try adjusting your filters or search terms to find what you're looking for."
                                        : "You haven't listed any tickets yet. Start selling today to reach millions of fans."}
                                </p>
                                <button 
                                    onClick={() => activeTab !== 'Active' ? setActiveTab('Active') : navigate('/sell')}
                                    className="bg-[#1a1a1a] hover:bg-[#333333] text-white px-8 py-3 rounded-[4px] font-bold text-[14px] transition-colors"
                                >
                                    {activeTab !== 'Active' ? 'View Active Listings' : 'List Your Tickets'}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* FEATURE 12: Footer Context Alert */}
            <div className="bg-[#ebf3fb] border border-[#0064d2]/20 rounded-[4px] p-4 flex items-start gap-3">
                <AlertCircle className="text-[#0064d2] shrink-0 mt-0.5" size={18} />
                <p className="text-[13px] text-[#0064d2] font-medium leading-relaxed">
                    <strong>Note:</strong> Listings for upcoming IPL matches may take up to 2 hours to appear on the public marketplace after verification. You can edit your pricing at any time before a sale is confirmed.
                </p>
            </div>
        </motion.div>
    );
}