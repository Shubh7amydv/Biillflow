'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { WaveLogo } from '@/components/landing/WaveLogo';
import { Toast } from '@/components/landing/Toast';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Plus,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    await signOut({ redirect: false });
    window.location.href = '/';
  };

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Invoices', href: '/invoices', icon: FileText },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const businessName =
    (session?.user as any)?.businessName || session?.user?.name || 'My Creative Studio';
  const userEmail = session?.user?.email || '';

  return (
    <div className="min-h-screen flex flex-col bg-[#EAE7DC] text-[#2B2824] font-sans selection:bg-[#E98074]/30 selection:text-[#E85A4F]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#D8C3A5] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo & Nav Links */}
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="flex items-center gap-2">
                <WaveLogo size="md" variant="dark" />
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive =
                    pathname === link.href ||
                    (link.href !== '/dashboard' && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#E85A4F]/15 text-[#E85A4F] shadow-2xs'
                          : 'text-[#6B6864] hover:bg-[#D8C3A5]/20 hover:text-[#2B2824]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right: + New Invoice CTA & User Profile Dropdown */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/invoices/new" className="hidden sm:inline-flex">
                <button
                  id="appshell-new-invoice-btn"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#E85A4F] hover:bg-[#D44A3F] active:bg-[#C03D32] shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Invoice</span>
                </button>
              </Link>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  id="appshell-user-menu-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-full border border-[#D8C3A5] bg-[#FAF8F5] hover:bg-[#EAE7DC] text-[#2B2824] transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-[#E85A4F] text-white font-black text-xs flex items-center justify-center shadow-xs">
                    {businessName.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left text-xs">
                    <div className="font-bold text-[#2B2824] leading-tight truncate max-w-[120px]">
                      {businessName}
                    </div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-[#FAF8F5] rounded-2xl shadow-xl border border-[#D8C3A5] py-2 z-50 text-xs">
                      <div className="px-4 py-2 border-b border-[#D8C3A5]/50">
                        <div className="font-bold text-[#2B2824] truncate">{businessName}</div>
                        <div className="text-[11px] text-[#8E8D8A] truncate">{userEmail}</div>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/settings"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#2B2824] hover:bg-[#D8C3A5]/20 hover:text-[#E85A4F] transition-colors"
                        >
                          <Settings className="w-4 h-4 text-[#8E8D8A]" />
                          <span>Studio Settings</span>
                        </Link>
                        <Link
                          href="/"
                          target="_blank"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-[#2B2824] hover:bg-[#D8C3A5]/20 hover:text-[#E85A4F] transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <ExternalLink className="w-4 h-4 text-[#8E8D8A]" />
                            <span>Landing Page</span>
                          </div>
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-[#D8C3A5]/50">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#E85A4F] hover:bg-[#E98074]/15 transition-colors cursor-pointer text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl border border-[#D8C3A5] text-[#2B2824] hover:bg-[#D8C3A5]/20"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#D8C3A5] px-4 pt-3 pb-4 bg-[#FAF8F5] space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== '/dashboard' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-[#E85A4F]/15 text-[#E85A4F]'
                      : 'text-[#6B6864] hover:bg-[#D8C3A5]/20 hover:text-[#2B2824]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            <div className="pt-2">
              <Link
                href="/invoices/new"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#E85A4F] hover:bg-[#D44A3F]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Invoice</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Shared Toast Container */}
      <Toast />
    </div>
  );
};

export default AppShell;
