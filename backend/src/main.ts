import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { Logger, PinoLogger } from 'nestjs-pino';
import {
  UnknownExceptionFilter,
  HttpExceptionFilter,
  BaseExceptionFilter,
} from './common/exception/filter/GlobalExceptionFilter';
import { initializeTransactionalContext } from 'typeorm-transactional';

process.env.NODE_ENV =
  process.env.NODE_ENV && process.env.NODE_ENV.trim().toLowerCase() === 'prod'
    ? 'prod'
    : 'develop';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(Logger);

  app.useLogger(logger);
  app.use(cookieParser());
  app.useGlobalFilters(
    new UnknownExceptionFilter(logger as unknown as PinoLogger),
    new HttpExceptionFilter(logger as unknown as PinoLogger),
    new BaseExceptionFilter(logger as unknown as PinoLogger),
  );

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  process.on('unhandledRejection', (reason, promise) => {
    // 버그 원인 파악시까지 컨테이너 로그에도 남기기 위해 console.error 사용
    console.error('Unhandled Rejection at:', { promise, reason });
    logger.error('Unhandled Rejection at:', { promise, reason });
  });

  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    logger.error('Uncaught Exception:', err);
  });

  await app.listen(8080);
}

bootstrap();
