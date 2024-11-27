import { INITIAL_MAP_CONFIG } from '@/constants/map';
import { StateCreator } from 'zustand';
import { StoreState } from '@/types';
import {
  getGoogleMapClass,
  getPlaceClass,
  loadGoogleMapsApi,
} from '@/lib/googleMapsAPI-loader';

export type GoogleMapState = {
  googleMap: google.maps.Map | null;
  markers: Map<number, google.maps.marker.AdvancedMarkerElement>;
  markerId: number;
  setGoogleMap: (map: google.maps.Map) => void;
  initializeMap: (container: HTMLElement) => void;
  moveTo: (lat: number, lng: number) => void;
  findPlaces: (query: string) => void;
  addMarker: (marker: google.maps.marker.AdvancedMarkerElement) => void;
  deleteMarker: (markerId: number) => void;
};

export const createGoogleMapSlice: StateCreator<
  StoreState,
  [],
  [],
  GoogleMapState
> = (set, get) => ({
  googleMap: null,
  markers: new Map(),
  markerId: 1,

  setGoogleMap: (map: google.maps.Map) => set({ googleMap: map }),

  initializeMap: async (container: HTMLElement) => {
    await loadGoogleMapsApi();
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
    const request: google.maps.places.SearchByTextRequest = {
      textQuery: query,
      language: 'ko',
      region: 'KR',
      fields: ['location', 'displayName'],
      maxResultCount: 7,
    };
    const { places } = await Place.searchByText(request);
    return places;
  },

  addMarker: (marker: google.maps.marker.AdvancedMarkerElement) => {
    const { markers, markerId } = get();
    markers.set(markerId, marker);
    set({ markers, markerId: markerId + 1 });
  },

  deleteMarker: (markerId: number) => {
    const { markers } = get();
    markers.delete(markerId);
    set({ markers });
  },
});
