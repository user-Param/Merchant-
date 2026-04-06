import { Pool } from 'pg';

// Using a Connection Pool for high-performance concurrent queries
export const pgPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'merchant_db',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

let lastDbErrorTime = 0;
const DB_ERROR_LOG_INTERVAL = 5000;

pgPool.on('error', (err) => {
  const now = Date.now();
  if (now - lastDbErrorTime > DB_ERROR_LOG_INTERVAL) {
    console.error('Unexpected error on idle client', err.message || err);
    lastDbErrorTime = now;
  }
});

export const query = (text: string, params?: any[]) => {
  return pgPool.query(text, params).catch(err => {
    const now = Date.now();
    if (now - lastDbErrorTime > DB_ERROR_LOG_INTERVAL) {
      console.error('Database query error:', err.message || err);
      lastDbErrorTime = now;
    }
    throw err;
  });
};
