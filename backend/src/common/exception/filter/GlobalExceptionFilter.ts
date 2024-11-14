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
    logException(this.logger, exception.getMessage(), status);

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
    logException(this.logger, errorMessage, status);

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

function logException(logger: PinoLogger, message: string, status: number) {
  const WARN = 400;
  const ERROR = 500;

  if (status < WARN) return;
  void (status < ERROR
    ? logger.warn(`${message}`)
    : logger.error(`${message}`));
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
