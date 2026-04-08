import React from 'react';
import { Heart } from 'lucide-react';
import { useAppStore } from '../store/useStore';

// Real-time Cloudinary Auto-Optimization Utility
const optimizeImage = (url, width = 600) => {
    if (!url) return '';
    if (url.includes('res.cloudinary.com')) return url;
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';
    return `https://res.cloudinary.com/${cloudName}/image/fetch/f_auto,q_auto,w_${width}/${encodeURIComponent(url)}`;
};

export default function ViagogoEventCard({ group, onClick }) {
    const { isAuthenticated, openAuthModal, toggleFavorite } = useAppStore();

    // Secure Interaction Guard for the Heart Icon
    const handleRestrictedAction = (e, obj) => {
        e.stopPropagation(); // Prevent the card's onClick (navigation) from firing
        if (!isAuthenticated) {
            openAuthModal();
        } else {
            toggleFavorite(obj);
        }
    };

    if (!group) return null;

    return (
        <div 
            onClick={onClick} 
            className="min-w-[280px] max-w-[280px] flex-shrink-0 cursor-pointer snap-start group"
        >
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-3 bg-gray-100">
                <img 
                    src={optimizeImage(`https://loremflickr.com/600/400/${encodeURIComponent(group.imageId.replace(/\s+/g, ''))},sport?lock=${group.id.charCodeAt(0)}`, 600)} 
                    alt={group.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                
                {/* 1:1 Exact Top-Right Black Circular Heart Button */}
                <button 
                    onClick={(e) => handleRestrictedAction(e, group)} 
                    className="absolute top-3 right-3 w-[32px] h-[32px] rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black transition-colors shadow-md z-10"
                >
                    <Heart size={16} className="text-white" strokeWidth={2}/>
                </button>
            </div>
            
            {/* Exact Typography Replica: Bold Title, Normal Date, Bold Location/Count */}
            <h3 className="font-bold text-[#1a1a1a] text-[16px] leading-snug mb-1 truncate pr-2">
                {group.name}
            </h3>
            <p className="text-[14px] text-gray-500 mb-1 font-normal truncate">
                {group.dateStr}
            </p>
            <p className="text-[14px] text-gray-500 font-bold">
                {group.count} event{group.count !== 1 ? 's' : ''} near you
            </p>
        </div>
    );
}