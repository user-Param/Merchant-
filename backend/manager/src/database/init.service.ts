import { pgPool } from './storage/connection/postgres.client';
import * as fs from 'fs';
import * as path from 'path';

export class DatabaseInitService {
  async initialize(): Promise<void> {
    try {
      console.log('🗄️ Initializing database schema...');
      
      // Load and execute schema
      const schemaPath = path.join(__dirname, './storage/schemas/analytics.sql');
      const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
      await pgPool.query(schemaSql);
      console.log('✅ Database schema initialized');

      // Load and execute seeds
      const seedPath = path.join(__dirname, './storage/seeds/seed-data.sql');
      const seedSql = fs.readFileSync(seedPath, 'utf-8');
      await pgPool.query(seedSql);
      console.log('✅ Database seeded with initial data');
    } catch (err) {
      console.error('❌ Database initialization failed:', err);
      throw err;
    }
  }
}
