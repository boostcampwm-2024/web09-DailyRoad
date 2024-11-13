import { getMapList } from '@/api/map';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { MapItemType, MapList } from '@/types';
import React from 'react';
import MapItem from './MapItem';

const MapListPanel = () => {
  const { data, isFetchingNextPage, hasNextPage, ref } =
    useInfiniteScroll<MapList>({
      queryKey: ['mapList'],
      queryFn: ({ pageParam }) => getMapList(pageParam),
      getNextPageParam: (lastPage) => {
        return lastPage.currentPage < lastPage.totalPages
          ? lastPage.currentPage + 1
          : undefined;
      },
      defaultFetch: true,
    });
  return (
    <div className="scrollbar-thumb-rounded-lg flex max-h-[600px] flex-wrap space-y-4 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 hover:scrollbar-track-gray-200 hover:scrollbar-thumb-gray-500">
      {data?.pages.map((page, index) => (
        <React.Fragment key={index}>
          {page.maps.map((map: MapItemType) => (
            <React.Fragment key={map.id}>
              <MapItem key={map.id} mapItem={map} />
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
      <div ref={ref} className="h-1" />
    </div>
  );
};

export default MapListPanel;
