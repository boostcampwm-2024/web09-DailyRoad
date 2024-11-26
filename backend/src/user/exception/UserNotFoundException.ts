import { BaseException } from '@src/common/exception/BaseException';

export class UserNotFoundException extends BaseException {
  constructor(id: number) {
    super({
      code: 101,
      message: `[${id}] 사용자가 존재하지 않습니다.`,
      status: 404,
    });
  }
}
