import { BaseException } from '../../common/exception/BaseException';
import { HttpStatus } from '@nestjs/common';

export class PlaceNotFoundException extends BaseException {
  constructor() {
    super({
      code: 1002,
      message: '검색 결과가 없습니다.',
      status: HttpStatus.NO_CONTENT,
    });
  }
}
