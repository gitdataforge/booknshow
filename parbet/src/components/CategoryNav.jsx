import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useStore';

const categories = [
    {
        id: 'Sports',
        title: 'Live Sports',
        subtitle: 'IPL, ISL & More',
        color: 'from-blue-500 to-cyan-400',
        svg: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white opacity-90 drop-shadow-md">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.93 4.93C7.26 7.26 8.5 10.5 8.5 14C8.5 17.5 7.26 20.74 4.93 23.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19.07 4.93C16.74 7.26 15.5 10.5 15.5 14C15.5 17.5 16.74 20.74 19.07 23.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 2V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        )
    },
    {
        id: 'Concerts',
        title: 'Concerts',
        subtitle: 'Tours & Gigs',
        color: 'from-purple-500 to-pink-500',
        svg: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white opacity-90 drop-shadow-md">
                <path d="M9 18V5L21 3V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 21C7.65685 21 9 19.6569 9 18C9 16.3431 7.65685 15 6 15C4.34315 15 3 16.3431 3 18C3 19.6569 4.34315 21 6 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 19C19.6569 19 21 17.6569 21 16C21 14.3431 19.6569 13 18 13C16.3431 13 15 14.3431 15 16C15 17.6569 16.3431 19 18 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        )
    },
    {
        id: 'Theater',
        title: 'Comedy & Theater',
        subtitle: 'Standup & Plays',
        color: 'from-amber-500 to-orange-400',
        svg: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white opacity-90 drop-shadow-md">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 14S10 16 12 16S16 14 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 9H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 9H15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        )
    },
    {
        id: 'Festivals',
        title: 'Festivals',
        subtitle: 'Fests & Culture',
        color: 'from-emerald-500 to-green-400',
        svg: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white opacity-90 drop-shadow-md">
                <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 3L20 21H4L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.5 10L15.5 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        )
    }
];

export default function CategoryNav() {
    const navigate = useNavigate();
    const { setExploreCategory } = useAppStore();

    const handleCategoryClick = (categoryId) => {
        setExploreCategory(categoryId);
        navigate('/explore');
    };

    return (
        <div className="w-full mb-12 md:mb-16">
            <div className="flex overflow-x-auto hide-scrollbar space-x-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                {categories.map((cat, index) => (
                    <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{ y: -6, scale: 1.02 }}
                        onClick={() => handleCategoryClick(cat.id)}
                        className={`relative min-w-[200px] h-[120px] rounded-[20px] overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all group bg-gradient-to-br ${cat.color}`}
                    >
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                        <div className="absolute right-2 top-2 rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-transform duration-500 ease-out">
                            {cat.svg}
                        </div>
                        <div className="absolute bottom-4 left-4 z-10">
                            <h3 className="text-white font-black text-[18px] leading-tight drop-shadow-md">{cat.title}</h3>
                            <p className="text-white/90 font-medium text-[12px] drop-shadow-sm">{cat.subtitle}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}