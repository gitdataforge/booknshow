import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, Calendar, MapPin, Ticket, AlertCircle } from 'lucide-react';
import { useSellerStore } from '../store/useSellerStore';

export default function ListingForm({ initialQuery }) {
    const navigate = useNavigate();
    const { addEventListing, isSubmitting, submitError } = useSellerStore();
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        t1: initialQuery || '',
        t2: '',
        league: '',
        date: '',
        time: '',
        venue: '',
        city: '',
        section: '',
        row: '',
        quantity: 1,
        price: ''
    });

    // Auto-map league if the user searched for IPL on the home page
    useEffect(() => {
        if (initialQuery && (initialQuery.toLowerCase().includes('ipl') || initialQuery.toLowerCase().includes('premier league'))) {
            setFormData(prev => ({ ...prev, league: 'Indian Premier League', t1: '' }));
        }
    }, [initialQuery]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addEventListing(formData);
            setIsSuccess(true);
            // Redirect to dashboard after showing the success animation
            setTimeout(() => {
                navigate('/dashboard');
            }, 2500);
        } catch (error) {
            console.error("Submission failed", error);
        }
    };

    if (isSuccess) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="flex flex-col items-center justify-center py-20 text-center"
            >
                <CheckCircle size={64} className="text-[#458731] mb-6" />
                <h3 className="text-[28px] font-black text-[#1a1a1a] mb-2 tracking-tight">Tickets Live!</h3>
                <p className="text-[16px] text-gray-500 font-medium">Your tickets have been successfully synced to the global buyer network.</p>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-8 font-sans">
            
            {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-[8px] flex items-start shadow-sm">
                    <AlertCircle size={20} className="mr-3 shrink-0 mt-0.5" />
                    <p className="text-[14px] font-medium">{submitError}</p>
                </div>
            )}

            {/* SECTION 1: Event Details */}
            <div className="flex flex-col space-y-5">
                <h3 className="text-[18px] font-bold text-[#1a1a1a] flex items-center border-b border-gray-100 pb-2">
                    <Ticket size={20} className="mr-2 text-[#458731]" /> Event Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col">
                        <label className="text-[13px] font-bold text-[#54626c] mb-1.5 uppercase tracking-wide">Primary Team / Performer (t1) *</label>
                        <input required type="text" name="t1" value={formData.t1} onChange={handleChange} placeholder="e.g., Chennai Super Kings" className="w-full border border-[#cccccc] rounded-[8px] px-4 py-3 outline-none focus:border-[#458731] focus:ring-1 focus:ring-[#458731] transition-all text-[15px]"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[13px] font-bold text-[#54626c] mb-1.5 uppercase tracking-wide">Opponent (t2)</label>
                        <input type="text" name="t2" value={formData.t2} onChange={handleChange} placeholder="e.g., Mumbai Indians" className="w-full border border-[#cccccc] rounded-[8px] px-4 py-3 outline-none focus:border-[#458731] focus:ring-1 focus:ring-[#458731] transition-all text-[15px]"/>
                    </div>
                    <div className="flex flex-col md:col-span-2">
                        <label className="text-[13px] font-bold text-[#54626c] mb-1.5 uppercase tracking-wide">League / Tour Name *</label>
                        <input required type="text" name="league" value={formData.league} onChange={handleChange} placeholder="e.g., Indian Premier League" className="w-full border border-[#cccccc] rounded-[8px] px-4 py-3 outline-none focus:border-[#458731] focus:ring-1 focus:ring-[#458731] transition-all text-[15px]"/>
                    </div>
                </div>
            </div>

            {/* SECTION 2: Location & Time */}
            <div className="flex flex-col space-y-5">
                <h3 className="text-[18px] font-bold text-[#1a1a1a] flex items-center border-b border-gray-100 pb-2">
                    <Calendar size={20} className="mr-2 text-[#458731]" /> Date & Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col">
                        <label className="text-[13px] font-bold text-[#54626c] mb-1.5 uppercase tracking-wide">Event Date *</label>
                        <input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full border border-[#cccccc] rounded-[8px] px-4 py-3 outline-none focus:border-[#458731] focus:ring-1 focus:ring-[#458731] transition-all text-[15px]"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[13px] font-bold text-[#54626c] mb-1.5 uppercase tracking-wide">Event Time *</label>
                        <input required type="time" name="time" value={formData.time} onChange={handleChange} className="w-full border border-[#cccccc] rounded-[8px] px-4 py-3 outline-none focus:border-[#458731] focus:ring-1 focus:ring-[#458731] transition-all text-[15px]"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[13px] font-bold text-[#54626c] mb-1.5 uppercase tracking-wide">Venue / Stadium *</label>
                        <input required type="text" name="venue" value={formData.venue} onChange={handleChange} placeholder="e.g., Wankhede Stadium" className="w-full border border-[#cccccc] rounded-[8px] px-4 py-3 outline-none focus:border-[#458731] focus:ring-1 focus:ring-[#458731] transition-all text-[15px]"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[13px] font-bold text-[#54626c] mb-1.5 uppercase tracking-wide">City *</label>
                        <input required type="text" name="city" value={formData.city} onChange={handleChange} placeholder="e.g., Mumbai" className="w-full border border-[#cccccc] rounded-[8px] px-4 py-3 outline-none focus:border-[#458731] focus:ring-1 focus:ring-[#458731] transition-all text-[15px]"/>
                    </div>
                </div>
            </div>

            {/* SECTION 3: Tickets & Pricing */}
            <div className="flex flex-col space-y-5">
                <h3 className="text-[18px] font-bold text-[#1a1a1a] flex items-center border-b border-gray-100 pb-2">
                    <MapPin size={20} className="mr-2 text-[#458731]" /> Seating & Pricing
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col">
                        <label className="text-[13px] font-bold text-[#54626c] mb-1.5 uppercase tracking-wide">Section *</label>
                        <input required type="text" name="section" value={formData.section} onChange={handleChange} placeholder="e.g., North Stand L3" className="w-full border border-[#cccccc] rounded-[8px] px-4 py-3 outline-none focus:border-[#458731] focus:ring-1 focus:ring-[#458731] transition-all text-[15px]"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[13px] font-bold text-[#54626c] mb-1.5 uppercase tracking-wide">Row *</label>
                        <input required type="text" name="row" value={formData.row} onChange={handleChange} placeholder="e.g., G" className="w-full border border-[#cccccc] rounded-[8px] px-4 py-3 outline-none focus:border-[#458731] focus:ring-1 focus:ring-[#458731] transition-all text-[15px]"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[13px] font-bold text-[#54626c] mb-1.5 uppercase tracking-wide">Quantity *</label>
                        <input required type="number" min="1" max="20" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full border border-[#cccccc] rounded-[8px] px-4 py-3 outline-none focus:border-[#458731] focus:ring-1 focus:ring-[#458731] transition-all text-[15px]"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[13px] font-bold text-[#54626c] mb-1.5 uppercase tracking-wide">Price per ticket (INR) *</label>
                        <div className="relative w-full">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                            <input required type="number" min="1" name="price" value={formData.price} onChange={handleChange} placeholder="0.00" className="w-full border border-[#cccccc] rounded-[8px] pl-8 pr-4 py-3 outline-none focus:border-[#458731] focus:ring-1 focus:ring-[#458731] transition-all text-[15px]"/>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Action */}
            <div className="pt-6 border-t border-gray-200 flex justify-end">
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full md:w-auto bg-[#458731] hover:bg-[#366a26] text-white font-bold px-10 py-4 rounded-[8px] text-[16px] transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isSubmitting ? (
                        <><Loader2 size={20} className="animate-spin mr-2"/> Processing...</>
                    ) : (
                        'List Tickets on parbet'
                    )}
                </button>
            </div>
        </form>
    );
}