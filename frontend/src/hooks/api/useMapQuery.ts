import { useSuspenseQuery } from '@tanstack/react-query';
import { getMap } from '@/api/map';
import { Map } from '@/types';

export const useMapQuery = (mapId: number) => {
  const { data } = useSuspenseQuery<Map, Error>({
    queryKey: ['map', mapId],
    queryFn: () => getMap(mapId),
  });
  return data;
};
