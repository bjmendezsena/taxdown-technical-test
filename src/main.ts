import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { envs, configureApp, isProduction, appConfig } from 'config';

async function bootstrap() {
  const logger = new Logger('Main');

  logger.log('Starting up...');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  configureApp(app);

  await app.listen(envs.PORT, '0.0.0.0');

  logger.log(`Application listening on port ${envs.PORT}`);

  if (!isProduction) {
    logger.log(
      `Swagger documentation is available at ${await app.getUrl()}${appConfig.endpoint}`,
    );
  }
}

bootstrap().catch((error) => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
