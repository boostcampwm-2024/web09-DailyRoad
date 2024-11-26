export const INVALID_TOKEN_EXCEPTION = {
  statusCode: 401,
  message: '유효하지 않은 토큰입니다.',
};

export const EXPIRE_TOKEN_EXCEPTION = {
  statusCode: 401,
  message: '만료된 토큰입니다.',
};

export const EMPTY_TOKEN_EXCEPTION = {
  statusCode: 401,
  message: '토큰이 없습니다.',
};

export const MAP_NOT_FOUND_EXCEPTION = (id: number) => {
  return {
    statusCode: 404,
    message: `[${id}] 지도가 존재하지 않거나 삭제되었습니다.`,
  };
};

export const MAP_PERMISSION_EXCEPTION = (id: number) => {
  return {
    statusCode: 403,
    message: `[${id}] 지도에 대한 권한이 없습니다.`,
  };
};
