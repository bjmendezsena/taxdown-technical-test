import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import {
  ValidationException,
  PrismaClientExceptionFilter,
} from '@/shared/domain';
import { HttpExceptionFilter } from './exception.filter';
import { envs, isProduction } from './envs';

export function configureApp(app: NestExpressApplication): void {
  const configService = app.get(ConfigService);

  app.setGlobalPrefix(`${envs.API_PREFIX}/${envs.VERSION}`);
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

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

  // Middleware de seguridad
  app.use(helmet());

  // Configuración de CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN', '*'),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle(appConfig.swaggerConfig.title)
      .setDescription(appConfig.swaggerConfig.description)
      .setVersion(envs.VERSION)
      .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);

    SwaggerModule.setup(appConfig.endpoint, app, documentFactory, {
      customSiteTitle: appConfig.swaggerConfig.title,
    });

    // Deshabilitar CSP para Swagger UI
    app.use(appConfig.endpoint, (req, res, next) => {
      helmet({
        contentSecurityPolicy: false,
      })(req, res, next);
    });
  }
}

export const appConfig = {
  endpoint: `/${envs.API_PREFIX}/${envs.VERSION}/docs`,
  swaggerConfig: {
    title: 'Taxdawn Api Documentation',
    description: 'This is the technical test of API documentation for Taxdawn',
  },
} as const;
