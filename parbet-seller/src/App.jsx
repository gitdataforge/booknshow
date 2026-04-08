import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Structural Layout Components
import Header from './components/Header';
import Footer from './components/Footer';

// Core Pages
import Home from './pages/Home';
import Dashboard from './pages/seller/Dashboard';
import ListingWizardWrapper from './pages/seller/ListingWizardWrapper';

export default function App() {
    return (
        <BrowserRouter>
            {/* Base shell matching the pristine white aesthetic of the Viagogo seller portal */}
            <div className="min-h-screen bg-white flex flex-col font-sans text-[#1a1a1a]">
                
                {/* 1:1 Replica Seller Header */}
                <Header />
                
                {/* Main Content Area */}
                <main className="flex-1 flex flex-col">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        
                        {/* Map both legacy and new routing pathways to the listing flow */}
                        <Route path="/sell" element={<ListingWizardWrapper />} />
                        <Route path="/create-listing" element={<ListingWizardWrapper />} />
                    </Routes>
                </main>
                
                {/* 1:1 Replica 4-Column Footer */}
                <Footer />
                
            </div>
        </BrowserRouter>
    );
}