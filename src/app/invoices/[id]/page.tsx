'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AppShell from '@/components/layout/AppShell';
import {
  Card,
  Button,
  Badge,
  Skeleton,
} from '@/components/ui';
import { showToast } from '@/components/landing/Toast';
import {
  ArrowLeft,
  Printer,
  Share2,
  CheckCircle2,
  Send,
  Edit2,
  Trash2,
  ExternalLink,
  Copy,
  Building,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/helper';

export default function InvoiceDetailPage() {
  const { id } = useParams() as { id: string };
  const { data: session, status } = useSession();
  const router = useRouter();

  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  const fetchInvoice = async () => {
    try {
      const res = await fetch(`/api/v1/invoices/${id}`);
      const data = await res.json();
      if (data.success && data.data) {
        setInvoice(data.data);
      } else {
        router.push('/invoices');
      }
    } catch (err) {
      console.error('Failed to load invoice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && id) {
      fetchInvoice();
    }
  }, [status, id]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyPublicLink = () => {
    if (!invoice?.publicToken) return;
    const url = `${window.location.origin}/invoice/${invoice.publicToken}`;
    navigator.clipboard.writeText(url);
    showToast('Public client link copied to clipboard!');
  };

  const handleSend = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/v1/invoices/${id}/send`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast(`Invoice ${invoice.invoiceNumber} marked as Sent!`);
        fetchInvoice();
      }
    } catch (err) {
      alert('Failed to send invoice');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsPaid = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/v1/invoices/${id}/pay`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast(`Invoice ${invoice.invoiceNumber} marked as Paid!`);
        fetchInvoice();
      }
    } catch (err) {
      alert('Failed to mark as paid');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber}?`)) return;

    try {
      const res = await fetch(`/api/v1/invoices/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Invoice deleted.');
        router.push('/invoices');
      }
    } catch (err) {
      alert('Failed to delete invoice');
    }
  };

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <AppShell>
        <div className="space-y-6 max-w-4xl mx-auto">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-[600px] w-full rounded-3xl" />
        </div>
      </AppShell>
    );
  }

  if (!invoice) return null;

  const userCurrency = invoice.user?.currency || (session?.user as any)?.currency || 'USD';
  const publicPortalUrl = `/invoice/${invoice.publicToken}`;

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Navigation & Action Header (Hidden in Print) */}
        <div className="no-print space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Link
              href="/invoices"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Invoices</span>
            </Link>

            <div className="flex items-center gap-2">
              <Badge variant={invoice.displayStatus?.toLowerCase() as any} size="md">
                {invoice.displayStatus}
              </Badge>
            </div>
          </div>

          {/* Action Bar */}
          <Card className="p-4 flex flex-wrap items-center justify-between gap-3 bg-white">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                leftIcon={<Printer className="w-3.5 h-3.5" />}
              >
                Print / PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyPublicLink}
                leftIcon={<Copy className="w-3.5 h-3.5" />}
              >
                Copy Public Link
              </Button>
              <Link href={publicPortalUrl} target="_blank">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<ExternalLink className="w-3.5 h-3.5 text-[#0055FF]" />}
                >
                  Client Portal
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              {invoice.status === 'DRAFT' && (
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={actionLoading}
                  onClick={handleSend}
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                >
                  Send to Client
                </Button>
              )}

              {invoice.status === 'SENT' && (
                <Button
                  variant="teal"
                  size="sm"
                  isLoading={actionLoading}
                  onClick={handleMarkAsPaid}
                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                >
                  Mark as Paid
                </Button>
              )}

              <Link href={`/invoices/${invoice.id}/edit`}>
                <Button variant="secondary" size="sm" leftIcon={<Edit2 className="w-3.5 h-3.5" />}>
                  Edit
                </Button>
              </Link>

              <button
                onClick={handleDelete}
                className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Delete invoice"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        </div>

        {/* Invoice Paper Document Sheet */}
        <div className="print-sheet bg-[#FAF8F5] rounded-3xl border border-[#D8C3A5] shadow-xl p-8 sm:p-14 space-y-10 text-[#2B2824]">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 pb-8 border-b border-[#D8C3A5]/50">
            <div>
              {invoice.user?.logoUrl ? (
                <img
                  src={invoice.user.logoUrl}
                  alt={invoice.user?.businessName}
                  className="h-12 max-w-[180px] object-contain mb-3"
                />
              ) : null}
              <h2 className="text-2xl font-extrabold text-[#2B2824]">
                {invoice.user?.businessName || 'My Studio'}
              </h2>
              <p className="text-xs text-[#8E8D8A] mt-0.5">{invoice.user?.email}</p>
            </div>

            <div className="sm:text-right">
              <div className="text-3xl font-black text-[#E85A4F] tracking-tight">
                INVOICE
              </div>
              <div className="mt-2 text-sm font-bold text-[#2B2824]">
                {invoice.invoiceNumber}
              </div>
              <div className="text-xs text-[#8E8D8A] mt-1">
                Issued: <span className="font-semibold text-[#2B2824]">{formatDate(invoice.issueDate)}</span>
              </div>
              <div className="text-xs text-[#8E8D8A] mt-0.5">
                Due: <span className="font-semibold text-[#2B2824]">{formatDate(invoice.dueDate)}</span>
              </div>
            </div>
          </div>

          {/* Client Details Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pb-8 border-b border-[#D8C3A5]/50">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E8D8A] block mb-2">
                Billed To
              </span>
              <h4 className="text-base font-bold text-[#2B2824]">{invoice.client?.name}</h4>
              {invoice.client?.company && (
                <p className="text-xs text-[#6B6864] font-medium mt-0.5">
                  {invoice.client.company}
                </p>
              )}
              {invoice.client?.email && (
                <p className="text-xs text-[#8E8D8A] mt-0.5">{invoice.client.email}</p>
              )}
              {invoice.client?.phone && (
                <p className="text-xs text-[#8E8D8A] mt-0.5">{invoice.client.phone}</p>
              )}
              {invoice.client?.address && (
                <p className="text-xs text-[#8E8D8A] mt-0.5 max-w-xs">{invoice.client.address}</p>
              )}
            </div>

            <div className="sm:text-right flex flex-col justify-end">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8E8D8A] mb-1">
                Payment Status
              </span>
              <div className="sm:inline-flex sm:justify-end">
                <Badge variant={invoice.displayStatus?.toLowerCase() as any} size="md">
                  {invoice.displayStatus}
                </Badge>
              </div>
              {invoice.paidAt && (
                <p className="text-xs text-emerald-800 font-semibold mt-1">
                  Settled on {formatDate(invoice.paidAt)}
                </p>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b-2 border-[#D8C3A5] text-[#8E8D8A] uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="pb-3 text-left">Description</th>
                  <th className="pb-3 text-center">Qty</th>
                  <th className="pb-3 text-right">Rate</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8C3A5]/40">
                {(invoice.lineItems || []).map((item: any) => {
                  const lineTotal = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
                  return (
                    <tr key={item.id}>
                      <td className="py-4 text-[#2B2824] font-medium">
                        {item.description}
                      </td>
                      <td className="py-4 text-center text-[#6B6864]">
                        {Number(item.quantity)}
                      </td>
                      <td className="py-4 text-right text-[#6B6864]">
                        {formatCurrency(Number(item.rate), userCurrency)}
                      </td>
                      <td className="py-4 text-right font-bold text-[#2B2824]">
                        {formatCurrency(lineTotal, userCurrency)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals & Notes Row */}
          <div className="pt-6 border-t border-[#D8C3A5] grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
            <div>
              {invoice.notes && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E8D8A] block">
                    Notes &amp; Payment Instructions
                  </span>
                  <p className="text-xs text-[#6B6864] leading-relaxed whitespace-pre-line bg-[#EAE7DC]/60 p-4 rounded-xl border border-[#D8C3A5]">
                    {invoice.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-[#6B6864]">
                <span>Subtotal</span>
                <span className="font-semibold text-[#2B2824]">
                  {formatCurrency(invoice.subtotal, userCurrency)}
                </span>
              </div>

              {Number(invoice.discountPercent) > 0 && (
                <div className="flex justify-between text-[#6B6864]">
                  <span>Discount ({Number(invoice.discountPercent)}%)</span>
                  <span className="font-semibold text-[#2B2824]">
                    -{formatCurrency(invoice.discountAmount, userCurrency)}
                  </span>
                </div>
              )}

              {Number(invoice.taxPercent) > 0 && (
                <div className="flex justify-between text-[#6B6864]">
                  <span>Tax ({Number(invoice.taxPercent)}%)</span>
                  <span className="font-semibold text-[#2B2824]">
                    +{formatCurrency(invoice.taxAmount, userCurrency)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 border-t border-[#D8C3A5] text-base font-extrabold text-[#2B2824]">
                <span>Total Due</span>
                <span className="text-2xl text-[#E85A4F]">
                  {formatCurrency(invoice.total, userCurrency)}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Share Link Banner */}
          <div className="no-print pt-6 border-t border-[#D8C3A5]/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B6864] bg-[#EAE7DC]/50 p-4 rounded-2xl border border-[#D8C3A5]">
            <div>
              <span className="font-bold text-[#2B2824]">Client Payment Link:</span>
              <p className="text-[#8E8D8A] truncate max-w-md mt-0.5">
                {typeof window !== 'undefined' ? `${window.location.origin}/invoice/${invoice.publicToken}` : `/invoice/${invoice.publicToken}`}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyPublicLink}
              leftIcon={<Copy className="w-3.5 h-3.5" />}
            >
              Copy Link
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
