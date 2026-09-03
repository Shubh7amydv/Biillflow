import { DashboardService } from '@/services/dashboard-service';
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

    const dashboardService = new DashboardService();
    const metrics = await dashboardService.getDashboardMetrics((session.user as any).id);

    return buildResponse({
      data: metrics,
      success: true,
      message: 'Dashboard metrics fetched successfully',
      statusCode: SuccessCodes.OK,
    });
  } catch (error: any) {
    logger.error('[DashboardController:get] error:', error);
    return buildResponse({
      success: false,
      message: error?.message || 'Failed to fetch dashboard metrics',
      err: error,
      statusCode: error?.statusCode || ServerErrorCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
