import { SettingsRepository } from '@/repository/settings-repository';
import logger from '@/utils/logger';

export class SettingsService {
  private settingsRepository: SettingsRepository;

  constructor() {
    this.settingsRepository = new SettingsRepository();
  }

  async getSettings(userId: string) {
    try {
      const settings = await this.settingsRepository.getSettings(userId);
      if (!settings) {
        const err = new Error('User settings not found');
        (err as any).statusCode = 404;
        throw err;
      }
      return settings;
    } catch (error) {
      logger.error('[SettingsService:getSettings] error:', error);
      throw error;
    }
  }

  async updateSettings(
    userId: string,
    data: {
      name?: string;
      businessName?: string;
      logoUrl?: string | null;
      currency?: string;
      invoicePrefix?: string;
    }
  ) {
    try {
      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name.trim();
      if (data.businessName !== undefined) updateData.businessName = data.businessName.trim();
      if (data.logoUrl !== undefined) updateData.logoUrl = data.logoUrl;
      if (data.currency !== undefined) updateData.currency = data.currency.trim().toUpperCase();
      if (data.invoicePrefix !== undefined) {
        updateData.invoicePrefix = data.invoicePrefix.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
      }

      return await this.settingsRepository.updateSettings(userId, updateData);
    } catch (error) {
      logger.error('[SettingsService:updateSettings] error:', error);
      throw error;
    }
  }
}

export default SettingsService;
