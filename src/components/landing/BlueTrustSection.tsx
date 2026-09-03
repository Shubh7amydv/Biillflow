'use client';

import React from 'react';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { Star, Sparkles, ArrowRight } from 'lucide-react';

interface BlueTrustSectionProps {
  onOpenSignUp: () => void;
}

export const BlueTrustSection: React.FC<BlueTrustSectionProps> = ({ onOpenSignUp }) => {
  const { config } = useSiteConfig();

  return (
    <section id="testimonials" className="relative py-24 bg-[#D8C3A5]/35 text-[#2B2824] border-b border-[#D8C3A5]/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Headline */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAE7DC] text-[#E85A4F] text-xs font-extrabold uppercase tracking-wider border border-[#D8C3A5] mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#E85A4F]" />
            <span>Community Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2B2824] tracking-tight leading-snug">
            Over{' '}
            <span className="text-[#E85A4F]">12,000</span>{' '}
            freelancers &amp; studios trust {config.brandName} to manage their billing
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6B6864]">
            Hear from creatives, developers, and consultants who simplified their client billing.
          </p>
        </div>

        {/* 3 Cohesive Elevated Customer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-14">
          {/* CARD 1: Tatiyanna W. */}
          <div className="bg-[#FAF8F5] text-[#2B2824] rounded-3xl p-7 sm:p-8 flex flex-col justify-between border border-[#D8C3A5] shadow-xs hover:shadow-md hover:border-[#E85A4F]/60 transition-all duration-300">
            <div>
              {/* Stars & Highlight */}
              <div className="flex items-center gap-1 text-[#E85A4F] mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#E85A4F] text-[#E85A4F]" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm sm:text-base text-[#2B2824] leading-relaxed mb-6">
                “{config.brandName} makes running my creative studio a whole lot{' '}
                <strong className="font-bold text-[#E85A4F]">
                  easier and takes that payment anxiety away.
                </strong>{' '}
                My clients love receiving a direct link where they can pay in 30 seconds.”
              </p>
            </div>

            {/* Author row */}
            <div className="flex items-center gap-3.5 pt-4 border-t border-[#D8C3A5]/40">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80"
                alt="Tatiyanna W."
                className="w-11 h-11 rounded-full object-cover border border-[#D8C3A5] shadow-2xs"
              />
              <div>
                <h4 className="font-bold text-sm text-[#2B2824]">Tatiyanna W.</h4>
                <p className="text-xs text-[#8E8D8A] font-medium">TruCreates Design Studio</p>
              </div>
            </div>
          </div>

          {/* CARD 2: Eric Silverberg & Eli Gladstone */}
          <div className="bg-[#FAF8F5] text-[#2B2824] rounded-3xl p-7 sm:p-8 flex flex-col justify-between border-2 border-[#E85A4F] shadow-md hover:shadow-lg transition-all duration-300 relative">
            <div className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full bg-[#E85A4F] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
              Featured Story
            </div>
            <div>
              {/* Stars & Highlight */}
              <div className="flex items-center gap-1 text-[#E85A4F] mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#E85A4F] text-[#E85A4F]" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm sm:text-base text-[#2B2824] leading-relaxed mb-6">
                “{config.brandName}'s invoicing is unbeatable.{' '}
                <strong className="font-bold text-[#E85A4F]">
                  We haven't had a single unpaid invoice this year
                </strong>
                , thanks to automatic status tracking and clean PDF exports. Our billing process would be lost without it!”
              </p>
            </div>

            {/* Author row */}
            <div className="flex items-center gap-3.5 pt-4 border-t border-[#D8C3A5]/40">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
                alt="Eric Silverberg"
                className="w-11 h-11 rounded-full object-cover border border-[#D8C3A5] shadow-2xs"
              />
              <div>
                <h4 className="font-bold text-sm text-[#2B2824]">
                  Eric Silverberg &amp; Eli Gladstone
                </h4>
                <p className="text-xs text-[#8E8D8A] font-medium">Speaker Labs Consulting</p>
              </div>
            </div>
          </div>

          {/* CARD 3: Robbie Katherine Anthony */}
          <div className="bg-[#FAF8F5] text-[#2B2824] rounded-3xl p-7 sm:p-8 flex flex-col justify-between border border-[#D8C3A5] shadow-xs hover:shadow-md hover:border-[#E85A4F]/60 transition-all duration-300">
            <div>
              {/* Stars & Highlight */}
              <div className="flex items-center gap-1 text-[#E85A4F] mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#E85A4F] text-[#E85A4F]" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm sm:text-base text-[#2B2824] leading-relaxed mb-6">
                “It's not just an invoicing tool, it gives total peace of mind.{' '}
                <strong className="font-bold text-[#E85A4F]">
                  You know exactly who owes what, what is overdue, and what has been collected
                </strong>{' '}
                every single week.”
              </p>
            </div>

            {/* Author row */}
            <div className="flex items-center gap-3.5 pt-4 border-t border-[#D8C3A5]/40">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80"
                alt="Robbie Katherine Anthony"
                className="w-11 h-11 rounded-full object-cover border border-[#D8C3A5] shadow-2xs"
              />
              <div>
                <h4 className="font-bold text-sm text-[#2B2824]">
                  Robbie Katherine Anthony
                </h4>
                <p className="text-xs text-[#8E8D8A] font-medium">
                  Euphoria App Development
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={onOpenSignUp}
            className="px-8 py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-[#E85A4F] hover:bg-[#D44A3F] active:bg-[#C03D32] shadow-md shadow-[#E85A4F]/25 hover:shadow-lg hover:shadow-[#E85A4F]/35 hover:-translate-y-0.5 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Start invoicing for free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
