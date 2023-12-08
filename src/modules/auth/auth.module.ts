import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'modules/user/user.module';
import { RedisModule } from 'modules/redis/redis.module';

@Module({
  imports: [
    RedisModule,
    UserModule,
    JwtModule.register({
      secret: String(process.env.JWT_SECRET),
      global: true,
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
