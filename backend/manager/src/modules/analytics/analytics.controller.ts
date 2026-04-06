import { Controller, Get, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('api/v1/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  async getOverview(@Headers('x-store-id') storeId: string) {
    this.checkStoreId(storeId);
    return this.analyticsService.getOverview(storeId);
  }

  @Get('visitors-trend')
  async getVisitorsTrend(@Headers('x-store-id') storeId: string) {
    this.checkStoreId(storeId);
    return this.analyticsService.getVisitorsTrend(storeId);
  }

  @Get('orders-trend')
  async getOrdersTrend(@Headers('x-store-id') storeId: string) {
    this.checkStoreId(storeId);
    return this.analyticsService.getOrdersTrend(storeId);
  }

  @Get('top-products')
  async getTopProducts(@Headers('x-store-id') storeId: string) {
    this.checkStoreId(storeId);
    return this.analyticsService.getTopProducts(storeId);
  }

  @Get('retention')
  async getRetentionStats(@Headers('x-store-id') storeId: string) {
    this.checkStoreId(storeId);
    return this.analyticsService.getRetentionStats(storeId);
  }

  @Get('funnel')
  async getConversionFunnel(@Headers('x-store-id') storeId: string) {
    this.checkStoreId(storeId);
    return this.analyticsService.getConversionFunnel(storeId);
  }

  @Get('recent-activity')
  async getRecentActivity(@Headers('x-store-id') storeId: string) {
    this.checkStoreId(storeId);
    return this.analyticsService.getRecentActivity(storeId);
  }

  @Get('campaigns')
  async getCampaignStats(@Headers('x-store-id') storeId: string) {
    this.checkStoreId(storeId);
    return this.analyticsService.getCampaignStats(storeId);
  }

  private checkStoreId(storeId: string) {
    if (!storeId) throw new HttpException('Store ID is required', HttpStatus.BAD_REQUEST);
  }
}
