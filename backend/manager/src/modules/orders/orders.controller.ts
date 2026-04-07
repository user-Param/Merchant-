import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Headers,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('api/v1/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(@Headers('x-store-id') storeId: string): Promise<unknown> {
    this.checkStoreId(storeId);
    return this.ordersService.findAll(storeId);
  }

  @Get(':orderId')
  async findById(
    @Headers('x-store-id') storeId: string,
    @Param('orderId') orderId: string,
  ): Promise<unknown> {
    this.checkStoreId(storeId);
    return this.ordersService.findById(storeId, orderId);
  }

  @Post()
  async create(
    @Headers('x-store-id') storeId: string,
    @Body() order: { customer_id: string; total: number; items: unknown },
  ): Promise<unknown> {
    this.checkStoreId(storeId);
    if (!order.customer_id || !order.total) {
      throw new HttpException(
        'Customer ID and total are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.ordersService.create(storeId, order);
  }

  @Put(':orderId/status')
  async updateStatus(
    @Headers('x-store-id') storeId: string,
    @Param('orderId') orderId: string,
    @Body() body: { status: string },
  ): Promise<unknown> {
    this.checkStoreId(storeId);
    if (!body.status) {
      throw new HttpException('Status is required', HttpStatus.BAD_REQUEST);
    }
    return this.ordersService.updateStatus(storeId, orderId, body.status);
  }

  @Delete(':orderId')
  async delete(
    @Headers('x-store-id') storeId: string,
    @Param('orderId') orderId: string,
  ): Promise<unknown> {
    this.checkStoreId(storeId);
    return this.ordersService.delete(storeId, orderId);
  }

  private checkStoreId(storeId: string) {
    if (!storeId)
      throw new HttpException('Store ID is required', HttpStatus.BAD_REQUEST);
  }
}
