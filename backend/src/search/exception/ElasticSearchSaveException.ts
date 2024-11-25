import { BaseException } from '@src/common/exception/BaseException';
import { HttpStatus } from '@nestjs/common';

export class ElasticSearchException extends BaseException {
  constructor(id?: number) {
    const message = id
      ? `id:${id} ElasticSearch에 데이터를 저장하는데 실패했습니다.`
      : 'ElasticSearch에 데이터를 저장하는데 실패했습니다.';
    super({
      code: 1003,
      message,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
