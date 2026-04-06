import { query } from '../connection/postgres.client';
import { pgPool } from '../connection/postgres.client';

export class AnalyticsRepository {
  
  // 1. Overview: Sales, Orders, Views, Conversion
  async getOverview(storeId: string) {
    const sql = `
      SELECT 
        COALESCE(SUM(revenue), 0) as total_revenue,
        COALESCE(SUM(orders), 0) as total_orders,
        COALESCE(SUM(page_views), 0) as total_views,
        COALESCE(AVG(conversion_rate), 0) as avg_conversion
      FROM analytics_daily
      WHERE store_id = $1 AND date >= (CURRENT_DATE - INTERVAL '30 days')
    `;
    const result = await query(sql, [storeId]);
    return result.rows[0];
  }

  // 2. Visitors Over Time (for VisitorsCard)
  async getVisitorsTrend(storeId: string) {
    const sql = `
      SELECT date, page_views as visitors
      FROM analytics_daily
      WHERE store_id = $1 AND date >= (CURRENT_DATE - INTERVAL '30 days')
      ORDER BY date ASC
    `;
    const result = await query(sql, [storeId]);
    return result.rows;
  }

  // 3. Orders Frequency (for OrdersCard)
  async getOrdersTrend(storeId: string) {
    const sql = `
      SELECT date, orders
      FROM analytics_daily
      WHERE store_id = $1 AND date >= (CURRENT_DATE - INTERVAL '30 days')
      ORDER BY date ASC
    `;
    const result = await query(sql, [storeId]);
    return result.rows;
  }

  // 4. Top Products (for ProductCard)
  async getTopProducts(storeId: string) {
    const sql = `
      SELECT product_id, revenue, orders
      FROM top_products
      WHERE store_id = $1
      ORDER BY revenue DESC
      LIMIT 10
    `;
    const result = await query(sql, [storeId]);
    return result.rows;
  }

  // 5. Customer Retention (for ReturningCard)
  async getRetentionStats(storeId: string) {
    // Simulated retention logic - in a real app, this would query a dedicated retention table
    return {
      returning_customers: 12402,
      retention_rate: 24.5,
      avg_ltv: 4250
    };
  }

  // 6. Conversion Funnel (for PerformanceCard)
  async getConversionFunnel(storeId: string) {
    const sql = `
      SELECT 
        SUM(page_views) as views,
        (SELECT COUNT(*) FROM events WHERE store_id = $1 AND event_type = 'add_to_cart') as cart_adds,
        SUM(orders) as purchases
      FROM analytics_daily
      WHERE store_id = $1
    `;
    const result = await query(sql, [storeId]);
    return result.rows[0];
  }

  // 7. Recent Activity (for Activity Feed)
  async getRecentActivity(storeId: string) {
    const sql = `
      SELECT event_type, product_id, amount, timestamp
      FROM events
      WHERE store_id = $1
      ORDER BY timestamp DESC
      LIMIT 20
    `;
    const result = await query(sql, [storeId]);
    return result.rows;
  }

  // 8. Campaign Impact (for CampaignCard)
  async getCampaignStats(storeId: string) {
    // Simulated campaign data
    return [
      { name: "Summer Flash Sale", revenue: 42500, roi: 4.2, reach: 12400 },
      { name: "Insta Influencer Pack", revenue: 18200, roi: 3.1, reach: 8200 }
    ];
  }

  // CORE: Aggregation logic for Precompute Service
  async aggregatePendingEvents() {
    const client = await pgPool.connect();
    try {
      await client.query('BEGIN');
      const events = await client.query(
        `SELECT * FROM events WHERE processed = FALSE ORDER BY id LIMIT 500 FOR UPDATE SKIP LOCKED`,
      );

      if (events.rows.length === 0) {
        await client.query('COMMIT');
        return 0;
      }

      const eventIds = events.rows.map(e => e.id);

      for (const event of events.rows) {
        const date = new Date(event.timestamp).toISOString().split('T')[0];
        await client.query(
          `
          INSERT INTO analytics_daily (store_id, date, revenue, orders, page_views)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (store_id, date) DO UPDATE SET
            revenue = analytics_daily.revenue + $3,
            orders = analytics_daily.orders + $4,
            page_views = analytics_daily.page_views + $5,
            conversion_rate = CASE WHEN (analytics_daily.page_views + $5) > 0
              THEN ((analytics_daily.orders + $4)::DECIMAL / (analytics_daily.page_views + $5)) * 100
              ELSE 0 END
        `,
          [
            event.store_id,
            date,
            event.event_type === 'purchase' ? event.amount : 0,
            event.event_type === 'purchase' ? 1 : 0,
            event.event_type === 'page_view' ? 1 : 0,
          ],
        );

        if (event.product_id) {
          await client.query(
            `
            INSERT INTO top_products (store_id, product_id, revenue, orders)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (store_id, product_id) DO UPDATE SET
              revenue = top_products.revenue + $3,
              orders = top_products.orders + $4
          `,
            [
              event.store_id,
              event.product_id,
              event.event_type === 'purchase' ? event.amount : 0,
              event.event_type === 'purchase' ? 1 : 0,
            ],
          );
        }
      }

      await client.query(`UPDATE events SET processed = TRUE WHERE id = ANY($1)`, [eventIds]);
      await client.query('COMMIT');
      return events.rows.length;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
