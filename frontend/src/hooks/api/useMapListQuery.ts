import { useQuery } from '@tanstack/react-query';
import { getMapList } from '@/api/map';
import { MapList } from '@/types';

export const useMapListQuery = () => {
  const { data: mapListData } = useQuery<MapList, Error>({
    queryKey: ['mapList'],
    queryFn: () => getMapList(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  return { mapListData };
};
