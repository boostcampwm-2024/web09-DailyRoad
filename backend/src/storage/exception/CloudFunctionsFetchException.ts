import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@src/common/exception/BaseException';

export class CloudFunctionsFetchException extends BaseException {
  constructor(error: Error) {
    super(
      {
        code: 711,
        message: `Cloud function 통신 중 오류가 발생했습니다.`,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      },
      error,
    );
  }
}
