'use client';

import React from 'react';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { ArrowRight, Sparkles } from 'lucide-react';

interface PreFooterBookkeeperBannerProps {
  onOpenSignUp: () => void;
}

export const PreFooterBookkeeperBanner: React.FC<PreFooterBookkeeperBannerProps> = ({
  onOpenSignUp,
}) => {
  const { config } = useSiteConfig();

  return (
    <section className="w-full bg-gradient-to-r from-[#E85A4F] via-[#E98074] to-[#E85A4F] text-white py-12 sm:py-16 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#2B2824]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Left Column: Headline & Subtitle */}
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-[#EAE7DC] text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-xs border border-white/30">
              <Sparkles className="w-3 h-3 text-[#EAE7DC]" />
              <span>Transform Your Studio Billing</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Ready to streamline your invoicing and get paid on time?
            </h2>

            <p className="text-sm sm:text-base text-[#FAF8F5]/90 leading-relaxed">
              Create professional invoices with custom branding in under 60 seconds. Join 12,000+ freelancers and studios using {config.brandName}.
            </p>
          </div>

          {/* Right Column: CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 shrink-0">
            <button
              onClick={onOpenSignUp}
              className="px-8 py-3.5 rounded-full font-bold text-[#E85A4F] bg-[#EAE7DC] hover:bg-white active:bg-[#FAF8F5] text-sm sm:text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <span>Get started free</span>
              <ArrowRight className="w-4 h-4 text-[#E85A4F]" />
            </button>
            <a
              href="#pricing"
              className="px-6 py-3.5 rounded-full font-bold text-white bg-white/15 hover:bg-white/25 active:bg-white/30 border border-white/30 text-sm sm:text-base backdrop-blur-xs transition-all cursor-pointer text-center"
            >
              Explore plans
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
