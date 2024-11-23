import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';

export const usePoyline = (
  path: google.maps.LatLngLiteral[],
  color: string,
) => {
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);
  const map = useStore((state) => state.googleMap);

  useEffect(() => {
    if (!map) {
      return;
    }
    const newPolyline = new google.maps.Polyline({
      path,
      strokeColor: color,
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });
    newPolyline.setMap(map);
    setPolyline(newPolyline);
    console.log('polyline', newPolyline);
    return () => {
      newPolyline.setMap(null);
      setPolyline(null);
    };
  }, [map, path]);

  return polyline;
};
