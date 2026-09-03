'use client';

import React, { useState } from 'react';
import { useSiteConfig } from '@/context/SiteConfigContext';
import {
  FileText,
  Plus,
  Trash2,
  Send,
  Download,
  CreditCard,
  CheckCircle2,
  Building,
  Sparkles,
  Receipt,
  Printer,
} from 'lucide-react';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export const InteractiveInvoiceDemo: React.FC = () => {
  const { config, showToast } = useSiteConfig();

  const [senderName, setSenderName] = useState('My Creative Studio LLC');
  const [clientName, setClientName] = useState('Acme Marketing Corp');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-001');
  const [dueDate, setDueDate] = useState('Due in 14 days');
  const [notes, setNotes] = useState('Thank you for your business! Please remit payment via the online portal.');

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Brand Identity Strategy & Style Guide', quantity: 1, rate: 1200 },
    { id: '2', description: 'Responsive Web UI Design (5 pages)', quantity: 1, rate: 1650 },
    { id: '3', description: 'Analytics & Search Engine Optimization Setup', quantity: 1, rate: 450 },
  ]);

  const [taxRatePercent, setTaxRatePercent] = useState<number>(0);
  const [isSent, setIsSent] = useState<boolean>(false);
  const [isPaid, setIsPaid] = useState<boolean>(false);

  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
  const taxAmount = (subtotal * taxRatePercent) / 100;
  const total = subtotal + taxAmount;

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: 'Consulting & Implementation Services',
      quantity: 1,
      rate: 350,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleSendInvoice = () => {
    setIsSent(true);
    showToast(`Invoice ${invoiceNumber} sent to ${clientName}!`);
  };

  const handleSimulatePayment = () => {
    setIsPaid(true);
    showToast(`Payment received! ${config.currencySymbol}${total.toFixed(2)} deposited.`);
  };

  const handleResetInvoice = () => {
    setIsSent(false);
    setIsPaid(false);
  };

  return (
    <section id="interactive-demo" className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Interactive Experience
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Try creating a live {config.brandName} invoice
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Experience firsthand why over 3 million business owners use our streamlined invoicing engine. Edit any detail below in real time.
          </p>
        </div>

        {/* Invoice Generator Card */}
        <div className="max-w-4xl mx-auto bg-[#fafafa] rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Top Bar with actions */}
          <div className="bg-slate-900 text-white p-4 sm:px-8 sm:py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-400" />
              <span className="font-bold text-sm tracking-tight">
                {config.brandName} Invoice Builder Demo
              </span>
              {isPaid && (
                <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PAID
                </span>
              )}
              {isSent && !isPaid && (
                <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500 text-slate-950">
                  SENT
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isSent ? (
                <button
                  id="demo-send-invoice-btn"
                  onClick={handleSendInvoice}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#007788] hover:bg-[#006677] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send to Client
                </button>
              ) : !isPaid ? (
                <button
                  id="demo-simulate-pay-btn"
                  onClick={handleSimulatePayment}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  Simulate Client Paying Online
                </button>
              ) : (
                <button
                  onClick={handleResetInvoice}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                >
                  Reset Demo
                </button>
              )}
            </div>
          </div>

          {/* Invoice Paper Document Sheet */}
          <div className="p-6 sm:p-10 bg-white">
            {/* Header: Company and Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Your Business Name
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="font-bold text-xl text-slate-900 w-full p-1.5 -ml-1.5 rounded hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-teal-500 outline-none border border-transparent hover:border-slate-200"
                />
                <div className="text-xs text-slate-400 mt-1">Verified {config.brandName} Merchant</div>
              </div>

              <div className="sm:text-right">
                <div className="text-2xl font-black text-[#007788] tracking-tight">INVOICE</div>
                <div className="mt-2 flex sm:justify-end items-center gap-2">
                  <span className="text-xs text-slate-400">Invoice #:</span>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="text-xs font-bold text-slate-800 p-1 rounded border border-slate-200 w-32 sm:text-right"
                  />
                </div>
                <div className="mt-1 flex sm:justify-end items-center gap-2">
                  <span className="text-xs text-slate-400">Terms:</span>
                  <input
                    type="text"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="text-xs text-slate-700 p-1 rounded border border-slate-200 w-32 sm:text-right"
                  />
                </div>
              </div>
            </div>

            {/* Client info */}
            <div className="py-6 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Billed To (Client Name)
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="font-semibold text-base text-slate-800 w-full p-1.5 -ml-1.5 rounded hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-teal-500 outline-none border border-transparent hover:border-slate-200"
                />
                <div className="text-xs text-slate-500 mt-0.5">client@example.com</div>
              </div>

              <div className="sm:text-right flex flex-col justify-end">
                <span className="text-xs text-slate-400">Payment method accepted:</span>
                <span className="text-xs font-semibold text-slate-700 mt-0.5">
                  Visa, Mastercard, Apple Pay, ACH Direct Deposit
                </span>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="py-6">
              <div className="grid grid-cols-12 gap-2 text-xs font-bold uppercase text-slate-400 pb-2 border-b border-slate-200">
                <span className="col-span-6 sm:col-span-7">Description</span>
                <span className="col-span-2 text-center">Qty</span>
                <span className="col-span-2 text-right">Rate</span>
                <span className="col-span-2 sm:col-span-1 text-right">Amount</span>
              </div>

              <div className="divide-y divide-slate-100">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 py-3 items-center group">
                    <div className="col-span-6 sm:col-span-7">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className="w-full text-xs sm:text-sm font-medium text-slate-800 p-1.5 rounded border border-transparent hover:border-slate-200 focus:border-teal-500 outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', Math.max(1, Number(e.target.value)))}
                        className="w-full text-xs sm:text-sm text-center text-slate-800 p-1.5 rounded border border-slate-200 focus:border-teal-500 outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="relative">
                        <span className="absolute left-2 top-1.5 text-xs text-slate-400">{config.currencySymbol}</span>
                        <input
                          type="number"
                          min="0"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, 'rate', Math.max(0, Number(e.target.value)))}
                          className="w-full text-xs sm:text-sm text-right pl-5 pr-2 py-1.5 rounded border border-slate-200 focus:border-teal-500 outline-none"
                        />
                      </div>
                    </div>
                    <div className="col-span-2 sm:col-span-1 text-right flex items-center justify-end gap-1">
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {config.currencySymbol}{(item.quantity * item.rate).toFixed(0)}
                      </span>
                      {items.length > 1 && (
                        <button
                          onClick={() => removeItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-rose-500 transition-opacity"
                          title="Delete item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addItem}
                className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#007788] hover:text-[#005566] p-2 rounded-lg hover:bg-teal-50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add another line item
              </button>
            </div>

            {/* Calculations & Totals */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Client Memo / Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs text-slate-600 p-2.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-teal-500 outline-none resize-none"
                />
              </div>

              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    {config.currencySymbol}{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-600">
                  <div className="flex items-center gap-2">
                    <span>Tax (%)</span>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={taxRatePercent}
                      onChange={(e) => setTaxRatePercent(Math.max(0, Number(e.target.value)))}
                      className="w-14 p-1 text-xs border border-slate-200 rounded text-center"
                    />
                  </div>
                  <span className="font-semibold text-slate-900">
                    {config.currencySymbol}{taxAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-base font-extrabold text-slate-900">
                  <span>Total Due</span>
                  <span className="text-2xl text-[#007788]">
                    {config.currencySymbol}{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
