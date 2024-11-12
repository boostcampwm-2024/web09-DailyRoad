import { useQuery } from '@tanstack/react-query';
import { getMap } from '@/api/map';
import { Map } from '@/types';

export const useGetMap = (mapId: number) => {
  const { data: mapData } = useQuery<Map, Error>({
    queryKey: ['map', mapId],
    queryFn: () => getMap(mapId),
  });
  return { mapData };
};
