import { ICONS } from '@/constants/icon';
import { useStore } from '@/store/useStore';
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
  const map = useStore((state) => state.googleMap);

  const { onClick, ...markerOptions } = props;
  useEffect(() => {
    if (!map) {
      return;
    }
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = ICONS.RED_PIN();
    contentDiv.style.borderRadius = '50%';
    contentDiv.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
    const newMarker = new google.maps.marker.AdvancedMarkerElement({
      ...markerOptions,
      content: contentDiv,
    });
    newMarker.map = map;
    setMarker(newMarker);

    return () => {
      newMarker.map = null;
      setMarker(null);
    };
  }, [map]);

  useEffect(() => {
    if (!marker) return;

    if (onClick) {
      google.maps.event.addListener(marker, 'click', onClick);
    }

    return () => {
      google.maps.event.clearInstanceListeners(marker);
    };
  }, [marker, onClick]);
  return marker;
};
