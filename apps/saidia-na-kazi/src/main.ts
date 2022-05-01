import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WinstonModule, utilities as WinstonUtilities } from 'nest-winston';
import * as express from 'express';
import * as winston from 'winston';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    cors: true,
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: 'debug',
          format: WinstonUtilities.format.nestLike('SaidiaNaKazi', {
            prettyPrint: true,
          }),
        }),
      ],
    }),
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle('Saidia na Kazi API')
    .setDescription('The Saidia na Kazi API description')
    .setVersion('1.0')
    .addTag('Saidia na Kazi')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3333;
  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
  Logger.log(
    `🚀 Swagger is running on: http://localhost:${port}/${globalPrefix}/docs`
  );
}

bootstrap();
