import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Info, CheckCircle2, XCircle, Users, 
    ShieldCheck, AlertTriangle, HelpCircle, 
    MapPin, Navigation, Star, Activity
} from 'lucide-react';

/**
 * GLOBAL REBRAND: Booknshow Interactive Seat Matrix
 * Enforced Colors: #FFFFFF, #E7364D, #333333, #EB5B6E, #FAD8DC, #A3A3A3, #626262
 */

// Official Booknshow Logo Component for local branding
const BrandLogo = ({ textColor = "#333333" }) => {
    const fillHex = textColor.includes('#') ? textColor.match(/#(?:[0-9a-fA-F]{3,8})/)[0] : "#333333";
    return (
        <div className="flex items-center justify-center select-none relative z-10 scale-75 origin-left">
            <svg viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[30px]">
                <text x="10" y="70" fontFamily="Inter, sans-serif" fontSize="64" fontWeight="800" fill={fillHex} letterSpacing="-2">book</text>
                <g transform="translate(170, 10) rotate(-12)">
                    <path d="M0,0 L16,10 L32,0 L48,10 L64,0 L80,10 L80,95 L60,95 A20,20 0 0,0 20,95 L0,95 Z" fill="#E7364D" />
                    <text x="21" y="72" fontFamily="Inter, sans-serif" fontSize="60" fontWeight="900" fill="#FFFFFF">n</text>
                </g>
                <text x="250" y="70" fontFamily="Inter, sans-serif" fontSize="64" fontWeight="800" fill={fillHex} letterSpacing="-2">show</text>
            </svg>
        </div>
    );
};

// SECTION 1: High-End Ambient Background
const AmbientBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 rounded-[16px]">
        <motion.div
            className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-[#FAD8DC] opacity-30 blur-[60px]"
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
            className="absolute bottom-0 left-0 w-[250px] h-[250px] rounded-full bg-[#EB5B6E] opacity-10 blur-[80px]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
    </div>
);

export default function SeatMap({ 
    totalCapacity = 100, 
    bookedSeats = [], 
    selectedQty = 1, 
    selectedSeats = [], 
    onSeatSelect 
}) {
    const [seatGrid, setSeatGrid] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');

    // Real-Time Grid Generation Logic
    useEffect(() => {
        const rows = Math.ceil(totalCapacity / 10);
        const grid = [];
        let seatCounter = 1;
        
        for (let r = 0; r < rows; r++) {
            const rowLabel = String.fromCharCode(65 + r); // A, B, C...
            const rowSeats = [];
            for (let c = 1; c <= 10; c++) {
                if (seatCounter > totalCapacity) break;
                const seatId = `${rowLabel}${c}`;
                rowSeats.push({
                    id: seatId,
                    isBooked: bookedSeats.includes(seatId),
                });
                seatCounter++;
            }
            grid.push({ row: rowLabel, seats: rowSeats });
        }
        setSeatGrid(grid);
    }, [totalCapacity, bookedSeats]);

    const handleSeatClick = (seat) => {
        if (seat.isBooked) {
            setErrorMsg(`Seat ${seat.id} is already booked by another user.`);
            setTimeout(() => setErrorMsg(''), 3000);
            return;
        }

        const isCurrentlySelected = selectedSeats.includes(seat.id);

        if (isCurrentlySelected) {
            // Deselect
            onSeatSelect(selectedSeats.filter(s => s !== seat.id));
            setErrorMsg('');
        } else {
            // Attempt to select
            if (selectedSeats.length >= selectedQty) {
                setErrorMsg(`You can only select exactly ${selectedQty} seat(s). Deselect a seat first.`);
                setTimeout(() => setErrorMsg(''), 3000);
                return;
            }
            onSeatSelect([...selectedSeats, seat.id]);
            setErrorMsg('');
        }
    };

    return (
        <div className="w-full bg-[#FFFFFF] border border-[#A3A3A3]/20 rounded-[16px] shadow-sm relative overflow-hidden flex flex-col">
            <AmbientBackground />
            
            <div className="relative z-10 p-6 md:p-8 flex-1">
                
                {/* SECTION 2: Header & Brand Real-estate */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-[#A3A3A3]/20 pb-6 gap-4">
                    <div>
                        <h2 className="text-[22px] font-black text-[#333333] tracking-tight">Interactive Seat Matrix</h2>
                        <p className="text-[14px] text-[#626262] font-medium mt-1 flex items-center">
                            <Activity size={14} className="mr-2 text-[#E7364D] animate-pulse" />
                            Live allocation tracking
                        </p>
                    </div>
                    <BrandLogo />
                </div>

                {/* Toast Error Messages */}
                <AnimatePresence>
                    {errorMsg && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0 }} 
                            className="bg-[#FAD8DC]/30 border-l-[4px] border-[#E7364D] text-[#E7364D] p-3 rounded-r-[8px] font-bold text-[13px] flex items-center mb-6"
                        >
                            <AlertTriangle size={16} className="mr-2 shrink-0" /> {errorMsg}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* SECTION 3: The Stage Visualizer */}
                <div className="w-full mb-10 flex flex-col items-center justify-center">
                    <div className="w-[80%] max-w-[400px] h-12 border-t-[4px] border-[#A3A3A3] rounded-t-[50%] flex items-end justify-center pb-2 bg-gradient-to-t from-[#F5F5F5] to-transparent">
                        <span className="text-[12px] font-black tracking-[0.3em] uppercase text-[#A3A3A3]">Event Stage</span>
                    </div>
                </div>

                {/* SECTION 4: Interactive Seat Grid */}
                <div className="w-full overflow-x-auto pb-4">
                    <div className="flex flex-col items-center justify-center gap-4 min-w-max mx-auto">
                        {seatGrid.map((rowObj) => (
                            <div key={rowObj.row} className="flex items-center gap-4">
                                <span className="text-[12px] font-black text-[#A3A3A3] w-4 text-center">{rowObj.row}</span>
                                <div className="flex gap-2">
                                    {rowObj.seats.map((seat) => {
                                        const isSelected = selectedSeats.includes(seat.id);
                                        return (
                                            <motion.button
                                                key={seat.id}
                                                whileHover={!seat.isBooked ? { scale: 1.15 } : {}}
                                                whileTap={!seat.isBooked ? { scale: 0.95 } : {}}
                                                onClick={() => handleSeatClick(seat)}
                                                disabled={seat.isBooked}
                                                className={`
                                                    w-8 h-8 rounded-t-[8px] rounded-b-[4px] flex items-center justify-center text-[10px] font-black transition-colors relative shadow-sm
                                                    ${seat.isBooked 
                                                        ? 'bg-[#E5E5E5] text-[#A3A3A3] border border-[#A3A3A3]/20 cursor-not-allowed opacity-60' 
                                                        : isSelected 
                                                            ? 'bg-[#E7364D] text-[#FFFFFF] border border-[#E7364D] shadow-[0_4px_10px_rgba(231,54,77,0.3)]' 
                                                            : 'bg-[#FFFFFF] text-[#333333] border border-[#A3A3A3]/40 hover:border-[#E7364D] cursor-pointer'
                                                    }
                                                `}
                                            >
                                                {seat.id}
                                                {isSelected && (
                                                    <motion.div layoutId="selectionRing" className="absolute -inset-1 border-2 border-[#E7364D]/30 rounded-t-[10px] rounded-b-[6px] pointer-events-none" />
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                                <span className="text-[12px] font-black text-[#A3A3A3] w-4 text-center">{rowObj.row}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SECTION 5: Intelligent Legend */}
                <div className="flex flex-wrap items-center justify-center gap-6 py-6 border-y border-[#A3A3A3]/20 mt-6 bg-[#FAFAFA] rounded-[8px]">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-t-[6px] rounded-b-[3px] bg-[#FFFFFF] border border-[#A3A3A3]/40"></div>
                        <span className="text-[12px] font-bold text-[#626262] uppercase tracking-wider">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-t-[6px] rounded-b-[3px] bg-[#E7364D] border border-[#E7364D]"></div>
                        <span className="text-[12px] font-bold text-[#333333] uppercase tracking-wider">Your Selection</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-t-[6px] rounded-b-[3px] bg-[#E5E5E5] border border-[#A3A3A3]/20 opacity-60"></div>
                        <span className="text-[12px] font-bold text-[#A3A3A3] uppercase tracking-wider">Booked</span>
                    </div>
                </div>

                {/* SECTION 6: Live Selection Summary Pane */}
                <div className="mt-8 bg-[#333333] rounded-[12px] p-6 text-[#FFFFFF] shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-[#E7364D] opacity-10 rounded-full blur-[40px] pointer-events-none"></div>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
                        <div>
                            <p className="text-[11px] text-[#A3A3A3] font-bold uppercase tracking-widest mb-1">Current Selection</p>
                            <div className="flex items-center gap-3">
                                {selectedSeats.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedSeats.map(seat => (
                                            <span key={seat} className="bg-[#E7364D] px-3 py-1 rounded-[4px] text-[14px] font-black tracking-wide shadow-sm">{seat}</span>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-[15px] font-black text-[#626262]">No seats selected yet</span>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[11px] text-[#A3A3A3] font-bold uppercase tracking-widest mb-1">Requirement</p>
                            <p className="text-[15px] font-black">
                                {selectedSeats.length} / {selectedQty} Allocated
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 7, 8, 9: Info & Support Accordion Areas */}
            <div className="bg-[#F5F5F5] border-t border-[#A3A3A3]/20 p-6 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                
                {/* Section 7: Accessibility & VIP */}
                <div className="space-y-2">
                    <h4 className="flex items-center text-[13px] font-black text-[#333333] uppercase tracking-wider"><Star size={16} className="mr-2 text-[#E7364D]"/> Layout Rules</h4>
                    <p className="text-[12px] text-[#626262] font-medium leading-relaxed">Front rows (A-C) are designated premium viewing zones. Accessibility seating is available at the end of rows D and E.</p>
                </div>
                
                {/* Section 8: Group Guidelines */}
                <div className="space-y-2">
                    <h4 className="flex items-center text-[13px] font-black text-[#333333] uppercase tracking-wider"><Users size={16} className="mr-2 text-[#E7364D]"/> Group Bookings</h4>
                    <p className="text-[12px] text-[#626262] font-medium leading-relaxed">If purchasing for a group, ensure you select contiguous seats in the same row. Split selections are allowed but not recommended.</p>
                </div>

                {/* Section 9: Security & Support */}
                <div className="space-y-2">
                    <h4 className="flex items-center text-[13px] font-black text-[#333333] uppercase tracking-wider"><ShieldCheck size={16} className="mr-2 text-[#E7364D]"/> Institutional Backing</h4>
                    <p className="text-[12px] text-[#626262] font-medium leading-relaxed">Seat data is locked instantly via our transaction gateway. If an error occurs, please contact <a href="mailto:support@booknshow.in" className="text-[#E7364D] hover:underline">Support</a>.</p>
                </div>

            </div>
        </div>
    );
}