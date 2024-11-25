import { BaseException } from '@src/common/exception/BaseException';
import { HttpStatus } from '@nestjs/common';

export class ExpiredTokenException extends BaseException {
  constructor(message: string = '만료된 토큰입니다.') {
    super({
      code: 502,
      message: message,
      status: HttpStatus.UNAUTHORIZED,
    });
  }
}
