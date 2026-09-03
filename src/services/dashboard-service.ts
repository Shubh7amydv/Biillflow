import { InvoiceRepository } from '@/repository/invoice-repository';
import logger from '@/utils/logger';
import { calculateInvoiceTotals, isInvoiceOverdue } from '@/utils/helper';

export class DashboardService {
  private invoiceRepository: InvoiceRepository;

  constructor() {
    this.invoiceRepository = new InvoiceRepository();
  }

  async getDashboardMetrics(userId: string) {
    try {
      // Fetch all invoices for metrics aggregation
      const invoices = await this.invoiceRepository.findMany({
        where: { userId },
        include: {
          client: true,
          lineItems: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      let totalEarned = 0;
      let outstanding = 0;
      let overdue = 0;
      let draftAmount = 0;
      let draftCount = 0;
      let paidCount = 0;
      let outstandingCount = 0;
      let overdueCount = 0;

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const now = new Date();
      const monthlyRevenueMap = new Map<string, number>();

      // Initialize past 6 months
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${months[d.getMonth()]} ${d.getFullYear().toString().slice(2)}`;
        monthlyRevenueMap.set(key, 0);
      }

      const enrichedInvoices = invoices.map((inv: any) => {
        const totals = calculateInvoiceTotals(
          inv.lineItems || [],
          inv.discountPercent,
          inv.taxPercent
        );
        const overdueStatus = isInvoiceOverdue(inv.status, inv.dueDate);

        if (inv.status === 'PAID') {
          totalEarned += totals.total;
          paidCount += 1;

          // Bucket to month
          const paidDate = inv.paidAt ? new Date(inv.paidAt) : new Date(inv.updatedAt);
          const key = `${months[paidDate.getMonth()]} ${paidDate.getFullYear().toString().slice(2)}`;
          if (monthlyRevenueMap.has(key)) {
            monthlyRevenueMap.set(key, (monthlyRevenueMap.get(key) || 0) + totals.total);
          }
        } else if (inv.status === 'SENT') {
          if (overdueStatus) {
            overdue += totals.total;
            overdueCount += 1;
          } else {
            outstanding += totals.total;
            outstandingCount += 1;
          }
        } else if (inv.status === 'DRAFT') {
          draftAmount += totals.total;
          draftCount += 1;
        }

        return {
          ...inv,
          ...totals,
          isOverdue: overdueStatus,
          displayStatus: overdueStatus ? 'OVERDUE' : inv.status,
        };
      });

      const monthlyRevenue = Array.from(monthlyRevenueMap.entries()).map(([month, revenue]) => ({
        month,
        revenue: Math.round(revenue * 100) / 100,
      }));

      const totalInvoiced = totalEarned + outstanding + overdue + draftAmount;
      const collectionRate = totalInvoiced > 0 ? Math.round((totalEarned / (totalEarned + outstanding + overdue)) * 100) : 100;
      const avgInvoiceValue = invoices.length > 0 ? Math.round(totalInvoiced / invoices.length) : 0;

      // Distribution data formatted specifically for Recharts Pie Chart
      const statusDistribution = [
        { name: 'Paid', value: Math.round(totalEarned * 100) / 100, count: paidCount, color: '#10B981' },
        { name: 'Outstanding', value: Math.round(outstanding * 100) / 100, count: outstandingCount, color: '#E85A4F' },
        { name: 'Overdue', value: Math.round(overdue * 100) / 100, count: overdueCount, color: '#E98074' },
        { name: 'Draft', value: Math.round(draftAmount * 100) / 100, count: draftCount, color: '#D8C3A5' },
      ].filter((item) => item.value > 0 || item.count > 0);

      const recentInvoices = enrichedInvoices.slice(0, 8);

      return {
        stats: {
          totalEarned: Math.round(totalEarned * 100) / 100,
          outstanding: Math.round(outstanding * 100) / 100,
          overdue: Math.round(overdue * 100) / 100,
          draftAmount: Math.round(draftAmount * 100) / 100,
          totalInvoicesCount: invoices.length,
          paidInvoicesCount: paidCount,
          collectionRate,
          avgInvoiceValue,
        },
        statusDistribution,
        monthlyRevenue,
        recentInvoices,
      };
    } catch (error) {
      logger.error('[DashboardService:getDashboardMetrics] error:', error);
      throw error;
    }
  }
}

export default DashboardService;
