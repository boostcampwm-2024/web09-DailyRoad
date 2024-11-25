import { BaseException } from '@src/common/exception/BaseException';
import { HttpStatus } from '@nestjs/common';

export class PlaceNotFoundException extends BaseException {
  constructor(id?: number) {
    const message = id
      ? `id:${id} 장소가 존재하지 않습니다.`
      : '장소가 존재하지 않습니다.';
    super({
      code: 201,
      message,
      status: HttpStatus.NOT_FOUND,
    });
  }
}
