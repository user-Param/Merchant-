import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from '../../../database/storage/repositories/analytics.repo';
import { cache } from '../../../database/cache/src/cache.service';

@Injectable()
export class AnalyticsService {
  private readonly repo = new AnalyticsRepository();

  async getOverview(storeId: string) {
    return this.getCachedOrFetch(`analytics:${storeId}:overview`, () =>
      this.repo.getOverview(storeId),
    );
  }

  async getVisitorsTrend(storeId: string) {
    return this.getCachedOrFetch(`analytics:${storeId}:visitors`, () =>
      this.repo.getVisitorsTrend(storeId),
    );
  }

  async getOrdersTrend(storeId: string) {
    return this.getCachedOrFetch(`analytics:${storeId}:orders`, () =>
      this.repo.getOrdersTrend(storeId),
    );
  }

  async getTopProducts(storeId: string) {
    return this.getCachedOrFetch(`analytics:${storeId}:top_products`, () =>
      this.repo.getTopProducts(storeId),
    );
  }

  async getRetentionStats(storeId: string) {
    return this.getCachedOrFetch(`analytics:${storeId}:retention`, () =>
      this.repo.getRetentionStats(storeId),
    );
  }

  async getConversionFunnel(storeId: string) {
    return this.getCachedOrFetch(`analytics:${storeId}:funnel`, () =>
      this.repo.getConversionFunnel(storeId),
    );
  }

  async getRecentActivity(storeId: string) {
    return this.repo.getRecentActivity(storeId);
  }

  async getCampaignStats(storeId: string) {
    return this.getCachedOrFetch(`analytics:${storeId}:campaigns`, () =>
      this.repo.getCampaignStats(storeId),
    );
  }

  private async getCachedOrFetch(
    key: string,
    fetchFn: () => Promise<unknown>,
  ): Promise<unknown> {
    try {
      const cached: unknown = await cache.get(key);
      if (cached) return cached;
    } catch (err) {
      console.warn(`Cache read failed for key ${key}:`, (err as Error).message);
    }

    const data: unknown = await fetchFn();

    try {
      await cache.set(key, data, 60);
    } catch (err) {
      console.warn(
        `Cache write failed for key ${key}:`,
        (err as Error).message,
      );
    }

    return data;
  }
}
