'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AppShell from '@/components/layout/AppShell';
import { Card, CardHeader, CardContent, Button, Badge, Skeleton, EmptyState } from '@/components/ui';
import {
  DollarSign,
  Clock,
  AlertTriangle,
  Plus,
  ArrowRight,
  TrendingUp,
  PieChart as PieChartIcon,
  FileText,
  Users,
  Percent,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { formatCurrency, formatDate } from '@/utils/helper';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/v1/dashboard')
        .then((res) => res.json())
        .then((res) => {
          if (res.success && res.data) {
            setMetrics(res.data);
          }
        })
        .catch((err) => console.error('Failed to load dashboard:', err))
        .finally(() => setLoading(false));
    }
  }, [status]);

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <AppShell>
        <div className="space-y-6">
          <div className="h-10 w-64">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Skeleton className="h-32 rounded-3xl" />
            <Skeleton className="h-32 rounded-3xl" />
            <Skeleton className="h-32 rounded-3xl" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Skeleton className="lg:col-span-7 h-80 rounded-3xl" />
            <Skeleton className="lg:col-span-5 h-80 rounded-3xl" />
          </div>
        </div>
      </AppShell>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const userCurrency = (session?.user as any)?.currency || 'USD';
  const businessName =
    (session?.user as any)?.businessName || session?.user?.name || 'Studio';

  const stats = metrics?.stats || {
    totalEarned: 0,
    outstanding: 0,
    overdue: 0,
    totalInvoicesCount: 0,
    paidInvoicesCount: 0,
    collectionRate: 100,
    avgInvoiceValue: 0,
  };
  const monthlyRevenue = metrics?.monthlyRevenue || [];
  const statusDistribution = metrics?.statusDistribution || [];
  const recentInvoices = metrics?.recentInvoices || [];

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2B2824] tracking-tight">
              Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#6B6864] mt-1">
              Welcome back, <span className="font-bold text-[#2B2824]">{businessName}</span>. Here is your studio's financial breakdown.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/clients">
              <Button variant="outline" size="sm" leftIcon={<Users className="w-3.5 h-3.5" />}>
                Clients
              </Button>
            </Link>
            <Link href="/invoices/new">
              <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                New Invoice
              </Button>
            </Link>
          </div>
        </div>

        {/* 3 Metric Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Total Earned */}
          <Card className="p-6 relative overflow-hidden bg-gradient-to-br from-[#FAF8F5] to-emerald-50/40 border-[#D8C3A5]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Total Earned
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[#2B2824] mt-3 tracking-tight">
              {formatCurrency(stats.totalEarned, userCurrency)}
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#D8C3A5]/40 text-[11px] text-[#8E8D8A]">
              <span>{stats.paidInvoicesCount || 0} settled invoices</span>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                {stats.collectionRate || 100}% collection
              </span>
            </div>
          </Card>

          {/* Outstanding */}
          <Card className="p-6 relative overflow-hidden bg-gradient-to-br from-[#FAF8F5] to-[#E98074]/15 border-[#D8C3A5]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E85A4F]">
                Outstanding
              </span>
              <div className="w-8 h-8 rounded-full bg-[#E85A4F]/15 text-[#E85A4F] flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[#2B2824] mt-3 tracking-tight">
              {formatCurrency(stats.outstanding, userCurrency)}
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#D8C3A5]/40 text-[11px] text-[#8E8D8A]">
              <span>Awaiting client payment</span>
              <span className="font-bold text-[#E85A4F] bg-[#E85A4F]/10 px-2 py-0.5 rounded-full">
                Within terms
              </span>
            </div>
          </Card>

          {/* Overdue */}
          <Card className="p-6 relative overflow-hidden bg-gradient-to-br from-[#FAF8F5] to-rose-50/40 border-[#D8C3A5]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
                Overdue
              </span>
              <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[#2B2824] mt-3 tracking-tight">
              {formatCurrency(stats.overdue, userCurrency)}
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#D8C3A5]/40 text-[11px] text-[#8E8D8A]">
              <span>Invoices past due date</span>
              <span className="font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                Needs attention
              </span>
            </div>
          </Card>
        </div>

        {/* Dual Chart Row: Monthly Revenue (Bar) & Cash Distribution (Donut / Pie) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Monthly Revenue Bar Chart (7 Cols) */}
          <Card className="lg:col-span-7 p-6 sm:p-7">
            <div className="flex items-center justify-between pb-5 border-b border-[#D8C3A5]/50">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#E85A4F]" />
                <h3 className="font-bold text-[#2B2824] text-sm sm:text-base">
                  Revenue Over Time
                </h3>
              </div>
              <span className="text-xs text-[#8E8D8A] font-medium">Last 6 Months</span>
            </div>

            <div className="h-64 sm:h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D8C3A5" strokeOpacity={0.4} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#8E8D8A' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#8E8D8A' }}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip
                    cursor={{ fill: '#EAE7DC', opacity: 0.5 }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#23201D] text-[#EAE7DC] px-3 py-2 rounded-xl text-xs shadow-lg border border-[#3E3A36]">
                            <p className="font-medium text-[#8E8D8A]">{payload[0].payload.month}</p>
                            <p className="font-bold text-sm text-[#E98074] mt-0.5">
                              {formatCurrency(payload[0].value as number, userCurrency)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#E85A4F"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={44}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Cashflow & Invoice Status Distribution Donut / Pie Chart (5 Cols) */}
          <Card className="lg:col-span-5 p-6 sm:p-7 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-5 border-b border-[#D8C3A5]/50">
              <div className="flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-[#E85A4F]" />
                <h3 className="font-bold text-[#2B2824] text-sm sm:text-base">
                  Cashflow Distribution
                </h3>
              </div>
              <span className="text-xs text-[#8E8D8A] font-medium">By Status</span>
            </div>

            {statusDistribution.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-xs text-[#8E8D8A]">
                <PieChartIcon className="w-8 h-8 text-[#D8C3A5] mb-2" />
                <span>No invoice data yet to graph distribution.</span>
              </div>
            ) : (
              <div className="h-64 sm:h-72 w-full pt-2 flex flex-col justify-center">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusDistribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#FAF8F5" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-[#23201D] text-[#EAE7DC] px-3 py-2 rounded-xl text-xs shadow-lg border border-[#3E3A36]">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
                                <span className="font-bold">{data.name}</span>
                              </div>
                              <p className="font-extrabold text-sm text-[#FAF8F5] mt-1">
                                {formatCurrency(data.value, userCurrency)}
                              </p>
                              <p className="text-[10px] text-[#8E8D8A]">{data.count} invoice{data.count !== 1 ? 's' : ''}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Custom Warm Legend */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#D8C3A5]/40 text-xs">
                  {statusDistribution.map((item: any) => (
                    <div key={item.name} className="flex items-center justify-between p-1.5 rounded-lg bg-[#EAE7DC]/50">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="font-semibold text-[#2B2824] text-[11px]">{item.name}</span>
                      </div>
                      <span className="font-extrabold text-[#2B2824] text-[11px]">
                        {formatCurrency(item.value, userCurrency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Recent Invoices Section */}
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#E85A4F]" />
              <h3 className="font-bold text-[#2B2824] text-sm sm:text-base">
                Recent Invoices
              </h3>
            </div>
            <Link
              href="/invoices"
              className="text-xs font-bold text-[#E85A4F] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>

          {recentInvoices.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<FileText className="w-6 h-6" />}
                title="No invoices created yet"
                description="Create your first client invoice in under 60 seconds with live totals and online payment."
                actionLabel="Create First Invoice"
                onAction={() => router.push('/invoices/new')}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#EAE7DC]/60 border-b border-[#D8C3A5] text-xs font-bold uppercase tracking-wider text-[#8E8D8A]">
                  <tr>
                    <th className="px-6 py-3.5">Invoice #</th>
                    <th className="px-6 py-3.5">Client</th>
                    <th className="px-6 py-3.5">Due Date</th>
                    <th className="px-6 py-3.5">Amount</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8C3A5]/40 text-[#2B2824]">
                  {recentInvoices.map((inv: any) => (
                    <tr key={inv.id} className="hover:bg-[#EAE7DC]/40 transition-colors group">
                      <td className="px-6 py-4 font-bold text-[#2B2824]">
                        <Link href={`/invoices/${inv.id}`} className="hover:text-[#E85A4F] transition-colors">
                          {inv.invoiceNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-[#2B2824]">{inv.client?.name || 'Unknown Client'}</div>
                        <div className="text-xs text-[#8E8D8A]">{inv.client?.email}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#6B6864]">
                        {formatDate(inv.dueDate)}
                      </td>
                      <td className="px-6 py-4 font-extrabold text-[#2B2824]">
                        {formatCurrency(inv.total, inv.currency || userCurrency)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={inv.displayStatus ? inv.displayStatus.toLowerCase() : inv.status.toLowerCase()}>
                          {inv.displayStatus || inv.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/invoices/${inv.id}`}
                          className="text-xs font-bold text-[#E85A4F] hover:underline"
                        >
                          View &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
