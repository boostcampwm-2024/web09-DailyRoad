import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const message =
      exception instanceof Error
        ? 'Internal server error: ' + exception.message
        : 'Internal server error';

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: -1,
      message,
    });
  }
}
