import { Injectable } from '@nestjs/common';
import { CustomersRepository } from '../../../database/storage/repositories/customers.repo';

@Injectable()
export class CustomersService {
  private readonly repo = new CustomersRepository();

  async findAll(storeId: string): Promise<unknown> {
    return this.repo.findAll(storeId);
  }

  async findById(storeId: string, customerId: string): Promise<unknown> {
    return this.repo.findById(storeId, customerId);
  }

  async create(
    storeId: string,
    customer: { name: string; email: string; phone?: string },
  ): Promise<unknown> {
    const existing: unknown = await this.repo.findByEmail(
      storeId,
      customer.email,
    );
    if (existing) {
      throw new Error('Customer with this email already exists');
    }
    return this.repo.create(storeId, customer);
  }

  async update(
    storeId: string,
    customerId: string,
    customer: { name?: string; email?: string; phone?: string },
  ): Promise<unknown> {
    return this.repo.update(storeId, customerId, customer);
  }

  async delete(storeId: string, customerId: string): Promise<unknown> {
    return this.repo.delete(storeId, customerId);
  }
}
