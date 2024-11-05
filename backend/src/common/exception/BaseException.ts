import { HttpException } from '@nestjs/common';
import { ExceptionType } from './ExceptionType';

export class BaseException extends HttpException {
  readonly code: number;

  constructor(exceptionType: ExceptionType) {
    super(exceptionType.message, exceptionType.status);
    this.code = exceptionType.code;
  }
}
