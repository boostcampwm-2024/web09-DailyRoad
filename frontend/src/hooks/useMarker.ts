import { useEffect, useState } from 'react';

import { useStore } from '@/store/useStore';

import { CATEGORY_LIST, GOOGLE_ELEMENTS } from '@/constants/map';

type MarkerCustomProps = {
  onClick?: (e: google.maps.MapMouseEvent) => void;
  color?: string;
  category?: string;
  order?: number;
  title: string;
  description?: string;
  address?: string;
};

export type MarkerProps = Omit<
  google.maps.marker.AdvancedMarkerElementOptions,
  'map'
> &
  MarkerCustomProps;

export const useMarker = (props: MarkerProps) => {
  const [marker, setMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const map = useStore((state) => state.googleMap);
  const addMarker = useStore((state) => state.addMarker);
  const removeMarker = useStore((state) => state.removeMarker);
  const moveTo = useStore((state) => state.moveTo);

  const {
    onClick,
    category,
    color,
    order,
    title,
    description,
    address,
    ...markerOptions
  } = props;
  const { position } = markerOptions;

  const categoryCode =
    CATEGORY_LIST[(category as keyof typeof CATEGORY_LIST) ?? '기본'];

  const contentDiv = document.createElement('div');

  useEffect(() => {
    if (!map) {
      return;
    }

    contentDiv.innerHTML = order
      ? GOOGLE_ELEMENTS.COURSE_MARKER(order)
      : GOOGLE_ELEMENTS.MAP_MARKER(categoryCode, color?.toLocaleLowerCase());

    const newMarker = new google.maps.marker.AdvancedMarkerElement({
      ...markerOptions,
      content: contentDiv,
    });

    newMarker.map = map;
    setMarker(newMarker);
    addMarker(newMarker);

    return () => {
      setMarker(null);
      google.maps.event.clearInstanceListeners(newMarker);
      removeMarker(newMarker);
    };
  }, [map, order]);

  useEffect(() => {
    if (!marker || !map) return;

    const infoContent = GOOGLE_ELEMENTS.INFO_WINDOW(
      title,
      category,
      categoryCode,
      address ?? '',
      description ?? '',
    );

    const infoWindow = new google.maps.InfoWindow({
      content: infoContent,
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.close();
      infoWindow.open({ anchor: marker, map });
      moveTo(position?.lat as number, position?.lng as number);
    });

    google.maps.event.addListener(map, 'click', () => {
      infoWindow.close();
    });
  }, [marker, onClick]);
  return marker;
};
