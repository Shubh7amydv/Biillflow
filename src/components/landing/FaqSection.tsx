'use client';

import React, { useState } from 'react';
import { defaultFaqs } from '@/data/defaultWaveData';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { ChevronDown, HelpCircle, Mail, MessageCircle, Sparkles } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const { config } = useSiteConfig();
  const [openFaq, setOpenFaq] = useState<string | null>('faq-1');

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <section id="faqs" className="py-24 bg-[#EAE7DC] border-b border-[#D8C3A5]/70">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E98074]/15 text-[#E85A4F] text-xs font-extrabold uppercase tracking-wider border border-[#E98074]/30 mb-3 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#E85A4F]" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2B2824] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-[#6B6864] text-sm sm:text-base mt-3 max-w-xl mx-auto leading-relaxed">
            Everything you need to know about {config.brandName}, pricing, and features.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3.5">
          {defaultFaqs.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <div
                key={faq.id}
                className={`bg-[#FAF8F5] rounded-2xl overflow-hidden transition-all ${
                  isOpen ? 'border-2 border-[#E85A4F] shadow-sm' : 'border border-[#D8C3A5] hover:border-[#8E8D8A]'
                }`}
              >
                <button
                  id={`faq-btn-${faq.id}`}
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 font-bold text-[#2B2824] hover:bg-[#D8C3A5]/20 transition-colors text-base cursor-pointer"
                >
                  <span className="tracking-tight">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#8E8D8A] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#E85A4F]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-[#6B6864] text-sm leading-relaxed border-t border-[#D8C3A5]/40 bg-[#FAF8F5]/80">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support help callout */}
        <div className="mt-14 bg-[#FAF8F5] rounded-3xl p-6 sm:p-7 border border-[#D8C3A5] shadow-xs text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-bold text-[#2B2824] text-sm sm:text-base">
              Still have questions about getting started?
            </h4>
            <p className="text-xs sm:text-sm text-[#8E8D8A] mt-0.5">
              Our support team is always ready to help you set up your invoicing.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`mailto:${config.supportEmail}`}
              className="px-5 py-2.5 rounded-full bg-[#2B2824] text-[#EAE7DC] text-xs font-bold hover:bg-black flex items-center gap-2 shadow-xs transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#E98074]" />
              Email Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
