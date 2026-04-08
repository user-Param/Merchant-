import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AuthRepository } from '../../database/storage/repositories/auth.repo';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

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
    const passwordHash = await this.hashPassword(store.password);

    const result = await this.repo.create({
      store_id: storeId,
      name: store.name,
      email: store.email,
      password_hash: passwordHash,
    });

    const token = this.generateToken(storeId);
    return {
      token,
      store_id: storeId,
      name: store.name,
      email: store.email,
    };
  }

  async login(email: string, password: string): Promise<unknown> {
    try {
      const store: unknown = await this.repo.findByEmail(email);
      if (!store) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      const passwordMatch = await this.comparePassword(
        password,
        (store as Record<string, unknown>).password_hash as string,
      );
      if (!passwordMatch) {
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
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      console.error('Login error:', err);
      throw new HttpException(
        'Authentication failed. Please try again.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateStore(storeId: string): Promise<unknown> {
    return this.repo.findByStoreId(storeId);
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private generateToken(storeId: string): string {
    return crypto
      .createHash('sha256')
      .update(`${storeId}:${Date.now()}`)
      .digest('hex');
  }
}
