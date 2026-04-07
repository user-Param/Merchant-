import { Injectable } from '@nestjs/common';
import { OrdersRepository } from '../../../database/storage/repositories/orders.repo';

@Injectable()
export class OrdersService {
  private readonly repo = new OrdersRepository();

  async findAll(storeId: string): Promise<unknown> {
    return this.repo.findAll(storeId);
  }

  async findById(storeId: string, orderId: string): Promise<unknown> {
    return this.repo.findById(storeId, orderId);
  }

  async create(
    storeId: string,
    order: { customer_id: string; total: number; items: unknown },
  ): Promise<unknown> {
    return this.repo.create(storeId, order);
  }

  async updateStatus(
    storeId: string,
    orderId: string,
    status: string,
  ): Promise<unknown> {
    return this.repo.updateStatus(storeId, orderId, status);
  }

  async delete(storeId: string, orderId: string): Promise<unknown> {
    return this.repo.delete(storeId, orderId);
  }
}
