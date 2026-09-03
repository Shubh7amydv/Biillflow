'use client';

import React from 'react';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { ShieldCheck, Lock, KeyRound, Server } from 'lucide-react';

export const SecuritySection: React.FC = () => {
  const { config } = useSiteConfig();

  const securityFeatures = [
    {
      icon: ShieldCheck,
      title: 'PCI-DSS Level 1 Compliant',
      description: 'Highest security standard in the online payment industry.',
    },
    {
      icon: Lock,
      title: '256-Bit SSL Encryption',
      description: 'End-to-end data encryption in transit and at rest.',
    },
    {
      icon: KeyRound,
      title: 'Tokenized Invoice Links',
      description: 'Cryptographically generated secure public tokens.',
    },
    {
      icon: Server,
      title: 'Automated Cloud Backups',
      description: 'Client records and invoices backed up continuously.',
    },
  ];

  return (
    <section className="w-full bg-[#23201D] text-[#EAE7DC] border-y border-[#3E3A36] py-10 sm:py-12 relative overflow-hidden">
      {/* Subtle warm ambient decorative glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E85A4F]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#E98074]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Compact Header */}
        <div className="max-w-3xl mx-auto text-center mb-7 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E85A4F]/15 text-[#E98074] text-[11px] font-extrabold uppercase tracking-wider border border-[#E98074]/30 mb-2 shadow-xs">
            <Lock className="w-3 h-3" />
            <span>Bank-Grade Security Standards</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#EAE7DC] tracking-tight">
            Your financial data is completely protected
          </h2>
          <p className="text-[#D8C3A5] text-xs sm:text-sm mt-1.5 max-w-xl mx-auto leading-relaxed">
            We protect your privacy, client records, and invoice data with modern cryptographic standards.
          </p>
        </div>

        {/* 4 Compact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {securityFeatures.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#1C1A18] p-4 sm:p-5 rounded-2xl border border-[#3E3A36] hover:border-[#E85A4F]/50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-[#E85A4F]/15 text-[#E98074] flex items-center justify-center mb-3 border border-[#E98074]/30">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-[#EAE7DC] text-sm mb-1 tracking-tight">{item.title}</h3>
                  <p className="text-xs text-[#8E8D8A] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
