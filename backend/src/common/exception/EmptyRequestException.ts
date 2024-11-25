import { BaseException } from '@src/common/exception/BaseException';
import { HttpStatus } from '@nestjs/common';

export class EmptyRequestException extends BaseException {
  constructor(action: string = '작업') {
    super({
      code: 601,
      message: `${action}에 필요한 정보가 없습니다.`,
      status: HttpStatus.BAD_REQUEST,
    });
  }
}
