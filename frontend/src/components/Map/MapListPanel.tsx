import React from 'react';

import { getMapList } from '@/api/map';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { MapItemType, MapList } from '@/types';

import MapItem from '@/components/Map/MapItem';
import Box from '../common/Box';

interface MapListPanelProps {
  query?: string;
}

const MapListPanel: React.FC<MapListPanelProps> = ({ query }) => {
  const { data, isFetchingNextPage, hasNextPage, ref } =
    useInfiniteScroll<MapList>({
      queryKey: ['mapList'],
      queryFn: ({ pageParam }) => getMapList(pageParam, query),
      getNextPageParam: (lastPage) => {
        return lastPage.currentPage < lastPage.totalPages
          ? lastPage.currentPage + 1
          : undefined;
      },
      fetchWithoutQuery: true,
    });

  return (
    <Box className="scrollbar-thumb-rounded-lg max-h-[700px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 hover:scrollbar-track-gray-200 hover:scrollbar-thumb-gray-500">
      <div className="grid h-full grid-cols-5 gap-8 p-20 px-40">
        {data?.pages.map((page, index) => (
          <React.Fragment key={index}>
            {page.maps.map((map: MapItemType) => (
              <MapItem key={map.id} mapItem={map} />
            ))}
          </React.Fragment>
        ))}
      </div>
      <div ref={ref} className="h-1" />
    </Box>
  );
};

export default MapListPanel;
