import { BaseException } from '@src/common/exception/BaseException';
import { HttpStatus } from '@nestjs/common';

export class PlaceInMapNotFoundException extends BaseException {
  constructor(mapId: number, mapPlaceId: number) {
    super({
      code: 806,
      message: `[${mapId}] 지도에 [${mapPlaceId}] 장소가 존재하지 않거나 삭제되었습니다.`,
      status: HttpStatus.NOT_FOUND,
    });
  }
}
