import { BaseException } from '@src/common/exception/BaseException';
import { HttpStatus } from '@nestjs/common';

export class InvalidPlaceToCourseException extends BaseException {
  constructor(invalidPlaceIds: number[]) {
    super({
      code: 404,
      message: `존재하지 않는 장소를 코스에 추가할 수 없습니다. : ${invalidPlaceIds.join(', ')}`,
      status: HttpStatus.BAD_REQUEST,
    });
  }
}
