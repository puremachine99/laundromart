import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { AppModule } from './app.module';
import { AppConfig } from './common/config/config.types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });

  const config = app.get(ConfigService<AppConfig, true>);
  const appConfig = config.get('app', { infer: true });

  const logger = pino({
    level: appConfig.logLevel,
    transport:
      appConfig.env === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard'
            }
          }
        : undefined
  });

  app.use(
    pinoHttp({
      logger,
      customProps: () => ({
        service: appConfig.name
      })
    })
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      },
      forbidNonWhitelisted: true
    })
  );

  app.enableShutdownHooks();

  await app.listen(appConfig.port, '0.0.0.0');
  logger.info(`🚿 LaundroMart backend ready on port ${appConfig.port}`);
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Fatal bootstrap error', error);
  process.exit(1);
});
