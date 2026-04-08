import { query } from '../connection/postgres.client';

export class OrdersRepository {
  async findAll(storeId: string) {
    const sql = `
      SELECT o.id, o.order_id, o.customer_id, c.name as customer_name, o.status, o.total, o.items, o.created_at, o.updated_at
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.customer_id AND o.store_id = c.store_id
      WHERE o.store_id = $1
      ORDER BY o.created_at DESC
    `;
    const result = await query(sql, [storeId]);
    return result.rows;
  }

  async findById(storeId: string, orderId: string) {
    const sql = `
      SELECT o.id, o.order_id, o.customer_id, c.name as customer_name, o.status, o.total, o.items, o.created_at, o.updated_at
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.customer_id AND o.store_id = c.store_id
      WHERE o.store_id = $1 AND o.order_id = $2
    `;
    const result = await query(sql, [storeId, orderId]);
    return result.rows[0];
  }

  async create(storeId: string, order: { customer_id: string; total: number; items: any }) {
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const sql = `
      INSERT INTO orders (order_id, store_id, customer_id, total, items)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, order_id, customer_id, status, total, items, created_at, updated_at
    `;
    const result = await query(sql, [orderId, storeId, order.customer_id, order.total, JSON.stringify(order.items)]);
    
    await query(
      `UPDATE customers SET total_orders = total_orders + 1, total_spent = total_spent + $1 WHERE customer_id = $2 AND store_id = $3`,
      [order.total, order.customer_id, storeId]
    );
    
    return result.rows[0];
  }

  async updateStatus(storeId: string, orderId: string, status: string) {
    const sql = `
      UPDATE orders
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE store_id = $2 AND order_id = $3
      RETURNING id, order_id, customer_id, status, total, items, created_at, updated_at
    `;
    const result = await query(sql, [status, storeId, orderId]);
    return result.rows[0];
  }

  async delete(storeId: string, orderId: string) {
    const sql = `DELETE FROM orders WHERE store_id = $1 AND order_id = $2 RETURNING order_id`;
    const result = await query(sql, [storeId, orderId]);
    return result.rows[0];
  }
}
