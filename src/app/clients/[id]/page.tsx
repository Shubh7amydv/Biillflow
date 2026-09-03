'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AppShell from '@/components/layout/AppShell';
import {
  Card,
  CardHeader,
  Button,
  Input,
  Modal,
  Badge,
  Skeleton,
  EmptyState,
} from '@/components/ui';
import { showToast } from '@/components/landing/Toast';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  MapPin,
  Plus,
  Edit2,
  FileText,
  DollarSign,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency, formatDate, calculateInvoiceTotals, isInvoiceOverdue } from '@/utils/helper';

export default function ClientDetailPage() {
  const { id } = useParams() as { id: string };
  const { data: session, status } = useSession();
  const router = useRouter();

  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  const fetchClient = async () => {
    try {
      const res = await fetch(`/api/v1/clients/${id}`);
      const data = await res.json();
      if (data.success && data.data) {
        setClient(data.data);
        setEditName(data.data.name || '');
        setEditEmail(data.data.email || '');
        setEditCompany(data.data.company || '');
        setEditPhone(data.data.phone || '');
        setEditAddress(data.data.address || '');
      } else {
        router.push('/clients');
      }
    } catch (err) {
      console.error('Failed to load client:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && id) {
      fetchClient();
    }
  }, [status, id]);

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);
    setSaving(true);

    try {
      const res = await fetch(`/api/v1/clients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName.trim(),
          email: editEmail.trim().toLowerCase(),
          company: editCompany.trim() || null,
          phone: editPhone.trim() || null,
          address: editAddress.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update client');
      }

      showToast('Client details updated');
      setEditOpen(false);
      fetchClient();
    } catch (err: any) {
      setEditError(err?.message || 'Error updating client');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <AppShell>
        <div className="space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-48 rounded-3xl" />
          <Skeleton className="h-80 rounded-3xl" />
        </div>
      </AppShell>
    );
  }

  if (!client) return null;

  const userCurrency = (session?.user as any)?.currency || 'USD';

  // Compute metrics for this client
  let totalBilled = 0;
  let totalPaid = 0;

  const invoices = (client.invoices || []).map((inv: any) => {
    const totals = calculateInvoiceTotals(
      inv.lineItems || [],
      inv.discountPercent,
      inv.taxPercent
    );
    const overdue = isInvoiceOverdue(inv.status, inv.dueDate);
    totalBilled += totals.total;
    if (inv.status === 'PAID') {
      totalPaid += totals.total;
    }
    return {
      ...inv,
      ...totals,
      isOverdue: overdue,
      displayStatus: overdue ? 'OVERDUE' : inv.status,
    };
  });

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Back navigation */}
        <Link
          href="/clients"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Clients</span>
        </Link>

        {/* Client Profile Header Card */}
        <Card className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/80 text-[#0055FF] font-serif font-bold text-xl flex items-center justify-center">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 tracking-tight">
                    {client.name}
                  </h1>
                  {client.company && (
                    <p className="text-xs sm:text-sm font-semibold text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{client.company}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-slate-600 pt-2">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{client.email}</span>
                </div>
                {client.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{client.phone}</span>
                  </div>
                )}
                {client.address && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{client.address}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditOpen(true)}
                leftIcon={<Edit2 className="w-3.5 h-3.5" />}
              >
                Edit Client
              </Button>
              <Link href={`/invoices/new?clientId=${client.id}`}>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Create Invoice
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100">
            <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Total Invoices
              </span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">
                {invoices.length}
              </span>
            </div>

            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0055FF] block">
                Total Invoiced
              </span>
              <span className="text-2xl font-serif font-bold text-slate-900 mt-1 block">
                {formatCurrency(totalBilled, userCurrency)}
              </span>
            </div>

            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
                Total Paid
              </span>
              <span className="text-2xl font-serif font-bold text-slate-900 mt-1 block">
                {formatCurrency(totalPaid, userCurrency)}
              </span>
            </div>
          </div>
        </Card>

        {/* Invoice History for this client */}
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0055FF]" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Invoice History
              </h3>
            </div>
            <Link
              href={`/invoices/new?clientId=${client.id}`}
              className="text-xs font-bold text-[#0055FF] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Invoice</span>
            </Link>
          </CardHeader>

          {invoices.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<FileText className="w-6 h-6" />}
                title="No invoices for this client yet"
                description="Issue an invoice to this client to track payment status and revenue."
                actionLabel="Create Invoice"
                onAction={() => router.push(`/invoices/new?clientId=${client.id}`)}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50/80 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3.5">Invoice #</th>
                    <th className="px-6 py-3.5">Issue Date</th>
                    <th className="px-6 py-3.5">Due Date</th>
                    <th className="px-6 py-3.5 text-right">Amount</th>
                    <th className="px-6 py-3.5 text-center">Status</th>
                    <th className="px-6 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map((inv: any) => (
                    <tr
                      key={inv.id}
                      onClick={() => router.push(`/invoices/${inv.id}`)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 font-bold text-slate-900 group-hover:text-[#0055FF] transition-colors">
                        {inv.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {formatDate(inv.issueDate)}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {formatDate(inv.dueDate)}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900">
                        {formatCurrency(inv.total, userCurrency)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={inv.displayStatus?.toLowerCase() as any}>
                          {inv.displayStatus}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs font-bold text-[#0055FF] group-hover:underline">
                          View &rarr;
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Edit Client Modal */}
        <Modal
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          title="Edit Client Information"
          description="Update contact details or billing address"
        >
          {editError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {editError}
            </div>
          )}

          <form onSubmit={handleUpdateClient} className="space-y-4">
            <Input
              id="edit-client-name"
              label="Contact Name *"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />

            <Input
              id="edit-client-email"
              label="Email Address *"
              type="email"
              required
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />

            <Input
              id="edit-client-company"
              label="Company"
              value={editCompany}
              onChange={(e) => setEditCompany(e.target.value)}
            />

            <Input
              id="edit-client-phone"
              label="Phone Number"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
            />

            <Input
              id="edit-client-address"
              label="Billing Address"
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
            />

            <div className="pt-3 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={saving}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppShell>
  );
}
