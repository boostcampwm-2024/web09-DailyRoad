import { useGoogleMapStore } from '@/store/googleMapState';

export const createMarkerInstance = (latitude: number, longitude: number) => {
  const googleMap = useGoogleMapStore.getState().googleMap;

  const markerInstance = new google.maps.marker.AdvancedMarkerElement({
    position: new google.maps.LatLng(latitude, longitude),
    map: googleMap,
  });

  return markerInstance;
};
