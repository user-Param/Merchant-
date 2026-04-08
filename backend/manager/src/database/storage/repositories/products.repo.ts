import { query } from '../connection/postgres.client';

export class ProductsRepository {
  async findAll(storeId: string) {
    const sql = `
      SELECT id, product_id, name, description, category, price, stock, image_url, created_at, updated_at
      FROM products
      WHERE store_id = $1
      ORDER BY created_at DESC
    `;
    const result = await query(sql, [storeId]);
    return result.rows;
  }

  async findById(storeId: string, productId: string) {
    const sql = `
      SELECT id, product_id, name, description, category, price, stock, image_url, created_at, updated_at
      FROM products
      WHERE store_id = $1 AND product_id = $2
    `;
    const result = await query(sql, [storeId, productId]);
    return result.rows[0];
  }

  async create(storeId: string, product: { name: string; description?: string; category?: string; price: number; stock: number; image_url?: string }) {
    const productId = `PRD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const sql = `
      INSERT INTO products (product_id, store_id, name, description, category, price, stock, image_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, product_id, name, description, category, price, stock, image_url, created_at, updated_at
    `;
    const result = await query(sql, [productId, storeId, product.name, product.description, product.category, product.price, product.stock, product.image_url]);
    return result.rows[0];
  }

  async update(storeId: string, productId: string, product: { name?: string; description?: string; category?: string; price?: number; stock?: number; image_url?: string }) {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (product.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(product.name);
    }
    if (product.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(product.description);
    }
    if (product.category !== undefined) {
      fields.push(`category = $${paramCount++}`);
      values.push(product.category);
    }
    if (product.price !== undefined) {
      fields.push(`price = $${paramCount++}`);
      values.push(product.price);
    }
    if (product.stock !== undefined) {
      fields.push(`stock = $${paramCount++}`);
      values.push(product.stock);
    }
    if (product.image_url !== undefined) {
      fields.push(`image_url = $${paramCount++}`);
      values.push(product.image_url);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(storeId, productId);

    const sql = `
      UPDATE products
      SET ${fields.join(', ')}
      WHERE store_id = $${paramCount++} AND product_id = $${paramCount}
      RETURNING id, product_id, name, description, category, price, stock, image_url, created_at, updated_at
    `;
    const result = await query(sql, values);
    return result.rows[0];
  }

  async delete(storeId: string, productId: string) {
    const sql = `DELETE FROM products WHERE store_id = $1 AND product_id = $2 RETURNING product_id`;
    const result = await query(sql, [storeId, productId]);
    return result.rows[0];
  }
}
