import { INITIAL_MAP_CONFIG } from '@/constants/map';
import { StateCreator } from 'zustand';
import { StoreState } from '@/types';
import {
  getGoogleMapClass,
  getMarkerClass,
  getPlaceClass,
} from '@/lib/googleMapsAPI-loader';

export type GoogleMapState = {
  googleMap: google.maps.Map | null;
  setGoogleMap: (map: google.maps.Map) => void;
  initializeMap: (container: HTMLElement) => void;
  moveTo: (lat: number, lng: number) => void;
  findPlaces: (query: string) => void;
};

export const createGoogleMapSlice: StateCreator<
  StoreState,
  [],
  [],
  GoogleMapState
> = (set, get) => ({
  googleMap: null,
  markerLibrary: null,
  googleMapLibary: null,

  setGoogleMap: (map: google.maps.Map) => set({ googleMap: map }),

  initializeMap: (container: HTMLElement) => {
    const GoogleMap = getGoogleMapClass();
    const map = new GoogleMap(container, INITIAL_MAP_CONFIG);
    set({ googleMap: map });
  },

  moveTo: (lat: number, lng: number) => {
    const map = get().googleMap;
    if (map) {
      map.panTo({ lat, lng });
      map.setZoom(14);
    }
  },

  findPlaces: async (query: string) => {
    if (!query) {
      return;
    }
    const Place = getPlaceClass();
    const AdvancedMarkerElement = getMarkerClass();
    const request: google.maps.places.SearchByTextRequest = {
      textQuery: query,
      language: 'ko',
      region: 'KR',
      fields: ['location', 'displayName'],
      maxResultCount: 7,
    };
    const { places } = await Place.searchByText(request);
    console.log(places);
  },
});
