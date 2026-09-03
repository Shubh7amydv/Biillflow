'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AppShell from '@/components/layout/AppShell';
import {
  Card,
  Button,
  Input,
  Select,
  Textarea,
  Skeleton,
} from '@/components/ui';
import { showToast } from '@/components/landing/Toast';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  AlertCircle,
} from 'lucide-react';
import { calculateInvoiceTotals, formatCurrency } from '@/utils/helper';

interface LineItemForm {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export default function EditInvoicePage() {
  const { id } = useParams() as { id: string };
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<LineItemForm[]>([]);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated' && id) {
      Promise.all([
        fetch('/api/v1/clients').then((r) => r.json()),
        fetch(`/api/v1/invoices/${id}`).then((r) => r.json()),
      ])
        .then(([clientsRes, invoiceRes]) => {
          if (clientsRes.success) setClients(clientsRes.data || []);
          if (invoiceRes.success && invoiceRes.data) {
            const inv = invoiceRes.data;
            setSelectedClientId(inv.clientId);
            setInvoiceNumber(inv.invoiceNumber);
            setIssueDate(new Date(inv.issueDate).toISOString().split('T')[0]);
            setDueDate(new Date(inv.dueDate).toISOString().split('T')[0]);
            setDiscountPercent(Number(inv.discountPercent) || 0);
            setTaxPercent(Number(inv.taxPercent) || 0);
            setNotes(inv.notes || '');
            setItems(
              (inv.lineItems || []).map((li: any) => ({
                id: li.id,
                description: li.description,
                quantity: Number(li.quantity),
                rate: Number(li.rate),
              }))
            );
          } else {
            router.push('/invoices');
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [status, id]);

  const handleAddLineItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), description: '', quantity: 1, rate: 0 },
    ]);
  };

  const handleRemoveLineItem = (itemId: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((item) => item.id !== itemId));
  };

  const handleUpdateLineItem = (itemId: string, field: keyof LineItemForm, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === itemId) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedClientId) {
      setError('Please select a client.');
      return;
    }

    if (items.some((item) => !item.description.trim())) {
      setError('Every line item must have a description.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/v1/invoices/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: selectedClientId,
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
        throw new Error(data.message || 'Failed to update invoice.');
      }

      showToast(`Invoice ${invoiceNumber} updated!`);
      router.push(`/invoices/${id}`);
    } catch (err: any) {
      setError(err?.message || 'Failed to update invoice.');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <AppShell>
        <div className="space-y-6 max-w-4xl mx-auto">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-[600px] w-full rounded-3xl" />
        </div>
      </AppShell>
    );
  }

  const userCurrency = (session?.user as any)?.currency || 'USD';
  const totals = calculateInvoiceTotals(items, discountPercent, taxPercent);

  return (
    <AppShell>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={`/invoices/${id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel Edit</span>
          </Link>

          <Button
            variant="primary"
            size="sm"
            isLoading={submitting}
            onClick={handleSubmit}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Save Changes
          </Button>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <Card className="p-6 sm:p-10 bg-white space-y-8 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Editing Invoice
              </span>
              <h2 className="text-2xl font-serif font-bold text-slate-900">
                {invoiceNumber}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                Billed To (Client) *
              </span>
              <Select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.company ? `(${c.company})` : ''} - {c.email}
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  Issue Date
                </span>
                <Input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
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

          {/* Line Items */}
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-3 text-xs font-bold uppercase text-slate-400 pb-2 border-b border-slate-200">
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
                    <div className="col-span-2 sm:col-span-1 flex items-center justify-end gap-1 text-right">
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {formatCurrency(lineAmount, userCurrency)}
                      </span>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLineItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-rose-500 transition-opacity cursor-pointer"
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

          {/* Notes & Calculations */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                Client Notes &amp; Payment Terms
              </span>
              <Textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(totals.subtotal, userCurrency)}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <div className="flex items-center gap-2">
                  <span>Discount (%)</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Math.max(0, Number(e.target.value)))}
                    className="w-14 p-1 text-xs border border-slate-200 rounded text-center bg-white"
                  />
                </div>
                <span className="font-semibold text-slate-900">
                  -{formatCurrency(totals.discountAmount, userCurrency)}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <div className="flex items-center gap-2">
                  <span>Tax Rate (%)</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(Math.max(0, Number(e.target.value)))}
                    className="w-14 p-1 text-xs border border-slate-200 rounded text-center bg-white"
                  />
                </div>
                <span className="font-semibold text-slate-900">
                  +{formatCurrency(totals.taxAmount, userCurrency)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-200 text-base font-extrabold text-slate-900">
                <span>Total Due</span>
                <span className="text-2xl text-[#0055FF]">
                  {formatCurrency(totals.total, userCurrency)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
