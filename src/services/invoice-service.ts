import { InvoiceRepository, InvoiceListFilterParams } from '@/repository/invoice-repository';
import { SettingsRepository } from '@/repository/settings-repository';
import { ClientRepository } from '@/repository/client-repository';
import logger from '@/utils/logger';
import { calculateInvoiceTotals, isInvoiceOverdue, formatInvoiceNumber } from '@/utils/helper';

export class InvoiceService {
  private invoiceRepository: InvoiceRepository;
  private settingsRepository: SettingsRepository;
  private clientRepository: ClientRepository;

  constructor() {
    this.invoiceRepository = new InvoiceRepository();
    this.settingsRepository = new SettingsRepository();
    this.clientRepository = new ClientRepository();
  }

  private enrichInvoice(invoice: any) {
    if (!invoice) return null;
    const totals = calculateInvoiceTotals(
      invoice.lineItems || [],
      invoice.discountPercent,
      invoice.taxPercent
    );

    const isOverdue = isInvoiceOverdue(invoice.status, invoice.dueDate);

    return {
      ...invoice,
      ...totals,
      isOverdue,
      displayStatus: isOverdue ? 'OVERDUE' : invoice.status,
    };
  }

  async getAllInvoices(userId: string, filters: InvoiceListFilterParams = {}) {
    try {
      const result = await this.invoiceRepository.findFilteredInvoices(userId, filters);
      return {
        ...result,
        invoices: result.invoices.map((inv) => this.enrichInvoice(inv)),
      };
    } catch (error) {
      logger.error('[InvoiceService:getAllInvoices] error:', error);
      throw error;
    }
  }

  async getInvoice(id: string, userId: string) {
    try {
      const invoice = await this.invoiceRepository.findByIdAndUser(id, userId);
      if (!invoice) {
        const err = new Error('Invoice not found');
        (err as any).statusCode = 404;
        throw err;
      }
      return this.enrichInvoice(invoice);
    } catch (error) {
      logger.error('[InvoiceService:getInvoice] error:', error);
      throw error;
    }
  }

  async getPublicInvoice(publicToken: string) {
    try {
      const invoice = await this.invoiceRepository.findByPublicToken(publicToken);
      if (!invoice) {
        const err = new Error('Invoice not found or invalid public token');
        (err as any).statusCode = 404;
        throw err;
      }
      return this.enrichInvoice(invoice);
    } catch (error) {
      logger.error('[InvoiceService:getPublicInvoice] error:', error);
      throw error;
    }
  }

  async createInvoice(
    userId: string,
    data: {
      clientId: string;
      status?: 'DRAFT' | 'SENT';
      issueDate: string | Date;
      dueDate: string | Date;
      taxPercent?: number;
      discountPercent?: number;
      notes?: string;
    },
    lineItems: Array<{ description: string; quantity: number; rate: number; sortOrder?: number }>
  ) {
    try {
      // 1. Verify client belongs to user
      const client = await this.clientRepository.findByIdAndUser(data.clientId, userId);
      if (!client) {
        const err = new Error('Client not found or does not belong to you');
        (err as any).statusCode = 400;
        throw err;
      }

      // 2. Validate line items if sending
      if (data.status === 'SENT' && (!lineItems || lineItems.length === 0)) {
        const err = new Error('At least one line item is required to send an invoice');
        (err as any).statusCode = 400;
        throw err;
      }

      // 3. Validate numeric fields
      const taxPercent = Math.max(0, Number(data.taxPercent) || 0);
      const discountPercent = Math.max(0, Number(data.discountPercent) || 0);

      for (const item of lineItems || []) {
        if (!item.description?.trim()) {
          const err = new Error('Line item description is required');
          (err as any).statusCode = 400;
          throw err;
        }
        if (Number(item.quantity) <= 0) {
          const err = new Error('Line item quantity must be greater than zero');
          (err as any).statusCode = 400;
          throw err;
        }
        if (Number(item.rate) < 0) {
          const err = new Error('Line item rate cannot be negative');
          (err as any).statusCode = 400;
          throw err;
        }
      }

      // 4. Generate next invoice sequence
      const settings = await this.settingsRepository.getSettings(userId);
      const prefix = settings?.invoicePrefix || 'INV';
      const year = new Date(data.issueDate || new Date()).getFullYear();
      const sequence = await this.invoiceRepository.getNextSequenceForUser(userId, year);
      const invoiceNumber = formatInvoiceNumber(prefix, year, sequence);

      // 5. Create invoice
      const created = await this.invoiceRepository.createWithLineItems(
        userId,
        {
          ...data,
          invoiceNumber,
          taxPercent,
          discountPercent,
        },
        lineItems || []
      );

      return this.enrichInvoice(created);
    } catch (error) {
      logger.error('[InvoiceService:createInvoice] error:', error);
      throw error;
    }
  }

