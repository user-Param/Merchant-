import { Injectable } from '@nestjs/common';
import { query } from '../../../database/storage/connection/postgres.client';

@Injectable()
export class EventTrackingService {
  async trackEvent(event: {
    store_id: string;
    event_type: string;
    product_id?: string;
    amount?: number;
  }): Promise<unknown> {
    const event_id = `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const sql = `
      INSERT INTO events (event_id, store_id, event_type, product_id, amount)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, event_id, store_id, event_type, product_id, amount, timestamp
    `;
    const result = await query(sql, [
      event_id,
      event.store_id,
      event.event_type,
      event.product_id || null,
      event.amount || 0,
    ]);
    return (result as unknown as Record<string, unknown>).rows?.[0];
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
