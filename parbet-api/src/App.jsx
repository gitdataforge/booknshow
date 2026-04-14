import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Security & Layout Components
import AdminGuard from './components/AdminGuard';
import Layout from './components/Layout';

// Page Components
import Login from './pages/Login';
import Gateway from './pages/Gateway';
import Status from './pages/Status';
import Docs from './pages/Docs';

/**
 * FEATURE: Strict Admin Routing Architecture
 * Defines the public and protected routes for the API Gateway.
 * Enforces a global white-theme background and centralized layout logic.
 */
export default function App() {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-[#8cc63f]/20 selection:text-[#458731]">
            <BrowserRouter>
                <Routes>
                    {/* * PUBLIC ROUTE (Trapdoor)
                     * Centered authentication portal matching image_8d2c48.png aesthetic.
                     */}
                    <Route path="/login" element={<Login />} />

                    {/* * PROTECTED ROUTES (testcodecfg@gmail.com ONLY)
                     * Enforces strict Identity & Access Management (IAM).
                     * These routes are wrapped in a shared Layout for navigation consistency.
                     */}
                    <Route 
                        path="/" 
                        element={
                            <AdminGuard>
                                <Layout>
                                    <Gateway />
                                </Layout>
                            </AdminGuard>
                        } 
                    />
                    
                    <Route 
                        path="/status" 
                        element={
                            <AdminGuard>
                                <Layout>
                                    <Status />
                                </Layout>
                            </AdminGuard>
                        } 
                    />
                    
                    <Route 
                        path="/docs" 
                        element={
                            <AdminGuard>
                                <Layout>
                                    <Docs />
                                </Layout>
                            </AdminGuard>
                        } 
                    />

                    {/* * FALLBACK ROUTE
                     * Redirects any unknown API sub-paths back to the secure root.
                     */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}