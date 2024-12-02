import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@src/common/exception/BaseException';

export class InvalidPlaceToMapException extends BaseException {
  constructor(invalidPlaceId: number) {
    super({
      code: 304,
      message: `존재하지 않는 장소를 지도에 추가할 수 없습니다. : ${invalidPlaceId}`,
      status: HttpStatus.BAD_REQUEST,
    });
  }
}
