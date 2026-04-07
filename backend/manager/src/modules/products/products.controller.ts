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
import { ProductsService } from './products.service';

@Controller('api/v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Headers('x-store-id') storeId: string): Promise<unknown> {
    this.checkStoreId(storeId);
    return this.productsService.findAll(storeId);
  }

  @Get(':productId')
  async findById(
    @Headers('x-store-id') storeId: string,
    @Param('productId') productId: string,
  ): Promise<unknown> {
    this.checkStoreId(storeId);
    return this.productsService.findById(storeId, productId);
  }

  @Post()
  async create(
    @Headers('x-store-id') storeId: string,
    @Body()
    product: {
      name: string;
      description?: string;
      category?: string;
      price: number;
      stock: number;
      image_url?: string;
    },
  ): Promise<unknown> {
    this.checkStoreId(storeId);
    if (!product.name || !product.price) {
      throw new HttpException(
        'Name and price are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.productsService.create(storeId, product);
  }

  @Put(':productId')
  async update(
    @Headers('x-store-id') storeId: string,
    @Param('productId') productId: string,
    @Body()
    product: {
      name?: string;
      description?: string;
      category?: string;
      price?: number;
      stock?: number;
      image_url?: string;
    },
  ): Promise<unknown> {
    this.checkStoreId(storeId);
    return this.productsService.update(storeId, productId, product);
  }

  @Delete(':productId')
  async delete(
    @Headers('x-store-id') storeId: string,
    @Param('productId') productId: string,
  ): Promise<unknown> {
    this.checkStoreId(storeId);
    return this.productsService.delete(storeId, productId);
  }

  private checkStoreId(storeId: string) {
    if (!storeId)
      throw new HttpException('Store ID is required', HttpStatus.BAD_REQUEST);
  }
}
