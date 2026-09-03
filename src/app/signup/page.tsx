'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button, Input } from '@/components/ui';
import { Mail, Lock, User, Building, AlertCircle, ArrowLeft, Zap } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          businessName: businessName.trim() || `${name.trim()}'s Studio`,
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create account.');
      }

      // Auto-login upon registration
      const signInRes = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        router.push('/login');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred during registration.');
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
          Create your BillFlow account
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#6B6864]">
          Free forever • No credit card required • Instant setup
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="signup-name"
              label="Your Full Name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Elena Rostova"
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              id="signup-business-name"
              label="Studio / Business Name"
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Elena Rostova Studio"
              leftIcon={<Building className="w-4 h-4" />}
            />

            <Input
              id="signup-email"
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourstudio.com"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              id="signup-password"
              label="Password (min 8 characters)"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <div className="pt-2">
              <button
                id="signup-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-full bg-[#E85A4F] hover:bg-[#D44A3F] active:bg-[#C03D32] text-white font-bold text-sm shadow-md shadow-[#E85A4F]/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Creating account...' : 'Create Free Account'}
              </button>
            </div>
          </form>

          <div className="text-center text-xs text-[#6B6864]">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-bold text-[#E85A4F] hover:underline"
            >
              Sign In
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
