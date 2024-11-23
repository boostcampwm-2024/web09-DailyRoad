import { ICONS } from '@/constants/icon';
import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';

type MarkerCustomProps = {
  onClick?: (e: google.maps.MapMouseEvent) => void;
  color?: string;
  category?: string;
  order?: number;
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

  const { onClick, category, color, order, ...markerOptions } = props;
  const contentDiv = document.createElement('div');
  useEffect(() => {
    if (!map) {
      return;
    }
    const categoryCode =
      categoryObj[(category as keyof typeof categoryObj) ?? '기본'];
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
    if (!marker) return;
    google.maps.event.addListener(marker, 'click', () => {
      console.log(1);
    });
    if (onClick) {
      google.maps.event.addListener(marker, 'click', () => {
        console.log(1);
      });
    }

    return () => {
      google.maps.event.clearInstanceListeners(marker);
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
