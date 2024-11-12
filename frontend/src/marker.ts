import { useStore } from '@/store/useStore';

export const createMarkerInstance = (latitude: number, longitude: number) => {
  const googleMap = useStore.getState().googleMap;

  const markerInstance = new google.maps.marker.AdvancedMarkerElement({
    position: new google.maps.LatLng(latitude, longitude),
    map: googleMap,
  });

  return markerInstance;
};
