'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { X, AlertCircle, Zap, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signup',
}) => {
  const { config, showToast } = useSiteConfig();
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        const res = await fetch('/api/v1/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: businessName || email.split('@')[0],
            businessName: businessName || `${email.split('@')[0]}'s Studio`,
            email: email.trim().toLowerCase(),
            password,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to create account');
        }

        // Auto sign-in
        const signInRes = await signIn('credentials', {
          email: email.trim().toLowerCase(),
          password,
          redirect: false,
        });

        if (signInRes?.error) {
          throw new Error(signInRes.error);
        }

        showToast(`Welcome! Free account created for ${businessName || 'your business'}.`);
        onClose();
        router.push('/dashboard');
        router.refresh();
      } else {
        const signInRes = await signIn('credentials', {
          email: email.trim().toLowerCase(),
          password,
          redirect: false,
        });

        if (signInRes?.error) {
          throw new Error(signInRes.error || 'Invalid email or password');
        }

        showToast(`Welcome back, ${email || 'user'}!`);
        onClose();
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = async () => {
    setMode('signin');
    setEmail('demo@billflow.app');
    setPassword('password123');
    setError(null);
    setLoading(true);

    try {
      const signInRes = await signIn('credentials', {
        email: 'demo@billflow.app',
        password: 'password123',
        redirect: false,
      });

      if (signInRes?.error) {
        throw new Error(signInRes.error || 'Failed to login with demo account.');
      }

      showToast('Signed in to BillFlow Demo Account!');
      onClose();
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Failed to login with demo account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-[#FAF8F5] w-full max-w-md rounded-3xl shadow-2xl border border-[#D8C3A5] p-6 sm:p-8 overflow-hidden text-[#2B2824]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-[#8E8D8A] hover:text-[#2B2824] rounded-lg hover:bg-[#D8C3A5]/20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          {/* BillFlow brand mark */}
          <div className="inline-flex items-center gap-2 font-extrabold text-2xl text-[#E85A4F] mb-3">
            <Zap className="w-6 h-6" />
            <span>BillFlow</span>
          </div>
          <h3 className="text-2xl font-extrabold text-[#2B2824]">
            {mode === 'signup' ? 'Create your free account' : 'Sign in to your account'}
          </h3>
          <p className="text-xs sm:text-sm text-[#6B6864] mt-1">
            {mode === 'signup'
              ? 'Free forever. No credit card required.'
              : `Access your ${config.brandName} dashboard.`}
          </p>
        </div>

        {/* 1-CLICK DEMO ACCOUNT BUTTON */}
        <div className="mb-5">
          <button
            type="button"
            onClick={handleFillDemo}
            disabled={loading}
            className="w-full py-3 px-4 bg-[#E85A4F]/15 hover:bg-[#E85A4F]/25 active:bg-[#E85A4F]/30 border-2 border-[#E85A4F] text-[#E85A4F] rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E85A4F]" />
              <span>1-Click Demo Account Login</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider bg-[#E85A4F] text-white px-2 py-0.5 rounded-full font-extrabold">
              Instant Access &rarr;
            </span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-[#2B2824] mb-1">
                Business Name
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Apex Creative LLC"
                className="w-full p-2.5 rounded-xl border border-[#D8C3A5] bg-[#EAE7DC]/40 focus:ring-2 focus:ring-[#E85A4F] focus:border-[#E85A4F] outline-none text-xs sm:text-sm text-[#2B2824]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#2B2824] mb-1">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full p-2.5 rounded-xl border border-[#D8C3A5] bg-[#EAE7DC]/40 focus:ring-2 focus:ring-[#E85A4F] focus:border-[#E85A4F] outline-none text-xs sm:text-sm text-[#2B2824]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2B2824] mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 rounded-xl border border-[#D8C3A5] bg-[#EAE7DC]/40 focus:ring-2 focus:ring-[#E85A4F] focus:border-[#E85A4F] outline-none text-xs sm:text-sm text-[#2B2824]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#E85A4F] hover:bg-[#D44A3F] active:bg-[#C03D32] text-white font-bold text-sm shadow-md shadow-[#E85A4F]/25 transition-all mt-4 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Please wait...' : mode === 'signup' ? config.primaryCtaText : 'Sign In'}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-[#6B6864]">
          {mode === 'signup' ? (
            <div>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setMode('signin');
                }}
                className="font-bold text-[#E85A4F] hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          ) : (
            <div>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setMode('signup');
                }}
                className="font-bold text-[#E85A4F] hover:underline cursor-pointer"
              >
                Create a free account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
