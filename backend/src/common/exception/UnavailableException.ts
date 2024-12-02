import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@src/common/exception/BaseException';

export class UnavailableException extends BaseException {
  constructor(environment: string) {
    super({
      code: 901,
      message: `현재는 지원하지 않는 서비스입니다. [${environment} 환경]`,

      status: HttpStatus.SERVICE_UNAVAILABLE,
    });
  }
}
