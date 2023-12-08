import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisProvider } from 'common/providers/redis.provider';

@Module({
  providers: [RedisService, RedisProvider],
  exports: [RedisService],
})
export class RedisModule {}
