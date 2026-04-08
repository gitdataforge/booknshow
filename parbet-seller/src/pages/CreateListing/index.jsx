import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import ListingForm from '../../components/ListingForm';

export default function CreateListing() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Extract the query from the URL (e.g., if the user searched on the Home page)
    const initialQuery = searchParams.get('q') || '';

    return (
        <div className="min-h-screen bg-[#f8f9fa] py-8 md:py-16 px-4 font-sans flex-1">
            <div className="max-w-[850px] mx-auto">
                
                {/* Top Navigation & Context */}
                <div className="mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center text-[#458731] font-bold text-[14px] mb-6 hover:underline"
                    >
                        <ChevronLeft size={16} className="mr-1" /> Back
                    </button>
                    <h1 className="text-[32px] md:text-[44px] font-black text-[#1a1a1a] tracking-tight leading-tight">
                        List your tickets
                    </h1>
                    <p className="text-[16px] md:text-[18px] text-[#54626c] mt-2 font-medium">
                        Enter the exact details of the event to instantly publish your tickets to the global marketplace.
                    </p>
                </div>
                
                {/* Form Container */}
                <div className="bg-white rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-200 p-6 md:p-10 relative overflow-hidden">
                    {/* Decorative subtle top border line matching Viagogo style */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#458731]"></div>
                    
                    <ListingForm initialQuery={initialQuery} />
                </div>

            </div>
        </div>
    );
}