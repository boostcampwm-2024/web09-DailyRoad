import { getMapList, getMyMapList } from '@/api/map';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { MapList } from '@/types';

import MapItem from '@/components/common/List/Map/MapItem';
import InfiniteListPanel from '@/components/common/List/InfiniteListPanel';

type MapListPanelProps = {
  query?: string;
  Range: 'ALL' | 'MY';
};

const MapListPanel = ({ query, Range }: MapListPanelProps) => {
  const queryFn =
    Range === 'MY'
      ? ({ pageParam }: { pageParam: number }) => getMyMapList(pageParam)
      : ({ pageParam }: { pageParam: number }) => getMapList(pageParam, query);
  const queryKey =
    Range === 'MY' ? ['myMapList', query ?? ''] : ['mapList', query ?? ''];

  console.log(query, Range, queryKey, queryFn);

  const { data, ref } = useInfiniteScroll<MapList>({
    queryKey: queryKey,
    queryFn: queryFn,
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
