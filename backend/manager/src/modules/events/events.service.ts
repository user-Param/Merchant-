import { Injectable } from '@nestjs/common';
import { query } from '../../database/storage/connection/postgres.client';
import { sendMessage } from '../../kafka/producer';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EventTrackingService {
  async trackEvent(event: {
    store_id: string;
    event_type: string;
    product_id?: string;
    amount?: number;
  }): Promise<unknown> {
    const event_id = uuidv4();
    const eventPayload = {
      event_id,
      store_id: event.store_id,
      event_type: event.event_type,
      product_id: event.product_id || null,
      amount: event.amount || 0,
      timestamp: new Date().toISOString(),
    };

    // Send to Kafka for async processing
    await sendMessage('merchant_events', eventPayload);

    return {
      success: true,
      message: 'Event accepted',
      event_id,
    };
  }

  async getRecentEvents(storeId: string, limit = 20): Promise<unknown> {
    const sql = `
      SELECT event_id, event_type, product_id, amount, timestamp
      FROM events
      WHERE store_id = $1
      ORDER BY timestamp DESC
      LIMIT $2
    `;
    const result = await query(sql, [storeId, limit]);
    return (result as unknown as Record<string, unknown>).rows;
  }
}
