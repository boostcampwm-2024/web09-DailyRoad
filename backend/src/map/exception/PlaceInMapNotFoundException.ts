import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@src/common/exception/BaseException';

export class PlaceInMapNotFoundException extends BaseException {
  constructor(mapId: number, mapPlaceId: number) {
    super({
      code: 302,
      message: `[${mapId}] 지도에 [${mapPlaceId}] 장소가 존재하지 않거나 삭제되었습니다.`,
      status: HttpStatus.NOT_FOUND,
    });
  }
}
