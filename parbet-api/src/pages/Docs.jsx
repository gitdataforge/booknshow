import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

// ==========================================
// FEATURE 1: Interactive Code Block Engine
// ==========================================
const InteractiveCodeBlock = ({ title, code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy code: ', err);
            // Fallback for older browsers / strict iframes
            const textArea = document.createElement("textarea");
            textArea.value = code;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="bg-[#f8f9fa] border border-[#e2e2e2] rounded-[8px] overflow-hidden mt-6 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
            <div className="bg-[#e2e2e2]/40 px-4 py-3 flex justify-between items-center border-b border-[#e2e2e2]">
                <span className="text-[12px] font-extrabold uppercase text-[#54626c] tracking-[0.5px]">{title}</span>
                <button 
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-[12px] font-bold transition-all border ${
                        copied 
                        ? 'bg-[#f2f7ef] text-[#458731] border-[#458731]' 
                        : 'bg-white text-[#54626c] border-[#e2e2e2] hover:border-[#458731] hover:text-[#458731]'
                    }`}
                >
                    {copied ? <Check size={14} strokeWidth={3} /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <div className="p-5 font-mono text-[13px] text-[#1a1a1a] whitespace-pre-wrap overflow-x-auto leading-relaxed">
                {code}
            </div>
        </div>
    );
};

// ==========================================
// FEATURE 2: Dynamic Parameters Table Engine
// ==========================================
const ParamsTable = ({ params }) => (
    <div className="w-full border border-[#e2e2e2] rounded-[8px] overflow-hidden mt-4">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-[#f8f9fa] border-b border-[#e2e2e2]">
                    <th className="px-4 py-3 text-[12px] font-extrabold uppercase text-[#54626c] tracking-[0.5px]">Parameter</th>
                    <th className="px-4 py-3 text-[12px] font-extrabold uppercase text-[#54626c] tracking-[0.5px]">Type</th>
                    <th className="px-4 py-3 text-[12px] font-extrabold uppercase text-[#54626c] tracking-[0.5px]">Description</th>
                </tr>
            </thead>
            <tbody>
                {params.map((param, idx) => (
                    <tr key={idx} className="border-b border-[#e2e2e2] last:border-b-0 bg-white">
                        <td className="px-4 py-3 font-mono text-[14px] font-bold text-[#1a1a1a]">{param.name}</td>
                        <td className="px-4 py-3 text-[14px] italic text-[#54626c]">{param.type}</td>
                        <td className="px-4 py-3 text-[14px] text-[#1a1a1a]">{param.desc}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// ==========================================
// FEATURE 3: Main Documentation Component
// ==========================================
export default function Docs() {
    // Animation Configurations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    const fetchVerificationCode = `const response = await fetch('https://parbet-api.vercel.app/api/sendVerification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: "seller@example.com",
        name: "John Doe"
    })
});

