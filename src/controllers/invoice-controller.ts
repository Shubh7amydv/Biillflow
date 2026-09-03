import { InvoiceService } from '@/services/invoice-service';
import { getServerAuthSession } from '@/lib/auth';
import { buildResponse } from '@/utils/response';
import { SuccessCodes, ClientErrorCodes, ServerErrorCodes } from '@/utils/error-codes';
import logger from '@/utils/logger';

export async function getAll(req: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user || !(session.user as any).id) {
      return buildResponse({
        success: false,
        message: 'Unauthorized. Please sign in.',
        statusCode: ClientErrorCodes.UNAUTHORIZED,
      });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const clientId = searchParams.get('clientId') || undefined;
    const sortBy = (searchParams.get('sortBy') as any) || 'createdAt';
    const sortDir = (searchParams.get('sortDir') as any) || 'desc';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const invoiceService = new InvoiceService();
    const result = await invoiceService.getAllInvoices((session.user as any).id, {
      search,
      status,
      clientId,
      sortBy,
      sortDir,
      page,
      limit,
    });

    return buildResponse({
      data: result,
      success: true,
      message: 'Invoices fetched successfully',
      statusCode: SuccessCodes.OK,
    });
  } catch (error: any) {
    logger.error('[InvoiceController:getAll] error:', error);
    return buildResponse({
      success: false,
      message: error?.message || 'Failed to fetch invoices',
      err: error,
      statusCode: error?.statusCode || ServerErrorCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function get(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user || !(session.user as any).id) {
      return buildResponse({
        success: false,
        message: 'Unauthorized. Please sign in.',
        statusCode: ClientErrorCodes.UNAUTHORIZED,
      });
    }

    const invoiceService = new InvoiceService();
    const invoice = await invoiceService.getInvoice(params.id, (session.user as any).id);

    return buildResponse({
      data: invoice,
      success: true,
      message: 'Invoice fetched successfully',
      statusCode: SuccessCodes.OK,
    });
  } catch (error: any) {
    logger.error('[InvoiceController:get] error:', error);
    return buildResponse({
      success: false,
      message: error?.message || 'Invoice not found',
      err: error,
      statusCode: error?.statusCode || ServerErrorCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function create(req: Request) {
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
    const { lineItems, ...invoiceData } = body;

    const invoiceService = new InvoiceService();
    const created = await invoiceService.createInvoice(
      (session.user as any).id,
      invoiceData,
      lineItems || []
    );

    return buildResponse({
      data: created,
      success: true,
      message: 'Invoice created successfully',
      statusCode: SuccessCodes.CREATED,
    });
  } catch (error: any) {
    logger.error('[InvoiceController:create] error:', error);
    return buildResponse({
      success: false,
      message: error?.message || 'Failed to create invoice',
      err: error,
      statusCode: error?.statusCode || ServerErrorCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function update(req: Request, { params }: { params: { id: string } }) {
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
    const { lineItems, ...invoiceData } = body;

    const invoiceService = new InvoiceService();
    const updated = await invoiceService.updateInvoice(
      params.id,
      (session.user as any).id,
      invoiceData,
      lineItems
    );

    return buildResponse({
      data: updated,
      success: true,
      message: 'Invoice updated successfully',
      statusCode: SuccessCodes.OK,
    });
  } catch (error: any) {
    logger.error('[InvoiceController:update] error:', error);
    return buildResponse({
      success: false,
      message: error?.message || 'Failed to update invoice',
      err: error,
      statusCode: error?.statusCode || ServerErrorCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function destroy(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user || !(session.user as any).id) {
      return buildResponse({
        success: false,
        message: 'Unauthorized. Please sign in.',
        statusCode: ClientErrorCodes.UNAUTHORIZED,
      });
    }

    const invoiceService = new InvoiceService();
    await invoiceService.destroyInvoice(params.id, (session.user as any).id);

    return buildResponse({
      data: null,
      success: true,
      message: 'Invoice deleted successfully',
      statusCode: SuccessCodes.OK,
    });
  } catch (error: any) {
    logger.error('[InvoiceController:destroy] error:', error);
    return buildResponse({
      success: false,
      message: error?.message || 'Failed to delete invoice',
      err: error,
      statusCode: error?.statusCode || ServerErrorCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function send(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user || !(session.user as any).id) {
      return buildResponse({
        success: false,
        message: 'Unauthorized. Please sign in.',
        statusCode: ClientErrorCodes.UNAUTHORIZED,
      });
    }

    const invoiceService = new InvoiceService();
    const updated = await invoiceService.sendInvoice(params.id, (session.user as any).id);

    return buildResponse({
      data: updated,
      success: true,
      message: 'Invoice marked as sent and public link activated',
      statusCode: SuccessCodes.OK,
    });
  } catch (error: any) {
    logger.error('[InvoiceController:send] error:', error);
    return buildResponse({
      success: false,
      message: error?.message || 'Failed to send invoice',
      err: error,
      statusCode: error?.statusCode || ServerErrorCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function pay(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user || !(session.user as any).id) {
      return buildResponse({
        success: false,
        message: 'Unauthorized. Please sign in.',
        statusCode: ClientErrorCodes.UNAUTHORIZED,
      });
    }

    const invoiceService = new InvoiceService();
    const updated = await invoiceService.payInvoice(params.id, (session.user as any).id);

    return buildResponse({
      data: updated,
      success: true,
      message: 'Invoice marked as paid',
      statusCode: SuccessCodes.OK,
    });
  } catch (error: any) {
    logger.error('[InvoiceController:pay] error:', error);
    return buildResponse({
      success: false,
      message: error?.message || 'Failed to mark invoice as paid',
      err: error,
      statusCode: error?.statusCode || ServerErrorCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function getPublic(req: Request, { params }: { params: { publicToken: string } }) {
  try {
    const invoiceService = new InvoiceService();
    const invoice = await invoiceService.getPublicInvoice(params.publicToken);

    return buildResponse({
      data: invoice,
      success: true,
      message: 'Public invoice fetched successfully',
      statusCode: SuccessCodes.OK,
    });
  } catch (error: any) {
    logger.error('[InvoiceController:getPublic] error:', error);
    return buildResponse({
      success: false,
      message: error?.message || 'Invoice not found',
      err: error,
      statusCode: error?.statusCode || ServerErrorCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function payPublic(req: Request, { params }: { params: { publicToken: string } }) {
  try {
    const invoiceService = new InvoiceService();
    const updated = await invoiceService.payPublicInvoice(params.publicToken);

    return buildResponse({
      data: updated,
      success: true,
      message: 'Payment simulated successfully. Invoice marked as PAID.',
      statusCode: SuccessCodes.OK,
    });
  } catch (error: any) {
    logger.error('[InvoiceController:payPublic] error:', error);
    return buildResponse({
      success: false,
      message: error?.message || 'Failed to process payment',
      err: error,
      statusCode: error?.statusCode || ServerErrorCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
