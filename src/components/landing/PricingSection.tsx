'use client';

import React, { useState } from 'react';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { Check, Sparkles, HelpCircle, ShieldCheck, ArrowRight, CreditCard, Users, Briefcase } from 'lucide-react';

interface PricingSectionProps {
  onSelectPlan: (planId: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const { config, isEditMode, updateConfig } = useSiteConfig();
  const [isAnnual, setIsAnnual] = useState(true);

  const starterPrice = isAnnual ? config.pricing.starterAnnual : config.pricing.starterMonthly;
  const proPrice = isAnnual ? config.pricing.proAnnual : config.pricing.proMonthly;

  return (
    <section id="pricing" className="py-24 bg-[#EAE7DC] border-b border-[#D8C3A5]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E98074]/15 text-[#E85A4F] text-xs font-extrabold uppercase tracking-wider border border-[#E98074]/30 mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#E85A4F]" />
            <span>Simple, Honest Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2B2824] tracking-tight">
            Start for free. Upgrade when you need automation.
          </h2>
          <p className="text-[#6B6864] text-sm sm:text-base mt-3 max-w-xl mx-auto">
            No sneaky hidden fees, no credit card required to start, and cancel anytime.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center p-1 bg-[#D8C3A5]/50 rounded-full text-xs font-semibold border border-[#D8C3A5]">
            <button
              id="pricing-billing-annual"
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
                isAnnual
                  ? 'bg-[#FAF8F5] text-[#2B2824] shadow-xs font-bold'
                  : 'text-[#6B6864] hover:text-[#2B2824]'
              }`}
            >
              Billed Annually
              <span className="ml-1.5 px-2 py-0.5 rounded-full bg-[#E85A4F] text-white text-[10px] font-extrabold">
                Save 17%
              </span>
            </button>
            <button
              id="pricing-billing-monthly"
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
                !isAnnual
                  ? 'bg-[#FAF8F5] text-[#2B2824] shadow-xs font-bold'
                  : 'text-[#6B6864] hover:text-[#2B2824]'
              }`}
            >
              Billed Monthly
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* STARTER PLAN */}
          <div className="bg-[#FAF8F5] rounded-3xl border border-[#D8C3A5] p-8 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between relative">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#2B2824]">Starter Plan</h3>
                  <p className="text-xs text-[#8E8D8A] mt-0.5">
                    Essential invoicing and bookkeeping for new businesses.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D8C3A5]/40 text-[#2B2824]">
                  Free Forever
                </span>
              </div>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-[#2B2824]">
                  {config.currencySymbol}{starterPrice}
                </span>
                <span className="text-xs text-[#8E8D8A] font-medium">/ month</span>
              </div>
              <p className="text-xs text-[#8E8D8A] mt-1">No trial period. Truly free.</p>

              <div className="mt-8 space-y-3.5 text-xs sm:text-sm">
                <div className="font-semibold text-[#2B2824]">Included in Starter:</div>
                {[
                  'Unlimited professional invoices and estimates',
                  'Unlimited clients and customer records',
                  'Online credit card & bank payment processing',
                  'Income and expense tracking & reporting',
                  'Unlimited bank account connections',
                  'Export accountant-friendly financial reports',
                ].map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-[#2B2824]">
                    <Check className="w-4 h-4 text-[#E85A4F] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#D8C3A5]/40">
              <button
                id="select-plan-starter"
                onClick={() => onSelectPlan('starter')}
                className="w-full py-3.5 px-6 rounded-full font-bold text-[#2B2824] bg-[#EAE7DC] hover:bg-[#D8C3A5]/60 active:bg-[#D8C3A5] text-sm border border-[#D8C3A5] transition-colors cursor-pointer"
              >
                Get started for free
              </button>
            </div>
          </div>

          {/* PRO PLAN */}
          <div className="bg-[#FAF8F5] rounded-3xl border-2 border-[#E85A4F] p-8 shadow-xl relative flex flex-col justify-between">
            {/* Most popular badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-extrabold bg-[#E85A4F] text-white shadow-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              MOST POPULAR
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#2B2824]">Pro Plan</h3>
                  <p className="text-xs text-[#8E8D8A] mt-0.5">
                    Maximum time savings and financial automation.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E98074]/15 text-[#E85A4F] border border-[#E98074]/30">
                  Best Value
                </span>
              </div>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-[#E85A4F]">
                  {config.currencySymbol}{proPrice}
                </span>
                <span className="text-xs text-[#8E8D8A] font-medium">/ month</span>
              </div>
              <p className="text-xs text-[#8E8D8A] mt-1">
                {isAnnual ? `Billed annually at ${config.currencySymbol}190/yr` : 'Billed monthly, cancel anytime'}
              </p>

              <div className="mt-8 space-y-3.5 text-xs sm:text-sm">
                <div className="font-semibold text-[#2B2824]">Everything in Starter, plus:</div>
                {[
                  'Automatic bank feeds & daily transaction imports',
                  'Unlimited receipt capture & OCR scanning',
                  'Automated late payment reminder emails',
                  'Discounted card processing on your first 10 monthly payments',
                  'Multiple collaborator user permissions',
                  'Priority email and live chat customer support',
                ].map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-[#2B2824] font-medium">
                    <Check className="w-4 h-4 text-[#E85A4F] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#D8C3A5]/40">
              <button
                id="select-plan-pro"
                onClick={() => onSelectPlan('pro')}
                className="w-full py-3.5 px-6 rounded-full font-bold text-white bg-[#E85A4F] hover:bg-[#D44A3F] active:bg-[#C03D32] text-sm shadow-md shadow-[#E85A4F]/25 transition-all cursor-pointer"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>

        {/* Optional Add-Ons Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-center font-bold text-xl text-[#2B2824] mb-6">
            Optional Add-On Services (Pay as you grow)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Payments Add-on */}
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#D8C3A5] shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-[#E98074]/15 text-[#E85A4F] flex items-center justify-center mb-3">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-[#2B2824] text-sm">Online Payments</h4>
              <div className="text-base font-extrabold text-[#E85A4F] mt-1">
                {config.pricing.cardProcessingRate}
              </div>
              <p className="text-xs text-[#8E8D8A] mt-1 leading-relaxed">
                Credit card &amp; ACH checkout directly on invoices. Pay only when you get paid.
              </p>
            </div>

            {/* Payroll Add-on */}
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#D8C3A5] shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-[#2B2824] text-sm">Full-Service Payroll</h4>
              <div className="text-base font-extrabold text-[#E85A4F] mt-1">
                {config.currencySymbol}{config.pricing.payrollMonthlyBase}/mo + {config.currencySymbol}{config.pricing.payrollPerEmployee}/staff
              </div>
              <p className="text-xs text-[#8E8D8A] mt-1 leading-relaxed">
                Direct deposits, state &amp; federal tax filings, employee portals, and W-2s.
              </p>
            </div>

            {/* Priority Support Add-on */}
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#D8C3A5] shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                <Briefcase className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-[#2B2824] text-sm">Priority Support</h4>
              <div className="text-base font-extrabold text-[#E85A4F] mt-1">
                Included in Pro plan
              </div>
              <p className="text-xs text-[#8E8D8A] mt-1 leading-relaxed">
                Priority email support, early feature access, and dedicated onboarding help.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
