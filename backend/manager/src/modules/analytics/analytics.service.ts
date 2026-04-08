import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from '../../database/storage/repositories/analytics.repo';
import { cache } from '../../database/cache/src/cache.service';

@Injectable()
export class AnalyticsService {
  private readonly repo = new AnalyticsRepository();
  private readonly HISTORICAL_CACHE_TTL = 3600; // 1 hour

  async getOverview(storeId: string) {
    const historical = await this.getCachedHistorical(
      `analytics:${storeId}:historical_overview`,
      () => this.repo.getHistoricalOverview(storeId)
    );
    const realtime = await this.getRealtimeStats(storeId);

    return {
      total_revenue: parseFloat(historical.total_revenue) + realtime.revenue,
      total_orders: parseInt(historical.total_orders) + realtime.orders,
      total_views: parseInt(historical.total_views) + realtime.page_views,
      avg_conversion:
        (parseInt(historical.total_orders) + realtime.orders) /
        Math.max(1, parseInt(historical.total_views) + realtime.page_views) * 100,
    };
  }

  async getVisitorsTrend(storeId: string) {
    const historical = await this.getCachedHistorical(
      `analytics:${storeId}:historical_visitors`,
      () => this.repo.getHistoricalVisitorsTrend(storeId)
    );
    const realtime = await this.getRealtimeStats(storeId);

    return [
      ...historical,
      { date: new Date().toISOString().split('T')[0], visitors: realtime.page_views },
    ];
  }

  async getOrdersTrend(storeId: string) {
    const historical = await this.getCachedHistorical(
      `analytics:${storeId}:historical_orders`,
      () => this.repo.getHistoricalOrdersTrend(storeId)
    );
    const realtime = await this.getRealtimeStats(storeId);

    return [
      ...historical,
      { date: new Date().toISOString().split('T')[0], orders: realtime.orders },
    ];
  }

  private async getCachedHistorical(key: string, fetchFn: () => Promise<any>): Promise<any> {
    const cached = await cache.get(key);
    if (cached) return cached;

    const data = await fetchFn();
    await cache.set(key, data, this.HISTORICAL_CACHE_TTL);
    return data;
  }

  private async getRealtimeStats(storeId: string) {
    const date = new Date().toISOString().split('T')[0];
    const key = `realtime:${storeId}:${date}`;
    
    // Use hGetAll for efficiency, but it might be slower than specific HGETs if hash is large.
    // For our case, it only has 3-4 fields, so it's fine.
    const stats = await cache.hGetAll(key);

    return {
      revenue: (parseInt(stats?.revenue) || 0) / 100,
      orders: parseInt(stats?.orders) || 0,
      page_views: parseInt(stats?.page_views) || 0,
    };
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
    const historical = await this.getCachedHistorical(
      `analytics:${storeId}:historical_funnel`,
      () => this.repo.getConversionFunnel(storeId)
    );
    const realtime = await this.getRealtimeStats(storeId);

    return {
      views: parseInt(historical.views || 0) + realtime.page_views,
      cart_adds: parseInt(historical.cart_adds || 0),
      purchases: parseInt(historical.purchases || 0) + realtime.orders,
    };
  }

  async getRecentActivity(storeId: string) {
    // Recent activity should not be cached or only for a few seconds
    return this.repo.getRecentActivity(storeId);
  }

  async getCampaignStats(storeId: string) {
    return this.getCachedOrFetch(`analytics:${storeId}:campaigns`, () =>
      this.repo.getCampaignStats(storeId),
    );
  }

  private async getCachedOrFetch(
    key: string,
    fetchFn: () => Promise<any>,
    ttl = 60
  ): Promise<any> {
    try {
      const cached = await cache.get(key);
      if (cached) return cached;
    } catch (err) {
      console.warn(`Cache read failed for key ${key}:`, (err as Error).message);
    }

    const data = await fetchFn();

    try {
      await cache.set(key, data, ttl);
    } catch (err) {
      console.warn(
        `Cache write failed for key ${key}:`,
        (err as Error).message,
      );
    }

    return data;
  }
}
