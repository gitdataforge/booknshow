import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    // If there's only 1 page (or 0), completely hide the pagination UI
    if (totalPages <= 1) return null;

    // Strict logic to determine which page numbers to display, including ellipsis windowing
    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="w-full flex items-center justify-center space-x-2 md:space-x-4 mt-12 mb-8">
            <motion.button
                whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center px-4 py-2.5 rounded-[12px] font-bold text-[14px] transition-colors select-none ${
                    currentPage === 1 
                        ? 'text-gray-400 bg-gray-50 border border-gray-200 cursor-not-allowed' 
                        : 'text-[#1D2B36] bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm cursor-pointer'
                }`}
            >
                <ChevronLeft size={16} className="mr-1.5" /> 
                <span className="hidden sm:inline">Previous</span>
            </motion.button>

            <div className="flex items-center space-x-1 sm:space-x-2">
                {getPageNumbers().map((page, idx) => (
                    page === '...' ? (
                        <span key={`ellipsis-${idx}`} className="px-2 py-2 text-gray-500 font-bold tracking-widest select-none">
                            ...
                        </span>
                    ) : (
                        <motion.button
                            key={`page-${page}`}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onPageChange(page)}
                            className={`w-10 h-10 rounded-[12px] flex items-center justify-center font-bold text-[14px] transition-all select-none ${
                                currentPage === page
                                    ? 'bg-[#114C2A] text-white border border-[#114C2A] shadow-md shadow-[#114C2A]/20'
                                    : 'bg-white text-[#1D2B36] border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm'
                            }`}
                        >
                            {page}
                        </motion.button>
                    )
                ))}
            </div>

            <motion.button
                whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center px-4 py-2.5 rounded-[12px] font-bold text-[14px] transition-colors select-none ${
                    currentPage === totalPages 
                        ? 'text-gray-400 bg-gray-50 border border-gray-200 cursor-not-allowed' 
                        : 'text-[#1D2B36] bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm cursor-pointer'
                }`}
            >
                <span className="hidden sm:inline">Next</span> 
                <ChevronRight size={16} className="ml-1.5" />
            </motion.button>
        </div>
    );
}