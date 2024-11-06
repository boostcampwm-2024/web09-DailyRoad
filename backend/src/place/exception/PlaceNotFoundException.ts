import { BaseException } from '../../common/exception/BaseException';
import { HttpStatus } from '@nestjs/common';

export class PlaceNotFoundException extends BaseException {
  constructor() {
    super({
      code: 1002,
      message: '해당 장소가 존재하지 않습니다.',
      status: HttpStatus.NO_CONTENT,
    });
  }
}
