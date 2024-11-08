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
