import { useEffect, useRef, useState } from 'react';
import { getGoogleMapStore, useGoogleMapStore } from './store/googleMapState';

const GoogleMap = () => {
  const ref = useRef<HTMLDivElement>(null);
  const setGoogleMap = useGoogleMapStore((state) => state.setGoogleMap);
  const googleMap = useGoogleMapStore((state) => state.googleMap);
  useEffect(() => {
    if (ref.current && !googleMap) {
      const initialMap = getGoogleMapStore();
      setGoogleMap(initialMap);
      ref.current.appendChild(initialMap.getDiv());
    }
  }, [googleMap]);

  return <div ref={ref} id="map" style={{ minHeight: '100vh' }} />;
};

export default GoogleMap;
