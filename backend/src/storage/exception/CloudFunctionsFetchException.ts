import { BaseException } from '../../common/exception/BaseException';
import { HttpStatus } from '@nestjs/common';

export class CloudFunctionsFetchException extends BaseException {
  constructor(error: Error) {
    super({
      code: 777,
      message: `cloud function 과 fetch 중 오류가 발생했습니다. : ${error.message}`,
      status: HttpStatus.CONFLICT,
    });
  }
}
