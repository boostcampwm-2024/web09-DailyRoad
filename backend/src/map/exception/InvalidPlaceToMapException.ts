import { BaseException } from '../../common/exception/BaseException';
import { HttpStatus } from '@nestjs/common';

export class InvalidPlaceToMapException extends BaseException {
  constructor(invalidPlaceId: number) {
    super({
      code: 803,
      message: `존재하지 않는 장소를 지도에 추가할 수 없습니다. : ${invalidPlaceId}`,
      status: HttpStatus.BAD_REQUEST,
    });
  }
}
