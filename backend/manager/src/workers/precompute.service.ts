import { Kafka, Consumer } from 'kafkajs';
import { AnalyticsRepository } from '../database/storage/repositories/analytics.repo';
import { cache } from '../database/cache/src/cache.service';

const repo = new AnalyticsRepository();

const kafka = new Kafka({
  clientId: 'merchant-worker',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

export class PrecomputeWorker {
  private consumer: Consumer;
  private buffer: any[] = [];
  private readonly BATCH_SIZE = 500;
  private readonly FLUSH_INTERVAL = 5000; // 5 seconds
  private isFlushing = false;

  constructor() {
    this.consumer = kafka.consumer({ groupId: 'merchant-worker-group' });
  }

  async start() {
    console.log('🚀 Precompute Worker (Streaming) Started');
    
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'merchant_events', fromBeginning: true });

    // Flush buffer periodically
    setInterval(() => {
      void this.flush();
    }, this.FLUSH_INTERVAL);

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;
        try {
          const event = JSON.parse(message.value.toString());
          
          // 1. Update Real-time Redis Counters (Async, don't block ingestion)
          void this.updateRealtimeStats(event);

          // 2. Add to In-memory Buffer
          this.buffer.push(event);

          if (this.buffer.length >= this.BATCH_SIZE) {
            void this.flush();
          }
        } catch (err) {
          console.error('Error processing message:', err);
        }
      },
    });
  }

  private async updateRealtimeStats(event: any) {
    const { store_id, event_type, amount } = event;
    const date = new Date().toISOString().split('T')[0];
    const key = `realtime:${store_id}:${date}`;

    try {
      if (event_type === 'purchase') {
        // Round to 2 decimal places and store as cents to avoid floating point issues in Redis
        const cents = Math.round(parseFloat(amount) * 100);
        await Promise.all([
          cache.hIncrBy(key, 'revenue', cents),
          cache.hIncrBy(key, 'orders', 1)
        ]);
      } else if (event_type === 'page_view') {
        await cache.hIncrBy(key, 'page_views', 1);
      }
    } catch (err) {
      console.error('Redis update error:', err);
    }
  }

  private async flush() {
    if (this.isFlushing || this.buffer.length === 0) return;

    this.isFlushing = true;
    const currentBatch = [...this.buffer];
    this.buffer = [];

    console.log(`📦 Precompute Worker: Flushing ${currentBatch.length} events to DB`);

    try {
      // 1. Aggregate in memory
      const dailyData: Record<string, { revenue: number; orders: number; page_views: number }> = {};
      const topProductsData: Record<string, { revenue: number; orders: number }> = {};
      const rawEvents: any[][] = [];

      for (const event of currentBatch) {
        const date = new Date(event.timestamp).toISOString().split('T')[0];
        const dailyKey = `${event.store_id}:${date}`;

        if (!dailyData[dailyKey]) {
          dailyData[dailyKey] = { revenue: 0, orders: 0, page_views: 0 };
        }

        if (event.event_type === 'purchase') {
          dailyData[dailyKey].revenue += parseFloat(event.amount);
          dailyData[dailyKey].orders += 1;
        } else if (event.event_type === 'page_view') {
          dailyData[dailyKey].page_views += 1;
        }

        if (event.product_id) {
          const productKey = `${event.store_id}:${event.product_id}`;
          if (!topProductsData[productKey]) {
            topProductsData[productKey] = { revenue: 0, orders: 0 };
          }
          if (event.event_type === 'purchase') {
            topProductsData[productKey].revenue += parseFloat(event.amount);
            topProductsData[productKey].orders += 1;
          }
        }

        rawEvents.push([
          event.event_id,
          event.store_id,
          event.event_type,
          event.product_id,
          event.amount,
          event.timestamp,
          true // processed
        ]);
      }

      // 2. Perform Bulk Operations
      await Promise.all([
        repo.bulkUpdateAnalytics(dailyData, topProductsData),
        repo.bulkInsertEvents(rawEvents)
      ]);

      console.log(`✅ Precompute Worker: Successfully flushed ${currentBatch.length} events`);
      
    } catch (error) {
      console.error('❌ Precompute Worker Flush Error:', error);
      // Re-add to buffer for retry
      this.buffer = [...currentBatch, ...this.buffer];
    } finally {
      this.isFlushing = false;
    }
  }
}
