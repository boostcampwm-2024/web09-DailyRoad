import { useStore } from '@/store/useStore';
import { add } from 'lodash';
import { useEffect, useState } from 'react';

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
    categoryObj[(category as keyof typeof categoryObj) ?? '기본'];

  const contentDiv = document.createElement('div');

  useEffect(() => {
    if (!map) {
      return;
    }

    console.log(categoryCode, color);
    contentDiv.innerHTML = order
      ? `
    <div style="background: white; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: black; transform: translate(0, -4px);">${order}</div>
    `
      : `<img width='36' height='36' src="https://kr.object.ncloudstorage.com/ogil-public/uploads/marker/${categoryCode ?? 'pin'}_${color?.toLocaleLowerCase() ?? 'default'}.png" style="filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.5));"/>`;

    const newMarker = new google.maps.marker.AdvancedMarkerElement({
      ...markerOptions,
      content: contentDiv,
    });

    newMarker.map = map;
    setMarker(newMarker);
    addMarker(newMarker);

    return () => {
      newMarker.map = null;
      setMarker(null);
      removeMarker(newMarker);
    };
  }, [map, order]);

  useEffect(() => {
    if (!marker || !map) return;

    const infoContent = `<div style="font-family: Pretendard, ui-sans-serif, system-ui;">
    <div style="display:flex; justify-content:space-between; gap:0.25rem; align-items: center;">
        <p>${title}</p>
        </div>
        <p class="${categoryCode} badge">${category ?? '장소'}</p>  
        <p>${address}</p>
        <p>${description}</p>
  </div>`;

    const infoWindow = new google.maps.InfoWindow({
      content: infoContent,
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open({ anchor: marker, map });
      moveTo(position?.lat as number, position?.lng as number);
    });
    google.maps.event.addListener(map, 'click', () => {
      infoWindow.close();
    });

    return () => {
      google.maps.event.clearInstanceListeners(marker);
      google.maps.event.clearInstanceListeners(map);
    };
  }, [marker, onClick]);
  return marker;
};

const categoryObj = {
  명소: 'camera',
  맛집: 'restaurant',
  카페: 'cafe',
  기본: 'pin',
  숙소: 'pin',
};
