import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@src/common/exception/BaseException';

export class DuplicatePlaceToMapException extends BaseException {
  constructor(id: number) {
    super({
      code: 303,
      message: '이미 지도에 존재하는 장소입니다. : ' + id,
      status: HttpStatus.CONFLICT,
    });
  }
}
