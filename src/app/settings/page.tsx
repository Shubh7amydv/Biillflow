'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AppShell from '@/components/layout/AppShell';
import {
  Card,
  CardHeader,
  Button,
  Input,
  Select,
  Skeleton,
} from '@/components/ui';
import { showToast } from '@/components/landing/Toast';
import {
  Settings,
  Building,
  Upload,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
} from 'lucide-react';

export default function SettingsPage() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [invoicePrefix, setInvoicePrefix] = useState('INV');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/v1/settings')
        .then((res) => res.json())
        .then((res) => {
          if (res.success && res.data) {
            setName(res.data.name || '');
            setBusinessName(res.data.businessName || '');
            setCurrency(res.data.currency || 'USD');
            setInvoicePrefix(res.data.invoicePrefix || 'INV');
            setLogoUrl(res.data.logoUrl || null);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [status]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const res = await fetch('/api/v1/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          businessName: businessName.trim(),
          currency: currency.trim(),
          invoicePrefix: invoicePrefix.trim().toUpperCase(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update settings');
      }

      // Update NextAuth session state so the navbar reflects the new business name
      await updateSession({
        name: data.data.name,
        businessName: data.data.businessName,
        currency: data.data.currency,
      });

      showToast('Settings saved successfully!');
    } catch (err: any) {
      setError(err?.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/v1/upload/logo', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to upload logo');
      }

      setLogoUrl(data.data.logoUrl);
      showToast('Studio logo uploaded!');
    } catch (err: any) {
      setError(err?.message || 'Failed to upload logo');
    } finally {
      setUploadingLogo(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveLogo = async () => {
    try {
      const res = await fetch('/api/v1/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logoUrl: null }),
      });
      const data = await res.json();
      if (data.success) {
        setLogoUrl(null);
        showToast('Logo removed');
      }
    } catch (err) {
      alert('Failed to remove logo');
    }
  };

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <AppShell>
        <div className="space-y-6 max-w-3xl mx-auto">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-96 rounded-3xl" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-8 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2B2824] tracking-tight">
            Studio Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6864] mt-1">
            Customize your studio branding, currency, and invoice numbering sequence
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Studio Branding Card */}
        <Card className="p-6 sm:p-8 space-y-6">
          <CardHeader className="px-0 pt-0 border-b border-[#D8C3A5]/50 pb-4">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-[#E85A4F]" />
              <h3 className="font-bold text-[#2B2824] text-base">Studio Logo &amp; Branding</h3>
            </div>
          </CardHeader>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-28 h-28 rounded-2xl bg-[#EAE7DC]/60 border-2 border-dashed border-[#D8C3A5] flex items-center justify-center overflow-hidden shrink-0 relative group">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Studio Logo"
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <Building className="w-8 h-8 text-[#8E8D8A]" />
              )}
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <h4 className="text-sm font-bold text-[#2B2824]">Invoice Header Logo</h4>
              <p className="text-xs text-[#6B6864] leading-relaxed max-w-sm">
                Upload a PNG, JPG, or SVG logo. It will appear on all generated PDF invoices and public client portals.
              </p>

              <div className="pt-2 flex items-center gap-3 justify-center sm:justify-start">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/svg+xml, image/webp"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  isLoading={uploadingLogo}
                  onClick={() => fileInputRef.current?.click()}
                  leftIcon={<Upload className="w-3.5 h-3.5" />}
                >
                  Upload Logo
                </Button>

                {logoUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveLogo}
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Business Details & Invoicing Rules Form */}
        <form onSubmit={handleSaveSettings}>
          <Card className="p-6 sm:p-8 space-y-6">
            <CardHeader className="px-0 pt-0 border-b border-[#D8C3A5]/50 pb-4">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#E85A4F]" />
                <h3 className="font-bold text-[#2B2824] text-base">Invoicing Preferences</h3>
              </div>
            </CardHeader>

            <div className="space-y-4">
              <Input
                id="settings-business-name"
                label="Studio / Company Name *"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Elena Rostova Studio LLC"
              />

              <Input
                id="settings-owner-name"
                label="Owner / Contact Name *"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Elena Rostova"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  id="settings-currency"
                  label="Default Billing Currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                  <option value="CAD">CAD ($) - Canadian Dollar</option>
                  <option value="AUD">AUD ($) - Australian Dollar</option>
                </Select>

                <Input
                  id="settings-prefix"
                  label="Invoice Number Prefix"
                  value={invoicePrefix}
                  maxLength={6}
                  onChange={(e) => setInvoicePrefix(e.target.value.toUpperCase())}
                  helperText="Prefix used in generated invoice numbers (e.g. INV-2026-0001)"
                  placeholder="INV"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#D8C3A5]/50 flex items-center justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={saving}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Preferences
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </AppShell>
  );
}
