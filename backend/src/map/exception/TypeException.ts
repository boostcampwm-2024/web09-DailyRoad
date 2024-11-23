import { BaseException } from '@src/common/exception/BaseException';
import { HttpStatus } from '@nestjs/common';

export class TypeException extends BaseException {
  constructor(where: string, toType: string, currentType: string) {
    super({
      code: 804,
      message: `${where} must be ${toType} not ${currentType}.`,
      status: HttpStatus.BAD_REQUEST,
    });
  }
}
