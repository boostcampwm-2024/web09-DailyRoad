import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@src/common/exception/BaseException';

export class PlaceAlreadyExistsException extends BaseException {
  constructor() {
    super({
      code: 203,
      message: '장소가 이미 존재합니다.',
      status: HttpStatus.CONFLICT,
    });
  }
}
