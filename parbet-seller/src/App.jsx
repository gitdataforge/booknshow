import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSellerStore } from './store/useSellerStore';

// Structural Layout Components
import Header from './components/Header';
import Footer from './components/Footer';
import ProfileLayout from './layouts/ProfileLayout'; // FEATURE 1: Imported new Master Layout

// Core Real-Time Pages
import Home from './pages/Home';
import CreateListing from './pages/CreateListing';
import IPLHub from './pages/seller/IPLHub'; // The standalone 1:1 Viagogo IPL catalog page

// Mobile Standalone Menu Pages
import MobileMenu from './pages/MobileMenu';
import SellMenu from './pages/MobileMenu/SellMenu';

// Profile Architecture (Zero-Modal Real-Time Nodes)
import ProfileOverview from './pages/Profile/index';
import Orders from './pages/Profile/Orders';
// Note: Remaining profile nodes (Listings, Sales, etc.) will be injected here as they are built.

export default function App() {
    const { initAuth } = useSellerStore();

    // CRITICAL PATH: Securely initialize real Firebase Authentication the millisecond the app loads
    // This permanently resolves the infinite "Processing..." hang by granting the app a real UID
    useEffect(() => {
        initAuth();
    }, [initAuth]);

    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            {/* Base shell matching the pristine white aesthetic of the Viagogo seller portal */}
            <div className="min-h-screen bg-white flex flex-col font-sans text-[#1a1a1a]">
                
                {/* 1:1 Replica Seller Header */}
                <Header />
                
                {/* Main Content Area */}
                <main className="flex-1 flex flex-col">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        
                        {/* Standalone Mobile Navigation Routes (Strictly Zero Modals) */}
                        <Route path="/menu" element={<MobileMenu />} />
                        <Route path="/menu/sell" element={<SellMenu />} />
                        
                        {/* Standalone IPL Hub Page (Strictly Zero Modals) */}
                        <Route path="/ipl" element={<IPLHub />} />
                        
                        {/* FEATURE 2: Legacy Dashboard Fallback Guard */}
                        {/* Instantly reroutes old links to the new secure Profile layout */}
                        <Route path="/dashboard" element={<Navigate to="/profile" replace />} />
                        
                        {/* FEATURE 3: 1:1 Viagogo Zero-Modal Nested Profile Architecture */}
                        <Route path="/profile" element={<ProfileLayout />}>
                            <Route index element={<ProfileOverview />} />
                            <Route path="orders" element={<Orders />} />
                            {/* Pending modules (Listings, Sales, Payments) will dynamically route here */}
                        </Route>
                        
                        {/* Map both legacy and new routing pathways directly to the real-time API listing flow */}
                        <Route path="/sell" element={<CreateListing />} />
                        <Route path="/create-listing" element={<CreateListing />} />
                    </Routes>
                </main>
                
                {/* 1:1 Replica Mobile/Desktop Footer */}
                <Footer />
                
            </div>
        </BrowserRouter>
    );
}