'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AppShell from '@/components/layout/AppShell';
import {
  Card,
  CardHeader,
  Button,
  Input,
  Modal,
  EmptyState,
  Skeleton,
} from '@/components/ui';
import { showToast } from '@/components/landing/Toast';
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  Building,
  MapPin,
  FileText,
  Trash2,
  Edit2,
  ArrowRight,
} from 'lucide-react';

export default function ClientsPage() {
  const { status } = useSession();
  const router = useRouter();

  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Add Client Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  const fetchClients = async (query = '') => {
    try {
      const url = query ? `/api/v1/clients?search=${encodeURIComponent(query)}` : '/api/v1/clients';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.data) {
        setClients(data.data);
      }
    } catch (err) {
      console.error('Failed to load clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchClients();
    }
  }, [status]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchClients(search);
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setCreating(true);

    try {
      const res = await fetch('/api/v1/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          email: formEmail.trim().toLowerCase(),
          company: formCompany.trim() || undefined,
          phone: formPhone.trim() || undefined,
          address: formAddress.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to add client');
      }

      showToast(`Client ${formName} created!`);
      setModalOpen(false);
      setFormName('');
      setFormEmail('');
      setFormCompany('');
      setFormPhone('');
      setFormAddress('');
      fetchClients(search);
    } catch (err: any) {
      setFormError(err?.message || 'Error creating client');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteClient = async (id: string, name: string, invoiceCount: number) => {
    if (invoiceCount > 0) {
      alert(`Cannot delete ${name} because they have ${invoiceCount} existing invoices.`);
      return;
    }

    if (!confirm(`Are you sure you want to delete client ${name}?`)) return;

    try {
      const res = await fetch(`/api/v1/clients/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete client');
      }
      showToast(`Client ${name} deleted.`);
      fetchClients(search);
    } catch (err: any) {
      alert(err?.message || 'Failed to delete client');
    }
  };

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <AppShell>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-48 rounded-3xl" />
            <Skeleton className="h-48 rounded-3xl" />
            <Skeleton className="h-48 rounded-3xl" />
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2B2824] tracking-tight">
              Clients
            </h1>
            <p className="text-xs sm:text-sm text-[#6B6864] mt-1">
              Manage your client roster, contact info, and billing records
            </p>
          </div>

          <Button
            onClick={() => setModalOpen(true)}
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Client
          </Button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, company..."
            leftIcon={<Search className="w-4 h-4" />}
          />
          <Button type="submit" variant="secondary" size="md">
            Search
          </Button>
        </form>

        {/* Clients Grid / List */}
        {clients.length === 0 ? (
          <EmptyState
            icon={<Users className="w-6 h-6" />}
            title="No clients found"
            description={
              search
                ? `No clients match the query "${search}".`
                : 'Build your client directory to start generating invoices with one click.'
            }
            actionLabel="Add Your First Client"
            onAction={() => setModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => {
              const invoiceCount = client._count?.invoices || 0;
              return (
                <Card
                  key={client.id}
                  className="p-6 flex flex-col justify-between hover:border-[#E85A4F]/60 group"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/clients/${client.id}`}
                          className="font-bold text-base text-[#2B2824] group-hover:text-[#E85A4F] transition-colors"
                        >
                          {client.name}
                        </Link>
                        {client.company && (
                          <p className="text-xs font-semibold text-[#8E8D8A] flex items-center gap-1.5 mt-0.5">
                            <Building className="w-3.5 h-3.5 text-[#8E8D8A]" />
                            <span>{client.company}</span>
                          </p>
                        )}
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E98074]/15 text-[#E85A4F] border border-[#E98074]/30 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>{invoiceCount}</span>
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-[#6B6864] pt-2 border-t border-[#D8C3A5]/40">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-[#8E8D8A] shrink-0" />
                        <span className="truncate">{client.email}</span>
                      </div>
                      {client.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-[#8E8D8A] shrink-0" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                      {client.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#8E8D8A] shrink-0" />
                          <span>{client.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-[#D8C3A5]/40 flex items-center justify-between">
                    <Link
                      href={`/clients/${client.id}`}
                      className="text-xs font-bold text-[#E85A4F] hover:underline flex items-center gap-1"
                    >
                      <span>View CRM Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() =>
                        handleDeleteClient(client.id, client.name, invoiceCount)
                      }
                      className="p-1.5 rounded-lg text-[#8E8D8A] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete client"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Add Client Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Add New Client"
          description="Enter client contact details for fast invoice autofill"
        >
          {formError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {formError}
            </div>
          )}

          <form onSubmit={handleCreateClient} className="space-y-4">
            <Input
              id="client-name"
              label="Client Contact Name *"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Sarah Connor"
            />

            <Input
              id="client-email"
              label="Email Address *"
              type="email"
              required
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder="sarah@cyberdyne.io"
            />

            <Input
              id="client-company"
              label="Company Name"
              value={formCompany}
              onChange={(e) => setFormCompany(e.target.value)}
              placeholder="Cyberdyne Systems LLC"
            />

            <Input
              id="client-phone"
              label="Phone Number"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              placeholder="+1 (555) 234-5678"
            />

            <Input
              id="client-address"
              label="Billing Address"
              value={formAddress}
              onChange={(e) => setFormAddress(e.target.value)}
              placeholder="100 Tech Blvd, Suite 400, Austin, TX 78701"
            />

            <div className="pt-3 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={creating}>
                Save Client
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppShell>
  );
}
