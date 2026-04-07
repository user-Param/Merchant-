import { query } from '../connection/postgres.client';

export class CustomersRepository {
  async findAll(storeId: string) {
    const sql = `
      SELECT id, customer_id, name, email, phone, total_orders, total_spent, created_at
      FROM customers
      WHERE store_id = $1
      ORDER BY created_at DESC
    `;
    const result = await query(sql, [storeId]);
    return result.rows;
  }

  async findById(storeId: string, customerId: string) {
    const sql = `
      SELECT id, customer_id, name, email, phone, total_orders, total_spent, created_at
      FROM customers
      WHERE store_id = $1 AND customer_id = $2
    `;
    const result = await query(sql, [storeId, customerId]);
    return result.rows[0];
  }

  async findByEmail(storeId: string, email: string) {
    const sql = `
      SELECT id, customer_id, name, email, phone, total_orders, total_spent, created_at
      FROM customers
      WHERE store_id = $1 AND email = $2
    `;
    const result = await query(sql, [storeId, email]);
    return result.rows[0];
  }

  async create(storeId: string, customer: { name: string; email: string; phone?: string }) {
    const customerId = `CUS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const sql = `
      INSERT INTO customers (customer_id, store_id, name, email, phone)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, customer_id, name, email, phone, total_orders, total_spent, created_at
    `;
    const result = await query(sql, [customerId, storeId, customer.name, customer.email, customer.phone]);
    return result.rows[0];
  }

  async update(storeId: string, customerId: string, customer: { name?: string; email?: string; phone?: string }) {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (customer.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(customer.name);
    }
    if (customer.email !== undefined) {
      fields.push(`email = $${paramCount++}`);
      values.push(customer.email);
    }
    if (customer.phone !== undefined) {
      fields.push(`phone = $${paramCount++}`);
      values.push(customer.phone);
    }

    values.push(storeId, customerId);

    const sql = `
      UPDATE customers
      SET ${fields.join(', ')}
      WHERE store_id = $${paramCount++} AND customer_id = $${paramCount}
      RETURNING id, customer_id, name, email, phone, total_orders, total_spent, created_at
    `;
    const result = await query(sql, values);
    return result.rows[0];
  }

  async delete(storeId: string, customerId: string) {
    const sql = `DELETE FROM customers WHERE store_id = $1 AND customer_id = $2 RETURNING customer_id`;
    const result = await query(sql, [storeId, customerId]);
    return result.rows[0];
  }
}
