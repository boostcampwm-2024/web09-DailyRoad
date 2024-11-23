import { BaseException } from '@src/common/exception/BaseException';
import { HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends BaseException {
  constructor(id: number) {
    super({
      code: 803,
      message: `id:${id} 유저가 존재하지 않거나 삭제되었습니다.`,
      status: HttpStatus.NOT_FOUND,
    });
  }
}
