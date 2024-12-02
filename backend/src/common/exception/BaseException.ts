import { HttpException } from '@nestjs/common';
import { ExceptionType } from './type';

export class BaseException extends HttpException {
  readonly code: number;

  constructor(
    readonly exceptionType: ExceptionType,
    readonly error?: Error,
  ) {
    super(exceptionType.message, exceptionType.status);
    this.code = exceptionType.code;
  }

  getCode(): string {
    return `E${this.code}`;
  }

  getMessage(): string {
    return this.message;
  }
}
