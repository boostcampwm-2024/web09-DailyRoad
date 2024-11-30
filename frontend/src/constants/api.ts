const PROD = import.meta.env.PROD;

export const AXIOS_BASE_URL = PROD
  ? import.meta.env.VITE_AXIOS_PROD_BASE_URL
  : import.meta.env.VITE_AXIOS_DEV_BASE_URL || '/';

export const NETWORK = {
  RETRY_COUNT: 2,
  TIMEOUT: 10000,
} as const;

export const END_POINTS = {
  MAPS: '/maps',
  MAP: (mapId: number) => `/maps/${mapId}`,
  ADD_PLACE_TO_MAP: (mapId: number) => `/maps/${mapId}/places`,
  EDIT_MAP_INFO: (mapId: number) => `/maps/${mapId}/info`,
  EDIT_MAP_VISIBILITY: (mapId: number) => `/maps/${mapId}/visibility`,
  DELETE_PLACE_TO_MAP: (mapId: number, placeId: number) =>
    `/maps/${mapId}/places/${placeId}`,

  COURSES: '/courses',
  COURSE: (courseId: number) => `/courses/${courseId}`,
  PUT_PLACE_TO_COURSE: (courseId: number) => `/courses/${courseId}/places`,
  EDIT_COURSE_INFO: (courseId: number) => `/courses/${courseId}/info`,
  EDIT_COURSE_VISIBILITY: (courseId: number) =>
    `/courses/${courseId}/visibility`,
  DELETE_PLACE_TO_COURSE: (courseId: number, placeId: number) =>
    `/courses/${courseId}/places/${placeId}`,
  GOOGLE_PLACE_SEARCH: '/places/search',
  GOOGLE_LOGIN: '/oauth/google/signIn',
  GOOGLE_REDIRECT_URI: '/oauth/google/signIn',
  LOGOUT: 'oauth/signOut',
  MY_MAP: '/maps/my',
  MY_COURSE: '/courses/my',
  PLACE: '/search/place',
  IMAGES: '/images',
  PRE_SIGNED_POST: '/storage/preSignedPost',
  USER_INFO: '/users/info',
  TOKEN_REFRESH: 'oauth/refresh',
};

export const IMAGE_EXTENSIONS = new Set([
  'jpg',
  'jpeg',
  'png',
  'gif',
  'bmp',
  'tiff',
  'tif',
  'webp',
  'svg',
  'heic',
  'raw',
  'cr2',
  'nef',
  'arw',
  'dng',
  'ico',
]);

export const THREE_MB = 3145728;
export const IMAGE_WIDTH = 1200;
export const IMAGE_HEIGHT = 900;

export const USER_ERROR_MESSAGE = {
  E500: '인증 정보가 올바르지 않습니다. 다시 시도해 주세요.',
  E501: '로그인 정보가 유효하지 않습니다. 새로 로그인해 주세요.',
  E502: '로그인 세션이 만료되었습니다. 다시 로그인해 주세요.',
  E510: '권한이 없습니다. 관리자에게 문의하세요.',
  E601: '필수 입력값이 누락되었습니다. 입력을 확인해 주세요.',
  E661: '요청하신 배너를 찾을 수 없습니다.',
  E401: '해당 코스를 찾을 수 없습니다.',
  E402: '코스에 요청한 장소가 포함되지 않았습니다.',
  E404: '추가하려는 장소가 올바르지 않습니다. 다시 확인해 주세요.',
  E405: '장소 순서가 올바르지 않습니다. 다시 시도해 주세요.',
  E406: '해당 코스를 수정할 권한이 없습니다.',
  E301: '해당 지도를 찾을 수 없습니다.',
  E302: '지도의 요청한 장소를 찾을 수 없습니다.',
  E303: '해당 장소가 이미 존재합니다.',
  E304: '유효하지 않은 지도입니다. 다시 확인해 주세요.',
  E201: '요청한 장소를 찾을 수 없습니다.',
};
