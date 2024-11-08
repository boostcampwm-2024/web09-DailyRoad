import { useGoogleMapStore } from '@/store/googleMapState';
import { useEffect, useState } from 'react';

type MarkerEventProps = {
  onClick?: (e: google.maps.MapMouseEvent) => void;
};

export type MarkerProps = Omit<
  google.maps.marker.AdvancedMarkerElementOptions,
  'map'
> &
  MarkerEventProps;

export const useMarker = (props: MarkerProps) => {
  const [marker, setMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const map = useGoogleMapStore.getState().googleMap;

  const { onClick, ...markerOptions } = props;
  useEffect(() => {
    if (!map) {
      return;
    }

    const newMarker = new google.maps.marker.AdvancedMarkerElement(
      markerOptions,
    );
    newMarker.map = map;
    setMarker(newMarker);

    return () => {
      newMarker.map = null;
      setMarker(null);
    };
  }, [map]);

  useEffect(() => {
    if (!marker) return;

    const m = marker;

    const gme = google.maps.event;

    if (onClick) gme.addListener(m, 'click', onClick);

    return () => {
      gme.clearInstanceListeners(m);
    };
  }, [marker, onClick]);
  return marker;
};
