import { BaseException } from '@src/common/exception/BaseException';
import { HttpStatus } from '@nestjs/common';

export class ConsecutivePlaceException extends BaseException {
  constructor() {
    super({
      code: 405,
      message: '동일한 장소는 연속된 순서로 추가할 수 없습니다.',
      status: HttpStatus.BAD_REQUEST,
    });
  }
}
