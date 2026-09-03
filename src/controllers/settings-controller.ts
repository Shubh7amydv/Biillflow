import { SettingsService } from '@/services/settings-service';
import { getServerAuthSession } from '@/lib/auth';
import { buildResponse } from '@/utils/response';
import { SuccessCodes, ClientErrorCodes, ServerErrorCodes } from '@/utils/error-codes';
import logger from '@/utils/logger';

export async function get(req: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user || !(session.user as any).id) {
      return buildResponse({
        success: false,
        message: 'Unauthorized. Please sign in.',
        statusCode: ClientErrorCodes.UNAUTHORIZED,
      });
    }

    const settingsService = new SettingsService();
    const settings = await settingsService.getSettings((session.user as any).id);

    return buildResponse({
      data: settings,
      success: true,
      message: 'Settings fetched successfully',
      statusCode: SuccessCodes.OK,
    });
  } catch (error: any) {
    logger.error('[SettingsController:get] error:', error);
    return buildResponse({
      success: false,
      message: error?.message || 'Failed to fetch settings',
      err: error,
      statusCode: error?.statusCode || ServerErrorCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function update(req: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user || !(session.user as any).id) {
      return buildResponse({
        success: false,
        message: 'Unauthorized. Please sign in.',
        statusCode: ClientErrorCodes.UNAUTHORIZED,
      });
    }

    const body = await req.json();
    const settingsService = new SettingsService();
    const updated = await settingsService.updateSettings((session.user as any).id, body);

    return buildResponse({
      data: updated,
      success: true,
      message: 'Settings updated successfully',
      statusCode: SuccessCodes.OK,
    });
  } catch (error: any) {
    logger.error('[SettingsController:update] error:', error);
    return buildResponse({
      success: false,
      message: error?.message || 'Failed to update settings',
      err: error,
      statusCode: error?.statusCode || ServerErrorCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
