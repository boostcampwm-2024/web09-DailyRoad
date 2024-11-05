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

    if (exception instanceof BaseException) {
      return this.sendErrorResponse(
        response,
        exception.code,
        exception.getStatus(),
        exception.message,
      );
    }

    if (exception instanceof HttpException) {
      return this.sendErrorResponse(
        response,
        9999,
        exception.getStatus(),
        exception.message,
      );
    }

    return this.sendErrorResponse(
      response,
      -1,
      HttpStatus.INTERNAL_SERVER_ERROR,
      this.getDefaultErrorMessage(exception),
    );
  }

  private sendErrorResponse(
    response: Response,
    code: number,
    status: number,
    message: string,
  ) {
    response.status(status).json({ code, message });
  }

  private getDefaultErrorMessage(exception: unknown) {
    return exception instanceof Error
      ? 'Internal server error: ' + exception.message
      : 'Internal server error';
  }
}
