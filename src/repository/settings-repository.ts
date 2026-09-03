import { CrudRepository } from './crud-repository';
import logger from '@/utils/logger';

export class SettingsRepository extends CrudRepository {
  constructor() {
    super('user');
  }

  async getSettings(userId: string) {
    try {
      return await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          businessName: true,
          logoUrl: true,
          currency: true,
          invoicePrefix: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      logger.error('[SettingsRepository:getSettings] error:', error);
      throw error;
    }
  }

  async updateSettings(userId: string, data: any) {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data,
        select: {
          id: true,
          name: true,
          email: true,
          businessName: true,
          logoUrl: true,
          currency: true,
          invoicePrefix: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      logger.error('[SettingsRepository:updateSettings] error:', error);
      throw error;
    }
  }
}

export default SettingsRepository;
