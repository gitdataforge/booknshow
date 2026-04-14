import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Gateway() {
    // ==========================================
    // FEATURE 2: Live UTC Clock Engine
    // ==========================================
    const [sysTime, setSysTime] = useState('00:00:00 Z');
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setSysTime(now.toISOString().split('T')[1].split('.')[0] + ' Z');
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // ==========================================
    // FEATURE 3: Real-Time Latency Ping Engine
    // ==========================================
    const [latency, setLatency] = useState('-- ms');
    const [pinging, setPinging] = useState(false);
    const [latencyColor, setLatencyColor] = useState('text-[#0064d2]'); // info

    const pingServer = async () => {
        setPinging(true);
        setLatency('... ms');
        setLatencyColor('text-[#54626c]'); // secondary

        const start = performance.now();
        try {
            await fetch(window.location.href, { cache: 'no-store' });
            const end = performance.now();
            const lat = Math.round(end - start);
            
            setLatency(`${lat} ms`);
            setLatencyColor(lat < 100 ? 'text-[#458731]' : (lat < 300 ? 'text-[#ff9800]' : 'text-[#d32f2f]'));
        } catch (error) {
            setLatency('ERR');
            setLatencyColor('text-[#d32f2f]'); // danger
        } finally {
            setPinging(false);
        }
    };

    // Auto-ping on mount
    useEffect(() => {
        const timeout = setTimeout(() => pingServer(), 1000);
        return () => clearTimeout(timeout);
    }, []);

    // Animation Configurations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={containerVariants}
            className="max-w-[1200px] mx-auto px-6 font-sans text-[#1a1a1a]"
        >
            {/* FEATURE 1: Hero Console */}
            <motion.header variants={itemVariants} className="pt-[60px] pb-[40px] text-center">
                <h1 className="text-[32px] md:text-[46px] font-black mb-4 tracking-[-1.5px] text-[#1a1a1a] leading-tight">
                    Enterprise API Gateway
                </h1>
                <p className="text-[#54626c] text-[16px] md:text-[18px] max-w-[600px] mx-auto font-medium">
                    Secure microservices architecture routing transactions, identity verification, and fulfillment for the Parbet Global Marketplace.
                </p>
            </motion.header>

            {/* REAL-TIME METRICS PANEL */}
            <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-[60px]">
                {/* Metric 1 */}
                <div className="bg-white border border-[#e2e2e2] rounded-[4px] p-6 text-center shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:-translate-y-[3px] hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)] hover:border-[#8cc63f] transition-all duration-200">
                    <div className="text-[13px] font-bold text-[#54626c] uppercase tracking-[0.5px]">System Time (UTC)</div>
                    <div className="text-[32px] font-black text-[#1a1a1a] my-2.5 tracking-[-1px]">{sysTime}</div>
                </div>

                {/* Metric 2 */}
                <div className="bg-white border border-[#e2e2e2] rounded-[4px] p-6 text-center shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:-translate-y-[3px] hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)] hover:border-[#8cc63f] transition-all duration-200">
                    <div className="text-[13px] font-bold text-[#54626c] uppercase tracking-[0.5px]">Gateway Latency</div>
                    <div className="text-[32px] font-black my-2.5 tracking-[-1px] flex items-center justify-center gap-3">
                        <span className={latencyColor}>{latency}</span>
                        <button 
                            onClick={pingServer}
                            disabled={pinging}
                            className="bg-transparent border-2 border-[#8cc63f] text-[#458731] font-bold px-4 py-1 rounded-[4px] text-[12px] transition-colors hover:bg-[#8cc63f] hover:text-white hover:border-[#8cc63f] disabled:opacity-50"
                        >
                            {pinging ? 'PINGING...' : 'PING'}
                        </button>
                    </div>
                </div>

                {/* FEATURE 4: Environment Status */}
                <div className="bg-white border border-[#e2e2e2] rounded-[4px] p-6 text-center shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:-translate-y-[3px] hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)] hover:border-[#8cc63f] transition-all duration-200">
                    <div className="text-[13px] font-bold text-[#54626c] uppercase tracking-[0.5px]">Environment</div>
                    <div className="text-[32px] font-black text-[#458731] my-2.5 tracking-[-1px]">Production</div>
                </div>
            </motion.section>

            {/* FEATURE 5: Strict Security Policy */}
            <motion.section variants={itemVariants} className="bg-[#fffcfc] border border-[#fecaca] border-l-4 border-l-[#d32f2f] p-6 rounded-[4px] mb-[40px]">
                <h3 className="text-[#d32f2f] mb-3 text-[16px] font-extrabold">Strict Origin Policy Enforced</h3>
                <ul className="flex flex-col gap-2">
                    <li className="text-[14px] text-[#1a1a1a] font-medium flex items-start gap-2.5">
                        <span className="text-[#d32f2f] text-[20px] leading-none mt-[-2px]">&bull;</span> All endpoints strictly enforce CORS. External domains are blocked.
                    </li>
                    <li className="text-[14px] text-[#1a1a1a] font-medium flex items-start gap-2.5">
                        <span className="text-[#d32f2f] text-[20px] leading-none mt-[-2px]">&bull;</span> Requests must originate from verified Parbet Frontend Domains (Vercel/Firebase).
                    </li>
                    <li className="text-[14px] text-[#1a1a1a] font-medium flex items-start gap-2.5">
                        <span className="text-[#d32f2f] text-[20px] leading-none mt-[-2px]">&bull;</span> Firebase Admin SDK securely validates internal routing tokens.
                    </li>
                    <li className="text-[14px] text-[#1a1a1a] font-medium flex items-start gap-2.5">
                        <span className="text-[#d32f2f] text-[20px] leading-none mt-[-2px]">&bull;</span> Rate limiting active to prevent DDoS and brute-force routing attacks.
                    </li>
                </ul>
            </motion.section>

            {/* FEATURE 6 & 7: Identity & Auth Routing */}
            <motion.div variants={itemVariants}>
                <h2 className="text-[22px] font-extrabold mb-5 pb-2.5 border-b border-[#e2e2e2] text-[#1a1a1a] tracking-[-0.5px]">1. Identity & Auth Routing</h2>
                <div className="grid grid-cols-1 gap-4 mb-10">
                    <div className="bg-white border border-[#e2e2e2] p-5 rounded-[4px] flex flex-col gap-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#54626c] transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <span className="bg-[#1a1a1a] text-white px-2.5 py-1 rounded-[4px] text-[12px] font-extrabold tracking-[0.5px] w-fit">POST</span>
                            <span className="font-bold text-[#0064d2] text-[15px] font-mono">/api/sendVerification</span>
                            <span className="bg-[#f2f7ef] text-[#458731] px-2.5 py-1 rounded-[4px] text-[11px] font-bold border border-[#8cc63f] sm:ml-auto tracking-[0.5px] w-fit">LIVE</span>
                        </div>
                        <div className="text-[#54626c] text-[14px] font-medium">Dispatches the 13-section HTML verification template containing the official Firebase link via Resend Sandbox.</div>
                    </div>
                    <div className="bg-white border border-[#e2e2e2] p-5 rounded-[4px] flex flex-col gap-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#54626c] transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <span className="bg-[#1a1a1a] text-white px-2.5 py-1 rounded-[4px] text-[12px] font-extrabold tracking-[0.5px] w-fit">POST</span>
                            <span className="font-bold text-[#0064d2] text-[15px] font-mono">/api/resetPassword</span>
                            <span className="bg-[#f2f7ef] text-[#458731] px-2.5 py-1 rounded-[4px] text-[11px] font-bold border border-[#8cc63f] sm:ml-auto tracking-[0.5px] w-fit">LIVE</span>
                        </div>
                        <div className="text-[#54626c] text-[14px] font-medium">Bypasses default Firebase templates to dispatch a custom secure password recovery HTML email.</div>
                    </div>
                </div>
            </motion.div>

            {/* FEATURE 8 & 9: Fulfillment Pipeline */}
            <motion.div variants={itemVariants}>
                <h2 className="text-[22px] font-extrabold mb-5 pb-2.5 border-b border-[#e2e2e2] text-[#1a1a1a] tracking-[-0.5px]">2. Fulfillment Pipeline</h2>
                <div className="grid grid-cols-1 gap-4 mb-10">
                    <div className="bg-white border border-[#e2e2e2] p-5 rounded-[4px] flex flex-col gap-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#54626c] transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <span className="bg-[#1a1a1a] text-white px-2.5 py-1 rounded-[4px] text-[12px] font-extrabold tracking-[0.5px] w-fit">POST</span>
                            <span className="font-bold text-[#0064d2] text-[15px] font-mono">/api/sendTicketEmail</span>
                            <span className="bg-[#fff8e1] text-[#f57c00] px-2.5 py-1 rounded-[4px] text-[11px] font-bold border border-[#ffb74d] sm:ml-auto tracking-[0.5px] w-fit">PENDING DEPLOY</span>
                        </div>
                        <div className="text-[#54626c] text-[14px] font-medium">Automatically dispatches the digital ticket and receipt to the buyer upon webhook payment confirmation.</div>
                    </div>
                    <div className="bg-white border border-[#e2e2e2] p-5 rounded-[4px] flex flex-col gap-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#54626c] transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <span className="bg-[#1a1a1a] text-white px-2.5 py-1 rounded-[4px] text-[12px] font-extrabold tracking-[0.5px] w-fit">POST</span>
                            <span className="font-bold text-[#0064d2] text-[15px] font-mono">/api/generateTicketPDF</span>
                            <span className="bg-[#fff8e1] text-[#f57c00] px-2.5 py-1 rounded-[4px] text-[11px] font-bold border border-[#ffb74d] sm:ml-auto tracking-[0.5px] w-fit">PENDING DEPLOY</span>
                        </div>
                        <div className="text-[#54626c] text-[14px] font-medium">Generates a highly secure, watermarked PDF containing the scannable QR code for stadium entry.</div>
                    </div>
                </div>
            </motion.div>

            {/* FEATURE 10 & 11: Financial Transactions */}
            <motion.div variants={itemVariants}>
                <h2 className="text-[22px] font-extrabold mb-5 pb-2.5 border-b border-[#e2e2e2] text-[#1a1a1a] tracking-[-0.5px]">3. Financial Transactions</h2>
                <div className="grid grid-cols-1 gap-4 mb-10">
                    <div className="bg-white border border-[#e2e2e2] p-5 rounded-[4px] flex flex-col gap-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#54626c] transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <span className="bg-[#1a1a1a] text-white px-2.5 py-1 rounded-[4px] text-[12px] font-extrabold tracking-[0.5px] w-fit">POST</span>
                            <span className="font-bold text-[#0064d2] text-[15px] font-mono">/api/createOrder</span>
                            <span className="bg-[#fff8e1] text-[#f57c00] px-2.5 py-1 rounded-[4px] text-[11px] font-bold border border-[#ffb74d] sm:ml-auto tracking-[0.5px] w-fit">PENDING DEPLOY</span>
                        </div>
                        <div className="text-[#54626c] text-[14px] font-medium">Server-side generation of Stripe/Razorpay Payment Intents to prevent frontend payload tampering.</div>
                    </div>
                    <div className="bg-white border border-[#e2e2e2] p-5 rounded-[4px] flex flex-col gap-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#54626c] transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <span className="bg-[#1a1a1a] text-white px-2.5 py-1 rounded-[4px] text-[12px] font-extrabold tracking-[0.5px] w-fit">POST</span>
                            <span className="font-bold text-[#0064d2] text-[15px] font-mono">/api/webhookPayment</span>
                            <span className="bg-[#fff8e1] text-[#f57c00] px-2.5 py-1 rounded-[4px] text-[11px] font-bold border border-[#ffb74d] sm:ml-auto tracking-[0.5px] w-fit">PENDING DEPLOY</span>
                        </div>
                        <div className="text-[#54626c] text-[14px] font-medium">Secure listener verifying bank success. Converts tickets to 'sold' and credits seller escrow wallets.</div>
                    </div>
                </div>
            </motion.div>

            {/* FEATURE 12 & 13: Seller Liquidity */}
            <motion.div variants={itemVariants}>
                <h2 className="text-[22px] font-extrabold mb-5 pb-2.5 border-b border-[#e2e2e2] text-[#1a1a1a] tracking-[-0.5px]">4. Seller Liquidity & Trust</h2>
                <div className="grid grid-cols-1 gap-4 mb-10">
                    <div className="bg-white border border-[#e2e2e2] p-5 rounded-[4px] flex flex-col gap-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#54626c] transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <span className="bg-[#1a1a1a] text-white px-2.5 py-1 rounded-[4px] text-[12px] font-extrabold tracking-[0.5px] w-fit">POST</span>
                            <span className="font-bold text-[#0064d2] text-[15px] font-mono">/api/withdrawFunds</span>
                            <span className="bg-[#fff8e1] text-[#f57c00] px-2.5 py-1 rounded-[4px] text-[11px] font-bold border border-[#ffb74d] sm:ml-auto tracking-[0.5px] w-fit">PENDING DEPLOY</span>
                        </div>
                        <div className="text-[#54626c] text-[14px] font-medium">Deducts verified Parbet balances and processes standard bank routing payouts to the seller's verified account.</div>
                    </div>
                    <div className="bg-white border border-[#e2e2e2] p-5 rounded-[4px] flex flex-col gap-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#54626c] transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <span className="bg-[#1a1a1a] text-white px-2.5 py-1 rounded-[4px] text-[12px] font-extrabold tracking-[0.5px] w-fit">POST</span>
                            <span className="font-bold text-[#0064d2] text-[15px] font-mono">/api/verifyKYC</span>
                            <span className="bg-[#fff8e1] text-[#f57c00] px-2.5 py-1 rounded-[4px] text-[11px] font-bold border border-[#ffb74d] sm:ml-auto tracking-[0.5px] w-fit">PENDING DEPLOY</span>
                        </div>
                        <div className="text-[#54626c] text-[14px] font-medium">Processes government ID logic to unlock withdrawal capabilities and flag fraudulent merchant accounts.</div>
                    </div>
                </div>
            </motion.div>

            {/* FEATURE 14: Global Notifications */}
            <motion.div variants={itemVariants}>
                <h2 className="text-[22px] font-extrabold mb-5 pb-2.5 border-b border-[#e2e2e2] text-[#1a1a1a] tracking-[-0.5px]">5. Global Notifications</h2>
                <div className="grid grid-cols-1 gap-4 mb-10">
                    <div className="bg-white border border-[#e2e2e2] p-5 rounded-[4px] flex flex-col gap-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#54626c] transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <span className="bg-[#1a1a1a] text-white px-2.5 py-1 rounded-[4px] text-[12px] font-extrabold tracking-[0.5px] w-fit">POST</span>
                            <span className="font-bold text-[#0064d2] text-[15px] font-mono">/api/sendSaleAlert</span>
                            <span className="bg-[#fff8e1] text-[#f57c00] px-2.5 py-1 rounded-[4px] text-[11px] font-bold border border-[#ffb74d] sm:ml-auto tracking-[0.5px] w-fit">PENDING DEPLOY</span>
                        </div>
                        <div className="text-[#54626c] text-[14px] font-medium">Dispatches real-time HTML alerts to sellers confirming their ticket has been purchased and funds are escrowed.</div>
                    </div>
                </div>
            </motion.div>

            {/* FEATURE 15-18: Stack Architecture */}
            <motion.div variants={itemVariants}>
                <h2 className="text-[22px] font-extrabold mb-5 pb-2.5 border-b border-[#e2e2e2] text-[#1a1a1a] tracking-[-0.5px]">Infrastructure Stack</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-[20px]">
                    <div className="bg-[#f8f9fa] p-5 rounded-[4px] border border-[#e2e2e2] flex items-center gap-4 hover:bg-[#f0f0f0] transition-colors">
                        <div className="text-[11px] font-extrabold text-[#0064d2] border border-[#0064d2] px-2 py-1 rounded-[4px] tracking-[1px]">EDGE</div>
                        <div>
                            <h4 className="text-[15px] font-extrabold text-[#1a1a1a] mb-1">Vercel Framework</h4>
                            <p className="text-[13px] font-medium text-[#54626c]">Serverless Execution</p>
                        </div>
                    </div>
                    <div className="bg-[#f8f9fa] p-5 rounded-[4px] border border-[#e2e2e2] flex items-center gap-4 hover:bg-[#f0f0f0] transition-colors">
                        <div className="text-[11px] font-extrabold text-[#0064d2] border border-[#0064d2] px-2 py-1 rounded-[4px] tracking-[1px]">AUTH</div>
                        <div>
                            <h4 className="text-[15px] font-extrabold text-[#1a1a1a] mb-1">Firebase Admin</h4>
                            <p className="text-[13px] font-medium text-[#54626c]">Bypassed Security Logic</p>
                        </div>
                    </div>
                    <div className="bg-[#f8f9fa] p-5 rounded-[4px] border border-[#e2e2e2] flex items-center gap-4 hover:bg-[#f0f0f0] transition-colors">
                        <div className="text-[11px] font-extrabold text-[#0064d2] border border-[#0064d2] px-2 py-1 rounded-[4px] tracking-[1px]">SMTP</div>
                        <div>
                            <h4 className="text-[15px] font-extrabold text-[#1a1a1a] mb-1">Resend API</h4>
                            <p className="text-[13px] font-medium text-[#54626c]">Enterprise Email Delivery</p>
                        </div>
                    </div>
                    <div className="bg-[#f8f9fa] p-5 rounded-[4px] border border-[#e2e2e2] flex items-center gap-4 hover:bg-[#f0f0f0] transition-colors">
                        <div className="text-[11px] font-extrabold text-[#0064d2] border border-[#0064d2] px-2 py-1 rounded-[4px] tracking-[1px]">PAY</div>
                        <div>
                            <h4 className="text-[15px] font-extrabold text-[#1a1a1a] mb-1">Payment Gateway</h4>
                            <p className="text-[13px] font-medium text-[#54626c]">Stripe / Razorpay Engine</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}