'use client';

import React from 'react';
import { WaveLogo } from './WaveLogo';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { Globe, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { config } = useSiteConfig();

  return (
    <footer className="bg-[#1C1A18] text-[#8E8D8A] text-xs pt-16 pb-12 border-t border-[#2D2A27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-[#2D2A27]">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <WaveLogo size="md" variant="light" />
            <p className="text-[#8E8D8A] text-xs sm:text-sm leading-relaxed max-w-sm">
              {config.brandTagline}. Dedicated to empowering small business owners, freelancers, and entrepreneurs with stress-free money management.
            </p>

            <div className="space-y-2 pt-2 text-xs text-[#8E8D8A]">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#E85A4F] shrink-0" />
                <span>{config.supportEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E85A4F] shrink-0" />
                <span>{config.supportPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E85A4F] shrink-0" />
                <span>{config.companyAddress}</span>
              </div>
            </div>
          </div>

          {/* Products Col */}
          <div className="space-y-3">
            <div className="font-bold text-[#EAE7DC] text-xs uppercase tracking-wider">
              Products
            </div>
            <ul className="space-y-2">
              <li><a href="#features-invoicing" className="hover:text-[#EAE7DC] transition-colors">Invoicing</a></li>
              <li><a href="#features-accounting" className="hover:text-[#EAE7DC] transition-colors">Dashboard</a></li>
              <li><a href="#features-payments" className="hover:text-[#EAE7DC] transition-colors">Online Payments</a></li>
              <li><a href="#features-payroll" className="hover:text-[#EAE7DC] transition-colors">Client Management</a></li>
              <li><a href="#features-advisors" className="hover:text-[#EAE7DC] transition-colors">Settings &amp; Branding</a></li>
              <li><a href="#interactive-demo" className="hover:text-[#EAE7DC] transition-colors">Invoice Generator</a></li>
              <li><a href="#pricing" className="hover:text-[#EAE7DC] transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Resources Col */}
          <div className="space-y-3">
            <div className="font-bold text-[#EAE7DC] text-xs uppercase tracking-wider">
              Resources
            </div>
            <ul className="space-y-2">
              <li><a href="#pricing" className="hover:text-[#EAE7DC] transition-colors">Pricing &amp; Plans</a></li>
              <li><a href="#faqs" className="hover:text-[#EAE7DC] transition-colors">Help Center &amp; FAQ</a></li>
              <li><a href="#testimonials" className="hover:text-[#EAE7DC] transition-colors">Customer Stories</a></li>
              <li><a href="#interactive-demo" className="hover:text-[#EAE7DC] transition-colors">Invoice Generator Demo</a></li>
              <li><a href="#" className="hover:text-[#EAE7DC] transition-colors">Small Business Hub</a></li>
              <li><a href="#" className="hover:text-[#EAE7DC] transition-colors">Financial Glossary</a></li>
            </ul>
          </div>

          {/* Company & Legal Col */}
          <div className="space-y-3">
            <div className="font-bold text-[#EAE7DC] text-xs uppercase tracking-wider">
              Company
            </div>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#EAE7DC] transition-colors">About {config.brandName}</a></li>
              <li><a href="#" className="hover:text-[#EAE7DC] transition-colors">Security &amp; Privacy</a></li>
              <li><a href="#" className="hover:text-[#EAE7DC] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#EAE7DC] transition-colors">PCI Compliance</a></li>
              <li><a href="#" className="hover:text-[#EAE7DC] transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-[#EAE7DC] transition-colors">Contact Support</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#8E8D8A] text-xs">
          <div>
            &copy; {new Date().getFullYear()} {config.brandName}. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-[#8E8D8A]">
              <Globe className="w-3.5 h-3.5 text-[#E85A4F]" />
              <span>Worldwide (USD)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
