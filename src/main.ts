import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { AllExceptionFilter } from 'common/filters/error-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    ...(process.env.LOGGING === 'false' ? { logger: false } : {}),
  });

  app.useGlobalFilters(new AllExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Cyber-Auth')
    .setDescription('Cyber-Auth API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, document);
  await app.listen(process.env.PORT);
}
bootstrap();
