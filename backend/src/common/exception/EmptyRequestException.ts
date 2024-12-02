import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@src/common/exception/BaseException';

export class EmptyRequestException extends BaseException {
  constructor() {
    super({
      code: 601,
      message: `작업에 필요한 정보가 없습니다.`,
      status: HttpStatus.BAD_REQUEST,
    });
  }
}
