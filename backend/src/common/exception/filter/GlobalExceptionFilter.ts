import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseException } from '../BaseException';

@Catch(BaseException)
export class BaseExceptionFilter implements ExceptionFilter {
  catch(exception: BaseException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    return response.status(exception.getStatus()).json({
      code: exception.getCode(),
      message: exception.getMessage(),
    });
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const exceptionResponse = exception.getResponse();

    const errorMessage = this.isValidationError(exceptionResponse)
      ? (exceptionResponse as any).message.join(', ')
      : exception.message;

    return response.status(exception.getStatus()).json({
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
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.log(exception);
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: -1,
      message: 'Internal server error',
    });
  }
}
