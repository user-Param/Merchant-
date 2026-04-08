import { query } from '../connection/postgres.client';
import { pgPool } from '../connection/postgres.client';

export class AnalyticsRepository {
  
  // 1. Overview: Sales, Orders, Views, Conversion (EXCLUDING TODAY)
  async getHistoricalOverview(storeId: string) {
    const sql = `
      SELECT 
        COALESCE(SUM(revenue), 0) as total_revenue,
        COALESCE(SUM(orders), 0) as total_orders,
        COALESCE(SUM(page_views), 0) as total_views,
        COALESCE(AVG(conversion_rate), 0) as avg_conversion
      FROM analytics_daily
      WHERE store_id = $1 AND date >= (CURRENT_DATE - INTERVAL '30 days') AND date < CURRENT_DATE
    `;
    const result = await query(sql, [storeId]);
    return result.rows[0];
  }

  // 2. Visitors Over Time (EXCLUDING TODAY)
  async getHistoricalVisitorsTrend(storeId: string) {
    const sql = `
      SELECT date, page_views as visitors
      FROM analytics_daily
      WHERE store_id = $1 AND date >= (CURRENT_DATE - INTERVAL '30 days') AND date < CURRENT_DATE
      ORDER BY date ASC
    `;
    const result = await query(sql, [storeId]);
    return result.rows;
  }

  // 3. Orders Frequency (EXCLUDING TODAY)
  async getHistoricalOrdersTrend(storeId: string) {
    const sql = `
      SELECT date, orders
      FROM analytics_daily
      WHERE store_id = $1 AND date >= (CURRENT_DATE - INTERVAL '30 days') AND date < CURRENT_DATE
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
    const sql = `
      WITH customer_orders AS (
        SELECT customer_id, COUNT(*) as order_count, SUM(total) as total_spent
        FROM orders
        WHERE store_id = $1
        GROUP BY customer_id
      )
      SELECT 
        COUNT(*) as total_customers,
        COUNT(CASE WHEN order_count > 1 THEN 1 END) as returning_customers,
        ROUND(COUNT(CASE WHEN order_count > 1 THEN 1 END)::DECIMAL / NULLIF(COUNT(*), 0) * 100, 2) as retention_rate,
        COALESCE(AVG(total_spent), 0) as avg_ltv
      FROM customer_orders
    `;
    const result = await query(sql, [storeId]);
    const row = result.rows[0];
    return {
      returning_customers: parseInt(row.returning_customers) || 0,
      retention_rate: parseFloat(row.retention_rate) || 0,
      avg_ltv: parseFloat(row.avg_ltv) || 0
    };
  }

  // 5b. Retention Trend Over Time (for ReturningCard Chart)
  async getRetentionTrend(storeId: string) {
    const sql = `
      WITH customer_retention AS (
        SELECT 
          ad.date,
          COALESCE(
            ROUND(
              (COUNT(DISTINCT CASE WHEN c.total_orders > 1 THEN c.customer_id END)::numeric / 
               NULLIF(COUNT(DISTINCT c.customer_id), 0) * 100),
              1
            ),
            0
          ) as retention_rate
        FROM analytics_daily ad
        LEFT JOIN customers c ON c.store_id = ad.store_id
        WHERE ad.store_id = $1 AND ad.date >= (CURRENT_DATE - INTERVAL '30 days') AND ad.date < CURRENT_DATE
        GROUP BY ad.date
      )
      SELECT date, COALESCE(retention_rate, 0) as retention_rate
      FROM customer_retention
      ORDER BY date ASC
    `;
    try {
      const result = await query(sql, [storeId]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching retention trend:', error);
      return [];
    }
  }

  // 6. Conversion Funnel (EXCLUDING TODAY)
  async getConversionFunnel(storeId: string) {
    const sql = `
      SELECT 
        SUM(page_views) as views,
        (SELECT COUNT(*) FROM events WHERE store_id = $1 AND event_type = 'add_to_cart' AND processed = TRUE) as cart_adds,
        SUM(orders) as purchases
      FROM analytics_daily
      WHERE store_id = $1 AND date < CURRENT_DATE
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
    const sql = `
      SELECT 
        DATE_TRUNC('day', created_at) as campaign_date,
        SUM(total) as revenue,
        COUNT(*) as orders
      FROM orders
      WHERE store_id = $1 AND created_at >= (CURRENT_DATE - INTERVAL '30 days')
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY revenue DESC
      LIMIT 10
    `;
    const result = await query(sql, [storeId]);
    const totalRevenue = result.rows.reduce((sum, r) => sum + parseFloat(r.revenue), 0);
    const totalOrders = result.rows.reduce((sum, r) => sum + parseInt(r.orders), 0);
    
    return [
      { name: "Direct Sales", revenue: totalRevenue, roi: totalRevenue > 0 ? 1 : 0, reach: totalOrders }
    ];
  }

