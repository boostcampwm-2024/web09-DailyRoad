import { getMyMapList } from '@/api/map';
import { MapList } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useMyMapQuery = () => {
  const { data: mapListData } = useQuery<MapList, Error>({
    queryKey: ['myMapList'],
    queryFn: () => getMyMapList(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  return { mapListData };
};
