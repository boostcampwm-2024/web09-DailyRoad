import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@src/common/exception/BaseException';

export class InvalidTokenException extends BaseException {
  constructor(message: string = '유효하지 않은 토큰입니다.') {
    super({
      code: 501,
      message: message,
      status: HttpStatus.UNAUTHORIZED,
    });
  }
}
