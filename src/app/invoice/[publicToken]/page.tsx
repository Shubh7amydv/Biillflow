'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button, Badge, Modal, Input, Skeleton } from '@/components/ui';
import {
  Printer,
  CreditCard,
  CheckCircle2,
  Lock,
  Building,
  ShieldCheck,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/helper';

export default function PublicInvoicePage() {
  const { publicToken } = useParams() as { publicToken: string };

  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pay Modal State
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardholderName, setCardholderName] = useState('');
  const [paySuccess, setPaySuccess] = useState(false);

  const fetchPublicInvoice = async () => {
    try {
      const res = await fetch(`/api/v1/invoices/public/${publicToken}`);
      const data = await res.json();
      if (data.success && data.data) {
        setInvoice(data.data);
        if (data.data.client?.name) {
          setCardholderName(data.data.client.name);
        }
        if (data.data.status === 'PAID') {
          setPaySuccess(true);
        }
      } else {
        setError(data.message || 'Invoice not found or link expired.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error loading invoice.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (publicToken) {
      fetchPublicInvoice();
    }
  }, [publicToken]);

  const handlePrint = () => {
    window.print();
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaying(true);

    try {
      const res = await fetch(`/api/v1/invoices/public/${publicToken}/pay`, {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to process payment');
      }

      setInvoice(data.data);
      setPaySuccess(true);
      setPayModalOpen(false);
    } catch (err: any) {
      alert(err?.message || 'Payment simulation failed');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white p-10 rounded-3xl space-y-6 shadow-xl">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 text-center">
        <div className="max-w-md bg-white p-10 rounded-3xl shadow-xl space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900">Invoice Unavailable</h2>
          <p className="text-xs text-slate-500">{error || 'This invoice link may be invalid or expired.'}</p>
        </div>
      </div>
    );
  }

  const userCurrency = invoice.user?.currency || 'USD';
  const isPaid = invoice.status === 'PAID' || paySuccess;

  return (
    <div className="min-h-screen bg-[#EAE7DC] text-[#2B2824] py-8 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#E98074]/30 selection:text-[#E85A4F]">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Floating Action Bar */}
        <header className="no-print bg-[#FAF8F5] p-4 sm:p-5 rounded-2xl border border-[#D8C3A5] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-extrabold text-base text-[#E85A4F]">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="#FAF8F5" />
                <path d="M7 6H25C25.5523 6 26 6.44772 26 7V25C26 25.5523 25.5523 26 25 26H7C6.44772 26 6 25.5523 6 25V7C6 6.44772 6.44772 6 7 6Z" stroke="#E85A4F" strokeWidth="2" />
                <line x1="10" y1="12" x2="22" y2="12" stroke="#E85A4F" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="10" y1="17" x2="20" y2="17" stroke="#E85A4F" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="10" y1="22" x2="22" y2="22" stroke="#E85A4F" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M22 3.5L16.5 19H21L14 32.5L20.5 17H16L22 3.5Z" fill="#E98074" />
              </svg>
              BillFlow
            </div>
            <span className="text-xs font-semibold text-[#8E8D8A] hidden sm:inline">|</span>
            <span className="text-xs font-semibold text-[#6B6864]">Client Portal</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-3.5 h-3.5" />}
            >
              Print / Save PDF
            </Button>

            {!isPaid ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setPayModalOpen(true)}
                leftIcon={<CreditCard className="w-3.5 h-3.5" />}
              >
                Pay {formatCurrency(invoice.total, userCurrency)}
              </Button>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Paid in Full</span>
              </div>
            )}
          </div>
        </header>

        {/* Paid Banner notification */}
        {isPaid && (
          <div className="no-print p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center justify-between gap-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">Payment Settled</p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Thank you! This invoice was paid on {formatDate(invoice.paidAt || new Date())}.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-100 px-2.5 py-1 rounded">
              RECEIPT
            </span>
          </div>
        )}

        {/* Document Sheet */}
        <main className="print-sheet bg-[#FAF8F5] rounded-3xl border border-[#D8C3A5] shadow-xl p-8 sm:p-14 space-y-10 text-[#2B2824]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 pb-8 border-b border-[#D8C3A5]/50">
            <div>
              {invoice.user?.logoUrl ? (
                <img
                  src={invoice.user.logoUrl}
                  alt={invoice.user?.businessName}
                  className="h-12 max-w-[180px] object-contain mb-3"
                />
              ) : null}
              <h1 className="text-2xl font-extrabold text-[#2B2824]">
                {invoice.user?.businessName || 'Design Studio'}
              </h1>
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

          {/* Billed To Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pb-8 border-b border-[#D8C3A5]/50">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E8D8A] block mb-2">
                Billed To
              </span>
              <h3 className="text-base font-bold text-[#2B2824]">{invoice.client?.name}</h3>
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

          {/* Line Items */}
          <div>
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b-2 border-slate-200 text-slate-400 uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="pb-3 text-left">Description</th>
                  <th className="pb-3 text-center">Qty</th>
                  <th className="pb-3 text-right">Rate</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(invoice.lineItems || []).map((item: any) => {
                  const lineTotal = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
                  return (
                    <tr key={item.id}>
                      <td className="py-4 text-slate-800 font-medium">
                        {item.description}
                      </td>
                      <td className="py-4 text-center text-slate-600">
                        {Number(item.quantity)}
                      </td>
                      <td className="py-4 text-right text-slate-600">
                        {formatCurrency(Number(item.rate), userCurrency)}
                      </td>
                      <td className="py-4 text-right font-bold text-slate-900">
                        {formatCurrency(lineTotal, userCurrency)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Notes & Totals */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
            <div>
              {invoice.notes && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Notes &amp; Remittance Terms
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {invoice.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(invoice.subtotal, userCurrency)}
                </span>
              </div>

              {Number(invoice.discountPercent) > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Discount ({Number(invoice.discountPercent)}%)</span>
                  <span className="font-semibold text-slate-900">
                    -{formatCurrency(invoice.discountAmount, userCurrency)}
                  </span>
                </div>
              )}

              {Number(invoice.taxPercent) > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Tax ({Number(invoice.taxPercent)}%)</span>
                  <span className="font-semibold text-slate-900">
                    +{formatCurrency(invoice.taxAmount, userCurrency)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 border-t-2 border-slate-900 text-base font-extrabold text-slate-900">
                <span>Total Amount Due</span>
                <span className="text-2xl text-[#0055FF]">
                  {formatCurrency(invoice.total, userCurrency)}
                </span>
              </div>

              {!isPaid && (
                <div className="no-print pt-4">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={() => setPayModalOpen(true)}
                    leftIcon={<CreditCard className="w-4 h-4" />}
                  >
                    Pay {formatCurrency(invoice.total, userCurrency)} Online
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Client Footer note */}
        <footer className="no-print text-center text-xs text-slate-400 py-4 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <span>Secured client billing powered by BillFlow</span>
        </footer>

        {/* Simulated Pay Now Modal */}
        <Modal
          isOpen={payModalOpen}
          onClose={() => setPayModalOpen(false)}
          title={`Pay ${formatCurrency(invoice.total, userCurrency)}`}
          description="Simulated digital payment portal (Credit Card / Apple Pay)"
        >
          <form onSubmit={handleProcessPayment} className="space-y-4">
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/60 flex items-center gap-2 text-xs text-[#0055FF]">
              <Lock className="w-4 h-4 shrink-0" />
              <span>Test mode active: Click below to simulate instant payment settlement.</span>
            </div>

            <Input
              label="Cardholder Name"
              required
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="Full Name"
            />

            <Input
              label="Card Number"
              required
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="4242 4242 4242 4242"
              leftIcon={<CreditCard className="w-4 h-4" />}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expires"
                required
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                placeholder="MM/YY"
              />
              <Input
                label="CVC / CVV"
                required
                value={cardCvc}
                onChange={(e) => setCardCvc(e.target.value)}
                placeholder="123"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                isLoading={paying}
                leftIcon={<Lock className="w-4 h-4" />}
              >
                Authorize &amp; Pay {formatCurrency(invoice.total, userCurrency)}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
