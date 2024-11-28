import { getUserInfo } from '@/api/auth';
import { User } from '@/types';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

export const useUserInfoQuery = () => {
  const { data, refetch, error } = useQuery<User, Error>({
    queryKey: ['user'],
    queryFn: getUserInfo,
    enabled: Boolean(localStorage.getItem('ACCESS_TOKEN_KEY')),
  });
  return { data, refetch, error };
};
