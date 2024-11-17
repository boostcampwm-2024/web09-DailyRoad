import { BaseException } from '@src/common/exception/BaseException';
import { HttpStatus } from '@nestjs/common';

export class AuthorizationException extends BaseException {
  constructor(message: string = '해당 작업에 대한 권한이 없습니다.') {
    super({
      code: 602,
      message: message,
      status: HttpStatus.FORBIDDEN,
    });
  }
}
