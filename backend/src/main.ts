import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import {
  UnknownExceptionFilter,
  HttpExceptionFilter,
  BaseExceptionFilter,
} from './common/exception/filter/GlobalExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.use(cookieParser());

  app.useGlobalFilters(
    new UnknownExceptionFilter(app.get(Logger)),
    new HttpExceptionFilter(app.get(Logger)),
    new BaseExceptionFilter(app.get(Logger)),
  );

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(8080);
}

bootstrap();
