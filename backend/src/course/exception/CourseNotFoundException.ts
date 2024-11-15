import { BaseException } from '../../common/exception/BaseException';
import { HttpStatus } from '@nestjs/common';

export class CourseNotFoundException extends BaseException {
  constructor(id: number) {
    super({
      code: 902,
      message: `id:${id} 코스가 존재하지 않거나 삭제되었습니다.`,
      status: HttpStatus.NOT_FOUND,
    });
  }
}
