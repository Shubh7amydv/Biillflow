import { AuthService } from '@/services/auth-service';
import { buildResponse } from '@/utils/response';
import { SuccessCodes, ClientErrorCodes, ServerErrorCodes } from '@/utils/error-codes';
import logger from '@/utils/logger';

export async function signup(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, businessName } = body;

    if (!email || !password) {
      return buildResponse({
        success: false,
        message: 'Email and password are required',
        statusCode: ClientErrorCodes.BAD_REQUEST,
      });
    }

    const authService = new AuthService();
    const user = await authService.signup({ name, email, password, businessName });

    return buildResponse({
      data: user,
      success: true,
      message: 'Account created successfully',
      statusCode: SuccessCodes.CREATED,
    });
  } catch (error: any) {
    logger.error('[AuthController:signup] error:', error);
    const statusCode = error?.statusCode || ServerErrorCodes.INTERNAL_SERVER_ERROR;
    return buildResponse({
      success: false,
      message: error?.message || 'Failed to create account',
      err: error,
      statusCode,
    });
  }
}
