import { Controller, Get } from '@nestjs/common';

@Controller('healthy')
export class HealthyController {
  @Get('ping')
  pong() {
    return 'pong';
  }
}
