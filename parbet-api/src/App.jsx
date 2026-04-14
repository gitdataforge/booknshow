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
 * All core pages are securely encased within the AdminGuard HOC.
 */
export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* * ==========================================
                  * PUBLIC ROUTE (Trapdoor)
                  * ==========================================
                  * Unauthenticated users or invalid admins are trapped here.
                  */}
                <Route path="/login" element={<Login />} />

                {/* * ==========================================
                  * PROTECTED ROUTES (testcodecfg@gmail.com ONLY)
                  * ==========================================
                  * These routes enforce strict Identity & Access Management (IAM).
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

                {/* * ==========================================
                  * FALLBACK ROUTE
                  * ==========================================
                  * Redirects any unknown API sub-paths back to the secure root.
                  */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}