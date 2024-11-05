import { BaseException } from '../../common/exception/BaseException';
import { ExceptionType } from '../../common/exception/ExceptionType';

export class PlaceException extends BaseException {
  constructor(exceptionType: ExceptionType) {
    super(exceptionType);
  }
}
