import { Module } from '@nestjs/common';
import { HealthyController } from './healthy.controller';

@Module({
  controllers: [HealthyController]
})
export class HealthyModule {}
