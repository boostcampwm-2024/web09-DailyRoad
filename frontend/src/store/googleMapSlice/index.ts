import { INITIAL_MAP_CONFIG } from '@/constants/map';
import { StateCreator } from 'zustand';
import { StoreState } from '@/types';
import {
  getGoogleMapClass,
  getPlaceClass,
  loadGoogleMapsApi,
} from '@/lib/googleMapsAPI-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import {
  clustererOptions,
  CustomMarkerClusterer,
} from '@/lib/CustomMarkerClusterer';

export type GoogleMapState = {
  googleMap: google.maps.Map | null;
  markerClusterer: MarkerClusterer | null;
  setGoogleMap: (map: google.maps.Map) => void;
  initializeMap: (container: HTMLElement) => void;
  moveTo: (lat: number, lng: number) => void;
  findPlaces: (query: string) => void;
  addMarker: (marker: google.maps.marker.AdvancedMarkerElement) => void;
  removeMarker: (marker: google.maps.marker.AdvancedMarkerElement) => void;
};

export const createGoogleMapSlice: StateCreator<
  StoreState,
  [],
  [],
  GoogleMapState
> = (set, get) => ({
  googleMap: null,
  markerClusterer: null,
  markerId: 1,
  setGoogleMap: (map: google.maps.Map) => set({ googleMap: map }),

  initializeMap: async (container: HTMLElement) => {
    await loadGoogleMapsApi();
    const GoogleMap = getGoogleMapClass();
    const map = new GoogleMap(container, INITIAL_MAP_CONFIG);
    const markerClusterer = new CustomMarkerClusterer({
      map,
      ...clustererOptions,
    });
    set({ googleMap: map, markerClusterer });
  },

  moveTo: (lat: number, lng: number) => {
    const map = get().googleMap;
    if (map) {
      map.panTo({ lat, lng });
      map.setZoom(18);
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
    const { markerClusterer } = get();
    markerClusterer?.addMarker(marker);
  },

  removeMarker: (marker: google.maps.marker.AdvancedMarkerElement) => {
    const { markerClusterer } = get();
    markerClusterer?.removeMarker(marker);
  },
});
