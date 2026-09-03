'use client';

import React, { useState, useEffect } from 'react';
import { WaveLogo } from './WaveLogo';
import { useSiteConfig } from '@/context/SiteConfigContext';
import {
  ChevronDown,
  Menu,
  X,
  FileText,
  LayoutDashboard,
  CreditCard,
  Users,
  Settings,
  Check,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

interface NavbarProps {
  onOpenSignIn: () => void;
  onOpenSignUp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSignIn, onOpenSignUp }) => {
  const { config, updateConfig } = useSiteConfig();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const featureItems = [
    {
      id: 'invoicing',
      title: 'Invoicing',
      desc: 'Send professional invoices & get paid online',
      icon: FileText,
      color: 'text-teal-600 bg-teal-50',
      hash: '#features-invoicing',
    },
    {
      id: 'accounting',
      title: 'Dashboard',
      desc: 'Track earnings, outstanding, and overdue in real time',
      icon: LayoutDashboard,
      color: 'text-blue-600 bg-blue-50',
      hash: '#features-accounting',
    },
    {
      id: 'payments',
      title: 'Online Payments',
      desc: 'Clients pay from the invoice link — no account needed',
      icon: CreditCard,
      color: 'text-indigo-600 bg-indigo-50',
      hash: '#features-payments',
    },
    {
      id: 'payroll',
      title: 'Client Management',
      desc: 'Add, edit, and track all your clients and billing history',
      icon: Users,
      color: 'text-emerald-600 bg-emerald-50',
      hash: '#features-payroll',
    },
    {
      id: 'advisors',
      title: 'Settings & Branding',
      desc: 'Upload your logo and customise every invoice',
      icon: Settings,
      color: 'text-amber-600 bg-amber-50',
      hash: '#features-advisors',
    },
  ];

  return (
    <>
      {/* Announcement banner */}
      {config.showAnnouncement && (
        <div className="bg-[#E85A4F] text-white text-xs sm:text-sm py-2 px-4 text-center font-medium relative shadow-2xs">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <span>{config.announcementText}</span>
            <a
              href="#pricing"
              className="underline hover:text-[#EAE7DC] font-semibold ml-1 cursor-pointer"
            >
              Learn more &rarr;
            </a>
          </div>
          <button
            onClick={() => updateConfig({ showAnnouncement: false })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-1 rounded-full hover:bg-black/10"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Navigation Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-[#EAE7DC]/95 backdrop-blur-md shadow-xs border-b border-[#D8C3A5]'
            : 'bg-[#EAE7DC]/85 backdrop-blur-md border-b border-[#D8C3A5]/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-10">
            <a href="#" className="flex items-center group">
              <WaveLogo size="md" />
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 text-[15px] font-medium text-[#2B2824]">
              {/* Features Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setFeaturesDropdownOpen(true)}
                onMouseLeave={() => setFeaturesDropdownOpen(false)}
              >
                <button
                  id="nav-features-dropdown"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg hover:text-[#E85A4F] hover:bg-[#D8C3A5]/20 transition-colors"
                >
                  Features
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      featuresDropdownOpen ? 'rotate-180 text-[#E85A4F]' : 'text-[#8E8D8A]'
                    }`}
                  />
                </button>

                {featuresDropdownOpen && (
                  <div className="absolute top-full left-0 w-[420px] bg-[#FAF8F5] rounded-xl shadow-xl border border-[#D8C3A5] p-3 mt-1 grid gap-1.5 z-50">
                    {featureItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={item.id}
                          href={item.hash}
                          onClick={() => setFeaturesDropdownOpen(false)}
                          className="flex items-start gap-3.5 p-2.5 rounded-lg hover:bg-[#D8C3A5]/20 transition-colors group"
                        >
                          <div className={`p-2 rounded-lg shrink-0 ${item.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-[#2B2824] group-hover:text-[#E85A4F] transition-colors text-sm">
                              {item.title}
                            </div>
                            <div className="text-xs text-[#8E8D8A] mt-0.5 leading-relaxed">
                              {item.desc}
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              <a
                href="#features"
                className="px-3.5 py-2 rounded-lg hover:text-[#E85A4F] hover:bg-[#D8C3A5]/20 transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="px-3.5 py-2 rounded-lg hover:text-[#E85A4F] hover:bg-[#D8C3A5]/20 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="px-3.5 py-2 rounded-lg hover:text-[#E85A4F] hover:bg-[#D8C3A5]/20 transition-colors"
              >
                Customers
              </a>
              <a
                href="#faqs"
                className="px-3.5 py-2 rounded-lg hover:text-[#E85A4F] hover:bg-[#D8C3A5]/20 transition-colors"
              >
                Resources &amp; FAQ
              </a>
            </nav>
          </div>

          {/* Desktop Right CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              id="nav-sign-in-btn"
              onClick={onOpenSignIn}
              className="px-4 py-2 text-[15px] font-semibold text-[#2B2824] hover:text-[#E85A4F] transition-colors rounded-lg hover:bg-[#D8C3A5]/20"
            >
              Sign In
            </button>
            <button
              id="nav-sign-up-btn"
              onClick={onOpenSignUp}
              className="px-5 py-2.5 text-[15px] font-bold text-white bg-[#E85A4F] hover:bg-[#D44A3F] active:bg-[#C03D32] transition-all rounded-full shadow-sm hover:shadow-md cursor-pointer"
            >
              {config.primaryCtaText}
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
            <div className="font-semibold text-xs uppercase tracking-wider text-slate-400 px-2 pt-2">
              Features
            </div>
            <div className="grid gap-1">
              {featureItems.map((item) => (
                <a
                  key={item.id}
                  href={item.hash}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm text-slate-800 font-medium hover:bg-slate-50 rounded-lg flex items-center justify-between"
                >
                  <span>{item.title}</span>
                  <span className="text-xs text-slate-400">&rarr;</span>
                </a>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 grid gap-1">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm text-slate-800 font-medium hover:bg-slate-50 rounded-lg"
              >
                Features
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm text-slate-800 font-medium hover:bg-slate-50 rounded-lg"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm text-slate-800 font-medium hover:bg-slate-50 rounded-lg"
              >
                Customer Stories
              </a>
              <a
                href="#faqs"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm text-slate-800 font-medium hover:bg-slate-50 rounded-lg"
              >
                FAQ
              </a>
            </div>

            <div className="pt-3 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSignIn();
                }}
                className="w-full py-2.5 text-center font-semibold text-slate-700 bg-slate-100 rounded-lg"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSignUp();
                }}
                className="w-full py-2.5 text-center font-bold text-white bg-[#0055FF] hover:bg-[#0044dd] rounded-full shadow-sm cursor-pointer"
              >
                {config.primaryCtaText}
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
