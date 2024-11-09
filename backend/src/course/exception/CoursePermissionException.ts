import { BaseException } from '../../common/exception/BaseException';
import { HttpStatus } from '@nestjs/common';

export class CoursePermissionException extends BaseException {
  constructor(id: number) {
    super({
      code: 903,
      message: `id:${id} 코스에 대한 권한이 없습니다.`,
      status: HttpStatus.FORBIDDEN,
    });
  }
}
