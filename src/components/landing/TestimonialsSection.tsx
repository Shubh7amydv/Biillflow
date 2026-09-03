'use client';

import React from 'react';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { Star, Quote, CheckCircle } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { testimonials, config, isEditMode, updateTestimonial } = useSiteConfig();

  return (
    <section id="testimonials" className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Real Stories, Real Small Businesses
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Loved by 12,000+ freelancers & studios
          </h2>
          <p className="text-slate-600 text-base mt-2">
            See how small business owners save time, get paid on schedule, and regain peace of mind with {config.brandName}.
          </p>
        </div>

        {/* Testimonials 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="bg-slate-50/70 rounded-2xl p-7 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between relative"
            >
              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Highlight Badge */}
                <div className="text-xs font-bold text-[#007788] mb-3">
                  "{test.highlight}"
                </div>

                {/* Quote */}
                {isEditMode ? (
                  <textarea
                    value={test.quote}
                    onChange={(e) => updateTestimonial(test.id, { quote: e.target.value })}
                    className="w-full text-xs text-slate-700 p-2 rounded border border-teal-300 bg-white focus:ring-1 focus:ring-teal-500 outline-none resize-none mb-4"
                    rows={4}
                  />
                ) : (
                  <p className="text-slate-700 text-sm leading-relaxed mb-6 italic">
                    "{test.quote}"
                  </p>
                )}
              </div>

              {/* Author Row */}
              <div className="pt-4 border-t border-slate-200/70 flex items-center gap-3.5">
                <img
                  src={test.image}
                  alt={test.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <div>
                  <div className="font-bold text-slate-900 text-sm">{test.name}</div>
                  <div className="text-xs text-slate-500">
                    {test.role} • <span className="font-medium text-slate-700">{test.company}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recognition logos strip */}
        <div className="mt-16 pt-10 border-t border-slate-100 flex flex-wrap items-center justify-center gap-8 sm:gap-16 text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <span>Trusted by freelancers in 80+ countries</span>
          <span>•</span>
          <span>Bank-grade 256-bit encryption</span>
          <span>•</span>
          <span>PCI-DSS Level 1 Compliant</span>
          <span>•</span>
          <span>Rated 4.9/5 by users</span>
        </div>
      </div>
    </section>
  );
};
