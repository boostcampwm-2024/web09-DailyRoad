import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@src/common/exception/BaseException';

export class PlaceNotFoundException extends BaseException {
  constructor(id?: number) {
    const message = `${id && `[${id}]`} 장소가 존재하지 않습니다.`;
    super({
      code: 201,
      message,
      status: HttpStatus.NOT_FOUND,
    });
  }
}
