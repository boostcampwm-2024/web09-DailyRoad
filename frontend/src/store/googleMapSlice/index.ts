import { Loader } from '@googlemaps/js-api-loader';
import { INITIAL_MAP_CONFIG } from '@/constants/map';
import { StateCreator } from 'zustand';
import { StoreState } from '@/types';

export type GoogleMapState = {
  googleMap: google.maps.Map | null;
  markerLibrary: google.maps.MarkerLibrary | null;
  setGoogleMap: (map: google.maps.Map) => void;
  initializeMap: (container: HTMLElement) => void;
  moveTo: (lat: number, lng: number) => void;
};

export const createGoogleMapSlice: StateCreator<
  StoreState,
  [],
  [],
  GoogleMapState
> = (set, get) => ({
  googleMap: null,
  markerLibrary: null,

  setGoogleMap: (map: google.maps.Map) => set({ googleMap: map }),

  initializeMap: async (container: HTMLElement) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error('Google Maps API 키가 설정되지 않았습니다.');
    }
    const loader = new Loader({
      apiKey: apiKey,
      version: '3.58',
    });

    try {
      await loader.load();

      const { Map: GoogleMap } = (await google.maps.importLibrary(
        'maps',
      )) as google.maps.MapsLibrary;

      const markerLibrary = (await google.maps.importLibrary(
        'marker',
      )) as google.maps.MarkerLibrary;

      const map = new GoogleMap(container, INITIAL_MAP_CONFIG);
      set({ googleMap: map, markerLibrary });
    } catch (error) {
      throw new Error('Failed to load Google Maps API');
    }
  },

  moveTo: (lat: number, lng: number) => {
    const map = get().googleMap;
    if (map) {
      map.panTo({ lat, lng });
      map.setZoom(14);
    }
  },
});
