import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';

type MarkerCustomProps = {
  onClick?: (e: google.maps.MapMouseEvent) => void;
  color?: string;
  category?: string;
  order?: number;
  title: string;
  description?: string;
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

  const {
    onClick,
    category,
    color,
    order,
    title,
    description,
    ...markerOptions
  } = props;

  const categoryCode =
    categoryObj[(category as keyof typeof categoryObj) ?? '기본'];

  const contentDiv = document.createElement('div');

  useEffect(() => {
    if (!map) {
      return;
    }

    console.log(color?.toLocaleLowerCase(), category);
    console.log(categoryCode ?? 'pin', color?.toLocaleLowerCase() ?? 'defualt');
    contentDiv.innerHTML = order
      ? `
    <div style="background: white; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: black;">${order}</div>
    `
      : `<img width='36' height='36' src=https://kr.object.ncloudstorage.com/ogil-public/uploads/marker/${categoryCode ?? 'pin'}_${color?.toLocaleLowerCase() ?? 'default'}.png />`;

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
    if (!marker || !map) return;

    const infoContent = `<div style="font-family: Pretendard, ui-sans-serif, system-ui;">
    <div style="display:flex; justify-content:space-between; gap:0.25rem; align-items: center;">
        <p>${title}</p>
        <p class="${categoryCode} badge">${category ?? '장소'}</p>  
        <p>${description}</p>
  </div>
  </div>`;

    const infoWindow = new google.maps.InfoWindow({
      content: infoContent,
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open({ anchor: marker, map });
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
};
