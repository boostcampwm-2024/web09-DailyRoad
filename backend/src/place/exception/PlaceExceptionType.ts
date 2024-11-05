import { HttpStatus } from '@nestjs/common';

export const PlaceExceptionType = {
  ALREADY_EXISTS: {
    code: 1001,
    message: '이미 등록되어 있는 장소입니다.',
    status: HttpStatus.BAD_REQUEST,
  },

  SEARCH_NOT_FOUND: {
    code: 1002,
    message: '검색 결과가 없습니다.',
    status: HttpStatus.NO_CONTENT,
  },
};
