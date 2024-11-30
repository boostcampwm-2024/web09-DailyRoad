import { useStore } from '@/store/useStore';
import React from 'react';
import Marker from './Marker';

const MarkerContainer = () => {
  const markers = useStore((state) => state.markers);
  return <></>;
};

export default MarkerContainer;
