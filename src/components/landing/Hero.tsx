'use client';

import React from 'react';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { WaveDashboardSandbox } from './WaveDashboardSandbox';
import {
  Tag,
  Star,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface HeroProps {
  onOpenSignUp: () => void;
  onExploreDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenSignUp, onExploreDemo }) => {
  const { config } = useSiteConfig();

  return (
    <div className="relative bg-gradient-to-b from-[#EAE7DC] via-[#F2EFE8] to-[#EAE7DC] overflow-hidden">
      {/* 1. TOP PROMO BANNER */}
      <div className="relative bg-[#D8C3A5]/40 border-b border-[#D8C3A5]/80 py-3.5 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3">
            <span className="inline-flex items-center gap-1 bg-[#E85A4F] text-white text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs shrink-0">
              NEW <span className="font-mono text-xs">//</span>
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#2B2824] tracking-tight">
                Know which client projects are actually paying off with Project Tags
              </h2>
              <p className="text-xs text-[#6B6864]">
                <span className="font-semibold text-[#2B2824]">Tag it, track it,</span> and see what's bringing in the most revenue.
              </p>
            </div>
          </div>

          {/* Floating Tag Pills */}
          <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
            <div className="bg-[#EAE7DC] text-[#2B2824] text-xs font-semibold px-3 py-1.5 rounded-xl shadow-2xs border border-[#D8C3A5] flex items-center gap-2">
              <span>Main Street Reno</span>
              <span className="w-5 h-5 rounded-md bg-[#E98074]/20 text-[#E85A4F] flex items-center justify-center">
                <Tag className="w-3 h-3" />
              </span>
            </div>

            <div className="bg-[#EAE7DC] text-[#2B2824] text-xs font-semibold px-3 py-1.5 rounded-xl shadow-2xs border border-[#D8C3A5] flex items-center gap-2">
              <span>Brand Identity</span>
              <span className="w-5 h-5 rounded-md bg-[#8E8D8A]/20 text-[#2B2824] flex items-center justify-center">
                <Tag className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN HERO SECTION */}
      <section className="pt-10 pb-16 lg:pt-14 lg:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* HEADLINE & HERO COPY (LEFT SIDE) */}
          <div className="lg:col-span-5 space-y-6 order-1">
            {/* Rating */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[#6B6864]">
              <div className="flex items-center gap-0.5 text-[#E85A4F]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span>Rated 4.9/5 by 12,000+ studios</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#2B2824] tracking-tight leading-[1.08]">
              {config.heroHeadline}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#6B6864] leading-relaxed max-w-lg font-normal">
              {config.heroSubheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                id="hero-primary-cta"
                onClick={onOpenSignUp}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-base font-bold text-white bg-[#E85A4F] hover:bg-[#D44A3F] active:bg-[#C03D32] shadow-lg shadow-[#E85A4F]/25 hover:shadow-xl hover:shadow-[#E85A4F]/35 transition-all duration-200 cursor-pointer"
              >
                <span>{config.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-demo-cta"
                onClick={onExploreDemo}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-sm font-bold text-[#2B2824] hover:text-[#E85A4F] bg-[#FAF8F5] hover:bg-[#EAE7DC] border border-[#D8C3A5] shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#E85A4F]" />
                <span>See how it works</span>
              </button>
            </div>

            {/* Micro proof badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B6864] pt-2">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E85A4F]" />
                <span>1-minute setup</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E98074]" />
                <span>Client payment portal</span>
              </div>
            </div>
          </div>

          {/* SANDBOX DASHBOARD PREVIEW (RIGHT SIDE) */}
          <div className="lg:col-span-7 order-2">
            <div className="relative group">
              {/* Subtle warm ambient back-glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#E98074]/20 via-[#D8C3A5]/30 to-[#E85A4F]/15 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition duration-500" />
              <div className="relative">
                <WaveDashboardSandbox onActionClick={onExploreDemo} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
