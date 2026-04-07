import { Module } from '@nestjs/common';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CustomersModule } from './modules/customers/customers.module';
import { AuthModule } from './modules/auth/auth.module';
import { EventsModule } from './modules/events/events.module';

@Module({
  imports: [
    AnalyticsModule,
    ProductsModule,
    OrdersModule,
    CustomersModule,
    AuthModule,
    EventsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
