import { CrudRepository } from '@/repository/crud-repository';
import logger from '@/utils/logger';

export class CrudService<T = any> {
  protected repository: CrudRepository<T>;

  constructor(repository: CrudRepository<T>) {
    this.repository = repository;
  }

  async create(data: any): Promise<T> {
    try {
      return await this.repository.create(data);
    } catch (error) {
      logger.error('[CrudService:create] error:', error);
      throw error;
    }
  }

  async get(id: string): Promise<T | null> {
    try {
      return await this.repository.findById(id);
    } catch (error) {
      logger.error('[CrudService:get] error:', error);
      throw error;
    }
  }

  async getAll(args: any = {}): Promise<T[]> {
    try {
      return await this.repository.findMany(args);
    } catch (error) {
      logger.error('[CrudService:getAll] error:', error);
      throw error;
    }
  }

  async update(id: string, data: any): Promise<T> {
    try {
      return await this.repository.update(id, data);
    } catch (error) {
      logger.error('[CrudService:update] error:', error);
      throw error;
    }
  }

  async destroy(id: string): Promise<T> {
    try {
      return await this.repository.delete(id);
    } catch (error) {
      logger.error('[CrudService:destroy] error:', error);
      throw error;
    }
  }
}

export default CrudService;
