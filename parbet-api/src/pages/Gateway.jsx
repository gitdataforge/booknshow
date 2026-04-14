import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Activity, Globe, User, Terminal, Server, Cpu, Database } from 'lucide-react';

/**
 * FEATURE: Enterprise API Gateway Dashboard
 * Strictly matching image_8d28e6.png and brand standards.
 * Implements high-fidelity metrics and endpoint documentation.
 */
export default function Gateway() {
    // FEATURE 1: Real-Time UTC Engine
    const [sysTime, setSysTime] = useState('00:00:00 Z');
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setSysTime(now.toISOString().split('T')[1].split('.')[0] + ' Z');
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // FEATURE 2: Real-Time Latency Intelligence
    const [latency, setLatency] = useState('1904 ms');
    const [pinging, setPinging] = useState(false);

    const pingServer = async () => {
        setPinging(true);
        const start = performance.now();
        try {
            await fetch(window.location.href, { cache: 'no-store' });
            const end = performance.now();
            setLatency(`${Math.round(end - start)} ms`);
        } catch (error) {
            setLatency('ERR');
        } finally {
            setPinging(false);
        }
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <div className="min-h-screen bg-white font-sans antialiased text-[#1a1a1a]">
            {/* FEATURE 3: Enterprise Navigation Header */}
            <header className="h-16 border-b border-[#f0f0f0] px-6 md:px-10 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-50">
                <div className="flex items-center gap-2 select-none">
                    <div className="text-[26px] font-black tracking-[-1.5px] leading-none">
                        <span className="text-[#54626c]">par</span><span className="text-[#8cc63f]">bet</span>
                        <span className="ml-2 px-1.5 py-0.5 bg-[#f8f9fa] border border-[#e2e2e2] rounded text-[10px] font-mono font-bold text-[#54626c] uppercase tracking-wider">api</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-5 md:gap-8 text-[14px] font-bold text-[#1a1a1a]">
                    <nav className="hidden md:flex items-center gap-8">
                        {['Status', 'Documentation', 'Developer'].map((item) => (
                            <span key={item} className="cursor-pointer hover:text-[#8cc63f] transition-colors duration-200">{item}</span>
                        ))}
                    </nav>
                    <div className="w-9 h-9 rounded-full bg-[#f8f9fa] border border-[#e2e2e2] flex items-center justify-center text-[#54626c] hover:border-[#8cc63f] hover:text-[#8cc63f] transition-all cursor-pointer">
                        <User size={18} />
                    </div>
                </div>
            </header>

            <motion.main 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-[1200px] mx-auto px-6 md:px-10 py-12"
            >
                {/* Hero Section */}
                <motion.div variants={itemVariants} className="mb-14">
                    <h1 className="text-[36px] md:text-[52px] font-black tracking-[-2px] leading-[1.1] mb-5">API Gateway Restricted</h1>
                    <p className="text-[17px] md:text-[20px] text-[#54626c] max-w-[850px] leading-relaxed font-medium">
                        Secure microservices architecture routing transactions, identity verification, and fulfillment for the Parbet Global Marketplace.
                    </p>
                </motion.div>

                {/* FEATURE 4: Real-Time Metrics Cards */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white border border-[#e2e2e2] rounded-[12px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-[#8cc63f] transition-all duration-300 group">
                        <p className="text-[11px] font-black text-[#54626c] uppercase tracking-[1.5px] mb-3 group-hover:text-[#8cc63f]">System Time (UTC)</p>
                        <p className="text-[36px] font-black tracking-[-1px] tabular-nums">{sysTime}</p>
                    </div>

                    <div className="bg-white border border-[#e2e2e2] rounded-[12px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-[#8cc63f] transition-all duration-300 group">
                        <p className="text-[11px] font-black text-[#54626c] uppercase tracking-[1.5px] mb-3 group-hover:text-[#8cc63f]">Gateway Latency</p>
                        <div className="flex items-center gap-3">
                            <span className="text-[36px] font-black tracking-[-1px] text-[#c21c3a] tabular-nums">{latency}</span>
                            <button 
                                onClick={pingServer}
                                disabled={pinging}
                                className="px-2 py-0.5 bg-[#fdf2f2] border border-[#fecaca] text-[#c21c3a] text-[10px] font-bold rounded hover:bg-[#c21c3a] hover:text-white transition-colors uppercase tracking-widest disabled:opacity-50"
                            >
                                {pinging ? '...' : 'Ping'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white border border-[#e2e2e2] rounded-[12px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-[#8cc63f] transition-all duration-300 group">
                        <p className="text-[11px] font-black text-[#54626c] uppercase tracking-[1.5px] mb-3 group-hover:text-[#8cc63f]">Environment</p>
                        <p className="text-[36px] font-black tracking-[-1px] text-[#8cc63f]">Production</p>
                    </div>
                </motion.div>

                {/* FEATURE 5: Security Policy Banner */}
                <motion.div variants={itemVariants} className="bg-[#fdf2f2]/40 border border-[#fecaca] rounded-[12px] p-8 mb-16 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#c21c3a]" />
                    <h3 className="text-[#c21c3a] font-black text-[20px] mb-5 flex items-center gap-2">
                        <ShieldCheck size={22} />
                        Strict Origin Policy Enforced
                    </h3>
                    <ul className="space-y-4 text-[14px] md:text-[15px] font-bold text-[#1a1a1a] leading-tight">
                        <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#c21c3a] mt-1.5 shrink-0" />
                            <span>All endpoints strictly enforce CORS. External domains are blocked.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#c21c3a] mt-1.5 shrink-0" />
                            <span>Requests must originate from verified Parbet Domains (Vercel).</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#c21c3a] mt-1.5 shrink-0" />
                            <span>Firebase Admin SDK securely validates internal routing tokens.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#c21c3a] mt-1.5 shrink-0" />
                            <span>Rate limiting active to prevent DDoS and brute-force routing attacks.</span>
                        </li>
                    </ul>
                </motion.div>

                {/* FEATURE 6: Endpoint Documentation Engine */}
                <div className="space-y-16">
                    <section>
                        <div className="flex items-center gap-3 mb-8 border-b border-[#f0f0f0] pb-4">
                            <h2 className="text-[28px] md:text-[32px] font-black tracking-[-1px]">1. Identity & Auth Routing</h2>
                        </div>
                        <div className="space-y-5">
                            <EndpointRow method="POST" path="/api/sendVerification" status="LIVE" description="Dispatches the 13-section HTML verification template containing the official Firebase link via Resend Sandbox." />
                            <EndpointRow method="POST" path="/api/resetPassword" status="LIVE" description="Bypasses default Firebase templates to dispatch a custom secure password recovery HTML email." />
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-8 border-b border-[#f0f0f0] pb-4">
                            <h2 className="text-[28px] md:text-[32px] font-black tracking-[-1px]">2. Fulfillment Pipeline</h2>
                        </div>
                        <div className="space-y-5">
                            <EndpointRow method="POST" path="/api/sendTicketEmail" status="PENDING DEPLOY" description="Automatically dispatches the digital ticket and receipt to the buyer upon webhook payment confirmation." />
                            <EndpointRow method="POST" path="/api/generateTicketPDF" status="PENDING DEPLOY" description="Generates a highly secure, watermarked PDF containing the scannable QR code for stadium entry." />
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-8 border-b border-[#f0f0f0] pb-4">
                            <h2 className="text-[28px] md:text-[32px] font-black tracking-[-1px]">3. Financial Transactions</h2>
                        </div>
                        <div className="space-y-5">
                            <EndpointRow method="POST" path="/api/createOrder" status="PENDING DEPLOY" description="Server-side generation of Stripe/Razorpay Payment Intents to prevent frontend payload tampering." />
                            <EndpointRow method="POST" path="/api/webhookPayment" status="PENDING DEPLOY" description="Secure listener verifying bank success. Converts tickets to 'sold' and credits seller escrow wallets." />
                        </div>
                    </section>
                </div>

                {/* Infrastructure Footer */}
                <motion.footer variants={itemVariants} className="mt-20 pt-10 border-t border-[#f0f0f0] text-center">
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                        <FooterLogo icon={<Server size={20} />} label="Vercel Edge" />
                        <FooterLogo icon={<ShieldCheck size={20} />} label="Firebase Admin" />
                        <FooterLogo icon={<Terminal size={20} />} label="Resend SDK" />
                        <FooterLogo icon={<Database size={20} />} label="Firestore" />
                    </div>
                </motion.footer>
            </motion.main>
        </div>
    );
}

function EndpointRow({ method, path, status, description }) {
    const isLive = status === 'LIVE';
    return (
        <motion.div 
            whileHover={{ y: -2 }}
            className="bg-white border border-[#e2e2e2] rounded-[12px] p-6 md:p-8 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all duration-300 group"
        >
            <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-[#1a1a1a] text-white text-[11px] font-black rounded uppercase tracking-wider">
                    {method}
                </span>
                <span className="text-[17px] md:text-[19px] font-bold text-[#2563eb] group-hover:text-[#1d4ed8] transition-colors tabular-nums">
                    {path}
                </span>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${isLive ? 'bg-[#f0fdf4] text-[#8cc63f] border border-[#8cc63f]/30' : 'bg-[#fff7ed] text-[#ea580c] border border-[#ea580c]/30'}`}>
                    {status}
                </span>
            </div>
            <p className="text-[14px] md:text-[15px] text-[#54626c] font-medium leading-relaxed group-hover:text-[#1a1a1a] transition-colors">
                {description}
            </p>
        </motion.div>
    );
}

function FooterLogo({ icon, label }) {
    return (
        <div className="flex items-center gap-2 font-black text-[14px] text-[#1a1a1a]">
            {icon}
            <span>{label}</span>
        </div>
    );
}