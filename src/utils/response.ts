import { NextResponse } from 'next/server';
import { SuccessCodes, ServerErrorCodes } from './error-codes';

export interface ApiResponse<T = any> {
  data: T | null;
  success: boolean;
  message: string;
  err: any | null;
}

export interface BuildResponseParams<T = any> {
  data?: T | null;
  success?: boolean;
  message?: string;
  err?: any | null;
  statusCode?: number;
}

export function buildResponse<T = any>({
  data = null,
  success = true,
  message = '',
  err = null,
  statusCode = success ? SuccessCodes.OK : ServerErrorCodes.INTERNAL_SERVER_ERROR,
}: BuildResponseParams<T>): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      data,
      success,
      message,
      err: err ? (typeof err === 'string' ? err : err.message || err) : null,
    },
    { status: statusCode }
  );
}
