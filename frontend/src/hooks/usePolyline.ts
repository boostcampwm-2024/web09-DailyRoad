import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';

export const usePoyline = (path: google.maps.LatLngLiteral[]) => {
  const [polyline, setPolyline] = useState<google.maps.Polyline[] | null>(null);
  const map = useStore((state) => state.googleMap);

  // [1,2,3,4,5] 배열을
  // [[1,2], [2,3], [3,4], [4,5]]로 변환

  const paths = path.slice(0, path.length - 1).map((_, index) => {
    return [path[index], path[index + 1]];
  });
  useEffect(() => {
    if (!map) {
      return;
    }
    const lineSymbol = {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    };

    const newPolylines = path.map((_, index) => {
      return new google.maps.Polyline({
        path: paths[index],
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
