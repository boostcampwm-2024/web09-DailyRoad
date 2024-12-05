import { useSuspenseQuery } from '@tanstack/react-query';

import { getMap } from '@/api/map';
import { QUERY_KEY } from '@/constants/api';

import { Map } from '@/types';

export const useMapQuery = (mapId: number) => {
  const { data } = useSuspenseQuery<Map, Error>({
    queryKey: QUERY_KEY.MAP(mapId),
    queryFn: () => getMap(mapId),
  });
  return data;
};
