import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useMainStore } from '../../store/useMainStore';

// Dynamic Standalone Page Imports (Page-Level Architecture)
import OverviewPage from './Overview';
import OrdersPage from './Orders';
import ListingsPage from './Listings';
import SalesPage from './Sales';
import SettingsPage from './Settings';
import FaqsPage from './Faqs';
import PaymentsPage from './Payments';
import SupportPage from './Support';
import WalletPage from './Wallet';

/**
 * FEATURE 1: Transparent Page-Level Dynamic Component Hub
 * FEATURE 2: Global Authentication Guard (Failsafe redirection)
 * FEATURE 3: Removed Duplicate UI (Relies entirely on global app layout/sidebar)
 * FEATURE 4: Framer Motion Route Transitions
 * FEATURE 5: Render OverviewPage on Root Route (Fixes redirect bug)
 */

export default function Profile() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, authLoading } = useMainStore();

    // Security Failsafe: Kick to home if somehow here unauthenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, authLoading, navigate]);

    // Initial load guard
    if (authLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] w-full">
                <Loader2 className="animate-spin text-[#427A1A] mb-4" size={32} />
                <p className="text-[#54626c] font-medium uppercase tracking-widest text-[12px]">Verifying Parbet Credentials</p>
            </div>
        );
    }

    if (!isAuthenticated) return null; // Prevent flash of content before redirect

    // The Profile index is now just a transparent routing wrapper.
    // It assumes your global <App /> or Layout component handles the main navigation sidebar/header.
    return (
        <div className="w-full h-full min-h-[calc(100vh-80px)]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full"
                >
                    <Routes>
                        {/* Render Overview on the root /profile route instead of redirecting */}
                        <Route path="/" element={<OverviewPage />} />
                        
                        {/* Dynamic Standalone Pages */}
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/listings" element={<ListingsPage />} />
                        <Route path="/sales" element={<SalesPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/faqs" element={<FaqsPage />} />
                        <Route path="/payments" element={<PaymentsPage />} />
                        <Route path="/support" element={<SupportPage />} />
                        <Route path="/wallet" element={<WalletPage />} />
                        
                        {/* Catch-all redirect */}
                        <Route path="*" element={<Navigate to="/profile" replace />} />
                    </Routes>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}