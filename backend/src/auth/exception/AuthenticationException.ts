import { BaseException } from '@src/common/exception/BaseException';
import { HttpStatus } from '@nestjs/common';

export class AuthenticationException extends BaseException {
  constructor(message: string = '인증에 실패했습니다.') {
    super({
      code: 601,
      message: message,
      status: HttpStatus.UNAUTHORIZED,
    });
  }
}
