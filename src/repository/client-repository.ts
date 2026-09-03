import { CrudRepository } from './crud-repository';
import logger from '@/utils/logger';

export class ClientRepository extends CrudRepository {
  constructor() {
    super('client');
  }

  async findAllByUser(userId: string, search?: string) {
    try {
      const where: any = { userId };
      if (search && search.trim()) {
        const query = search.trim();
        where.OR = [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { company: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query, mode: 'insensitive' } },
        ];
      }

      return await this.prisma.client.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { invoices: true },
          },
        },
      });
    } catch (error) {
      logger.error('[ClientRepository:findAllByUser] error:', error);
      throw error;
    }
  }

  async findByIdAndUser(id: string, userId: string) {
    try {
      return await this.prisma.client.findFirst({
        where: { id, userId },
        include: {
          invoices: {
            orderBy: { createdAt: 'desc' },
            include: { lineItems: true },
          },
          _count: {
            select: { invoices: true },
          },
        },
      });
    } catch (error) {
      logger.error('[ClientRepository:findByIdAndUser] error:', error);
      throw error;
    }
  }

  async createForUser(userId: string, data: any) {
    try {
      return await this.prisma.client.create({
        data: {
          ...data,
          userId,
        },
      });
    } catch (error) {
      logger.error('[ClientRepository:createForUser] error:', error);
      throw error;
    }
  }

  async updateForUser(id: string, userId: string, data: any) {
    try {
      // First verify ownership
      const existing = await this.prisma.client.findFirst({
        where: { id, userId },
      });
      if (!existing) return null;

      return await this.prisma.client.update({
        where: { id },
        data,
      });
    } catch (error) {
      logger.error('[ClientRepository:updateForUser] error:', error);
      throw error;
    }
  }

  async deleteForUser(id: string, userId: string) {
    try {
      const existing = await this.prisma.client.findFirst({
        where: { id, userId },
        include: {
          _count: { select: { invoices: true } },
        },
      });
      if (!existing) return null;

      return await this.prisma.client.delete({
        where: { id },
      });
    } catch (error) {
      logger.error('[ClientRepository:deleteForUser] error:', error);
      throw error;
    }
  }
}

export default ClientRepository;
