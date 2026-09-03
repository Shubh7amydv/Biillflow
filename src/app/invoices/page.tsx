'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AppShell from '@/components/layout/AppShell';
import {
  Card,
  Button,
  Input,
  Select,
  Badge,
  Skeleton,
  EmptyState,
} from '@/components/ui';
import { showToast } from '@/components/landing/Toast';
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Send,
  Trash2,
  ExternalLink,
  Edit2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/helper';

export default function InvoicesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  // Load clients for dropdown
  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/v1/clients')
        .then((res) => res.json())
        .then((res) => {
          if (res.success && res.data) setClients(res.data);
        })
        .catch(console.error);
    }
  }, [status]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab !== 'ALL') params.set('status', activeTab);
      if (selectedClient !== 'ALL') params.set('clientId', selectedClient);
      if (search.trim()) params.set('search', search.trim());
      params.set('sortBy', sortBy);
      params.set('sortDir', sortDir);
      params.set('page', page.toString());
      params.set('limit', '10');

      const res = await fetch(`/api/v1/invoices?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.data) {
        setInvoices(data.data.invoices || []);
        setTotalPages(data.data.totalPages || 1);
        setTotalCount(data.data.total || 0);
      }
    } catch (err) {
      console.error('Failed to load invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchInvoices();
    }
  }, [status, activeTab, selectedClient, page, sortBy, sortDir]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchInvoices();
  };

  const handleMarkAsPaid = async (id: string, invoiceNumber: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/v1/invoices/${id}/pay`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast(`Invoice ${invoiceNumber} marked as Paid!`);
        fetchInvoices();
      }
    } catch (err) {
      alert('Failed to mark as paid');
    }
  };

  const handleSendInvoice = async (id: string, invoiceNumber: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/v1/invoices/${id}/send`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast(`Invoice ${invoiceNumber} marked as Sent & public link active!`);
        fetchInvoices();
      }
    } catch (err) {
      alert('Failed to send invoice');
    }
  };

  const handleDeleteInvoice = async (id: string, invoiceNumber: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete invoice ${invoiceNumber}?`)) return;

    try {
      const res = await fetch(`/api/v1/invoices/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast(`Invoice ${invoiceNumber} deleted.`);
        fetchInvoices();
      }
    } catch (err) {
      alert('Failed to delete invoice');
    }
  };

  const userCurrency = (session?.user as any)?.currency || 'USD';
  const tabs = ['ALL', 'DRAFT', 'SENT', 'PAID', 'OVERDUE'];

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2B2824] tracking-tight">
              Invoices
            </h1>
            <p className="text-xs sm:text-sm text-[#6B6864] mt-1">
              Create, track, and manage all billing documents
            </p>
          </div>

          <Link href="/invoices/new">
            <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
              Create Invoice
            </Button>
          </Link>
        </div>

        {/* Filter Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 border-b border-[#D8C3A5]/60">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#E85A4F] text-white shadow-xs'
                    : 'text-[#6B6864] hover:text-[#2B2824] hover:bg-[#D8C3A5]/25'
                }`}
              >
                <span>{tab}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Client Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 max-w-md">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by invoice # or client..."
              leftIcon={<Search className="w-4 h-4" />}
            />
            <Button type="submit" variant="secondary" size="md">
              Search
            </Button>
          </form>

          <div className="w-full sm:w-52">
            <Select
              value={selectedClient}
              onChange={(e) => {
                setSelectedClient(e.target.value);
                setPage(1);
              }}
            >
              <option value="ALL">All Clients</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.company ? `(${c.company})` : ''}
                </option>
              ))}
            </Select>
          </div>

          <div className="w-full sm:w-52">
            <Select
              value={`${sortBy}:${sortDir}`}
              onChange={(e) => {
                const [by, dir] = e.target.value.split(':');
                setSortBy(by);
                setSortDir(dir);
                setPage(1);
              }}
            >
              <option value="createdAt:desc">Newest First</option>
              <option value="createdAt:asc">Oldest First</option>
              <option value="dueDate:asc">Due Date (Earliest)</option>
              <option value="dueDate:desc">Due Date (Latest)</option>
              <option value="issueDate:desc">Issue Date (Newest)</option>
              <option value="invoiceNumber:desc">Invoice # (Desc)</option>
              <option value="invoiceNumber:asc">Invoice # (Asc)</option>
            </Select>
          </div>
        </div>

        {/* Invoices List / Table */}
        <Card className="overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : invoices.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<FileText className="w-6 h-6" />}
                title="No invoices found"
                description={
                  search || activeTab !== 'ALL' || selectedClient !== 'ALL'
                    ? 'Try adjusting your search or active filters.'
                    : 'Get started by creating your first client invoice.'
                }
                actionLabel="Create Invoice"
                onAction={() => router.push('/invoices/new')}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#EAE7DC]/60 text-[#8E8D8A] font-bold uppercase tracking-wider text-[11px] border-b border-[#D8C3A5]">
                  <tr>
                    <th className="px-6 py-3.5">Invoice #</th>
                    <th className="px-6 py-3.5">Client</th>
                    <th className="px-6 py-3.5">Issue Date</th>
                    <th className="px-6 py-3.5">Due Date</th>
                    <th className="px-6 py-3.5 text-right">Amount</th>
                    <th className="px-6 py-3.5 text-center">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8C3A5]/40 text-[#2B2824]">
                  {invoices.map((inv: any) => (
                    <tr
                      key={inv.id}
                      onClick={() => router.push(`/invoices/${inv.id}`)}
                      className="hover:bg-[#EAE7DC]/40 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 font-bold text-[#2B2824] group-hover:text-[#E85A4F] transition-colors">
                        {inv.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 text-[#2B2824] font-medium">
                        {inv.client?.name || 'Unknown Client'}
                      </td>
                      <td className="px-6 py-4 text-[#8E8D8A]">
                        {formatDate(inv.issueDate)}
                      </td>
                      <td className="px-6 py-4 text-[#8E8D8A]">
                        {formatDate(inv.dueDate)}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-[#2B2824]">
                        {formatCurrency(inv.total, userCurrency)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={inv.displayStatus?.toLowerCase() as any}>
                          {inv.displayStatus}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {inv.status === 'DRAFT' && (
                            <button
                              onClick={(e) => handleSendInvoice(inv.id, inv.invoiceNumber, e)}
                              className="p-1.5 text-[#E85A4F] hover:bg-[#E85A4F]/15 rounded-lg transition-colors cursor-pointer"
                              title="Mark as Sent & Send Email"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          )}

                          {inv.status !== 'PAID' && (
                            <button
                              onClick={(e) => handleMarkAsPaid(inv.id, inv.invoiceNumber, e)}
                              className="p-1.5 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                              title="Mark as Paid"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}

                          <Link
                            href={`/invoices/${inv.id}/edit`}
                            className="p-1.5 text-[#8E8D8A] hover:text-[#2B2824] hover:bg-[#D8C3A5]/30 rounded-lg transition-colors"
                            title="Edit Invoice"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={(e) => handleDeleteInvoice(inv.id, inv.invoiceNumber, e)}
                            className="p-1.5 text-[#8E8D8A] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Invoice"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 bg-[#EAE7DC]/40 border-t border-[#D8C3A5]/50 flex items-center justify-between text-xs text-[#8E8D8A]">
              <div>
                Showing page <span className="font-bold text-[#2B2824]">{page}</span> of{' '}
                <span className="font-bold text-[#2B2824]">{totalPages}</span> ({totalCount} total)
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
