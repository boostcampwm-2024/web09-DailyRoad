import ListItem from '@/components/common/List/ListItem';

import { MapItemType } from '@/types';

type MapItemProps = {
  mapItem: MapItemType;
};

const MapItem = ({ mapItem }: MapItemProps) => {
  return <ListItem item={mapItem} linkPrefix="map" />;
};

export default MapItem;
