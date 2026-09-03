import { ClientService } from '@/services/client-service';
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

    const clientService = new ClientService();
    const clients = await clientService.getAllClients((session.user as any).id, search);

    return buildResponse({
      data: clients,
      success: true,
      message: 'Clients fetched successfully',
      statusCode: SuccessCodes.OK,
    });
  } catch (error: any) {
    logger.error('[ClientController:getAll] error:', error);
    return buildResponse({
      success: false,
      message: error?.message || 'Failed to fetch clients',
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

    const clientService = new ClientService();
    const client = await clientService.getClient(params.id, (session.user as any).id);

    return buildResponse({
      data: client,
      success: true,
      message: 'Client fetched successfully',
      statusCode: SuccessCodes.OK,
    });
  } catch (error: any) {
    logger.error('[ClientController:get] error:', error);
    return buildResponse({
      success: false,
      message: error?.message || 'Client not found',
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
    const clientService = new ClientService();
    const newClient = await clientService.createClient((session.user as any).id, body);

    return buildResponse({
      data: newClient,
      success: true,
      message: 'Client created successfully',
      statusCode: SuccessCodes.CREATED,
    });
  } catch (error: any) {
    logger.error('[ClientController:create] error:', error);
    return buildResponse({
      success: false,
      message: error?.message || 'Failed to create client',
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
    const clientService = new ClientService();
    const updated = await clientService.updateClient(params.id, (session.user as any).id, body);

    return buildResponse({
      data: updated,
      success: true,
      message: 'Client updated successfully',
      statusCode: SuccessCodes.OK,
    });
  } catch (error: any) {
    logger.error('[ClientController:update] error:', error);
    return buildResponse({
      success: false,
      message: error?.message || 'Failed to update client',
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

    const clientService = new ClientService();
    await clientService.destroyClient(params.id, (session.user as any).id);

    return buildResponse({
      data: null,
      success: true,
      message: 'Client deleted successfully',
      statusCode: SuccessCodes.OK,
    });
  } catch (error: any) {
    logger.error('[ClientController:destroy] error:', error);
    return buildResponse({
      success: false,
      message: error?.message || 'Failed to delete client',
      err: error,
      statusCode: error?.statusCode || ServerErrorCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
