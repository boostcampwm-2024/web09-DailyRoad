import { useEffect, useRef, useState } from 'react';

function GoogleMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [googleMap, setGoogleMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current) {
      const initialMap = new window.google.maps.Map(ref.current, {
        center: {
          lat: 37.5,
          lng: 127.0,
        },
        zoom: 16,
        mapId: import.meta.env.VITE_GOOGLE_MAPS_ID,
        disableDefaultUI: true,
        clickableIcons: false,
        minZoom: 10,
        maxZoom: 18,
        gestureHandling: 'greedy',
        restriction: {
          latLngBounds: {
            north: 39,
            south: 32,
            east: 132,
            west: 124,
          },
          strictBounds: true,
        },
      });

      setGoogleMap(initialMap);
    }
  }, []);

  return <div ref={ref} id="map" style={{ minHeight: '100vh' }} />;
}

export default GoogleMap;
