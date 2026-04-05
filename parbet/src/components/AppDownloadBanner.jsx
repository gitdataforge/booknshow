import React from 'react';
import { motion } from 'framer-motion';
import { Download, QrCode } from 'lucide-react';

export default function AppDownloadBanner() {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full bg-[#EAF4D9] rounded-[20px] p-8 md:p-12 flex flex-col md:flex-row justify-between items-center relative overflow-hidden mb-16 border border-[#C5E1A5] shadow-sm"
        >
            {/* Decorative Background Elements (Floating Phones) */}
            <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] pointer-events-none">
                <motion.div 
                    animate={{ y: [0, -10, 0] }} 
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-[150px] h-[280px] bg-black rounded-3xl border-[6px] border-gray-800 shadow-2xl rotate-[-15deg] translate-x-10 translate-y-10 overflow-hidden"
                >
                    <div className="w-full h-full bg-[#E6F2D9] opacity-50"></div>
                </motion.div>
                <motion.div 
                    animate={{ y: [0, 10, 0] }} 
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-[150px] h-[280px] bg-black rounded-3xl border-[6px] border-gray-800 shadow-2xl rotate-[15deg] translate-x-24 -translate-y-4 overflow-hidden"
                >
                     <div className="w-full h-full bg-[#458731] opacity-50"></div>
                </motion.div>
            </div>

            <div className="md:w-1/2 z-10 text-center md:text-left mb-8 md:mb-0">
                <h2 className="text-[28px] md:text-[36px] font-black text-[#114C2A] mb-2 leading-tight tracking-tight">
                    Download the parbet app
                </h2>
                <p className="text-[16px] text-[#114C2A]/80 font-medium mb-8">
                    Discover your favourite events with ease
                </p>
                
                <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <motion.button 
                        whileHover={{ scale: 1.03 }} 
                        whileTap={{ scale: 0.97 }} 
                        className="bg-black text-white px-5 py-3 rounded-[12px] flex items-center hover:bg-gray-900 transition-colors w-full sm:w-auto justify-center shadow-md"
                    >
                        <Download size={22} className="mr-3" />
                        <div className="text-left leading-none">
                            <span className="text-[10px] block opacity-80">Download on the</span>
                            <span className="text-[14px] font-bold">App Store</span>
                        </div>
                    </motion.button>
                    
                    <motion.button 
                        whileHover={{ scale: 1.03 }} 
                        whileTap={{ scale: 0.97 }} 
                        className="bg-black text-white px-5 py-3 rounded-[12px] flex items-center hover:bg-gray-900 transition-colors w-full sm:w-auto justify-center shadow-md"
                    >
                        <Download size={22} className="mr-3" />
                        <div className="text-left leading-none">
                            <span className="text-[10px] block opacity-80">GET IT ON</span>
                            <span className="text-[14px] font-bold">Google Play</span>
                        </div>
                    </motion.button>
                </div>
            </div>

            <div className="md:w-1/2 flex justify-center md:justify-end z-10">
                <motion.div 
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className="bg-white p-3 rounded-[16px] shadow-lg border border-gray-100 flex flex-col items-center cursor-pointer"
                >
                    <QrCode size={90} className="text-gray-900 mb-2"/>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Scan to get</span>
                </motion.div>
            </div>
        </motion.div>
    );
}