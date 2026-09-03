'use client';

import React from 'react';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface CtaBannerProps {
  onOpenSignUp: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onOpenSignUp }) => {
  const { config } = useSiteConfig();

  return (
    <section className="py-20 bg-gradient-to-r from-[#005f6e] via-[#007788] to-[#0b69a3] text-white text-center relative overflow-hidden">
      {/* Subtle background circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          Ready to manage your money like a boss?
        </h2>
        <p className="text-teal-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Join over 3 million entrepreneurs and freelancers who spend less time on administration and more time growing their business.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            id="cta-bottom-signup-btn"
            onClick={onOpenSignUp}
            className="w-full sm:w-auto px-9 py-4 rounded-full font-bold text-slate-950 bg-white hover:bg-slate-100 active:bg-slate-200 text-base shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{config.primaryCtaText}</span>
            <ArrowRight className="w-4 h-4 text-[#007788]" />
          </button>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-teal-100/90 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-300" />
            No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-300" />
            Unlimited invoicing & bookkeeping
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-300" />
            Setup in 2 minutes
          </span>
        </div>
      </div>
    </section>
  );
};
