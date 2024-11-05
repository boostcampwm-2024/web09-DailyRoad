import { BaseException } from '../../common/exception/BaseException';
import { HttpStatus } from '@nestjs/common';

export class PlaceAlreadyExistsException extends BaseException {
  constructor() {
    super({
      code: 1001,
      message: '장소가 이미 존재합니다.',
      status: HttpStatus.CONFLICT,
    });
  }
}
