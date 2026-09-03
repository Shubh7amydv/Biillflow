'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button, Input } from '@/components/ui';
import { Mail, Lock, AlertCircle, ArrowLeft, Zap, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error || 'Invalid email or password.');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = async () => {
    setEmail('demo@billflow.app');
    setPassword('password123');
    setError(null);
    setIsLoading(true);

    try {
      const res = await signIn('credentials', {
        email: 'demo@billflow.app',
        password: 'password123',
        redirect: false,
      });

      if (res?.error) {
        setError(res.error || 'Invalid email or password.');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#EAE7DC] text-[#2B2824] font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 font-extrabold text-2xl text-[#E85A4F] mb-6">
          <Zap className="w-7 h-7" />
          <span>BillFlow</span>
        </Link>
        <h2 className="text-3xl font-extrabold text-[#2B2824] tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#6B6864]">
          Sign in to manage your studio invoices and clients
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#FAF8F5] py-8 px-6 sm:px-10 rounded-3xl border border-[#D8C3A5] shadow-xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click Demo Account Quick Login Box */}
          <div>
            <button
              type="button"
              onClick={handleFillDemo}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-2xl bg-[#E85A4F]/15 hover:bg-[#E85A4F]/25 active:bg-[#E85A4F]/30 border-2 border-[#E85A4F] text-[#E85A4F] text-xs sm:text-sm font-bold flex items-center justify-between transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E85A4F]" />
                <span>1-Click Demo Account Login</span>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#E85A4F] text-white px-2 py-0.5 rounded-full">
                demo@billflow.app &rarr;
              </span>
            </button>
          </div>

          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-[#D8C3A5]/60" />
            <span className="px-3 text-xs text-[#8E8D8A] uppercase font-semibold">or email</span>
            <div className="flex-1 border-t border-[#D8C3A5]/60" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="login-email"
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourstudio.com"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              id="login-password"
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <div className="pt-2">
              <button
                id="login-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-full bg-[#E85A4F] hover:bg-[#D44A3F] active:bg-[#C03D32] text-white font-bold text-sm shadow-md shadow-[#E85A4F]/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="text-center text-xs text-[#6B6864]">
            Don't have an account yet?{' '}
            <Link
              href="/signup"
              className="font-bold text-[#E85A4F] hover:underline"
            >
              Start for free
            </Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#8E8D8A] hover:text-[#2B2824] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