  async updateInvoice(
    id: string,
    userId: string,
    data: any,
    lineItems?: Array<{ description: string; quantity: number; rate: number; sortOrder?: number }>
  ) {
    try {
      const existing = await this.invoiceRepository.findByIdAndUser(id, userId);
      if (!existing) {
        const err = new Error('Invoice not found');
        (err as any).statusCode = 404;
        throw err;
      }

      if (data.clientId) {
        const client = await this.clientRepository.findByIdAndUser(data.clientId, userId);
        if (!client) {
          const err = new Error('Client not found or does not belong to you');
          (err as any).statusCode = 400;
          throw err;
        }
      }

      if (data.status === 'SENT') {
        const itemsToCheck = lineItems || existing.lineItems;
        if (!itemsToCheck || itemsToCheck.length === 0) {
          const err = new Error('At least one line item is required to mark an invoice as Sent');
          (err as any).statusCode = 400;
          throw err;
        }
      }

      const updated = await this.invoiceRepository.updateWithLineItems(id, userId, data, lineItems);
      return this.enrichInvoice(updated);
    } catch (error) {
      logger.error('[InvoiceService:updateInvoice] error:', error);
      throw error;
    }
  }

  async destroyInvoice(id: string, userId: string) {
    try {
      const deleted = await this.invoiceRepository.deleteForUser(id, userId);
      if (!deleted) {
        const err = new Error('Invoice not found');
        (err as any).statusCode = 404;
        throw err;
      }
      return deleted;
    } catch (error) {
      logger.error('[InvoiceService:destroyInvoice] error:', error);
      throw error;
    }
  }

  async sendInvoice(id: string, userId: string) {
    try {
      const existing = await this.invoiceRepository.findByIdAndUser(id, userId);
      if (!existing) {
        const err = new Error('Invoice not found');
        (err as any).statusCode = 404;
        throw err;
      }

      if (!existing.lineItems || existing.lineItems.length === 0) {
        const err = new Error('At least one line item is required to send an invoice');
        (err as any).statusCode = 400;
        throw err;
      }

      const updated = await this.invoiceRepository.markAsSent(id, userId);
      return this.enrichInvoice(updated);
    } catch (error) {
      logger.error('[InvoiceService:sendInvoice] error:', error);
      throw error;
    }
  }

  async payInvoice(id: string, userId: string) {
    try {
      const existing = await this.invoiceRepository.findByIdAndUser(id, userId);
      if (!existing) {
        const err = new Error('Invoice not found');
        (err as any).statusCode = 404;
        throw err;
      }

      const updated = await this.invoiceRepository.markAsPaid(id, userId, new Date());
      return this.enrichInvoice(updated);
    } catch (error) {
      logger.error('[InvoiceService:payInvoice] error:', error);
      throw error;
    }
  }

  async payPublicInvoice(publicToken: string) {
    try {
      const existing = await this.invoiceRepository.findByPublicToken(publicToken);
      if (!existing) {
        const err = new Error('Invoice not found');
        (err as any).statusCode = 404;
        throw err;
      }

      // Idempotent: if already paid, just return it
      if (existing.status === 'PAID') {
        return this.enrichInvoice(existing);
      }

      const updated = await this.invoiceRepository.markAsPaidByPublicToken(publicToken, new Date());
      return this.enrichInvoice(updated);
    } catch (error) {
      logger.error('[InvoiceService:payPublicInvoice] error:', error);
      throw error;
    }
  }
}

export default InvoiceService;
