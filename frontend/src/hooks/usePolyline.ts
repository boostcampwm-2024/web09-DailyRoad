import { useStore } from '@/store/useStore';
import { useEffect, useMemo, useState } from 'react';

const POLYLINE_CONFIG = {
  strokeColor: '#00A3FF',
  strokeOpacity: 1.0,
  strokeWeight: 3,
};

export const usePolyline = (path: google.maps.LatLngLiteral[]) => {
  const [polyline, setPolyline] = useState<google.maps.Polyline[] | null>(null);
  const map = useStore((state) => state.googleMap);

  const paths = useMemo(() => {
    if (path.length < 2) {
      return [];
    }
    return path
      .slice(0, path.length - 1)
      .map((_, index) => [path[index], path[index + 1]]);
  }, [path]);

  useEffect(() => {
    if (!map) {
      return;
    }

    const ARROW_SYMBOL = {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    };

    const newPolylines = path.map((_, index) => {
      return new google.maps.Polyline({
        path: paths[index],
        ...POLYLINE_CONFIG,
        icons: [
          {
            icon: ARROW_SYMBOL,
            offset: '100%',
          },
        ],
      });
    });

    newPolylines.forEach((newPolyline) => {
      newPolyline.setMap(map);
    });

    setPolyline(newPolylines);

    return () => {
      newPolylines.forEach((newPolyline) => {
        newPolyline.setMap(null);
      });
      setPolyline(null);
    };
  }, [map, path]);

  return polyline;
};
