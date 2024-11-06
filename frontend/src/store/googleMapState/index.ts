import { create } from 'zustand';
import { Loader } from '@googlemaps/js-api-loader';

type GoogleMapState = {
  googleMap: google.maps.Map | null;
  setGoogleMap: (map: google.maps.Map) => void;
  initializeMap: (container: HTMLElement) => void;
};

export const INITIAL_CENTER = {
  lat: 37.5,
  lng: 127.0,
};
export const INITIAL_ZOOM_LEVEL = 16;

export const useGoogleMapStore = create<GoogleMapState>((set) => ({
  googleMap: null,
  setGoogleMap: (map: google.maps.Map) => set({ googleMap: map }),

  initializeMap: async (container: HTMLElement) => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
      version: '3.49',
    });

    await Promise.all([
      loader.importLibrary('maps'),
      loader.importLibrary('places'),
    ]);

    const map = new google.maps.Map(container, {
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

    set({ googleMap: map });
  },
}));
