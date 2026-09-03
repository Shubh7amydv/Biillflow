'use client';

import React, { useState } from 'react';
import { defaultFeatures } from '@/data/defaultWaveData';
import { useSiteConfig } from '@/context/SiteConfigContext';
import {
  FileText,
  Calculator,
  CreditCard,
  Users,
  Briefcase,
  Check,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Smartphone,
  Receipt,
  Download,
  Calendar,
  Zap,
} from 'lucide-react';

interface ProductTabsProps {
  onSelectProduct: (productId: string) => void;
}

export const ProductTabs: React.FC<ProductTabsProps> = ({ onSelectProduct }) => {
  const { config } = useSiteConfig();
  const [activeTab, setActiveTab] = useState<string>('invoicing');

  React.useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#features-')) {
        const featId = hash.replace('#features-', '');
        if (defaultFeatures.some((f) => f.id === featId)) {
          setActiveTab(featId);
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const iconsMap: Record<string, React.ElementType> = {
    invoicing: FileText,
    accounting: Calculator,
    payments: CreditCard,
    payroll: Users,
    advisors: Briefcase,
  };

  const currentFeature = defaultFeatures.find((f) => f.id === activeTab) || defaultFeatures[0];

  return (
    <section id="features" className="py-20 bg-slate-50 border-b border-slate-200/80 relative">
      <div id="features-invoicing" className="absolute top-0" />
      <div id="features-accounting" className="absolute top-0" />
      <div id="features-payments" className="absolute top-0" />
      <div id="features-payroll" className="absolute top-0" />
      <div id="features-advisors" className="absolute top-0" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            The {config.brandName} Product Suite
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Everything your small business needs to thrive
          </h2>
          <p className="text-slate-600 text-base mt-2">
            Integrated tools designed to talk to each other, so you spend less time on administration and more time making money.
          </p>
        </div>

        {/* Feature Selector Tabs */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 sm:pb-0 gap-2 no-scrollbar">
          {defaultFeatures.map((feature) => {
            const Icon = iconsMap[feature.id] || FileText;
            const isActive = activeTab === feature.id;
            return (
              <button
                key={feature.id}
                id={`feature-tab-${feature.id}`}
                onClick={() => setActiveTab(feature.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#007788] text-white shadow-md shadow-teal-900/10'
                    : 'bg-white text-slate-700 hover:bg-slate-100/80 border border-slate-200/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#007788]'}`} />
                <span>{feature.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Feature Display Card */}
        <div className="mt-10 bg-white rounded-2xl border border-slate-200/80 shadow-lg p-6 sm:p-10 lg:p-12 transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200/80 mb-3">
                  {currentFeature.badge}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {currentFeature.tagline}
                </h3>
                <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
                  {currentFeature.description}
                </p>
              </div>

              {/* Bullet Points */}
              <ul className="space-y-3">
                {currentFeature.bulletPoints.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              {/* Stat callout */}
              {currentFeature.statsText && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{currentFeature.statsText}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  id={`cta-${currentFeature.id}`}
                  onClick={() => onSelectProduct(currentFeature.id)}
                  className="px-6 py-3 rounded-full font-semibold text-white bg-[#007788] hover:bg-[#006677] active:bg-[#005566] text-sm shadow-sm flex items-center gap-2 cursor-pointer transition-all hover:gap-3"
                >
                  <span>{currentFeature.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Visual Interactive Mockup Column */}
            <div className="lg:col-span-7">
              <div className="bg-slate-900 rounded-xl p-5 sm:p-7 text-white shadow-2xl relative overflow-hidden border border-slate-800">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

                {/* Subheader inside visual */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      {config.brandName} • {currentFeature.title} Experience
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">
                    Live Demo
                  </span>
                </div>

                {/* INVOICING VISUAL */}
                {activeTab === 'invoicing' && (
                  <div className="space-y-4">
                    <div className="bg-slate-800/90 rounded-lg p-4 border border-slate-700/80">
                      <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                        <span>Invoice: #INV-2025-108</span>
                        <span className="text-emerald-400 font-semibold bg-emerald-950/70 px-2 py-0.5 rounded">
                          Sent via Email & SMS
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {config.currencySymbol}3,200.00
                      </div>
                      <div className="text-xs text-slate-400 mt-1">Client: Coastal Botanicals Ltd.</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                        <span className="text-slate-400 block">Payment Link Status</span>
                        <span className="font-semibold text-teal-300 mt-1 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> 1-Click Pay Ready
                        </span>
                      </div>
                      <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                        <span className="text-slate-400 block">Auto-Reminders</span>
                        <span className="font-semibold text-slate-200 mt-1">
                          Set for Due Date - 3 days
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-teal-950/40 border border-teal-800/50 rounded-lg text-xs flex items-center justify-between text-teal-200">
                      <span>Customer viewed invoice on iPhone (2 mins ago)</span>
                      <span className="font-bold text-teal-400">Online now</span>
                    </div>
                  </div>
                )}

                {/* ACCOUNTING VISUAL */}
                {activeTab === 'accounting' && (
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/70">
                        <span className="text-slate-400 block">Income YTD</span>
                        <span className="font-bold text-base text-emerald-400 mt-1 block">
                          {config.currencySymbol}94,200
                        </span>
                      </div>
                      <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/70">
                        <span className="text-slate-400 block">Expenses</span>
                        <span className="font-bold text-base text-amber-400 mt-1 block">
                          {config.currencySymbol}21,480
                        </span>
                      </div>
                      <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/70">
                        <span className="text-slate-400 block">Estimated Tax</span>
                        <span className="font-bold text-base text-teal-400 mt-1 block">
                          {config.currencySymbol}14,544
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/60 space-y-2">
                      <div className="font-semibold text-slate-300 text-xs flex items-center justify-between">
                        <span>Auto-Categorized Transactions</span>
                        <span className="text-[11px] text-teal-400">99.2% accuracy</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between p-2 bg-slate-900/60 rounded text-slate-200">
                          <span>Adobe Creative Cloud Suite</span>
                          <span className="text-amber-400 font-medium">-{config.currencySymbol}54.99 • Software</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-slate-900/60 rounded text-slate-200">
                          <span>Client Retainer Wire Deposit</span>
                          <span className="text-emerald-400 font-medium">+{config.currencySymbol}4,500.00 • Revenue</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PAYMENTS VISUAL */}
                {activeTab === 'payments' && (
                  <div className="space-y-4 text-xs">
                    <div className="bg-slate-800/90 rounded-lg p-4 border border-slate-700/80">
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Transparent Rates</span>
                        <span className="text-teal-400 font-semibold">Pay-As-You-Go</span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-900/80 rounded border border-slate-700/70">
                          <div className="text-slate-400 text-[11px]">Credit Card Rate</div>
                          <div className="text-lg font-bold text-white mt-0.5">
                            {config.pricing.cardProcessingRate}
                          </div>
                          <div className="text-[10px] text-slate-500">Visa, MC, Amex, Apple Pay</div>
                        </div>
                        <div className="p-3 bg-slate-900/80 rounded border border-slate-700/70">
                          <div className="text-slate-400 text-[11px]">ACH Bank Payments</div>
                          <div className="text-lg font-bold text-teal-400 mt-0.5">
                            {config.pricing.achProcessingRate}
                          </div>
                          <div className="text-[10px] text-slate-500">Direct checking transfer</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-lg text-emerald-200 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        PCI-DSS Level 1 & Bank 256-bit encryption
                      </span>
                      <span className="text-xs font-bold text-emerald-400">Protected</span>
                    </div>
                  </div>
                )}

                {/* PAYROLL VISUAL */}
                {activeTab === 'payroll' && (
                  <div className="space-y-4 text-xs">
                    <div className="bg-slate-800/90 rounded-lg p-4 border border-slate-700/80">
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Next Scheduled Payroll: Sep 15</span>
                        <span className="text-emerald-400 font-semibold bg-emerald-950 px-2 py-0.5 rounded">
                          Direct Deposit Ready
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-white mt-2">
                        {config.currencySymbol}8,450.00
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        4 Employees • 2 Contractors • Auto-tax withholdings calculated
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded border border-slate-700/60 text-slate-200">
                        <span>Elena Rostova (Lead Designer)</span>
                        <span className="font-semibold text-white">{config.currencySymbol}2,400.00</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded border border-slate-700/60 text-slate-200">
                        <span>David Miller (Operations)</span>
                        <span className="font-semibold text-white">{config.currencySymbol}2,100.00</span>
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-800/40 rounded text-slate-400 text-[11px] text-center">
                      Form W-2, 1099, and state filings generated with 100% accuracy guarantee
                    </div>
                  </div>
                )}

                {/* ADVISORS VISUAL */}
                {activeTab === 'advisors' && (
                  <div className="space-y-4 text-xs">
                    <div className="bg-slate-800/90 rounded-lg p-4 border border-slate-700/80 flex items-center gap-4">
                      <img
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                        alt="Advisor"
                        className="w-12 h-12 rounded-full object-cover border-2 border-teal-400 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-sm text-white">Sarah Jenkins, CPA</div>
                        <div className="text-teal-400 font-medium text-[11px]">
                          Your Dedicated {config.brandName} Bookkeeper
                        </div>
                        <div className="text-slate-400 text-[11px] mt-0.5">
                          12 years small business accounting experience
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800/60 rounded-lg p-3.5 border border-slate-700/60 space-y-2">
                      <div className="text-slate-300 font-semibold">Latest Advisor Notes (August Close):</div>
                      <div className="p-2.5 bg-slate-900/60 rounded text-slate-300 text-[11px] leading-relaxed">
                        "Hi! All 48 transactions for August have been reconciled. We claimed $1,420 in deductible travel & software expenses. Your P&L is locked and ready for Q3 tax estimation!"
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
