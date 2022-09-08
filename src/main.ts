import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getLogFormat, logLevel } from './logger/winston.config';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule } from 'nest-winston';
import * as winston from 'winston';

async function bootstrap() {
  const appOptions = {
    cors: true,
    bodyParser: true,
    //winstonLogger
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: logLevel(process.env.NODE_ENV),
          format: getLogFormat(process.env.NODE_ENV),
        }),
      ],
    }),
  };
  const app = await NestFactory.create(AppModule, appOptions);
  const configService = app.get(ConfigService);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const swaggerOptions = new DocumentBuilder()
    .setTitle(configService.get('SWAGGER_TITLE'))
    .setDescription('Blockchain API description')
    .setVersion('1.0')
    // .addTag('blockchain')
    // .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(configService.get('SWAGGER_PATH'), app, document);

  console.log(`${process.cwd()}/.env.${process.env.NODE_ENV}`);

  await app.listen(configService.get('APP_PORT'));
}

bootstrap();
