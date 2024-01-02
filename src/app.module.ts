import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RouterModule } from '@nestjs/core';
import { AbstractModule } from 'modules/abstract/abstract.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './modules/redis/redis.module';
import { getEnvPath } from 'common/helpers/env.helper';
import { HealthyModule } from './modules/healthy/healthy.module';

const envFilePath: string = getEnvPath(`${__dirname}/../..`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: String(process.env.DB_HOST) || 'localhost',
      port: Number(process.env.DB_PORT),
      username: String(process.env.DB_USERNAME),
      password: String(process.env.DB_PASSWORD),
      database: String(process.env.DB_NAME),
      synchronize: true, // In the improved version, I can add migration
      autoLoadEntities: true,
    }),
    RouterModule.register([
      {
        path: '/api',
        module: AbstractModule,
        children: [
          {
            path: '/auth',
            module: AuthModule,
          },
          { path: '/healthy', module: HealthyModule },
        ],
      },
    ]),
    UserModule,
    AuthModule,
    RedisModule,
    HealthyModule,
  ],
})
export class AppModule {}
