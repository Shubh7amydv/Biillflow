import { CrudRepository } from './crud-repository';
import logger from '@/utils/logger';
import { randomUUID } from 'crypto';

export interface InvoiceListFilterParams {
  search?: string;
  status?: string;
  clientId?: string;
  sortBy?: 'issueDate' | 'dueDate' | 'invoiceNumber' | 'createdAt';
  sortDir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export class InvoiceRepository extends CrudRepository {
  constructor() {
    super('invoice');
  }

  async findFilteredInvoices(userId: string, filters: InvoiceListFilterParams = {}) {
    try {
      const {
        search,
        status,
        clientId,
        sortBy = 'createdAt',
        sortDir = 'desc',
        page = 1,
        limit = 10,
      } = filters;

      const where: any = { userId };
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Status filtering including computed OVERDUE
      if (status && status !== 'ALL') {
        const upperStatus = status.toUpperCase();
        if (upperStatus === 'OVERDUE') {
          where.status = 'SENT';
          where.dueDate = { lt: today };
        } else if (upperStatus === 'SENT') {
          where.status = 'SENT';
          where.dueDate = { gte: today };
        } else if (upperStatus === 'DRAFT' || upperStatus === 'PAID') {
          where.status = upperStatus;
        }
      }

      if (clientId && clientId !== 'ALL') {
        where.clientId = clientId;
      }

      if (search && search.trim()) {
        const query = search.trim();
        where.OR = [
          { invoiceNumber: { contains: query, mode: 'insensitive' } },
          { client: { name: { contains: query, mode: 'insensitive' } } },
          { client: { company: { contains: query, mode: 'insensitive' } } },
          { client: { email: { contains: query, mode: 'insensitive' } } },
        ];
      }

      const totalCount = await this.prisma.invoice.count({ where });
      const skip = (page - 1) * limit;

      const invoices = await this.prisma.invoice.findMany({
        where,
        include: {
          client: true,
          lineItems: {
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: {
          [sortBy]: sortDir,
        },
        skip,
        take: limit,
      });

      return {
        invoices,
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit) || 1,
      };
    } catch (error) {
      logger.error('[InvoiceRepository:findFilteredInvoices] error:', error);
      throw error;
    }
  }

  async findByIdAndUser(id: string, userId: string) {
    try {
      return await this.prisma.invoice.findFirst({
        where: { id, userId },
        include: {
          client: true,
          lineItems: {
            orderBy: { sortOrder: 'asc' },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              businessName: true,
              logoUrl: true,
              currency: true,
              invoicePrefix: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('[InvoiceRepository:findByIdAndUser] error:', error);
      throw error;
    }
  }

  async findByPublicToken(publicToken: string) {
    try {
      return await this.prisma.invoice.findUnique({
        where: { publicToken },
        include: {
          client: {
            select: {
              name: true,
              email: true,
              company: true,
              address: true,
              phone: true,
            },
          },
          lineItems: {
            orderBy: { sortOrder: 'asc' },
          },
          user: {
            select: {
              businessName: true,
              logoUrl: true,
              currency: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('[InvoiceRepository:findByPublicToken] error:', error);
      throw error;
    }
  }

  async getNextSequenceForUser(userId: string, year: number): Promise<number> {
    try {
      // Find highest sequential invoice number for this user and year
      const prefixPattern = `-${year}-`;
      const invoices = await this.prisma.invoice.findMany({
        where: {
          userId,
          invoiceNumber: { contains: prefixPattern },
        },
        select: { invoiceNumber: true },
      });

      let maxSeq = 0;
      for (const inv of invoices) {
        const parts = inv.invoiceNumber.split('-');
        if (parts.length >= 3) {
          const num = parseInt(parts[parts.length - 1], 10);
          if (!isNaN(num) && num > maxSeq) {
            maxSeq = num;
          }
        }
      }

      return maxSeq + 1;
    } catch (error) {
      logger.error('[InvoiceRepository:getNextSequenceForUser] error:', error);
      throw error;
    }
  }

  async createWithLineItems(userId: string, data: any, lineItems: any[]) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const publicToken = randomUUID();
        const invoice = await tx.invoice.create({
          data: {
            userId,
            clientId: data.clientId,
            invoiceNumber: data.invoiceNumber,
            status: data.status || 'DRAFT',
            issueDate: new Date(data.issueDate),
            dueDate: new Date(data.dueDate),
            taxPercent: data.taxPercent ?? 0,
            discountPercent: data.discountPercent ?? 0,
            notes: data.notes || null,
            publicToken,
            lineItems: {
              create: lineItems.map((item, index) => ({
                description: item.description,
                quantity: item.quantity,
                rate: item.rate,
                sortOrder: item.sortOrder ?? index,
              })),
            },
          },
          include: {
            client: true,
            lineItems: true,
          },
        });

        return invoice;
      });
    } catch (error) {
      logger.error('[InvoiceRepository:createWithLineItems] error:', error);
      throw error;
    }
  }

  async updateWithLineItems(id: string, userId: string, data: any, lineItems?: any[]) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const existing = await tx.invoice.findFirst({
          where: { id, userId },
        });
        if (!existing) return null;

        const updateData: any = {};
        if (data.clientId !== undefined) updateData.clientId = data.clientId;
        if (data.status !== undefined) updateData.status = data.status;
        if (data.issueDate !== undefined) updateData.issueDate = new Date(data.issueDate);
        if (data.dueDate !== undefined) updateData.dueDate = new Date(data.dueDate);
        if (data.taxPercent !== undefined) updateData.taxPercent = data.taxPercent;
        if (data.discountPercent !== undefined) updateData.discountPercent = data.discountPercent;
        if (data.notes !== undefined) updateData.notes = data.notes;
        if (data.paidAt !== undefined) updateData.paidAt = data.paidAt ? new Date(data.paidAt) : null;

        if (lineItems && Array.isArray(lineItems)) {
          // Delete old line items and recreate
          await tx.lineItem.deleteMany({ where: { invoiceId: id } });
          updateData.lineItems = {
            create: lineItems.map((item, index) => ({
              description: item.description,
              quantity: item.quantity,
              rate: item.rate,
              sortOrder: item.sortOrder ?? index,
            })),
          };
        }

        return await tx.invoice.update({
          where: { id },
          data: updateData,
          include: {
            client: true,
            lineItems: true,
          },
        });
      });
    } catch (error) {
      logger.error('[InvoiceRepository:updateWithLineItems] error:', error);
      throw error;
    }
  }

  async deleteForUser(id: string, userId: string) {
    try {
      const existing = await this.prisma.invoice.findFirst({
        where: { id, userId },
      });
      if (!existing) return null;

      return await this.prisma.invoice.delete({
        where: { id },
      });
    } catch (error) {
      logger.error('[InvoiceRepository:deleteForUser] error:', error);
      throw error;
    }
  }

  async markAsPaid(id: string, userId: string, paidAt: Date = new Date()) {
    try {
      const existing = await this.prisma.invoice.findFirst({
        where: { id, userId },
      });
      if (!existing) return null;

      return await this.prisma.invoice.update({
        where: { id },
        data: {
          status: 'PAID',
          paidAt,
        },
        include: {
          client: true,
          lineItems: true,
        },
      });
    } catch (error) {
      logger.error('[InvoiceRepository:markAsPaid] error:', error);
      throw error;
    }
  }

  async markAsPaidByPublicToken(publicToken: string, paidAt: Date = new Date()) {
    try {
      const existing = await this.prisma.invoice.findUnique({
        where: { publicToken },
      });
      if (!existing) return null;

      return await this.prisma.invoice.update({
        where: { publicToken },
        data: {
          status: 'PAID',
          paidAt,
        },
        include: {
          client: true,
          lineItems: true,
        },
      });
    } catch (error) {
      logger.error('[InvoiceRepository:markAsPaidByPublicToken] error:', error);
      throw error;
    }
  }

  async markAsSent(id: string, userId: string) {
    try {
      const existing = await this.prisma.invoice.findFirst({
        where: { id, userId },
      });
      if (!existing) return null;

      return await this.prisma.invoice.update({
        where: { id },
        data: { status: 'SENT' },
        include: {
          client: true,
          lineItems: true,
        },
      });
    } catch (error) {
      logger.error('[InvoiceRepository:markAsSent] error:', error);
      throw error;
    }
  }
}

export default InvoiceRepository;