  // CORE: Aggregation logic for Precompute Service
  async bulkUpdateAnalytics(
    dailyData: Record<string, { revenue: number; orders: number; page_views: number }>,
    topProductsData: Record<string, { revenue: number; orders: number }>,
  ) {
    const client = await pgPool.connect();
    try {
      await client.query('BEGIN');

      // 1. Bulk Update analytics_daily using UNNEST
      const dailyEntries = Object.entries(dailyData);
      if (dailyEntries.length > 0) {
        const storeIds: string[] = [];
        const dates: string[] = [];
        const revenues: number[] = [];
        const orders: number[] = [];
        const pageViews: number[] = [];

        for (const [key, data] of dailyEntries) {
          const [storeId, date] = key.split(':');
          storeIds.push(storeId);
          dates.push(date);
          revenues.push(data.revenue);
          orders.push(data.orders);
          pageViews.push(data.page_views);
        }

        await client.query(
          `
          INSERT INTO analytics_daily (store_id, date, revenue, orders, page_views)
          SELECT * FROM UNNEST($1::uuid[], $2::date[], $3::numeric[], $4::int[], $5::int[])
          ON CONFLICT (store_id, date) DO UPDATE SET
            revenue = analytics_daily.revenue + EXCLUDED.revenue,
            orders = analytics_daily.orders + EXCLUDED.orders,
            page_views = analytics_daily.page_views + EXCLUDED.page_views,
            conversion_rate = CASE WHEN (analytics_daily.page_views + EXCLUDED.page_views) > 0
              THEN ((analytics_daily.orders + EXCLUDED.orders)::DECIMAL / (analytics_daily.page_views + EXCLUDED.page_views)) * 100
              ELSE 0 END
        `,
          [storeIds, dates, revenues, orders, pageViews],
        );
      }

      // 2. Bulk Update top_products using UNNEST
      const productEntries = Object.entries(topProductsData);
      if (productEntries.length > 0) {
        const storeIds: string[] = [];
        const productIds: string[] = [];
        const revenues: number[] = [];
        const orders: number[] = [];

        for (const [key, data] of productEntries) {
          const [storeId, productId] = key.split(':');
          storeIds.push(storeId);
          productIds.push(productId);
          revenues.push(data.revenue);
          orders.push(data.orders);
        }

        await client.query(
          `
          INSERT INTO top_products (store_id, product_id, revenue, orders)
          SELECT * FROM UNNEST($1::uuid[], $2::uuid[], $3::numeric[], $4::int[])
          ON CONFLICT (store_id, product_id) DO UPDATE SET
            revenue = top_products.revenue + EXCLUDED.revenue,
            orders = top_products.orders + EXCLUDED.orders
        `,
          [storeIds, productIds, revenues, orders],
        );
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async bulkInsertEvents(events: any[][]) {
    if (events.length === 0) return;

    const eventIds = events.map(e => e[0]);
    const storeIds = events.map(e => e[1]);
    const eventTypes = events.map(e => e[2]);
    const productIds = events.map(e => e[3]);
    const amounts = events.map(e => e[4]);
    const timestamps = events.map(e => e[5]);
    const processed = events.map(e => e[6]);

    const sql = `
      INSERT INTO events (event_id, store_id, event_type, product_id, amount, timestamp, processed)
      SELECT * FROM UNNEST($1::uuid[], $2::uuid[], $3::varchar[], $4::uuid[], $5::numeric[], $6::timestamp[], $7::boolean[])
      ON CONFLICT (event_id) DO NOTHING
    `;
    
    await query(sql, [eventIds, storeIds, eventTypes, productIds, amounts, timestamps, processed]);
  }
}
