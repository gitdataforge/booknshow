import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Globe, Zap, Server, Code, Database, Lock, Cpu, Terminal, CreditCard, Send, Wallet, Users } from 'lucide-react';

export default function Gateway() {
  // Real-Time UTC Clock Engine
  const [time, setTime] = useState(new Date().toISOString().split('T')[1].split('.')[0] + ' Z');
  useEffect(() => { 
    const t = setInterval(() => setTime(new Date().toISOString().split('T')[1].split('.')[0] + ' Z'), 1000); 
    return () => clearInterval(t); 
  }, []);

  // Real-Time Latency Ping Engine
  const [latency, setLatency] = useState('-- ms');
  const [pinging, setPinging] = useState(false);
  const [latencyColor, setLatencyColor] = useState('text-[#1a1a1a]');

  const pingServer = async () => {
    setPinging(true);
    setLatency('... ms');
    setLatencyColor('text-[#54626c]');
    const start = performance.now();
    try {
      await fetch(window.location.href, { cache: 'no-store', method: 'HEAD' });
      const end = performance.now();
      const lat = Math.round(end - start);
      setLatency(`${lat} ms`);
      setLatencyColor(lat < 100 ? 'text-[#8cc63f]' : (lat < 300 ? 'text-[#f59e0b]' : 'text-[#c21c3a]'));
    } catch (error) {
      setLatency('ERR');
      setLatencyColor('text-[#c21c3a]');
    } finally {
      setPinging(false);
    }
  };

  useEffect(() => {
    pingServer();
  }, []);

  // Animation Sequences
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div 
      initial="hidden" animate="visible" variants={containerVariants}
      className="max-w-[1280px] mx-auto px-6 md:px-12 py-12 md:py-16"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="mb-12 md:mb-20">
        <h1 className="text-[36px] md:text-[56px] lg:text-[64px] font-black tracking-tighter leading-tight mb-4 md:mb-6">API Gateway Restricted</h1>
        <p className="text-[16px] md:text-[20px] text-[#54626c] font-medium max-w-[800px] leading-relaxed">
          Strategic microservices routing for the Parbet Global Marketplace. Secure transaction processing, identity verification, and vendor liquidity engine.
        </p>
      </motion.div>

      {/* Real-Time Metrics Panel */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-20">
        <div className="border border-[#e2e2e2] p-6 md:p-8 rounded-[12px] md:rounded-[16px] hover:border-[#8cc63f] hover:shadow-[0_12px_40px_rgba(0,0,0,0.04)] transition-all bg-white group">
          <Globe className="text-[#54626c] group-hover:text-[#8cc63f] transition-colors mb-4" size={24} />
          <div className="text-[10px] md:text-[11px] font-black text-[#9ca3af] uppercase tracking-widest mb-2">System Time (UTC)</div>
          <div className="text-[28px] md:text-[32px] font-black tracking-tight">{time}</div>
        </div>
        
        <div className="border border-[#e2e2e2] p-6 md:p-8 rounded-[12px] md:rounded-[16px] hover:border-[#8cc63f] hover:shadow-[0_12px_40px_rgba(0,0,0,0.04)] transition-all bg-white group">
          <div className="flex justify-between items-start mb-4">
            <Zap className="text-[#54626c] group-hover:text-[#c21c3a] transition-colors" size={24} />
            <button onClick={pingServer} disabled={pinging} className="px-3 py-1 bg-[#f8f9fa] border border-[#e2e2e2] rounded-[4px] text-[10px] font-black uppercase tracking-widest text-[#1a1a1a] hover:bg-[#8cc63f] hover:text-white hover:border-[#8cc63f] transition-all disabled:opacity-50">
              {pinging ? 'Pinging...' : 'Ping'}
            </button>
          </div>
          <div className="text-[10px] md:text-[11px] font-black text-[#9ca3af] uppercase tracking-widest mb-2">Network Latency</div>
          <div className={`text-[28px] md:text-[32px] font-black tracking-tight ${latencyColor} transition-colors`}>{latency}</div>
        </div>

        <div className="border border-[#e2e2e2] p-6 md:p-8 rounded-[12px] md:rounded-[16px] hover:border-[#8cc63f] hover:shadow-[0_12px_40px_rgba(0,0,0,0.04)] transition-all bg-white group">
          <Server className="text-[#54626c] group-hover:text-[#8cc63f] transition-colors mb-4" size={24} />
          <div className="text-[10px] md:text-[11px] font-black text-[#9ca3af] uppercase tracking-widest mb-2">Environment</div>
          <div className="text-[28px] md:text-[32px] font-black tracking-tight text-[#8cc63f]">Production</div>
        </div>
      </motion.div>

      {/* Security Policy Section */}
      <motion.div variants={itemVariants} className="bg-[#fdf2f2]/60 border border-[#fecaca] rounded-[12px] md:rounded-[16px] p-6 md:p-10 mb-16 md:mb-24">
        <h3 className="text-[#c21c3a] text-[18px] md:text-[20px] font-black mb-6 flex items-center gap-3">
          <ShieldCheck size={24} /> Strict Origin Policy Enforced
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-[14px] md:text-[15px] font-bold text-[#1a1a1a]">
          <div className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#c21c3a] mt-1.5 shrink-0"/> CORS validation active on all mutations.</div>
          <div className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#c21c3a] mt-1.5 shrink-0"/> Vercel Domain header verification strictly enforced.</div>
          <div className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#c21c3a] mt-1.5 shrink-0"/> Firebase Admin Server-to-Server Handshake required.</div>
          <div className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#c21c3a] mt-1.5 shrink-0"/> Rate Limiting (100 req/sec) active against DDoS.</div>
        </div>
      </motion.div>

      {/* Endpoint Documentation Engine */}
      <div className="space-y-16 md:space-y-24">
        
        {/* SECTION 1: Identity & Auth */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center gap-4 mb-8 md:mb-10 pb-4 border-b border-[#f0f0f0]">
            <Lock className="text-[#8cc63f]" size={28} />
            <h2 className="text-[24px] md:text-[32px] font-black tracking-tighter">1. Security & Identity Routing</h2>
          </div>
          <div className="grid gap-4 md:gap-5">
            <Endpoint method="POST" path="/api/v1/auth/verify" status="LIVE" desc="Cryptographic verification of session tokens via Firebase Admin SDK." />
            <Endpoint method="POST" path="/api/v1/auth/reset" status="LIVE" desc="Bypasses default templates to dispatch custom secure recovery HTML emails." />
            <Endpoint method="POST" path="/api/v1/auth/2fa/sms" status="BETA" desc="Dispatches OTP payload for high-value merchant account access." />
          </div>
        </motion.section>

        {/* SECTION 2: Financial Transactions */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center gap-4 mb-8 md:mb-10 pb-4 border-b border-[#f0f0f0]">
            <CreditCard className="text-[#8cc63f]" size={28} />
            <h2 className="text-[24px] md:text-[32px] font-black tracking-tighter">2. Financial Transactions</h2>
          </div>
          <div className="grid gap-4 md:gap-5">
            <Endpoint method="POST" path="/api/v1/payments/intent" status="LIVE" desc="Server-side generation of Stripe/Razorpay Payment Intents to block payload tampering." />
            <Endpoint method="POST" path="/api/v1/payments/webhook" status="LIVE" desc="Secure edge listener verifying bank success, updating Firestore ledger states." />
            <Endpoint method="POST" path="/api/v1/payments/refund" status="RESTRICTED" desc="Admin-only endpoint to reverse escrow funds in event of fraudulent listings." />
          </div>
        </motion.section>

        {/* SECTION 3: Fulfillment Pipeline */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center gap-4 mb-8 md:mb-10 pb-4 border-b border-[#f0f0f0]">
            <Send className="text-[#8cc63f]" size={28} />
            <h2 className="text-[24px] md:text-[32px] font-black tracking-tighter">3. Fulfillment Pipeline</h2>
          </div>
          <div className="grid gap-4 md:gap-5">
            <Endpoint method="POST" path="/api/v1/fulfillment/dispatch" status="LIVE" desc="Automatically sends digital tickets and receipts to buyers via Resend SMTP." />
            <Endpoint method="POST" path="/api/v1/fulfillment/generate-pdf" status="LIVE" desc="Generates highly secure, watermarked PDFs containing encrypted stadium QR codes." />
          </div>
        </motion.section>

        {/* SECTION 4: Seller Liquidity */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center gap-4 mb-8 md:mb-10 pb-4 border-b border-[#f0f0f0]">
            <Wallet className="text-[#8cc63f]" size={28} />
            <h2 className="text-[24px] md:text-[32px] font-black tracking-tighter">4. Seller Liquidity & KYC</h2>
          </div>
          <div className="grid gap-4 md:gap-5">
            <Endpoint method="POST" path="/api/v1/seller/withdraw" status="PENDING" desc="Deducts verified balances and processes bank routing payouts via standard ACH/IMPS." />
            <Endpoint method="POST" path="/api/v1/seller/verify-kyc" status="PENDING" desc="Processes government ID logic to unlock merchant withdrawal capabilities." />
          </div>
        </motion.section>

        {/* SECTION 5: Global Notifications */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center gap-4 mb-8 md:mb-10 pb-4 border-b border-[#f0f0f0]">
            <Activity className="text-[#8cc63f]" size={28} />
            <h2 className="text-[24px] md:text-[32px] font-black tracking-tighter">5. Global Notifications</h2>
          </div>
          <div className="grid gap-4 md:gap-5">
            <Endpoint method="POST" path="/api/v1/notify/sale-alert" status="LIVE" desc="Dispatches real-time HTML alerts to sellers confirming escrowed funds." />
            <Endpoint method="POST" path="/api/v1/notify/system-alert" status="RESTRICTED" desc="Broadcasts enterprise maintenance windows to all active platform consumers." />
          </div>
        </motion.section>

      </div>
    </motion.div>
  );
}

function Endpoint({ method, path, status, desc }) {
  const isLive = status === 'LIVE';
  return (
    <div className="bg-white border border-[#e2e2e2] p-5 md:p-6 rounded-[8px] md:rounded-[12px] flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-[#8cc63f] transition-all duration-300 group">
      <div className="flex flex-wrap items-center gap-3 md:gap-5">
        <span className="bg-[#1a1a1a] text-white px-2.5 py-1 rounded-[4px] text-[11px] font-black tracking-[1px]">{method}</span>
        <span className="text-[16px] md:text-[18px] font-bold text-[#2563eb] font-mono break-all">{path}</span>
      </div>
      <div className="text-left md:text-right flex flex-col md:items-end">
        <div className={`text-[10px] font-black uppercase tracking-widest mb-1.5 w-fit md:ml-auto px-2 py-0.5 rounded-[4px] border ${isLive ? 'bg-[#f0fdf4] text-[#8cc63f] border-[#8cc63f]/30' : (status === 'PENDING' ? 'bg-[#fffbeb] text-[#f59e0b] border-[#f59e0b]/30' : 'bg-[#fdf2f2] text-[#c21c3a] border-[#c21c3a]/30')}`}>
          {status}
        </div>
        <div className="text-[13px] md:text-[14px] text-[#54626c] font-medium max-w-[500px] leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}