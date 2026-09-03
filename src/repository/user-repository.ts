import { CrudRepository } from './crud-repository';
import logger from '@/utils/logger';

export class UserRepository extends CrudRepository {
  constructor() {
    super('user');
  }

  async findByEmail(email: string) {
    try {
      return await this.prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });
    } catch (error) {
      logger.error('[UserRepository:findByEmail] error:', error);
      throw error;
    }
  }

  async findUserWithCounts(id: string) {
    try {
      return await this.prisma.user.findUnique({
        where: { id },
        include: {
          _count: {
            select: { clients: true, invoices: true },
          },
        },
      });
    } catch (error) {
      logger.error('[UserRepository:findUserWithCounts] error:', error);
      throw error;
    }
  }
}

export default UserRepository;
