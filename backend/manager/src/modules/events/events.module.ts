import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventTrackingService } from './events.service';

@Module({
  controllers: [EventsController],
  providers: [EventTrackingService],
})
export class EventsModule {}
