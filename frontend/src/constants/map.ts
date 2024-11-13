const INITIAL_CENTER = {
  lat: 37.5,
  lng: 127.0,
};
const INITIAL_ZOOM_LEVEL = 16;

export const INITIAL_MAP_CONFIG = {
  center: INITIAL_CENTER,
  zoom: INITIAL_ZOOM_LEVEL,
  disableDefaultUI: true,
  mapId: import.meta.env.VITE_GOOGLE_MAPS_ID,
  clickableIcons: false,
  minZoom: 10,
  maxZoom: 18,
  gestureHandling: 'greedy',
  restriction: {
    latLngBounds: {
      north: 39,
      south: 32,
      east: 132,
      west: 124,
    },
    strictBounds: true,
  },
};

export const VISIBILITY_TEXTS = {
  title: '공개 범위',
  description: '공개 여부를 선택해주세요',
  public: {
    label: '공개',
    description: '나의 지도를 다른 사람들과 공유할 수 있습니다.',
  },
  private: {
    label: '비공개',
    description: '나의 지도를 나만 볼 수 있습니다.',
  },
} as const;
