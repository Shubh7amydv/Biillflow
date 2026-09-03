import { ClientRepository } from '@/repository/client-repository';
import logger from '@/utils/logger';

export class ClientService {
  private clientRepository: ClientRepository;

  constructor() {
    this.clientRepository = new ClientRepository();
  }

  async getAllClients(userId: string, search?: string) {
    try {
      return await this.clientRepository.findAllByUser(userId, search);
    } catch (error) {
      logger.error('[ClientService:getAllClients] error:', error);
      throw error;
    }
  }

  async getClient(id: string, userId: string) {
    try {
      const client = await this.clientRepository.findByIdAndUser(id, userId);
      if (!client) {
        const err = new Error('Client not found');
        (err as any).statusCode = 404;
        throw err;
      }
      return client;
    } catch (error) {
      logger.error('[ClientService:getClient] error:', error);
      throw error;
    }
  }

  async createClient(userId: string, data: { name: string; email: string; company?: string; address?: string; phone?: string }) {
    try {
      if (!data.name || !data.email) {
        const err = new Error('Client name and email are required');
        (err as any).statusCode = 400;
        throw err;
      }

      return await this.clientRepository.createForUser(userId, data);
    } catch (error) {
      logger.error('[ClientService:createClient] error:', error);
      throw error;
    }
  }

  async updateClient(id: string, userId: string, data: any) {
    try {
      const updated = await this.clientRepository.updateForUser(id, userId, data);
      if (!updated) {
        const err = new Error('Client not found');
        (err as any).statusCode = 404;
        throw err;
      }
      return updated;
    } catch (error) {
      logger.error('[ClientService:updateClient] error:', error);
      throw error;
    }
  }

  async destroyClient(id: string, userId: string) {
    try {
      const client = await this.clientRepository.findByIdAndUser(id, userId);
      if (!client) {
        const err = new Error('Client not found');
        (err as any).statusCode = 404;
        throw err;
      }

      if (client._count?.invoices > 0) {
        const err = new Error(
          `Cannot delete client with ${client._count.invoices} associated invoices. Delete the invoices first.`
        );
        (err as any).statusCode = 400;
        throw err;
      }

      return await this.clientRepository.deleteForUser(id, userId);
    } catch (error) {
      logger.error('[ClientService:destroyClient] error:', error);
      throw error;
    }
  }
}

export default ClientService;
