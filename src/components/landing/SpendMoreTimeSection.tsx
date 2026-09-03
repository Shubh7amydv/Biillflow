'use client';

import React from 'react';
import { useSiteConfig } from '@/context/SiteConfigContext';
import {
  FileText,
  Camera,
  CreditCard,
  CheckCircle2,
  TrendingUp,
  Receipt,
  Sparkles,
} from 'lucide-react';

export const SpendMoreTimeSection: React.FC = () => {
  const { config } = useSiteConfig();

  return (
    <section className="py-24 bg-[#EAE7DC] overflow-hidden border-b border-[#D8C3A5]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with warm coral doodle star */}
        <div className="relative text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E98074]/15 text-[#E85A4F] text-xs font-extrabold uppercase tracking-wider border border-[#E98074]/30 mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#E85A4F]" />
            <span>Effortless Financial Flow</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#2B2824] tracking-tight">
            Spend more time on what you love
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6B6864] max-w-xl mx-auto">
            BillFlow takes care of invoice numbering, status tracking, and payment links so you can focus on your craft.
          </p>

          {/* SVG 8-pointed doodle star */}
          <div className="absolute -top-6 -right-4 sm:-right-12 text-[#E85A4F] w-16 h-16 sm:w-24 sm:h-24 pointer-events-none transform rotate-12 opacity-80">
            <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
              <polygon points="50,0 58,35 95,20 68,48 100,65 65,68 75,100 48,72 20,95 32,60 0,48 35,40" />
            </svg>
          </div>
        </div>

        {/* 3 Alternating Rows */}
        <div className="space-y-24">
          {/* ROW 1: Breathe that sigh of relief */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Visual Left */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#D8C3A5] bg-[#EAE7DC]">
                <img
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=700&h=700&q=80"
                  alt="Business owner working calmly"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 object-cover"
                />

                {/* Floating action pills */}
                <div className="absolute inset-0 bg-slate-900/15 p-4 flex flex-col justify-between pointer-events-none">
                  {/* Floating Action Pills */}
                  <div className="flex justify-end">
                    <div className="bg-[#FAF8F5]/95 backdrop-blur-xs text-[#E85A4F] text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-[#D8C3A5]">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Create invoices</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="bg-[#FAF8F5]/95 backdrop-blur-xs text-[#2B2824] text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-[#D8C3A5]">
                      <CreditCard className="w-3.5 h-3.5 text-[#E85A4F]" />
                      <span>Manage clients</span>
                    </div>
                    <div className="bg-[#FAF8F5]/95 backdrop-blur-xs text-[#2B2824] text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-[#D8C3A5]">
                      <Camera className="w-3.5 h-3.5 text-[#8E8D8A]" />
                      <span>Attach receipts</span>
                    </div>
                  </div>

                  {/* Center Brand Icon */}
                  <div className="flex justify-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#E85A4F] text-white flex items-center justify-center font-black text-2xl shadow-xl">
                      //
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="bg-[#FAF8F5]/95 backdrop-blur-xs text-[#2B2824] text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-[#D8C3A5]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Accept payments</span>
                    </div>
                    <div className="bg-[#FAF8F5]/95 backdrop-blur-xs text-[#2B2824] text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-[#D8C3A5]">
                      <Receipt className="w-3.5 h-3.5 text-[#E98074]" />
                      <span>Track status</span>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-[#FAF8F5]/95 backdrop-blur-xs text-[#2B2824] text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-[#D8C3A5]">
                      <TrendingUp className="w-3.5 h-3.5 text-[#E85A4F]" />
                      <span>View dashboard</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Right */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-[#2B2824] tracking-tight">
                Breathe that sigh of relief
              </h3>
              <p className="text-base sm:text-lg text-[#6B6864] leading-relaxed max-w-xl">
                With everything in one place, there’s no need to endlessly research solutions or stare at spreadsheets until your eyes glaze over. Plus, our features are designed to work together, meaning less to worry about.
              </p>
            </div>
          </div>

          {/* ROW 2: Professional invoices in seconds (Clean image without overlay card) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Text Left */}
            <div className="lg:col-span-7 space-y-4 order-2 lg:order-1">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-[#2B2824] tracking-tight">
                Look professional from day one
              </h3>
              <p className="text-base sm:text-lg text-[#6B6864] leading-relaxed max-w-xl">
                {config.brandName} is built for freelancers and solopreneurs — not accountants. Create a polished, branded invoice in under a minute, send it to your client, and get paid online. No templates, no spreadsheets, no chasing.
              </p>
            </div>

            {/* Visual Right */}
            <div className="lg:col-span-5 relative order-1 lg:order-2">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#D8C3A5] bg-[#EAE7DC]">
                <img
                  src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=700&h=700&q=80"
                  alt="Professional freelancer managing branded digital invoices"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 object-cover"
                />
              </div>
            </div>
          </div>

          {/* ROW 3: Know who has paid and who has not (Clean image without overlay card) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Visual Left */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#D8C3A5] bg-[#EAE7DC]">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=700&h=700&q=80"
                  alt="Team working on invoices"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 object-cover"
                />
              </div>
            </div>

            {/* Text Right */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-[#2B2824] tracking-tight">
                Always know who has paid
              </h3>
              <p className="text-base sm:text-lg text-[#6B6864] leading-relaxed max-w-xl">
                Your dashboard shows total earned, outstanding, and overdue at a glance — no manual tracking. Invoices past their due date are automatically flagged as Overdue. You stay in the loop without lifting a finger.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
