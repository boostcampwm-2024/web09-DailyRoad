import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@src/common/exception/BaseException';

export class AuthenticationException extends BaseException {
  constructor(message: string = '인증에 실패했습니다.') {
    super({
      code: 500,
      message: message,
      status: HttpStatus.UNAUTHORIZED,
    });
  }
}
