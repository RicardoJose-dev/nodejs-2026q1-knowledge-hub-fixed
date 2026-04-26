import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CustomLogger } from './comment/logger/logger.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { GlobalExceptionsFilter } from './common/filters/global.exceptions.filter';

const port = process.env.PORT || 4000;

async function bootstrap() {
  const logLevel = (process.env.LOG_LEVEL as any) || 'log';
  const isProduction = process.env.NODE_ENV === 'production';
  const processLevelLogger = new CustomLogger('error', isProduction);

  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(logLevel, isProduction),
  });

  app.useGlobalFilters(new GlobalExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Knowledge Hub')
    .setDescription('API documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  await app.listen(port);

  async function gracefulShutdown(error: any) {
    processLevelLogger.error(
      'Shutting down due to an unhandled error:',
      error?.stack || error,
    );

    await app.close();
    process.exit(1);
  }

  process.on('uncaughtException', gracefulShutdown);
  process.on('unhandledRejection', gracefulShutdown);
}
bootstrap();
