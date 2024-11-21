import React from 'react';

import { getMapList } from '@/api/map';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { MapItemType, MapList } from '@/types';

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
      <div className="flex justify-center p-4">
        <NavigateButton
          to="/create"
          text="나만의 지도 만들러 가기"
          className="w-30 flex h-10 items-center justify-center rounded-md border-[1.5px] border-c_button_gray p-2 text-lg"
        />
      </div>
      <div className="scrollbar-thumb-rounded-lg grid h-full grid-cols-5 gap-8 overflow-y-auto p-20 px-40 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 hover:scrollbar-track-gray-200 hover:scrollbar-thumb-gray-500">
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
