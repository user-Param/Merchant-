import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

let lastErrorTime = 0;
const ERROR_LOG_INTERVAL = 5000; // Log error at most once every 5 seconds

redisClient.on('error', (err) => {
  const now = Date.now();
  if (now - lastErrorTime > ERROR_LOG_INTERVAL) {
    console.error('Redis Client Error:', err.message || err);
    lastErrorTime = now;
  }
});

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log('Redis Connected');
  }
};

export const cache = {
  get: async (key: string) => {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  },
  set: async (key: string, value: any, ttlSeconds: number = 60) => {
    await redisClient.set(key, JSON.stringify(value), {
      EX: ttlSeconds
    });
  },
  del: async (key: string) => {
    await redisClient.del(key);
  }
};
