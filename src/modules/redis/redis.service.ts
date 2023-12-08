import { Injectable, OnModuleDestroy, Inject } from '@nestjs/common';
import { RedisClient } from 'common/providers/redis.provider';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClient,
  ) {}

  async onModuleDestroy() {
    await this.redisClient.quit();
  }

  async set(key: string, value: string, expirationSeconds: number) {
    await this.redisClient.set(key, value, 'EX', expirationSeconds);
  }

  async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }
}
