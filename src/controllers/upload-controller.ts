import { UploadService } from '@/services/upload-service';
import { getServerAuthSession } from '@/lib/auth';
import { buildResponse } from '@/utils/response';
import { SuccessCodes, ClientErrorCodes, ServerErrorCodes } from '@/utils/error-codes';
import logger from '@/utils/logger';

export async function uploadLogo(req: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user || !(session.user as any).id) {
      return buildResponse({
        success: false,
        message: 'Unauthorized. Please sign in.',
        statusCode: ClientErrorCodes.UNAUTHORIZED,
      });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return buildResponse({
        success: false,
        message: 'No file provided',
        statusCode: ClientErrorCodes.BAD_REQUEST,
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadService = new UploadService();
    const result = await uploadService.uploadLogo(
      (session.user as any).id,
      buffer,
      file.name,
      file.type
    );

    return buildResponse({
      data: result,
      success: true,
      message: 'Logo uploaded successfully',
      statusCode: SuccessCodes.OK,
    });
  } catch (error: any) {
    logger.error('[UploadController:uploadLogo] error:', error);
    return buildResponse({
      success: false,
      message: error?.message || 'Failed to upload logo',
      err: error,
      statusCode: error?.statusCode || ServerErrorCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
