import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';

export const usePoyline = (path: google.maps.LatLngLiteral[]) => {
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);
  const map = useStore((state) => state.googleMap);

  useEffect(() => {
    if (!map) {
      return;
    }
    const lineSymbol = {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    };
    const newPolyline = new google.maps.Polyline({
      path,
      strokeColor: '#00000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
      icons: [
        {
          icon: lineSymbol,
          offset: '100%',
        },
      ],
    });

    newPolyline.setMap(map);
    setPolyline(newPolyline);

    return () => {
      newPolyline.setMap(null);
      setPolyline(null);
    };
  }, [map, path]);

  return polyline;
};
