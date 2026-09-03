import { SettingsRepository } from '@/repository/settings-repository';
import logger from '@/utils/logger';

export class UploadService {
  private settingsRepository: SettingsRepository;

  constructor() {
    this.settingsRepository = new SettingsRepository();
  }

  async uploadLogo(userId: string, fileBuffer: Buffer, fileName: string, mimeType: string) {
    try {
      // Validate image type
      if (!mimeType.startsWith('image/')) {
        const err = new Error('Only image files (PNG, JPG, SVG, WebP) are allowed');
        (err as any).statusCode = 400;
        throw err;
      }

      // Max size: 2MB
      if (fileBuffer.length > 2 * 1024 * 1024) {
        const err = new Error('File size exceeds 2MB limit');
        (err as any).statusCode = 400;
        throw err;
      }

      // Encode as Base64 Data URL (100% serverless and Vercel compatible)
      const base64Data = fileBuffer.toString('base64');
      const logoUrl = `data:${mimeType};base64,${base64Data}`;

      // Update user's logo in Postgres
      await this.settingsRepository.updateSettings(userId, { logoUrl });

      return { logoUrl };
    } catch (error) {
      logger.error('[UploadService:uploadLogo] error:', error);
      throw error;
    }
  }

  async removeLogo(userId: string) {
    try {
      await this.settingsRepository.updateSettings(userId, { logoUrl: null });
      return { success: true };
    } catch (error) {
      logger.error('[UploadService:removeLogo] error:', error);
      throw error;
    }
  }
}

export default UploadService;
