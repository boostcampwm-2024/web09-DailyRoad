import { getGooglePlace, GooglePlaceResponse } from '@/api/place';
import { useSuspenseQuery } from '@tanstack/react-query';

export const useGooglePlaceQuery = (query: string) => {
  if (!query) return [];
  const { data } = useSuspenseQuery<GooglePlaceResponse[], Error>({
    queryKey: ['googlePlace'],
    queryFn: () => getGooglePlace(query),
  });
  return data;
};
