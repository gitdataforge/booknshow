import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ShieldCheck, Globe } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full bg-white pt-16 pb-12 border-t border-gray-200 mt-auto font-sans relative z-10">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                
                {/* Column 1: Parbet Guarantee */}
                <div className="flex flex-col">
                    <div className="flex items-center mb-6">
                        <ShieldCheck size={36} className="text-[#458731] mr-2" strokeWidth={1.5} />
                        <div className="flex flex-col leading-none">
                            <span className="text-[20px] font-black tracking-tighter text-[#1a1a1a]">parbet</span>
                            <span className="text-[18px] font-normal text-[#54626c] tracking-tight">guarantee</span>
                        </div>
                    </div>
                    <ul className="space-y-4">
                        {[
                            'World class security checks', 
                            'Transparent pricing', 
                            '100% order guarantee', 
                            'Customer service from start to finish'
                        ].map(text => (
                            <li key={text} className="flex items-start text-[13px] font-bold text-[#54626c]">
                                <Check size={16} className="text-[#458731] mr-3 mt-0.5 shrink-0" strokeWidth={3} />
                                {text}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 2: Our Company */}
                <div className="flex flex-col">
                    <h3 className="text-[16px] font-bold text-[#54626c] mb-6">Our Company</h3>
                    <ul className="space-y-5">
                        {[
                            'About Us', 
                            'Partners', 
                            'Affiliate Programme', 
                            'Corporate Service', 
                            'Careers', 
                            'Event Organisers'
                        ].map(text => (
                            <li key={text}>
                                <Link to="/" className="text-[14px] text-[#1a1a1a] hover:text-[#458731] transition-colors">
                                    {text}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 3: Have Questions? */}
                <div className="flex flex-col">
                    <h3 className="text-[16px] font-bold text-[#54626c] mb-6">Have Questions?</h3>
                    <ul className="space-y-5">
                        <li>
                            <Link to="/" className="text-[14px] text-[#1a1a1a] hover:text-[#458731] transition-colors">
                                Help Centre / Contact Us
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Column 4: Localization */}
                <div className="flex flex-col">
                    <h3 className="text-[16px] font-bold text-[#54626c] mb-6">Live events all over the world</h3>
                    <div className="space-y-4">
                        {/* Country Selector */}
                        <button className="w-full flex items-center justify-start border border-[#cccccc] rounded-[6px] px-4 py-3 hover:bg-gray-50 transition-colors shadow-sm">
                            <span className="mr-3 text-[16px] leading-none">🇺🇸</span>
                            <span className="text-[14px] text-[#54626c]">United States</span>
                        </button>
                        
                        {/* Language & Currency Selector (Grouped Box) */}
                        <div className="w-full border border-[#cccccc] rounded-[6px] flex flex-col hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
                            <div className="flex items-center px-4 py-3 border-b border-[#cccccc]">
                                <Globe size={16} className="text-gray-500 mr-3 shrink-0" strokeWidth={1.5} />
                                <span className="text-[14px] text-[#54626c]">English (US)</span>
                            </div>
                            <div className="flex items-center px-4 py-3">
                                <span className="text-[14px] text-gray-500 mr-3 font-mono tracking-widest">INR</span>
                                <span className="text-[14px] text-[#54626c]">Indian Rupee</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Bottom Copyright & Legal Block */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 border-t border-[#cccccc] pt-8">
                <p className="text-[11px] text-[#54626c] leading-relaxed">
                    Copyright © parbet Entertainment Inc 2026 <Link to="/" className="text-[#458731] hover:underline">Company Details</Link><br/>
                    Use of this web site constitutes acceptance of the <Link to="/" className="text-[#458731] hover:underline">Terms and Conditions</Link> and <Link to="/" className="text-[#458731] hover:underline">Privacy Policy</Link> and <Link to="/" className="text-[#458731] hover:underline">Cookies Policy</Link> and <Link to="/" className="text-[#458731] hover:underline">Mobile Privacy Policy</Link> <Link to="/" className="text-[#458731] hover:underline">Do Not Share My Personal Information/Your Privacy Choices</Link>
                </p>
            </div>
        </footer>
    );
}