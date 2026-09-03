'use client';

import React, { useEffect, useState } from 'react';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { CheckCircle2 } from 'lucide-react';

export function showToast(message: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('billflow-toast', { detail: message }));
  }
}

export const Toast: React.FC = () => {
  let contextToast: string | null = null;
  try {
    const ctx = useSiteConfig();
    contextToast = ctx.toastMessage;
  } catch {
    // outside provider
  }

  const [eventToast, setEventToast] = useState<string | null>(null);

  useEffect(() => {
    const handleToast = (e: CustomEvent<string>) => {
      setEventToast(e.detail);
      setTimeout(() => {
        setEventToast(null);
      }, 3500);
    };

    window.addEventListener('billflow-toast' as any, handleToast);
    return () => window.removeEventListener('billflow-toast' as any, handleToast);
  }, []);

  const message = contextToast || eventToast;
  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200 pointer-events-none">
      <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 flex items-center gap-2.5 text-xs sm:text-sm font-semibold pointer-events-auto">
        <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
        <span>{message}</span>
      </div>
    </div>
  );
};
