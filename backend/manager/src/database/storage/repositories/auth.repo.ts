import { query } from '../connection/postgres.client';

export class AuthRepository {
  async findByEmail(email: string) {
    const sql = `SELECT * FROM stores WHERE email = $1`;
    const result = await query(sql, [email]);
    return result.rows[0];
  }

  async findByStoreId(storeId: string) {
    const sql = `SELECT * FROM stores WHERE store_id = $1`;
    const result = await query(sql, [storeId]);
    return result.rows[0];
  }

  async create(store: { store_id: string; name: string; email: string; password_hash: string }) {
    const sql = `
      INSERT INTO stores (store_id, name, email, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING id, store_id, name, email, created_at
    `;
    const result = await query(sql, [store.store_id, store.name, store.email, store.password_hash]);
    return result.rows[0];
  }

  async updatePassword(storeId: string, passwordHash: string) {
    const sql = `
      UPDATE stores
      SET password_hash = $1
      WHERE store_id = $2
      RETURNING id, store_id, name, email
    `;
    const result = await query(sql, [passwordHash, storeId]);
    return result.rows[0];
  }
}
