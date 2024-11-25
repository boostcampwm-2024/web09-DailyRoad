import { BaseException } from '@src/common/exception/BaseException';
import { HttpStatus } from '@nestjs/common';

export class CloudFunctionsFetchException extends BaseException {
  constructor(error: Error) {
    super({
      code: 711,
      message: `Cloud function 과 Fetch 중 오류가 발생했습니다. : ${error.message}`,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
