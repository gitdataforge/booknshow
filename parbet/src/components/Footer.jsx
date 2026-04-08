import React, { useEffect, useState } from 'react';
import { Check, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../store/useStore';

export default function Footer() {
    const { 
        userCurrency, 
        userLanguage,
        setUserCurrency,
        setUserLanguage
    } = useAppStore();

    // Dynamic Year Resolution
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="w-full bg-white border-t border-gray-200 mt-auto pt-10 pb-16 font-sans">
            <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                
                {/* Main Footer 4-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
                    
                    {/* Column 1: Guarantee */}
                    <div className="flex flex-col space-y-5">
                        <div className="flex items-center space-x-2.5 mb-2">
                            <ShieldCheck size={40} className="text-[#8bc53f]" strokeWidth={1.5} />
                            <div className="flex flex-col">
                                <span className="text-[22px] font-bold text-gray-800 leading-none tracking-tight">parbet</span>
                                <span className="text-[15px] font-medium text-gray-600 leading-none mt-1">guarantee</span>
                            </div>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex items-center text-[13px] font-bold text-gray-700">
                                <Check size={16} className="text-[#8bc53f] mr-2 stroke-[3px] shrink-0"/> World class security checks
                            </li>
                            <li className="flex items-center text-[13px] font-bold text-gray-700">
                                <Check size={16} className="text-[#8bc53f] mr-2 stroke-[3px] shrink-0"/> Transparent pricing
                            </li>
                            <li className="flex items-center text-[13px] font-bold text-gray-700">
                                <Check size={16} className="text-[#8bc53f] mr-2 stroke-[3px] shrink-0"/> 100% order guarantee
                            </li>
                            <li className="flex items-center text-[13px] font-bold text-gray-700">
                                <Check size={16} className="text-[#8bc53f] mr-2 stroke-[3px] shrink-0"/> Customer service from start to finish
                            </li>
                        </ul>
                    </div>

                    {/* Column 2: Our Company */}
                    <div>
                        <h4 className="font-bold text-[15px] text-gray-500 mb-6">Our Company</h4>
                        <ul className="space-y-5 text-[13px] font-bold text-[#1a1a1a]">
                            <li><button className="hover:underline transition-all hover:text-gray-600">About Us</button></li>
                            <li><button className="hover:underline transition-all hover:text-gray-600">Open Distribution</button></li>
                            <li><button className="hover:underline transition-all hover:text-gray-600">Affiliate Programme</button></li>
                            <li><button className="hover:underline transition-all hover:text-gray-600">Investors</button></li>
                            <li><button className="hover:underline transition-all hover:text-gray-600">Newsroom</button></li>
                            <li><button className="hover:underline transition-all hover:text-gray-600">Careers</button></li>
                            <li><button className="hover:underline transition-all hover:text-gray-600">Event Organisers</button></li>
                        </ul>
                    </div>

                    {/* Column 3: Have Questions? */}
                    <div>
                        <h4 className="font-bold text-[15px] text-gray-500 mb-6">Have Questions?</h4>
                        <ul className="space-y-5 text-[13px] font-bold text-[#1a1a1a]">
                            <li><button className="hover:underline transition-all hover:text-gray-600">Help Centre / Contact Us</button></li>
                            <li><button className="hover:underline transition-all hover:text-gray-600">Lowest Price Guarantee</button></li>
                        </ul>
                    </div>

                    {/* Column 4: Localization Dropdowns */}
                    <div>
                        <h4 className="font-bold text-[15px] text-gray-500 mb-6">Live events all over the world</h4>
                        <div className="space-y-3.5">
                            <div className="border border-gray-300 rounded-[6px] hover:border-gray-400 transition-colors overflow-hidden bg-white">
                                <select className="w-full py-2.5 px-4 text-[14px] text-gray-600 bg-transparent outline-none cursor-pointer appearance-none">
                                    <option value="US">🇺🇸 United States</option>
                                    <option value="IN">🇮🇳 India</option>
                                    <option value="GB">🇬🇧 United Kingdom</option>
                                    <option value="CA">🇨🇦 Canada</option>
                                    <option value="AU">🇦🇺 Australia</option>
                                </select>
                            </div>
                            <div className="border border-gray-300 rounded-[6px] hover:border-gray-400 transition-colors overflow-hidden bg-white">
                                <select 
                                    value={userLanguage || 'EN-US'} 
                                    onChange={(e) => setUserLanguage(e.target.value)} 
                                    className="w-full py-2.5 px-4 text-[14px] text-gray-600 bg-transparent outline-none cursor-pointer appearance-none"
                                >
                                    <option value="EN-US">A文 English (US)</option>
                                    <option value="EN-GB">A文 English (UK)</option>
                                    <option value="HI-IN">A文 Hindi (IN)</option>
                                </select>
                            </div>
                            <div className="border border-gray-300 rounded-[6px] hover:border-gray-400 transition-colors overflow-hidden bg-white">
                                <select 
                                    value={userCurrency || 'INR'} 
                                    onChange={(e) => setUserCurrency(e.target.value)} 
                                    className="w-full py-2.5 px-4 text-[14px] text-gray-600 bg-transparent outline-none cursor-pointer appearance-none"
                                >
                                    <option value="INR">INR Indian Rupee</option>
                                    <option value="USD">USD US Dollar</option>
                                    <option value="EUR">EUR Euro</option>
                                    <option value="GBP">GBP British Pound</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Legal / Copyright Divider */}
                <div className="border-t border-gray-200 pt-6 mt-8">
                    <p className="text-[12px] text-gray-500 mb-1.5">
                        Copyright © parbet Entertainment Inc {currentYear} 
                        <button className="text-[#0066c0] hover:underline ml-1">Company Details</button>
                    </p>
                    <p className="text-[12px] text-gray-500 leading-relaxed max-w-5xl">
                        Use of this web site constitutes acceptance of the <button className="text-[#0066c0] hover:underline">Terms and Conditions</button> and <button className="text-[#0066c0] hover:underline">Privacy Policy</button> and <button className="text-[#0066c0] hover:underline">Cookies Policy</button> and <button className="text-[#0066c0] hover:underline">Mobile Privacy Policy</button> 
                        <button className="text-[#0066c0] hover:underline ml-1">Do Not Share My Personal Information/Your Privacy Choices</button>
                    </p>
                </div>
            </div>
        </footer>
    );
}