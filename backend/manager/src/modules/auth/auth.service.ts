import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AuthRepository } from '../../../database/storage/repositories/auth.repo';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly repo = new AuthRepository();

  async register(store: {
    name: string;
    email: string;
    password: string;
  }): Promise<unknown> {
    const existing: unknown = await this.repo.findByEmail(store.email);
    if (existing) {
      throw new HttpException('Email already registered', HttpStatus.CONFLICT);
    }

    const storeId = `STORE-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const passwordHash = this.hashPassword(store.password);

    return this.repo.create({
      store_id: storeId,
      name: store.name,
      email: store.email,
      password_hash: passwordHash,
    });
  }

  async login(email: string, password: string): Promise<unknown> {
    const store: unknown = await this.repo.findByEmail(email);
    if (!store) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const passwordHash = this.hashPassword(password);
    if ((store as Record<string, unknown>).password_hash !== passwordHash) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const token = this.generateToken(
      (store as Record<string, string>).store_id,
    );
    return {
      token,
      store_id: (store as Record<string, string>).store_id,
      name: (store as Record<string, string>).name,
      email: (store as Record<string, string>).email,
    };
  }

  async validateStore(storeId: string): Promise<unknown> {
    return this.repo.findByStoreId(storeId);
  }

  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  private generateToken(storeId: string): string {
    return crypto
      .createHash('sha256')
      .update(`${storeId}:${Date.now()}`)
      .digest('hex');
  }
}
