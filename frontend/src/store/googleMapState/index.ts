import { create } from 'zustand';
import { Loader } from '@googlemaps/js-api-loader';
import { INITIAL_MAP_CONFIG } from '@/constants/map';

type GoogleMapState = {
  googleMap: google.maps.Map | null;
  setGoogleMap: (map: google.maps.Map) => void;
  initializeMap: (container: HTMLElement) => void;
  markerLibrary: google.maps.MarkerLibrary | null;
  moveTo: (lat: number, lng: number) => void;
};

export const useGoogleMapStore = create<GoogleMapState>((set, get) => ({
  googleMap: null,
  markerLibrary: null,
  setGoogleMap: (map: google.maps.Map) => set({ googleMap: map }),

  initializeMap: async (container: HTMLElement) => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
      version: '3.58',
    });

    await loader.load();
    const { Map } = (await google.maps.importLibrary(
      'maps',
    )) as google.maps.MapsLibrary;
    const markerLibrary = (await google.maps.importLibrary(
      'marker',
    )) as google.maps.MarkerLibrary;
    const map = new Map(container, INITIAL_MAP_CONFIG);

    set({ googleMap: map, markerLibrary });
  },

  moveTo: (lat: number, lng: number) => {
    const map = get().googleMap;
    if (map) {
      map.panTo({ lat, lng });
      map.setZoom(14);
    }
  },
}));
