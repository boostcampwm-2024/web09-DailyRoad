import { useEffect, useRef } from 'react';
import { useStore } from './store/useStore';

const GoogleMap = () => {
  const ref = useRef<HTMLDivElement>(null);
  const googleMap = useStore((state) => state.googleMap);
  const initializeMap = useStore((state) => state.initializeMap);

  useEffect(() => {
    if (ref.current) {
      initializeMap(ref.current);
    }
  }, [initializeMap]);

  return <div ref={ref} id="map" style={{ minHeight: '100vh' }} />;
};

export default GoogleMap;
