import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../../../database/storage/repositories/products.repo';
import { cache } from '../../../database/cache/src/cache.service';

@Injectable()
export class ProductsService {
  private readonly repo = new ProductsRepository();

  async findAll(storeId: string): Promise<unknown> {
    return this.repo.findAll(storeId);
  }

  async findById(storeId: string, productId: string): Promise<unknown> {
    return this.repo.findById(storeId, productId);
  }

  async create(
    storeId: string,
    product: {
      name: string;
      description?: string;
      category?: string;
      price: number;
      stock: number;
      image_url?: string;
    },
  ): Promise<unknown> {
    const created: unknown = await this.repo.create(storeId, product);
    await this.invalidateCache(storeId);
    return created;
  }

  async update(
    storeId: string,
    productId: string,
    product: {
      name?: string;
      description?: string;
      category?: string;
      price?: number;
      stock?: number;
      image_url?: string;
    },
  ): Promise<unknown> {
    const updated: unknown = await this.repo.update(
      storeId,
      productId,
      product,
    );
    await this.invalidateCache(storeId);
    return updated;
  }

  async delete(storeId: string, productId: string): Promise<unknown> {
    const deleted: unknown = await this.repo.delete(storeId, productId);
    await this.invalidateCache(storeId);
    return deleted;
  }

  private async invalidateCache(storeId: string) {
    try {
      const keys = await cache.keys(`products:${storeId}:*`);
      for (const key of keys) {
        await cache.del(key);
      }
    } catch (err) {
      console.warn('Cache invalidation failed:', (err as Error).message);
    }
  }
}
