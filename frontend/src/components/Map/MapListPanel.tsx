import { getMapList } from '@/api/map';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { MapItemType, MapList } from '@/types';
import React from 'react';
import MapItem from '@/components/Map/MapItem';
import NavigateButton from '@/components/common/NavigateButton';

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
      fetchWithoutQuery: true,
    });
  return (
    <>
      <div className="flex h-8 w-auto justify-center">
        <NavigateButton
          to="/create"
          text="지도/코스 추가"
          className="w-30 h-10 rounded-md border-[1.5px] border-c_button_gray p-2"
        />
      </div>
      <div className="scrollbar-thumb-rounded-lg flex h-full flex-wrap gap-4 overflow-y-auto p-20 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 hover:scrollbar-track-gray-200 hover:scrollbar-thumb-gray-500">
        {data?.pages.map((page, index) => (
          <React.Fragment key={index}>
            {page.maps.map((map: MapItemType) => (
              <MapItem key={map.id} mapItem={map} />
            ))}
          </React.Fragment>
        ))}
      </div>
      <div ref={ref} className="h-1" />
    </>
  );
};

export default MapListPanel;
