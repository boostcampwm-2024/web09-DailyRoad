import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import {
  BaseExceptionFilter,
  HttpExceptionFilter,
  UnknownExceptionFilter,
} from './common/exception/filter/GlobalExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.useGlobalFilters(
    new UnknownExceptionFilter(),
    new HttpExceptionFilter(),
    new BaseExceptionFilter(),
  );
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(8080);
}

bootstrap();
