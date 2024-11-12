const PROD = import.meta.env.PROD;

export const AXIOS_BASE_URL = PROD
  ? `${window.location.protocol}//${import.meta.env.VITE_AXIOS_PROD_BASE_URL}`
  : import.meta.env.VITE_AXIOS_DEV_BASE_URL || '/';

export const NETWORK = {
  RETRY_COUNT: 2,
  TIMEOUT: 10000,
} as const;

export const END_POINTS = {
  MAPS: '/maps',
  MAP: (mapId: number) => `/maps/${mapId}`,
  COURSES: '/coures',
  COURSE: (courseId: number) => `/coures/${courseId}`,
  GOOGLE_LOGIN: '/oauth/google/signIn',
  MY_MAP: '/maps/my',
  PLACE: '/places',
  IMAGES: '/images',
  PRE_SIGNED_POST: '/storage/preSignedPost',
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
