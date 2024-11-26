import { BaseException } from '@src/common/exception/BaseException';
import { HttpStatus } from '@nestjs/common';

export class ElasticSearchSaveException extends BaseException {
  constructor(id?: number, error?: Error) {
    const message = `${id && `[${id}]`} ElasticSearch 데이터를 저장하는데 실패했습니다.`;
    super(
      {
        code: 3001,
        message,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      },
      error,
    );
  }
}
