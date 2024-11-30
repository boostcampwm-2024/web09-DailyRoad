import { INITIAL_MAP_CONFIG } from '@/constants/map';
import { StateCreator } from 'zustand';
import { StoreState } from '@/types';
import {
  getGoogleMapClass,
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
  markers: google.maps.marker.AdvancedMarkerElement[];
  setGoogleMap: (map: google.maps.Map) => void;
  initializeMap: (container: HTMLElement) => void;
  moveTo: (lat: number, lng: number) => void;
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
  markers: [],
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
      map.setZoom(17);
    }
  },

  addMarker: (marker: google.maps.marker.AdvancedMarkerElement) => {
    const { markerClusterer, markers } = get();
    markerClusterer?.addMarker(marker);
    set({ markers: [...markers, marker] });
  },

  removeMarker: (marker: google.maps.marker.AdvancedMarkerElement) => {
    const { markerClusterer, markers } = get();
    markerClusterer?.removeMarker(marker);
    set({ markers: markers.filter((m) => m !== marker) });
  },
});
