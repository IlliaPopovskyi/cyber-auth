import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

export type RedisClient = Redis;

export const RedisProvider: Provider = {
  useFactory: (): RedisClient => {
    return new Redis({
      host: String(process.env.REDIS_HOST) || 'localhost',
      port: Number(process.env.REDIS_PORT),
    });
  },
  provide: 'REDIS_CLIENT',
};
