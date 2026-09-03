'use client';

import React, { useState } from 'react';
import { SiteConfigProvider } from '@/context/SiteConfigContext';
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { AnimatedNumbersRow } from '@/components/landing/AnimatedNumbersRow';
import { SpendMoreTimeSection } from '@/components/landing/SpendMoreTimeSection';
import { BlueTrustSection } from '@/components/landing/BlueTrustSection';
import { BuiltForSmallBusinessSection } from '@/components/landing/BuiltForSmallBusinessSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { SecuritySection } from '@/components/landing/SecuritySection';
import { FaqSection } from '@/components/landing/FaqSection';
import { PreFooterBookkeeperBanner } from '@/components/landing/PreFooterBookkeeperBanner';
import { Footer } from '@/components/landing/Footer';
import { AuthModal } from '@/components/landing/AuthModal';
import { Toast } from '@/components/landing/Toast';

function BillFlowLandingContent() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signup');

  const handleOpenSignIn = () => {
    setAuthModalMode('signin');
    setAuthModalOpen(true);
  };

  const handleOpenSignUp = () => {
    setAuthModalMode('signup');
    setAuthModalOpen(true);
  };

  const handleExploreDemo = () => {
    const el = document.getElementById('features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPlan = (planId: string) => {
    setAuthModalMode('signup');
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#EAE7DC] text-[#2B2824] font-sans selection:bg-[#E98074]/30 selection:text-[#E85A4F]">
      {/* Navigation */}
      <Navbar onOpenSignIn={handleOpenSignIn} onOpenSignUp={handleOpenSignUp} />

      {/* Main Content */}
      <main className="flex-1">
        {/* 1. Hero — headline, sub-copy, and interactive dashboard mockup */}
        <Hero onOpenSignUp={handleOpenSignUp} onExploreDemo={handleExploreDemo} />

        {/* 2. Built for freelancers & small studios */}
        <BuiltForSmallBusinessSection />

        {/* 3. Spend more time on the work you love */}
        <SpendMoreTimeSection />

        {/* 4. Animated stats counter */}
        <AnimatedNumbersRow />

        {/* 5. Social proof — customer testimonials on blue grid */}
        <BlueTrustSection onOpenSignUp={handleOpenSignUp} />

        {/* 6. Transparent pricing — Starter & Pro */}
        <PricingSection onSelectPlan={handleSelectPlan} />

        {/* 7. Security & compliance */}
        <SecuritySection />

        {/* 8. FAQ */}
        <FaqSection />

        {/* 9. Pre-footer CTA */}
        <PreFooterBookkeeperBanner onOpenSignUp={handleOpenSignUp} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Sign-in / Sign-up modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      {/* Toast notifications */}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <SiteConfigProvider>
      <BillFlowLandingContent />
    </SiteConfigProvider>
  );
}
