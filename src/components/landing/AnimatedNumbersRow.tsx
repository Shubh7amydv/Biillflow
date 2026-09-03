'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, ShieldCheck, Zap, Users } from 'lucide-react';

export const AnimatedNumbersRow: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // States for animated counters
  const [moneyCount, setMoneyCount] = useState(0.5); // in millions ($0.5M -> $8M)
  const [bizCount, setBizCount] = useState(2000);    // users: 2,000 -> 12,000
  const [invoiceCount, setInvoiceCount] = useState(10000); // invoices: 10,000 -> 95,000
  const [satisfactionCount, setSatisfactionCount] = useState(4.0);

  const startAnimation = () => {
    const startTime = performance.now();
    const duration = 1800;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      // $0.5M -> $8M
      const currentMoney = +(0.5 + (8 - 0.5) * easeProgress).toFixed(1);
      setMoneyCount(currentMoney);

      // 2,000 -> 12,000 users
      const currentBiz = Math.round(2000 + (12000 - 2000) * easeProgress);
      setBizCount(currentBiz);

      // 10,000 -> 95,000 invoices
      const currentInvoices = Math.round(10000 + (95000 - 10000) * easeProgress);
      setInvoiceCount(currentInvoices);

      // Rating: 4.0 -> 4.9
      const currentRating = +(4.0 + (4.9 - 4.0) * easeProgress).toFixed(1);
      setSatisfactionCount(currentRating);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          startAnimation();
        }
      },
      { threshold: 0.25 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [hasAnimated]);

  return (
    <div className="py-10 sm:py-12 bg-transparent max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        ref={containerRef}
        className="bg-[#23201D] text-[#EAE7DC] rounded-3xl p-7 sm:p-8 shadow-xl border border-[#3E3A36] relative overflow-hidden"
      >
        {/* Subtle warm ambient highlight */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E85A4F]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 mb-6 pb-5 border-b border-[#3E3A36]">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#E98074] bg-[#E85A4F]/15 px-2.5 py-0.5 rounded-full border border-[#E98074]/30 mb-1.5">
            <span>Proven Impact</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#EAE7DC]">
            Trusted scale powering independent businesses
          </h3>
        </div>

        {/* 4 Counter Metrics */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Stat 1 */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[#8E8D8A] font-semibold">
              <TrendingUp className="w-3.5 h-3.5 text-[#E98074]" />
              <span>Invoiced to Date</span>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#EAE7DC] tracking-tight">
              ${moneyCount}M+
            </div>
            <p className="text-[11px] text-[#8E8D8A]">Processed seamlessly</p>
          </div>

          {/* Stat 2 */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[#8E8D8A] font-semibold">
              <Users className="w-3.5 h-3.5 text-[#E98074]" />
              <span>Active Studios</span>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#EAE7DC] tracking-tight">
              {bizCount.toLocaleString()}+
            </div>
            <p className="text-[11px] text-[#8E8D8A]">Worldwide freelancers</p>
          </div>

          {/* Stat 3 */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[#8E8D8A] font-semibold">
              <Zap className="w-3.5 h-3.5 text-[#E98074]" />
              <span>Invoices Sent</span>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#EAE7DC] tracking-tight">
              {invoiceCount.toLocaleString()}+
            </div>
            <p className="text-[11px] text-[#8E8D8A]">Paid 2x faster</p>
          </div>

          {/* Stat 4 */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[#8E8D8A] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E98074]" />
              <span>Satisfaction</span>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#EAE7DC] tracking-tight">
              {satisfactionCount} / 5.0
            </div>
            <p className="text-[11px] text-[#8E8D8A]">Over 1,400 verified reviews</p>
          </div>
        </div>
      </div>
    </div>
  );
};
