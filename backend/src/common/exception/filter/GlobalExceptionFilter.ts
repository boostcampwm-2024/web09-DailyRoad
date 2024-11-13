import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseException } from '../BaseException';
import { PinoLogger } from 'nestjs-pino';

@Catch(BaseException)
export class BaseExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {}

  catch(exception: BaseException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    if (status >= 400 && status < 500) {
      this.logger.warn(`${exception.getMessage()}`);
    } else if (status >= 500) {
      this.logger.error(`${exception.getMessage()}`);
    }

    return response.status(status).json({
      code: exception.getCode(),
      message: exception.getMessage(),
    });
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const exceptionResponse = exception.getResponse();

    const errorMessage = this.isValidationError(exceptionResponse)
      ? (exceptionResponse as any).message.join(', ')
      : exception.message;

    const status = exception.getStatus();
    if (status >= 400 && status < 500) {
      this.logger.warn(`${errorMessage}`);
    } else if (status >= 500) {
      this.logger.error(`${errorMessage}`);
    }

    return response.status(status).json({
      code: 9999,
      message: errorMessage,
    });
  }

  private isValidationError(exceptionResponse: unknown): boolean {
    return (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse &&
      Array.isArray((exceptionResponse as any).message)
    );
  }
}

@Catch()
export class UnknownExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.logger.error(`Unexpected exception occurred : ${exception}`);
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: -1,
      message: 'Internal server error',
    });
  }
}
