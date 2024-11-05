import { useEffect, useRef } from 'react';
import { useGoogleMapStore } from './store/googleMapState';

const GoogleMap = () => {
  const ref = useRef<HTMLDivElement>(null);
  const googleMap = useGoogleMapStore((state) => state.googleMap);
  const initializeMap = useGoogleMapStore((state) => state.initializeMap);

  useEffect(() => {
    if (ref.current && !googleMap) {
      initializeMap(ref.current);
    }
  }, [googleMap, initializeMap]);

  return <div ref={ref} id="map" style={{ minHeight: '100vh' }} />;
};

export default GoogleMap;
