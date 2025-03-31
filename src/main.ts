import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { envs, configureApp, isProduction, swaggerConfig } from '@/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Main');

  logger.log('Starting up...');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  configureApp(app);

  await app.listen(envs.PORT, '0.0.0.0');

  logger.log(`Application listening on port ${envs.PORT}`);

  if (!isProduction) {
    logger.log(
      `Swagger documentation is available at ${await app.getUrl()}${swaggerConfig.endpoint}`,
    );
  }
}

bootstrap().catch((error) => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
