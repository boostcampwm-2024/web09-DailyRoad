import { BaseException } from '@src/common/exception/BaseException';

export class UserNotFoundException extends BaseException {
  constructor(id: number) {
    super({
      code: 2001,
      message: `id:${id} 사용자를 찾을 수 없습니다.`,
      status: 404,
    });
  }
}
