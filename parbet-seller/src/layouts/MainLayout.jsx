import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function MainLayout() {
    const { pathname } = useLocation();

    // FEATURE 1: Intelligent Scroll-to-Top Routing Engine
    // Automatically resets the window scroll position to the top whenever the route changes
    // This provides a pristine, app-like navigation experience across the seller dashboard
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [pathname]);

    return (
        // FEATURE 2: 1:1 Viagogo Full-Height Flexbox Architecture
        // Ensures the footer always sticks to the bottom of the viewport even on pages with minimal content
        <div className="min-h-screen bg-white flex flex-col font-sans text-[#1a1a1a]">
            
            {/* FEATURE 3: Encapsulated Global Navigation Shell */}
            <Header />
            
            {/* FEATURE 4: Dynamic Route Content Injector */}
            {/* The flex-1 utility forces the main container to consume all available vertical space */}
            <main className="flex-1 flex flex-col relative w-full">
                <Outlet />
            </main>
            
            {/* FEATURE 5: Encapsulated Global Footer Shell */}
            <Footer />
            
        </div>
    );
}