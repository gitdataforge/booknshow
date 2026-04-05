import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store/useStore';

export default function FilterDropdown({ type, isOpen, onClose, options = [] }) {
    const { 
        performerFilters = {
            dateRange: { from: null, to: null },
            activeOpponent: null,
            priceBuckets: [],
            homeAway: 'All games'
        }, 
        setPerformerFilter 
    } = useAppStore();

    const dropdownRef = useRef(null);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Container scaling based on type
    const getDropdownWidth = () => {
        switch (type) {
            case 'date': return 'w-[340px]';
            case 'opponent': return 'w-[280px]';
            case 'homeAway': return 'w-[220px]';
            case 'price': return 'w-[200px]';
            default: return 'w-[200px]';
        }
    };

    // ------------------------------------------------------------------
    // 1. DATE RANGE CALENDAR UI (image_f557a3.png)
    // ------------------------------------------------------------------
    const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3, 1)); // Default to April 2026
    
    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

    const renderDateCalendar = () => {
        const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
        const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
        
        const days = Array(firstDay).fill(null).concat(Array.from({length: daysInMonth}, (_, i) => i + 1));
        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const { from, to } = performerFilters.dateRange;

        const handleDayClick = (day) => {
            if (!day) return;
            const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            
            if (!from || (from && to)) {
                setPerformerFilter('dateRange', { from: clickedDate.toISOString(), to: null });
            } else {
                const fromDate = new Date(from);
                if (clickedDate < fromDate) {
                    setPerformerFilter('dateRange', { from: clickedDate.toISOString(), to: null });
                } else {
                    setPerformerFilter('dateRange', { from, to: clickedDate.toISOString() });
                }
            }
        };

        const isDaySelected = (day) => {
            if (!day) return false;
            const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).setHours(0,0,0,0);
            const fromD = from ? new Date(from).setHours(0,0,0,0) : null;
            const toD = to ? new Date(to).setHours(0,0,0,0) : null;

            if (d === fromD || d === toD) return 'selected';
            if (fromD && toD && d > fromD && d < toD) return 'in-range';
            return false;
        };

        const formatDate = (isoString) => {
            if (!isoString) return '';
            return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        };

        return (
            <div className="p-5">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-[18px] text-brand-text">Select date range</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-black"><X size={20}/></button>
                </div>
                
                <div className="flex gap-4 mb-6">
                    <div className="flex-1 border-b border-gray-300 pb-2">
                        <span className="text-[12px] font-bold text-brand-text block mb-1">From</span>
                        <span className="text-[14px] text-brand-muted">{formatDate(from)}</span>
                    </div>
                    <div className="flex-1 border-b border-gray-300 pb-2">
                        <span className="text-[12px] font-bold text-brand-text block mb-1">To</span>
                        <span className="text-[14px] text-brand-muted">{formatDate(to)}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-4 px-2">
                    <button onClick={prevMonth} className="text-gray-500 hover:text-black"><ChevronLeft size={20}/></button>
                    <span className="font-bold text-[15px] text-brand-text">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={nextMonth} className="text-gray-500 hover:text-black"><ChevronRight size={20}/></button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {weekDays.map(wd => <div key={wd} className="text-[12px] font-medium text-gray-500">{wd}</div>)}
                </div>
                
                <div className="grid grid-cols-7 gap-y-2 text-center">
                    {days.map((day, idx) => {
                        const status = isDaySelected(day);
                        return (
                            <div key={idx} className="flex justify-center items-center h-10">
                                {day ? (
                                    <button 
                                        onClick={() => handleDayClick(day)}
                                        className={`w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-medium transition-colors ${
                                            status === 'selected' ? 'bg-white border-2 border-[#114C2A] text-brand-text font-bold' :
                                            status === 'in-range' ? 'bg-[#EAF4D9] text-[#114C2A]' :
                                            'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        {day}
                                    </button>
                                ) : <div className="w-9 h-9" />}
                            </div>
                        );
                    })}
                </div>

                <button 
                    onClick={() => setPerformerFilter('dateRange', {from: null, to: null})}
                    className="w-full mt-6 py-2.5 rounded-xl border border-[#458731] text-[#458731] font-bold hover:bg-[#EAF4D9] transition-colors"
                >
                    Clear
                </button>
            </div>
        );
    };

    // ------------------------------------------------------------------
    // 2. OPPONENT SEARCH UI (image_f55804.png)
    // ------------------------------------------------------------------
    const [searchQuery, setSearchQuery] = useState('');
    const renderOpponentList = () => {
        const allOps = ['All opponents', ...options];
        const filtered = allOps.filter(o => o.toLowerCase().includes(searchQuery.toLowerCase()));
        const active = performerFilters.activeOpponent || 'All opponents';

        return (
            <div className="flex flex-col max-h-[350px]">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" placeholder="Opponent name" 
                            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-[#80C2FF] rounded-[10px] outline-none focus:ring-1 focus:ring-[#80C2FF] text-[15px]" 
                        />
                    </div>
                </div>
                <div className="overflow-y-auto hide-scrollbar py-2">
                    {filtered.map(opp => (
                        <button 
                            key={opp}
                            onClick={() => { setPerformerFilter('activeOpponent', opp); onClose(); }}
                            className={`w-full text-left px-5 py-3 text-[15px] flex items-center justify-between hover:bg-gray-50 transition-colors ${active === opp ? 'bg-gray-50' : ''}`}
                        >
                            <span className={active === opp ? 'text-brand-text font-bold' : 'text-gray-700'}>{opp}</span>
                            {active === opp && <Check size={18} className="text-gray-500" />}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    // ------------------------------------------------------------------
    // 3. PRICE BUCKET CHECKBOX UI (image_f55863.png)
    // ------------------------------------------------------------------
    const renderPriceBuckets = () => {
        const prices = ['$', '$$', '$$$', '$$$$'];
        const activeBuckets = performerFilters.priceBuckets || [];

        const togglePrice = (val) => {
            if (activeBuckets.includes(val)) {
                setPerformerFilter('priceBuckets', activeBuckets.filter(p => p !== val));
            } else {
                setPerformerFilter('priceBuckets', [...activeBuckets, val]);
            }
        };

        return (
            <div className="py-2">
                {prices.map(p => {
                    const isSelected = activeBuckets.includes(p);
                    return (
                        <button 
                            key={p} onClick={() => togglePrice(p)}
                            className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                        >
                            <span className="text-[16px] text-brand-text font-medium">{p}</span>
                            <div className={`w-5 h-5 rounded-[4px] border flex items-center justify-center transition-colors ${isSelected ? 'border-[#114C2A] bg-[#114C2A]' : 'border-gray-300'}`}>
                                {isSelected && <Check size={14} className="text-white stroke-[3]"/>}
                            </div>
                        </button>
                    );
                })}
            </div>
        );
    };

    // ------------------------------------------------------------------
    // 4. HOME/AWAY TOGGLE UI (image_f55b61.png)
    // ------------------------------------------------------------------
    const renderHomeAway = () => {
        const haOptions = ['All games', 'Home games', 'Away games'];
        const activeHA = performerFilters.homeAway || 'All games';

        return (
            <div className="py-2">
                {haOptions.map(option => (
                    <button 
                        key={option}
                        onClick={() => { setPerformerFilter('homeAway', option); onClose(); }}
                        className={`w-full text-left px-5 py-3 text-[15px] flex items-center justify-between hover:bg-gray-50 transition-colors ${activeHA === option ? 'bg-gray-50' : ''}`}
                    >
                        <span className={activeHA === option ? 'text-brand-text font-bold' : 'text-gray-700'}>{option}</span>
                        {activeHA === option && <Check size={18} className="text-gray-600"/>}
                    </button>
                ))}
            </div>
        );
    };

    const renderContent = () => {
        switch (type) {
            case 'date': return renderDateCalendar();
            case 'opponent': return renderOpponentList();
            case 'price': return renderPriceBuckets();
            case 'homeAway': return renderHomeAway();
            default: return null;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className={`absolute top-full left-0 mt-2 bg-white rounded-[16px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-gray-100 z-50 overflow-hidden ${getDropdownWidth()}`}
                    onClick={(e) => e.stopPropagation()} 
                >
                    {renderContent()}
                </motion.div>
            )}
        </AnimatePresence>
    );
}