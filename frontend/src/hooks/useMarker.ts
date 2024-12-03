import { useStore } from '@/store/useStore';
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

    contentDiv.innerHTML = order
      ? `
      <svg width="36" height="36" viewBox="0 0 61 74" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.86668 52.3259C-2.95556 40.3556 -2.95556 20.948 8.86668 8.97771C20.6889 -2.99257 39.8565 -2.99257 51.6788 8.97771C63.501 20.948 63.501 40.3556 51.6788 52.3259L30.2727 74L8.86668 52.3259Z" fill="#00A3FF"/>
<circle cx="30.3031" cy="30.1928" r="18.8988" fill="white"/>
<text x=30 y=40 font-size=25 text-anchor="middle" fill="#00A3FF" font-weight="bold">${order}</text> 
</svg>
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
      setMarker(null);
      google.maps.event.clearInstanceListeners(newMarker);
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
