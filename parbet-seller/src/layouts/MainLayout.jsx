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

    // FEATURE 2: Dynamic Layout Visibility Engine
    // Strictly evaluates if the current route belongs to the protected profile dashboard shell
    const isProfileRoute = pathname.startsWith('/profile');

    return (
        // FEATURE 3: 1:1 Viagogo Full-Height Flexbox Architecture
        // Ensures the footer always sticks to the bottom of the viewport even on pages with minimal content
        <div className="min-h-screen bg-white flex flex-col font-sans text-[#1a1a1a]">
            
            {/* FEATURE 4: Responsive Global Navigation Shell */}
            {/* Hidden on mobile devices during profile routes so the custom mobile header takes over. Visible on desktop. */}
            <div className={isProfileRoute ? "hidden lg:block w-full" : "block w-full"}>
                <Header />
            </div>
            
            {/* FEATURE 5: Dynamic Route Content Injector */}
            {/* The flex-1 utility forces the main container to consume all available vertical space */}
            <main className="flex-1 flex flex-col relative w-full">
                <Outlet />
            </main>
            
            {/* FEATURE 6: Responsive Global Footer Shell */}
            {/* Also hidden on mobile profile routes to maximize dashboard screen real estate, visible on desktop */}
            <div className={isProfileRoute ? "hidden lg:block w-full" : "block w-full"}>
                <Footer />
            </div>
            
        </div>
    );
}