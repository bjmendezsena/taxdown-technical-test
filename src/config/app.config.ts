import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import {
  ValidationException,
  PrismaClientExceptionFilter,
} from '@/shared/domain';
import { HttpExceptionFilter } from './exception.filter';
import { envs, isProduction } from './envs';
import { configureSwagger } from './swagger.config';

export function configureApp(app: NestExpressApplication): void {
  const configService = app.get(ConfigService);
  const logger = new Logger('ConfigApp');

  logger.log('Configuring app...');
  app.setGlobalPrefix(`${envs.API_PREFIX}/${envs.VERSION}`);
  const { httpAdapter } = app.get(HttpAdapterHost);
  logger.log('Configuring exception filters...');

  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        throw new ValidationException(errors);
      },
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  logger.log('Configuring middlewares...');
  // Middleware de seguridad
  app.use(helmet());

  // Configuración de CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN', '*'),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  if (!isProduction) {
    configureSwagger(app);
  }
}
