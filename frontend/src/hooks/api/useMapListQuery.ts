import { useQuery } from '@tanstack/react-query';
import { getMapList } from '@/api/map';

export const useGetMapList = () => {
  const { data: mapListData } = useQuery<MapListResponse, Error>({
    queryKey: ['mapList'],
    queryFn: () => getMapList(),
  });

  return { mapListData };
};
