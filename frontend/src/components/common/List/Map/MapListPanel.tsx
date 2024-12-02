import React from 'react';

import { getMapList } from '@/api/map';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { MapList } from '@/types';

import MapItem from '@/components/common/List/Map/MapItem';
import InfiniteListPanel from '@/components/common/List/InfiniteListPanel';

interface MapListPanelProps {
  query?: string;
}

const MapListPanel: React.FC<MapListPanelProps> = ({ query }) => {
  const { data, ref } = useInfiniteScroll<MapList>({
    queryKey: ['mapList'],
    queryFn: ({ pageParam }) => getMapList(pageParam, query),
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined,
    fetchWithoutQuery: true,
  });

  const mapItems = data?.pages.flatMap((page) => page.maps) || [];

  return (
    <InfiniteListPanel
      data={mapItems}
      ref={ref}
      renderItem={(map) => <MapItem key={map.id} mapItem={map} />}
      className="max-h-[800px] p-5"
    />
  );
};

export default MapListPanel;
