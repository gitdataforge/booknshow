import React from 'react';

export default function SoldOutGraveyard({ event }) {
    // Logic: Desaturated component for 0-inventory items
    return (
        <div className="min-w-[240px] p-4 rounded-2xl bg-gray-50 border border-gray-200 opacity-60 grayscale cursor-not-allowed">
            <span className="bg-gray-800 text-white px-2 py-1 rounded text-[10px] font-black uppercase">Sold Out</span>
            <h3 className="font-bold text-gray-800 mt-3 truncate">{event.t1}</h3>
            <p className="text-xs text-gray-500 mt-1">Missed it! Join waitlist.</p>
        </div>
    );
}