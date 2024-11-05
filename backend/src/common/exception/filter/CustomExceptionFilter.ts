import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { BaseException } from '../BaseException';

@Catch(BaseException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: BaseException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(exception.getStatus()).json({
      code: exception.code,
      message: exception.message,
    });
  }
}
