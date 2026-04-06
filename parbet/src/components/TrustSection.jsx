import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Headphones, Lock } from 'lucide-react';

/**
 * TrustSection: High-end section with animated SVG paths.
 * Explains Parbet strictly logic-based security features.
 */
export default function TrustSection() {
    const features = [
        { icon: ShieldCheck, title: "100% Guaranteed", desc: "Tickets are always valid and delivered on time." },
        { icon: Lock, title: "Secure Checkout", desc: "Strict end-to-end encryption for every transaction." },
        { icon: Truck, title: "Instant Access", desc: "Mobile-first digital delivery straight to your wallet." },
        { icon: Headphones, title: "24/7 Support", desc: "Expert resolution for all marketplace disputes." }
    ];

    return (
        <div className="w-full py-20 bg-gray-50 rounded-[40px] px-8 md:px-16 overflow-hidden relative border border-gray-100">
            {/* Background Animated SVG Abstract Line */}
            <svg className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" viewBox="0 0 1000 1000">
                <motion.path
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                    d="M0,500 C200,300 400,700 600,500 S800,300 1000,500"
                    fill="none"
                    stroke="#044d22"
                    strokeWidth="100"
                />
            </svg>

            <div className="max-w-6xl mx-auto">
                <div className="mb-16 text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-[#1a1a1a] tracking-tighter mb-4">
                        Buy and sell with <span className="text-[#458731]">confidence</span>
                    </h2>
                    <p className="text-gray-500 font-medium text-lg">Parbet strictly enforces global secondary marketplace security standards.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {features.map((f, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex flex-col items-center text-center p-6 bg-white rounded-3xl shadow-sm border border-gray-100"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-[#E6F2D9] flex items-center justify-center text-[#458731] mb-6">
                                <f.icon size={32} />
                            </div>
                            <h4 className="text-lg font-bold text-[#1a1a1a] mb-2">{f.title}</h4>
                            <p className="text-sm text-gray-500 leading-relaxed font-medium">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}