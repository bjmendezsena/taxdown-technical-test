import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { envs } from './envs';

export function configureSwagger(app: NestExpressApplication): void {
  const config = new DocumentBuilder()
    .setTitle(swaggerConfig.swaggerConfig.title)
    .setDescription(swaggerConfig.swaggerConfig.description)
    .setVersion(envs.VERSION)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(swaggerConfig.endpoint, app, document, {
    customSiteTitle: swaggerConfig.swaggerConfig.title,
  });

  // Deshabilitar CSP para Swagger UI
  app.use(swaggerConfig.endpoint, (req, res, next) => {
    helmet({
      contentSecurityPolicy: false,
    })(req, res, next);
  });
}

export const swaggerConfig = {
  endpoint: `/${envs.API_PREFIX}/${envs.VERSION}/docs`,
  swaggerConfig: {
    title: 'Taxdawn Api Documentation',
    description: 'This is the technical test of API documentation for Taxdawn',
  },
} as const;
