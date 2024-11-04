import { create } from 'zustand';

type GoogleMapState = {
  googleMap: google.maps.Map | null;
  setGoogleMap: (map: google.maps.Map) => void;
};

export const useGoogleMapStore = create<GoogleMapState>()((set) => ({
  googleMap: null,
  setGoogleMap: (map: google.maps.Map) => set({ googleMap: map }),
}));

export const INITIAL_CENTER = {
  lat: 37.5,
  lng: 127.0,
};
export const INITIAL_ZOOM_LEVEL = 16;

const initializeGoogleMap = (): google.maps.Map => {
  const container = document.createElement('div');
  container.id = 'map';
  container.style.minHeight = '100vh';
  document.body.appendChild(container);

  return new window.google.maps.Map(container, {
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
  });
};

export const getGoogleMapStore = (() => {
  let googleMap: google.maps.Map;

  return () => {
    const state = useGoogleMapStore.getState();
    googleMap = state.googleMap!;
    if (!googleMap) {
      googleMap = initializeGoogleMap();
      useGoogleMapStore.getState().setGoogleMap(googleMap);
    }

    return googleMap;
  };
})();
