import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'entities/user.entity';
import { UserSubscriber } from './user.subscriber';
import { UserService } from 'modules/user/user.service';
import { RedisModule } from 'modules/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisModule],
  providers: [UserService, UserSubscriber],
  exports: [UserService],
})
export class UserModule {}
