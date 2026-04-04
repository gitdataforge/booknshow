import React from 'react';
import { Check } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full bg-white border-t border-brand-border mt-auto">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
                
                {/* Main Footer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-16 mb-12">
                    
                    {/* Guarantee Column */}
                    <div className="flex flex-col space-y-6">
                        <div className="flex items-center space-x-3">
                            {/* High End SVG Shield */}
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
                                <path d="M12 22S4 16 4 9V5L12 2L20 5V9C20 16 12 22 12 22Z" stroke="#458731" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M9 12L11 14L15 10" stroke="#458731" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <div>
                                <h3 className="text-xl font-black text-brand-text leading-none tracking-tight">parbet</h3>
                                <p className="text-sm font-medium text-brand-muted">guarantee</p>
                            </div>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex items-center text-sm font-bold text-[#114C2A]"><Check size={18} className="text-[#458731] mr-3"/> World class security checks</li>
                            <li className="flex items-center text-sm font-bold text-[#114C2A]"><Check size={18} className="text-[#458731] mr-3"/> Transparent pricing</li>
                            <li className="flex items-center text-sm font-bold text-[#114C2A]"><Check size={18} className="text-[#458731] mr-3"/> 100% order guarantee</li>
                            <li className="flex items-center text-sm font-bold text-[#114C2A]"><Check size={18} className="text-[#458731] mr-3"/> Customer service from start to finish</li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="font-bold text-lg text-brand-text mb-6">Our Company</h4>
                        <ul className="space-y-4 text-sm font-medium text-brand-text">
                            <li><a href="#" className="hover:text-brand-primary transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-brand-primary transition-colors">Open Distribution</a></li>
                            <li><a href="#" className="hover:text-brand-primary transition-colors">Affiliate Programme</a></li>
                            <li><a href="#" className="hover:text-brand-primary transition-colors">Investors</a></li>
                            <li><a href="#" className="hover:text-brand-primary transition-colors">Corporate Service</a></li>
                            <li><a href="#" className="hover:text-brand-primary transition-colors">Newsroom</a></li>
                            <li><a href="#" className="hover:text-brand-primary transition-colors">Careers</a></li>
                        </ul>
                    </div>

                    {/* Questions Column */}
                    <div>
                        <h4 className="font-bold text-lg text-brand-text mb-6">Have Questions?</h4>
                        <ul className="space-y-4 text-sm font-medium text-brand-text">
                            <li><a href="#" className="hover:text-brand-primary transition-colors">Help Centre / Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Region / Selectors Column */}
                    <div className="flex flex-col">
                        <h4 className="font-bold text-lg text-brand-text mb-6">Live events all over the world</h4>
                        <div className="space-y-3 w-full max-w-[280px]">
                            <div className="relative">
                                <select className="w-full appearance-none bg-white border border-gray-300 text-brand-text py-3 px-4 pr-8 rounded-lg outline-none focus:border-brand-primary font-medium text-sm cursor-pointer shadow-sm">
                                    <option>🇬🇧 United Kingdom</option>
                                    <option>🇮🇳 India</option>
                                    <option>🇺🇸 United States</option>
                                </select>
                            </div>
                            <div className="bg-white border border-gray-300 rounded-lg shadow-sm flex flex-col">
                                <select className="w-full appearance-none bg-transparent text-brand-text py-3 px-4 outline-none font-medium text-sm cursor-pointer border-b border-gray-100">
                                    <option>A 文 English (UK)</option>
                                    <option>English (US)</option>
                                    <option>Hindi</option>
                                </select>
                                <select className="w-full appearance-none bg-transparent text-brand-muted py-3 px-4 outline-none font-medium text-sm cursor-pointer">
                                    <option>INR Indian Rupee</option>
                                    <option>USD US Dollar</option>
                                    <option>EUR Euro</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Legal Row */}
                <div className="border-t border-brand-border pt-6 flex flex-col text-xs text-brand-muted font-medium space-y-2">
                    <p>Copyright © parbet GmbH 2026 <a href="#" className="text-[#1D7AF2] hover:underline">Company Details</a></p>
                    <p className="leading-relaxed">
                        Use of this web site constitutes acceptance of the <a href="#" className="text-[#1D7AF2] hover:underline">Terms and Conditions</a> and <a href="#" className="text-[#1D7AF2] hover:underline">Privacy Policy</a> and <a href="#" className="text-[#1D7AF2] hover:underline">Cookies Policy</a> and <a href="#" className="text-[#1D7AF2] hover:underline">Mobile Privacy Policy</a> <a href="#" className="text-[#1D7AF2] hover:underline">Do Not Share My Personal Information/Your Privacy Choices</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}