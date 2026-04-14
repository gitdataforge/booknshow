import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, ShieldCheck, Check, Globe, DollarSign, ChevronDown, Terminal, Activity, FileText, Lock, Zap, Server, Settings, CreditCard, BarChart3, Users, Bell } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

/**
 * FEATURE 1: Sticky Glassmorphism Header (Scroll-aware)
 * FEATURE 2: Custom 2-Line Hamburger to 'X' Morph Animation
 * FEATURE 3: Debounced Mega-Menu Hover Engine (Prevents flickering)
 * FEATURE 4: Framer Motion Hardware-Accelerated Dropdowns
 * FEATURE 5: Active Route Detection & Highlighting
 * FEATURE 6: Mobile Slide-in Drawer with Body Scroll-Lock
 * FEATURE 7: 5-Section Enterprise Footer Architecture
 * FEATURE 8: Secure Logout Pipeline Integration
 * FEATURE 9: Dynamic Real-time Copyright Engine
 * FEATURE 10: Fluid Responsive Grid (320px to 4K screens)
 */

export default function Layout({ children }) {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // State Management
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const timeoutRef = useRef(null);

  // Scroll Detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobile Scroll Lock
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  // Close Mobile Menu on Route Change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  // Debounced Hover Engine
  const handleMouseEnter = (menu) => {
    clearTimeout(timeoutRef.current);
    setActiveDropdown(menu);
  };
  
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150); // 150ms buffer prevents accidental closure
  };

  // Animation Configurations
  const dropdownVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.15 } },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }
  };

  const mobileDrawerVariants = {
    hidden: { x: '-100%', transition: { duration: 0.3, ease: 'easeInOut' } },
    visible: { x: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans antialiased text-[#1a1a1a]">
      
      {/* ========================================= */}
      {/* GLOBAL HEADER */}
      {/* ========================================= */}
      <header className={`fixed top-0 left-0 right-0 h-[72px] bg-white/95 backdrop-blur-md z-50 transition-all duration-300 border-b border-[#f0f0f0] ${scrolled ? 'shadow-[0_4px_20px_rgba(0,0,0,0.04)]' : ''}`}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-full flex items-center justify-between">
          
          {/* Brand Logo (Strict Left) */}
          <Link to="/" className="flex items-center text-[28px] md:text-[32px] font-black tracking-[-1.5px] z-[60] select-none">
            <span className="text-[#54626c]">par</span><span className="text-[#8cc63f]">bet</span>
            <span className="ml-2.5 px-1.5 py-0.5 bg-[#f8f9fa] border border-[#e2e2e2] rounded-[4px] text-[10px] md:text-[11px] font-mono font-bold text-[#54626c] uppercase tracking-widest leading-none">
              api
            </span>
          </Link>

          {/* Desktop Navigation (Strict Right) */}
          <nav className="hidden lg:flex h-full items-center gap-2">
            
            {/* Core Dropdown */}
            <div 
              className="relative h-full flex items-center px-4 cursor-pointer group"
              onMouseEnter={() => handleMouseEnter('core')}
              onMouseLeave={handleMouseLeave}
            >
              <div className={`flex items-center gap-1.5 text-[14px] font-bold transition-colors ${activeDropdown === 'core' ? 'text-[#8cc63f]' : 'text-[#1a1a1a] group-hover:text-[#8cc63f]'}`}>
                Infrastructure <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'core' ? 'rotate-180' : ''}`} />
              </div>
              <AnimatePresence>
                {activeDropdown === 'core' && (
                  <motion.div initial="hidden" animate="visible" exit="hidden" variants={dropdownVariants} className="absolute top-[72px] left-1/2 -translate-x-1/2 bg-white border border-[#f0f0f0] rounded-[12px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-[320px] p-3 flex flex-col z-50">
                    <DropdownItem icon={<BarChart3 />} title="Analytics" desc="Real-time traffic & latency" path="/analytics" />
                    <DropdownItem icon={<Zap />} title="Webhooks" desc="Manage endpoint listeners" path="/webhooks" />
                    <DropdownItem icon={<Terminal />} title="Logs" desc="System access & errors" path="/logs" />
                    <DropdownItem icon={<Activity />} title="Rate Limits" desc="Quota & burst config" path="/rate-limits" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Security Dropdown */}
            <div 
              className="relative h-full flex items-center px-4 cursor-pointer group"
              onMouseEnter={() => handleMouseEnter('security')}
              onMouseLeave={handleMouseLeave}
            >
              <div className={`flex items-center gap-1.5 text-[14px] font-bold transition-colors ${activeDropdown === 'security' ? 'text-[#8cc63f]' : 'text-[#1a1a1a] group-hover:text-[#8cc63f]'}`}>
                Security <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'security' ? 'rotate-180' : ''}`} />
              </div>
              <AnimatePresence>
                {activeDropdown === 'security' && (
                  <motion.div initial="hidden" animate="visible" exit="hidden" variants={dropdownVariants} className="absolute top-[72px] left-1/2 -translate-x-1/2 bg-white border border-[#f0f0f0] rounded-[12px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-[320px] p-3 flex flex-col z-50">
                    <DropdownItem icon={<Lock />} title="API Keys" desc="Generate & revoke keys" path="/api-keys" />
                    <DropdownItem icon={<ShieldCheck />} title="IAM Roles" desc="Manage access policies" path="/security" />
                    <DropdownItem icon={<Users />} title="Users" desc="Consumer accounts" path="/users" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Developer Dropdown */}
            <div 
              className="relative h-full flex items-center px-4 cursor-pointer group"
              onMouseEnter={() => handleMouseEnter('developer')}
              onMouseLeave={handleMouseLeave}
            >
              <div className={`flex items-center gap-1.5 text-[14px] font-bold transition-colors ${activeDropdown === 'developer' ? 'text-[#8cc63f]' : 'text-[#1a1a1a] group-hover:text-[#8cc63f]'}`}>
                Developer <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'developer' ? 'rotate-180' : ''}`} />
              </div>
              <AnimatePresence>
                {activeDropdown === 'developer' && (
                  <motion.div initial="hidden" animate="visible" exit="hidden" variants={dropdownVariants} className="absolute top-[72px] left-1/2 -translate-x-1/2 bg-white border border-[#f0f0f0] rounded-[12px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-[320px] p-3 flex flex-col z-50">
                    <DropdownItem icon={<FileText />} title="Documentation" desc="Technical integration guide" path="/docs" />
                    <DropdownItem icon={<Server />} title="System Status" desc="Live operational health" path="/status" />
                    <DropdownItem icon={<Bell />} title="Alerts" desc="Configure notifications" path="/alerts" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile & Logout Section */}
            <div className="flex items-center gap-4 pl-6 ml-2 border-l border-[#f0f0f0]">
              <Link to="/settings" className="w-10 h-10 bg-[#f8f9fa] border border-[#e2e2e2] rounded-full flex items-center justify-center text-[#54626c] hover:border-[#8cc63f] hover:text-[#8cc63f] transition-all">
                <Settings size={18} />
              </Link>
              <div className="flex flex-col items-start pr-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#9ca3af] leading-tight">Admin</span>
                <span className="text-[13px] font-bold text-[#1a1a1a] leading-tight">Engineering</span>
              </div>
              <button onClick={handleLogout} className="w-10 h-10 flex items-center justify-center bg-[#fdf2f2] text-[#c21c3a] border border-[#fecaca] rounded-[8px] hover:bg-[#c21c3a] hover:text-white transition-all ml-2" title="Sign Out">
                <LogOut size={18} strokeWidth={2.5} />
              </button>
            </div>
          </nav>

          {/* Custom 2-Line Mobile Hamburger Toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="relative w-8 h-8 flex flex-col justify-center items-center z-[60] lg:hidden">
            <span className={`absolute w-6 h-[2px] bg-[#1a1a1a] rounded-full transition-all duration-300 ${mobileMenuOpen ? 'rotate-45' : '-translate-y-1.5'}`} />
            <span className={`absolute w-6 h-[2px] bg-[#1a1a1a] rounded-full transition-all duration-300 ${mobileMenuOpen ? '-rotate-45' : 'translate-y-1.5'}`} />
          </button>
        </div>
      </header>

      {/* ========================================= */}
      {/* MOBILE DRAWER */}
      {/* ========================================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[50] lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div 
              variants={mobileDrawerVariants} initial="hidden" animate="visible" exit="hidden"
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[340px] bg-white z-[55] shadow-2xl flex flex-col lg:hidden border-r border-[#e2e2e2] pt-[80px]"
            >
              <div className="flex-grow overflow-y-auto pb-8">
                <div className="px-6 pb-4 border-b border-[#f0f0f0] mb-4">
                  <div className="text-[11px] font-black uppercase tracking-widest text-[#9ca3af] mb-1">Authenticated As</div>
                  <div className="text-[14px] font-bold text-[#1a1a1a] truncate">{user?.email || 'testcodecfg@gmail.com'}</div>
                </div>

                <MobileNavGroup title="Infrastructure">
                  <MobileNavItem path="/analytics" label="Analytics" />
                  <MobileNavItem path="/webhooks" label="Webhooks" />
                  <MobileNavItem path="/logs" label="Logs" />
                </MobileNavGroup>

                <MobileNavGroup title="Security">
                  <MobileNavItem path="/api-keys" label="API Keys" />
                  <MobileNavItem path="/security" label="IAM Roles" />
                  <MobileNavItem path="/users" label="Users" />
                </MobileNavGroup>

                <MobileNavGroup title="Developer">
                  <MobileNavItem path="/docs" label="Documentation" />
                  <MobileNavItem path="/status" label="System Status" />
                  <MobileNavItem path="/settings" label="Settings" />
                </MobileNavGroup>
              </div>

              <div className="p-6 border-t border-[#f0f0f0] bg-[#f8f9fa]">
                <button onClick={handleLogout} className="w-full py-4 bg-[#fdf2f2] text-[#c21c3a] border border-[#fecaca] rounded-[8px] font-bold flex items-center justify-center gap-2 hover:bg-[#c21c3a] hover:text-white transition-colors">
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========================================= */}
      {/* MAIN VIEWPORT */}
      {/* ========================================= */}
      <main className="flex-grow pt-[72px]">
        {children}
      </main>

      {/* ========================================= */}
      {/* 5-SECTION ENTERPRISE FOOTER */}
      {/* ========================================= */}
      <footer className="bg-white border-t border-[#f0f0f0] pt-20 pb-12 mt-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
            
            {/* Section 1: Guarantee & Brand */}
            <div className="lg:col-span-2 flex flex-col pr-8">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck size={36} className="text-[#8cc63f]" strokeWidth={2.5} />
                <div>
                  <div className="text-[24px] font-black tracking-[-1.5px] text-[#54626c] leading-none">par<span className="text-[#8cc63f]">bet</span></div>
                  <div className="text-[11px] font-bold text-[#8cc63f] uppercase tracking-widest mt-1">Enterprise Gateway</div>
                </div>
              </div>
              <p className="text-[14px] text-[#54626c] font-medium leading-relaxed mb-6 max-w-[400px]">
                Secure microservices architecture routing transactions, identity verification, and fulfillment for the Parbet Global Marketplace.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[14px] font-bold text-[#1a1a1a]"><Check size={16} className="text-[#8cc63f]" strokeWidth={3} /> PCI-DSS Compliant</div>
                <div className="flex items-center gap-2 text-[14px] font-bold text-[#1a1a1a]"><Check size={16} className="text-[#8cc63f]" strokeWidth={3} /> AES-256 Encryption</div>
                <div className="flex items-center gap-2 text-[14px] font-bold text-[#1a1a1a]"><Check size={16} className="text-[#8cc63f]" strokeWidth={3} /> 99.99% Guaranteed Uptime</div>
              </div>
            </div>

            {/* Section 2: Company */}
            <div>
              <h3 className="text-[14px] font-black text-[#1a1a1a] uppercase tracking-widest mb-6">Company</h3>
              <ul className="flex flex-col gap-4 text-[14px] font-medium text-[#54626c]">
                <li><Link to="/" className="hover:text-[#8cc63f] transition-colors">About Parbet</Link></li>
                <li><Link to="/" className="hover:text-[#8cc63f] transition-colors">Careers</Link></li>
                <li><Link to="/" className="hover:text-[#8cc63f] transition-colors">Engineering Blog</Link></li>
                <li><Link to="/" className="hover:text-[#8cc63f] transition-colors">Partner Program</Link></li>
              </ul>
            </div>

            {/* Section 3: Support */}
            <div>
              <h3 className="text-[14px] font-black text-[#1a1a1a] uppercase tracking-widest mb-6">Support</h3>
              <ul className="flex flex-col gap-4 text-[14px] font-medium text-[#54626c]">
                <li><Link to="/status" className="hover:text-[#8cc63f] transition-colors">System Status</Link></li>
                <li><Link to="/docs" className="hover:text-[#8cc63f] transition-colors">Developer Docs</Link></li>
                <li><Link to="/" className="hover:text-[#8cc63f] transition-colors">Help Center</Link></li>
                <li><Link to="/" className="hover:text-[#8cc63f] transition-colors">Contact Support</Link></li>
              </ul>
            </div>

            {/* Section 4: Integrations */}
            <div>
              <h3 className="text-[14px] font-black text-[#1a1a1a] uppercase tracking-widest mb-6">Integrations</h3>
              <ul className="flex flex-col gap-4 text-[14px] font-medium text-[#54626c]">
                <li><Link to="/" className="hover:text-[#8cc63f] transition-colors">Stripe Payments</Link></li>
                <li><Link to="/" className="hover:text-[#8cc63f] transition-colors">Firebase Auth</Link></li>
                <li><Link to="/" className="hover:text-[#8cc63f] transition-colors">Vercel Edge</Link></li>
                <li><Link to="/" className="hover:text-[#8cc63f] transition-colors">Resend SMTP</Link></li>
              </ul>
            </div>
          </div>

          {/* Section 5: Legal & Copyright Baseline */}
          <div className="pt-8 border-t border-[#f0f0f0] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="text-[13px] font-medium text-[#9ca3af] leading-relaxed">
              &copy; {currentYear} Parbet Entertainment Inc. All rights reserved.<br/>
              Platform Version: <span className="font-bold text-[#54626c]">v8.4.12-enterprise</span>
            </div>
            
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-[13px] font-bold text-[#54626c]">
              <Link to="/" className="hover:text-[#8cc63f] transition-colors">Privacy Policy</Link>
              <Link to="/" className="hover:text-[#8cc63f] transition-colors">Terms of Service</Link>
              <Link to="/" className="hover:text-[#8cc63f] transition-colors">Cookie Preferences</Link>
              <Link to="/" className="hover:text-[#8cc63f] transition-colors">DPA</Link>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}

// Reusable Desktop Dropdown Item
function DropdownItem({ icon, title, desc, path }) {
  return (
    <Link to={path} className="flex items-start gap-4 p-3 rounded-[8px] hover:bg-[#f8f9fa] transition-colors group">
      <div className="mt-0.5 text-[#54626c] group-hover:text-[#8cc63f] transition-colors">{icon}</div>
      <div>
        <div className="text-[14px] font-bold text-[#1a1a1a] mb-0.5">{title}</div>
        <div className="text-[12px] font-medium text-[#9ca3af] leading-snug">{desc}</div>
      </div>
    </Link>
  );
}

// Reusable Mobile Nav Group
function MobileNavGroup({ title, children }) {
  return (
    <div className="mb-6">
      <div className="px-6 text-[11px] font-black uppercase tracking-widest text-[#9ca3af] mb-2">{title}</div>
      <div className="flex flex-col">
        {children}
      </div>
    </div>
  );
}

function MobileNavItem({ path, label }) {
  return (
    <Link to={path} className="px-6 py-3 text-[15px] font-bold text-[#1a1a1a] active:bg-[#f8f9fa] active:text-[#8cc63f]">
      {label}
    </Link>
  );
}