const data = await response.json();`;

    return (
        <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={containerVariants}
            className="max-w-[1200px] mx-auto px-6 font-sans text-[#1a1a1a] pb-[80px]"
        >
            {/* FEATURE 4: Documentation Hero */}
            <motion.header variants={itemVariants} className="pt-[60px] pb-[40px] border-b border-[#e2e2e2] mb-[40px]">
                <h1 className="text-[32px] md:text-[42px] font-black mb-4 tracking-[-1px] text-[#1a1a1a] leading-tight">
                    API Reference
                </h1>
                <p className="text-[#54626c] text-[16px] md:text-[18px] max-w-[700px] font-medium leading-relaxed">
                    Official developer documentation for the Parbet Serverless Edge API. Seamlessly integrate secure ticketing, real-time payouts, and automated fulfillment.
                </p>
            </motion.header>

            {/* FEATURE 5: Responsive Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-[60px] items-start">
                
                {/* FEATURE 6: Sticky Sidebar Navigation */}
                <motion.aside variants={itemVariants} className="lg:sticky lg:top-[100px] flex flex-col gap-3 lg:border-r border-[#e2e2e2] lg:pr-5">
                    
                    <div className="text-[12px] font-extrabold uppercase text-[#54626c] tracking-[1px] mb-2 mt-4 first:mt-0">Identity & Access</div>
                    <a href="#sendVerification" className="text-[14px] font-bold text-[#54626c] hover:bg-[#f8f9fa] hover:text-[#458731] px-3 py-2 rounded-[6px] transition-colors">POST /sendVerification</a>
                    <a href="#resetPassword" className="text-[14px] font-bold text-[#54626c] hover:bg-[#f8f9fa] hover:text-[#458731] px-3 py-2 rounded-[6px] transition-colors">POST /resetPassword</a>
                    
                    <div className="text-[12px] font-extrabold uppercase text-[#54626c] tracking-[1px] mb-2 mt-4">Transactions</div>
                    <a href="#createOrder" className="text-[14px] font-bold text-[#54626c] hover:bg-[#f8f9fa] hover:text-[#458731] px-3 py-2 rounded-[6px] transition-colors">POST /createOrder</a>
                    <a href="#webhookPayment" className="text-[14px] font-bold text-[#54626c] hover:bg-[#f8f9fa] hover:text-[#458731] px-3 py-2 rounded-[6px] transition-colors">POST /webhookPayment</a>

                    <div className="text-[12px] font-extrabold uppercase text-[#54626c] tracking-[1px] mb-2 mt-4">Fulfillment</div>
                    <a href="#sendTicketEmail" className="text-[14px] font-bold text-[#54626c] hover:bg-[#f8f9fa] hover:text-[#458731] px-3 py-2 rounded-[6px] transition-colors">POST /sendTicketEmail</a>
                    <a href="#generateTicketPDF" className="text-[14px] font-bold text-[#54626c] hover:bg-[#f8f9fa] hover:text-[#458731] px-3 py-2 rounded-[6px] transition-colors">POST /generateTicketPDF</a>
                    
                    <div className="text-[12px] font-extrabold uppercase text-[#54626c] tracking-[1px] mb-2 mt-4">Seller Finance</div>
                    <a href="#withdrawFunds" className="text-[14px] font-bold text-[#54626c] hover:bg-[#f8f9fa] hover:text-[#458731] px-3 py-2 rounded-[6px] transition-colors">POST /withdrawFunds</a>
                    <a href="#verifyKYC" className="text-[14px] font-bold text-[#54626c] hover:bg-[#f8f9fa] hover:text-[#458731] px-3 py-2 rounded-[6px] transition-colors">POST /verifyKYC</a>
                
                </motion.aside>

                <main className="flex flex-col gap-[60px]">
                    
                    {/* FEATURE 7: Global Rules Architecture */}
                    <motion.div variants={itemVariants} className="flex flex-col gap-4">
                        <div className="flex items-center gap-4 mb-2">
                            <h2 className="text-[24px] font-black tracking-[-0.5px] text-[#1a1a1a]">Base Configuration</h2>
                        </div>
                        <p className="text-[15px] text-[#54626c] leading-relaxed">
                            All requests must be made over HTTPS to the production Vercel edge network.<br/>
                            <strong className="text-[#1a1a1a]">Base URL:</strong> <code className="bg-[#f8f9fa] px-2 py-1 rounded-[4px] border border-[#e2e2e2] font-mono text-[#458731] ml-1">https://parbet-api.vercel.app</code>
                        </p>
                        <p className="text-[15px] text-[#54626c]">All payloads must be formatted as <code className="bg-[#f8f9fa] px-2 py-1 rounded-[4px] border border-[#e2e2e2] font-mono">application/json</code>.</p>
                    </motion.div>

                    {/* FEATURE 8: Identity API Reference */}
                    <motion.div variants={itemVariants} id="sendVerification" className="flex flex-col gap-4 pt-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
                            <span className="bg-[#1a1a1a] text-white px-3 py-1 rounded-[4px] text-[12px] font-black tracking-[0.5px] w-fit">POST</span>
                            <span className="text-[20px] font-bold text-[#1a1a1a] font-mono">/api/sendVerification</span>
                        </div>
                        <p className="text-[15px] text-[#54626c] leading-relaxed">
                            Dispatches the 13-section HTML enterprise verification template containing the official Firebase OOB secure link.
                        </p>
                        
                        <ParamsTable params={[
                            { name: 'email', type: 'string', desc: "The unverified user's email address. Required." },
                            { name: 'name', type: 'string', desc: "The user's display name for email personalization. Optional." }
                        ]} />

                        <InteractiveCodeBlock title="JavaScript Fetch Implementation" code={fetchVerificationCode} />
                    </motion.div>

                    {/* FEATURE 9: Identity API Reference */}
                    <motion.div variants={itemVariants} id="resetPassword" className="flex flex-col gap-4 pt-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
                            <span className="bg-[#1a1a1a] text-white px-3 py-1 rounded-[4px] text-[12px] font-black tracking-[0.5px] w-fit">POST</span>
                            <span className="text-[20px] font-bold text-[#1a1a1a] font-mono">/api/resetPassword</span>
                        </div>
                        <p className="text-[15px] text-[#54626c] leading-relaxed">
                            Bypasses default Firebase templates to dispatch a custom secure password recovery HTML email to the user's inbox via Resend.
                        </p>
                        
                        <ParamsTable params={[
                            { name: 'email', type: 'string', desc: "The account email address requesting the reset. Required." }
                        ]} />
                    </motion.div>

                    {/* FEATURE 10: Transaction API Reference */}
                    <motion.div variants={itemVariants} id="createOrder" className="flex flex-col gap-4 pt-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
                            <span className="bg-[#1a1a1a] text-white px-3 py-1 rounded-[4px] text-[12px] font-black tracking-[0.5px] w-fit">POST</span>
                            <span className="text-[20px] font-bold text-[#1a1a1a] font-mono">/api/createOrder</span>
                        </div>
                        <p className="text-[15px] text-[#54626c] leading-relaxed">
                            Server-side generation of Stripe/Razorpay Payment Intents to prevent frontend payload tampering during checkout.
                        </p>
                        
                        <ParamsTable params={[
                            { name: 'ticketId', type: 'string', desc: "The Firestore Document ID of the active ticket. Required." },
                            { name: 'buyerId', type: 'string', desc: "The UID of the authenticated purchaser. Required." }
                        ]} />
                    </motion.div>

                    {/* FEATURE 11: Fulfillment API Reference */}
                    <motion.div variants={itemVariants} id="sendTicketEmail" className="flex flex-col gap-4 pt-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
                            <span className="bg-[#1a1a1a] text-white px-3 py-1 rounded-[4px] text-[12px] font-black tracking-[0.5px] w-fit">POST</span>
                            <span className="text-[20px] font-bold text-[#1a1a1a] font-mono">/api/sendTicketEmail</span>
                        </div>
                        <p className="text-[15px] text-[#54626c] leading-relaxed">
                            Automatically dispatches the digital ticket and receipt to the buyer upon webhook payment confirmation.
                        </p>
                        
                        <ParamsTable params={[
                            { name: 'orderId', type: 'string', desc: "The finalized Order ID to generate the receipt for. Required." }
                        ]} />
                    </motion.div>

                    {/* FEATURE 12: Seller Finance API Reference */}
                    <motion.div variants={itemVariants} id="withdrawFunds" className="flex flex-col gap-4 pt-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
                            <span className="bg-[#1a1a1a] text-white px-3 py-1 rounded-[4px] text-[12px] font-black tracking-[0.5px] w-fit">POST</span>
                            <span className="text-[20px] font-bold text-[#1a1a1a] font-mono">/api/withdrawFunds</span>
                        </div>
                        <p className="text-[15px] text-[#54626c] leading-relaxed">
                            Deducts verified Parbet balances and processes standard bank routing payouts to the seller's verified account.
                        </p>
                        
                        <ParamsTable params={[
                            { name: 'sellerId', type: 'string', desc: "The UID of the verified seller. Required." },
                            { name: 'amount', type: 'number', desc: "Amount to withdraw in base currency. Required." }
                        ]} />
                    </motion.div>

                    {/* FEATURE 13: Standard Error Codes */}
                    <motion.div variants={itemVariants} className="flex flex-col gap-4 pt-4">
                        <div className="flex items-center gap-4 mb-2">
                            <h2 className="text-[20px] font-black tracking-[-0.5px] text-[#1a1a1a]">Standard Error Responses</h2>
                        </div>
                        <div className="w-full border border-[#e2e2e2] rounded-[8px] overflow-hidden mt-2">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#f8f9fa] border-b border-[#e2e2e2]">
                                        <th className="px-4 py-3 text-[12px] font-extrabold uppercase text-[#54626c] tracking-[0.5px]">HTTP Code</th>
                                        <th className="px-4 py-3 text-[12px] font-extrabold uppercase text-[#54626c] tracking-[0.5px]">Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-[#e2e2e2] bg-white">
                                        <td className="px-4 py-3 font-mono text-[14px] font-bold text-[#1a1a1a]">400 Bad Request</td>
                                        <td className="px-4 py-3 text-[14px] text-[#1a1a1a]">Missing required parameters (e.g., missing email).</td>
                                    </tr>
                                    <tr className="border-b border-[#e2e2e2] bg-white">
                                        <td className="px-4 py-3 font-mono text-[14px] font-bold text-[#1a1a1a]">403 Forbidden</td>
                                        <td className="px-4 py-3 text-[14px] text-[#1a1a1a]">CORS block. Request originated from an unauthorized domain.</td>
                                    </tr>
                                    <tr className="border-b border-[#e2e2e2] bg-white">
                                        <td className="px-4 py-3 font-mono text-[14px] font-bold text-[#1a1a1a]">405 Method Not Allowed</td>
                                        <td className="px-4 py-3 text-[14px] text-[#1a1a1a]">Attempted to use GET instead of POST.</td>
                                    </tr>
                                    <tr className="bg-white">
                                        <td className="px-4 py-3 font-mono text-[14px] font-bold text-[#1a1a1a]">500 Internal Server Error</td>
                                        <td className="px-4 py-3 text-[14px] text-[#1a1a1a]">Firebase Admin or Resend service failure. Check API logs.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                </main>
            </div>
        </motion.div>
    );
}