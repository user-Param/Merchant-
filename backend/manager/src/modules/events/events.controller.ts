import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EventTrackingService } from './events.service';

@Controller('api/v1/events')
export class EventsController {
  constructor(private readonly eventsService: EventTrackingService) {}

  @Post('track')
  async trackEvent(
    @Headers('x-store-id') storeId: string,
    @Body() body: { event_type: string; product_id?: string; amount?: number },
  ): Promise<unknown> {
    if (!storeId)
      throw new HttpException('Store ID is required', HttpStatus.BAD_REQUEST);
    if (!body.event_type)
      throw new HttpException('Event type is required', HttpStatus.BAD_REQUEST);

    return this.eventsService.trackEvent({
      store_id: storeId,
      event_type: body.event_type,
      product_id: body.product_id,
      amount: body.amount,
    });
  }

  @Get('recent')
  async getRecentEvents(
    @Headers('x-store-id') storeId: string,
  ): Promise<unknown> {
    if (!storeId)
      throw new HttpException('Store ID is required', HttpStatus.BAD_REQUEST);
    return this.eventsService.getRecentEvents(storeId);
  }
}
