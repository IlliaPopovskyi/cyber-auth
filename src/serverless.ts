import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { AllExceptionFilter } from 'common/filters/error-exception.filter';

import { configure as serverlessExpress } from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';

import { Pool } from 'pg';

let server: Handler;

const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: +process.env.DB_PORT,
  max: 1,
  min: 0,
  idleTimeoutMillis: 120000,
  connectionTimeoutMillis: 10000,
});

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
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();

  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  console.log('Tracing Handler: Initiating Handler');
  /*
  ADD IF DEPLOYED DB
  context.callbackWaitsForEmptyEventLoop = false;
  const client = await pool.connect();
  console.log('Tracing Handler: Pool of connection created');
  try {
    const response = await client.query('SELECT NOW()');
    console.log(
      'Tracing Handler: Query applied to check to DB without problems',
    );
  } catch (e) {
    console.log(
      `Tracing Handler: There was a problem with the query -> /n${e}`,
    );
  } finally {
    console.log('Tracing Handler: Doing the release, whatever it is');
    client.release();
  }
  */
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
