import { useQuery } from '@tanstack/react-query';
import { getMap } from '@/api/map';
import { MapType } from '@/types';

export const useGetMap = (mapId: number) => {
  const { data: mapData } = useQuery<MapType, Error>({
    queryKey: ['map', mapId],
    queryFn: () => getMap(mapId),
  });
  return { mapData };
};
