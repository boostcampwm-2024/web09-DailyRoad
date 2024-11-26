import { BaseException } from '@src/common/exception/BaseException';

export class BannerNotFoundException extends BaseException {
  constructor(id: number) {
    super({
      code: 661,
      message: `[${id}] 배너가 존재하지 않습니다.`,
      status: 404,
    });
  }
}
