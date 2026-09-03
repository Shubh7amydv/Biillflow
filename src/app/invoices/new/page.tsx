'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AppShell from '@/components/layout/AppShell';
import {
  Card,
  Button,
  Input,
  Select,
  Textarea,
  Modal,
  Skeleton,
} from '@/components/ui';
import { showToast } from '@/components/landing/Toast';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Send,
  Save,
  UserPlus,
  AlertCircle,
} from 'lucide-react';
import { calculateInvoiceTotals, formatCurrency } from '@/utils/helper';

interface LineItemForm {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

function NewInvoiceForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedClientId = searchParams.get('clientId');

  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState(preSelectedClientId || '');

  // Dates
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultDue = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];
  const [issueDate, setIssueDate] = useState(todayStr);
  const [dueDate, setDueDate] = useState(defaultDue);

  // Line items
  const [items, setItems] = useState<LineItemForm[]>([
    { id: '1', description: 'Web UI Design & Design System Setup', quantity: 1, rate: 1200 },
  ]);

  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [notes, setNotes] = useState('Payment is due within 14 days of invoice date. Thank you for your business!');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quick Add Client Modal inside editor
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientCompany, setNewClientCompany] = useState('');
  const [creatingClient, setCreatingClient] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  const loadClients = async () => {
    try {
      const res = await fetch('/api/v1/clients');
      const data = await res.json();
      if (data.success && data.data) {
        setClients(data.data);
        if (!selectedClientId && data.data.length > 0) {
          setSelectedClientId(preSelectedClientId || data.data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      loadClients();
    }
  }, [status]);

  const handleAddLineItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), description: '', quantity: 1, rate: 0 },
    ]);
  };

  const handleRemoveLineItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((item) => item.id !== id));
  };

  const handleUpdateLineItem = (id: string, field: keyof LineItemForm, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleQuickAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newClientEmail.trim()) return;

    setCreatingClient(true);
    try {
      const res = await fetch('/api/v1/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newClientName.trim(),
          email: newClientEmail.trim().toLowerCase(),
          company: newClientCompany.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        showToast(`Client ${data.data.name} added!`);
        await loadClients();
        setSelectedClientId(data.data.id);
        setAddClientOpen(false);
        setNewClientName('');
        setNewClientEmail('');
        setNewClientCompany('');
      } else {
        alert(data.message || 'Failed to add client');
      }
    } catch (err) {
      alert('Error creating client');
    } finally {
      setCreatingClient(false);
    }
  };

  const handleSubmit = async (targetStatus: 'DRAFT' | 'SENT') => {
    setError(null);

    if (!selectedClientId) {
      setError('Please select or create a client before saving.');
      return;
    }

    if (items.some((item) => !item.description.trim())) {
      setError('Every line item must have a description.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/v1/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: selectedClientId,
          status: targetStatus,
          issueDate,
          dueDate,
          taxPercent,
          discountPercent,
          notes,
          lineItems: items.map((item, idx) => ({
            description: item.description.trim(),
            quantity: Number(item.quantity) || 1,
            rate: Number(item.rate) || 0,
            sortOrder: idx,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create invoice.');
      }

      showToast(
        targetStatus === 'SENT'
          ? `Invoice ${data.data.invoiceNumber} created and sent!`
          : `Invoice ${data.data.invoiceNumber} saved as Draft.`
      );

      router.push(`/invoices/${data.data.id}`);
    } catch (err: any) {
      setError(err?.message || 'Failed to save invoice.');
    } finally {
      setSubmitting(false);
    }
  };

  const userCurrency = (session?.user as any)?.currency || 'USD';
  const totals = calculateInvoiceTotals(items, discountPercent, taxPercent);

  return (
    <AppShell>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            href="/invoices"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Invoices</span>
          </Link>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              isLoading={submitting}
              onClick={() => handleSubmit('DRAFT')}
              leftIcon={<Save className="w-3.5 h-3.5" />}
            >
              Save as Draft
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={submitting}
              onClick={() => handleSubmit('SENT')}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Save &amp; Send to Client
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Invoice Paper Form Container */}
        <Card className="p-6 sm:p-10 bg-[#FAF8F5] space-y-8 shadow-sm border border-[#D8C3A5]">
          {/* Header row: Studio info & Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-[#D8C3A5]/50">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E8D8A] block mb-1">
                Issued By
              </span>
              <h2 className="text-xl font-extrabold text-[#2B2824]">
                {(session?.user as any)?.businessName || session?.user?.name || 'Studio'}
              </h2>
              <p className="text-xs text-[#8E8D8A] mt-0.5">{session?.user?.email}</p>
            </div>

            <div className="sm:text-right space-y-2">
              <span className="text-2xl font-black text-[#E85A4F] tracking-tight block">
                NEW INVOICE
              </span>
              <span className="text-xs text-[#8E8D8A] block">
                Invoice # will be generated automatically on save
              </span>
            </div>
          </div>

          {/* Client & Dates row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pb-6 border-b border-[#D8C3A5]/50">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2B2824]">
                  Billed To (Client) *
                </span>
                <button
                  type="button"
                  onClick={() => setAddClientOpen(true)}
                  className="text-xs font-bold text-[#E85A4F] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-3 h-3" />
                  <span>+ Quick Add</span>
                </button>
              </div>

              {clients.length === 0 ? (
                <div className="p-3 bg-[#EAE7DC]/60 rounded-xl border border-[#D8C3A5] text-xs text-[#6B6864] flex items-center justify-between">
                  <span>No clients yet</span>
                  <Button size="sm" variant="outline" onClick={() => setAddClientOpen(true)}>
                    Add Client
                  </Button>
                </div>
              ) : (
                <Select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                >
                  <option value="">Select a client...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.company ? `(${c.company})` : ''} - {c.email}
                    </option>
                  ))}
                </Select>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2B2824] block mb-2">
                  Issue Date
                </span>
                <Input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2B2824] block mb-2">
                  Due Date
                </span>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Dynamic Line Items Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-3 text-xs font-bold uppercase text-[#8E8D8A] pb-2 border-b border-[#D8C3A5]">
              <span className="col-span-6 sm:col-span-7">Item Description *</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-2 text-right">Rate</span>
              <span className="col-span-2 sm:col-span-1 text-right">Amount</span>
            </div>

            <div className="space-y-3">
              {items.map((item) => {
                const lineAmount = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
                return (
                  <div key={item.id} className="grid grid-cols-12 gap-3 items-center group">
                    <div className="col-span-6 sm:col-span-7">
                      <Input
                        placeholder="e.g. Consulting, UI Design, Development..."
                        value={item.description}
                        onChange={(e) => handleUpdateLineItem(item.id, 'description', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        className="text-center"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateLineItem(item.id, 'quantity', Math.max(1, Number(e.target.value)))
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="relative">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          className="text-right"
                          value={item.rate}
                          onChange={(e) =>
                            handleUpdateLineItem(item.id, 'rate', Math.max(0, Number(e.target.value)))
                          }
                        />
                      </div>
                    </div>
                    <div className="col-span-2 sm:col-span-1 flex items-center justify-end gap-1 text-right">
                      <span className="text-xs sm:text-sm font-bold text-[#2B2824]">
                        {formatCurrency(lineAmount, userCurrency)}
                      </span>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLineItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-[#8E8D8A] hover:text-rose-600 transition-opacity cursor-pointer"
                          title="Delete line item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddLineItem}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Line Item
            </Button>
          </div>

          {/* Notes & Totals breakdown */}
          <div className="pt-6 border-t border-[#D8C3A5] grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2B2824] block mb-2">
                Client Notes &amp; Payment Terms
              </span>
              <Textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add bank wire details, payment instructions, or thank you note..."
              />
            </div>

            {/* Calculations Breakdown */}
            <div className="bg-[#EAE7DC]/60 rounded-2xl p-5 border border-[#D8C3A5] space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between text-[#6B6864]">
                <span>Subtotal</span>
                <span className="font-semibold text-[#2B2824]">
                  {formatCurrency(totals.subtotal, userCurrency)}
                </span>
              </div>

              {/* Discount % */}
              <div className="flex justify-between items-center text-[#6B6864]">
                <div className="flex items-center gap-2">
                  <span>Discount (%)</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Math.max(0, Number(e.target.value)))}
                    className="w-14 p-1 text-xs border border-[#D8C3A5] rounded text-center bg-[#FAF8F5] text-[#2B2824]"
                  />
                </div>
                <span className="font-semibold text-[#2B2824]">
                  -{formatCurrency(totals.discountAmount, userCurrency)}
                </span>
              </div>

              {/* Tax % */}
              <div className="flex justify-between items-center text-[#6B6864]">
                <div className="flex items-center gap-2">
                  <span>Tax Rate (%)</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(Math.max(0, Number(e.target.value)))}
                    className="w-14 p-1 text-xs border border-[#D8C3A5] rounded text-center bg-[#FAF8F5] text-[#2B2824]"
                  />
                </div>
                <span className="font-semibold text-[#2B2824]">
                  +{formatCurrency(totals.taxAmount, userCurrency)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[#D8C3A5] text-base font-extrabold text-[#2B2824]">
                <span>Total Due</span>
                <span className="text-2xl text-[#E85A4F]">
                  {formatCurrency(totals.total, userCurrency)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Add Client Modal */}
        <Modal
          isOpen={addClientOpen}
          onClose={() => setAddClientOpen(false)}
          title="Quick Add Client"
          description="Create client contact to attach to this invoice"
        >
          <form onSubmit={handleQuickAddClient} className="space-y-4">
            <Input
              label="Client Name *"
              required
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
              placeholder="Elena Vance"
            />
            <Input
              label="Email Address *"
              type="email"
              required
              value={newClientEmail}
              onChange={(e) => setNewClientEmail(e.target.value)}
              placeholder="elena@blackmesa.org"
            />
            <Input
              label="Company"
              value={newClientCompany}
              onChange={(e) => setNewClientCompany(e.target.value)}
              placeholder="Black Mesa Research"
            />
            <div className="pt-2 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setAddClientOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={creatingClient}>
                Add Client
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppShell>
  );
}

export default function NewInvoicePage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="p-8 space-y-4 max-w-4xl mx-auto">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-96 w-full rounded-3xl" />
          </div>
        </AppShell>
      }
    >
      <NewInvoiceForm />
    </Suspense>
  );
}
