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
import { CustomersService } from './customers.service';

@Controller('api/v1/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  async findAll(@Headers('x-store-id') storeId: string): Promise<unknown> {
    this.checkStoreId(storeId);
    return this.customersService.findAll(storeId);
  }

  @Get(':customerId')
  async findById(
    @Headers('x-store-id') storeId: string,
    @Param('customerId') customerId: string,
  ): Promise<unknown> {
    this.checkStoreId(storeId);
    return this.customersService.findById(storeId, customerId);
  }

  @Post()
  async create(
    @Headers('x-store-id') storeId: string,
    @Body() customer: { name: string; email: string; phone?: string },
  ): Promise<unknown> {
    this.checkStoreId(storeId);
    if (!customer.name || !customer.email) {
      throw new HttpException(
        'Name and email are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.customersService.create(storeId, customer);
  }

  @Put(':customerId')
  async update(
    @Headers('x-store-id') storeId: string,
    @Param('customerId') customerId: string,
    @Body() customer: { name?: string; email?: string; phone?: string },
  ): Promise<unknown> {
    this.checkStoreId(storeId);
    return this.customersService.update(storeId, customerId, customer);
  }

  @Delete(':customerId')
  async delete(
    @Headers('x-store-id') storeId: string,
    @Param('customerId') customerId: string,
  ): Promise<unknown> {
    this.checkStoreId(storeId);
    return this.customersService.delete(storeId, customerId);
  }

  private checkStoreId(storeId: string) {
    if (!storeId)
      throw new HttpException('Store ID is required', HttpStatus.BAD_REQUEST);
  }
}
