import prisma from '@/config/db';
import logger from '@/utils/logger';

export class CrudRepository<T = any> {
  protected modelName: string;
  protected prisma: typeof prisma;

  constructor(modelName: string) {
    this.modelName = modelName;
    this.prisma = prisma;
  }

  protected get model(): any {
    return (this.prisma as any)[this.modelName];
  }

  async create(data: any): Promise<T> {
    try {
      return await this.model.create({ data });
    } catch (error) {
      logger.error(`[CrudRepository:${this.modelName}] create error:`, error);
      throw error;
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findUnique({ where: { id } });
    } catch (error) {
      logger.error(`[CrudRepository:${this.modelName}] findById error:`, error);
      throw error;
    }
  }

  async findMany(args: any = {}): Promise<T[]> {
    try {
      return await this.model.findMany(args);
    } catch (error) {
      logger.error(`[CrudRepository:${this.modelName}] findMany error:`, error);
      throw error;
    }
  }

  async update(id: string, data: any): Promise<T> {
    try {
      return await this.model.update({ where: { id }, data });
    } catch (error) {
      logger.error(`[CrudRepository:${this.modelName}] update error:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<T> {
    try {
      return await this.model.delete({ where: { id } });
    } catch (error) {
      logger.error(`[CrudRepository:${this.modelName}] delete error:`, error);
      throw error;
    }
  }
}

export default CrudRepository;
