import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseException } from '../BaseException';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let code: number;
    let status: number;
    let message: string;

    if (exception instanceof BaseException) {
      code = exception.code;
      status = exception.getStatus();
      message = exception.message;
    } else if (exception instanceof HttpException) {
      code = 9999;
      status = exception.getStatus();
      message = exception.message;
    } else {
      code = -1;
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message =
        exception instanceof Error
          ? 'Internal server error: ' + exception.message
          : 'Internal server error';
    }

    response.status(status).json({
      code,
      message,
    });
  }
}
