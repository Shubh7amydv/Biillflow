'use client';

import React from 'react';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { Shield, Zap, Award, Users, HeartHandshake, CheckCircle2, Lock } from 'lucide-react';

export const TrustStats: React.FC = () => {
  const { config, isEditMode, updateConfig } = useSiteConfig();

  const pillars = [
    {
      title: 'Crafted for Solos & Small Teams',
      description: 'Zero enterprise bloat. Clean, intuitive workflows tailored to freelancers, consultants, and growing businesses.',
      icon: Users,
      color: 'text-teal-600 bg-teal-50 border-teal-200',
    },
    {
      title: 'Truly Free Starter Plan',
      description: 'Unlimited invoicing and accounting with no trial timeouts, no credit card upfront, and no artificial invoice limits.',
      icon: HeartHandshake,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      title: 'Get Paid 3x Faster Online',
      description: 'Give your clients one-click checkout via Credit Card, Apple Pay, or direct bank payment right from the invoice.',
      icon: Zap,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      title: 'Tax-Season Ready Reports',
      description: 'Double-entry accounting engine automatically organizes income, sales tax, and write-offs for your CPA.',
      icon: Shield,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
  ];

  return (
    <section className="py-16 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Social Proof Numbers Banner */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 shadow-xl relative overflow-hidden mb-16">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {config.stats.usersCount}
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                Small businesses empowered
              </div>
            </div>

            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-400 tracking-tight">
                {config.stats.moneyManaged}
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                Invoices & money processed
              </div>
            </div>

            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {config.stats.averageRating}
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                Average small business rating
              </div>
            </div>

            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-400 tracking-tight">
                {config.stats.invoicesSent}
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                Invoices delivered worldwide
              </div>
            </div>
          </div>
        </div>

        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Why over 3 million business owners choose {config.brandName}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Running a business is hard work. Managing your invoices, expenses, and taxes shouldn’t be.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${pillar.color} transition-transform group-hover:scale-105`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{pillar.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
