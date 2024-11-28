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
