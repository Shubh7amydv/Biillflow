'use client';

import React from 'react';

interface BusinessPersona {
  category: string;
  tagline: string;
  name: string;
  roleOrBiz: string;
  image: string;
}

const personas: BusinessPersona[] = [
  {
    category: 'Freelancers',
    tagline: 'Pay your staff (and yourself!) with confidence.',
    name: 'Tru Williams',
    roleOrBiz: 'Photographer/Videographer',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&h=750&q=80',
  },
  {
    category: 'Solopreneurs',
    tagline: 'Get tidy books for tax time—one less thing to worry about.',
    name: 'Dae',
    roleOrBiz: 'Dae the poet',
    image:
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&h=750&q=80',
  },
  {
    category: 'Contractors',
    tagline: 'Fire off professional invoices and estimates in minutes.',
    name: 'Troy Styke',
    roleOrBiz: 'Crystal Clean Window Cleaning',
    image:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&h=750&q=80',
  },
  {
    category: 'Consultants',
    tagline: 'Set up recurring invoices and payments for repeat clients.',
    name: 'Sarah Stockdale',
    roleOrBiz: 'Growclass Founder',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&h=750&q=80',
  },
];

export const BuiltForSmallBusinessSection: React.FC = () => {
  return (
    <section id="features" className="py-20 sm:py-24 bg-[#D8C3A5]/35 text-[#2B2824] border-y border-[#D8C3A5]/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAE7DC] text-[#E85A4F] text-xs font-extrabold uppercase tracking-wider border border-[#D8C3A5] mb-3 shadow-2xs">
            <span>Tailored For Your Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2B2824] tracking-tight">
            Built for freelancers &amp; studios like you
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6B6864] leading-relaxed">
            Whether you are billing on your own or scaling a studio, BillFlow gives you the exact tools you need to stay organised and get paid fast.
          </p>
        </div>

        {/* 4-Column Persona Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 sm:gap-6 lg:gap-8">
          {personas.map((item) => (
            <div key={item.category} className="flex flex-col justify-between group">
              {/* Top Text: Category & Tagline */}
              <div className="min-h-[76px] mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-[#2B2824] tracking-tight group-hover:text-[#E85A4F] transition-colors">
                  {item.category}
                </h3>
                <p className="text-xs sm:text-sm text-[#6B6864] font-normal leading-snug mt-1.5">
                  {item.tagline}
                </p>
              </div>

              {/* Photo Card */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs bg-[#EAE7DC] aspect-[4/5] border border-[#D8C3A5] group-hover:shadow-md group-hover:border-[#E85A4F]/60 group-hover:-translate-y-0.5 transition-all duration-300">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </div>

              {/* Bottom Caption: Name & Business */}
              <div className="mt-4 pt-1">
                <div className="font-bold text-sm text-[#2B2824] tracking-tight">
                  {item.name}
                </div>
                <div className="text-xs text-[#8E8D8A] font-medium mt-0.5">
                  {item.roleOrBiz}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
