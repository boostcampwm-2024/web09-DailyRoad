import { BaseException } from '@src/common/exception/BaseException';

export class UserPermissionException extends BaseException {
  constructor(id: number) {
    super({
      code: 2001,
      message: `id:${id} 유저에 대한 권한이 없습니다.`,
      status: 403,
    });
  }
}
