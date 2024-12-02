import { MapItemType } from '@/types';
import React from 'react';
import ListItem from '@/components/common/List/ListItem';

type MapItemProps = {
  mapItem: MapItemType;
};

const MapItem = ({ mapItem }: MapItemProps) => {
  return <ListItem item={mapItem} linkPrefix="map" />;
};

export default MapItem;
