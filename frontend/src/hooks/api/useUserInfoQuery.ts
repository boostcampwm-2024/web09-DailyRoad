import { getUserInfo } from '@/api/auth';
import { QUERY_KEY } from '@/constants/api';
import { User } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useUserInfoQuery = () => {
  const { data, refetch, error } = useQuery<User, Error>({
    queryKey: QUERY_KEY.USER_INFO,
    queryFn: getUserInfo,
    enabled: Boolean(localStorage.getItem('ACCESS_TOKEN_KEY')),
  });
  return { data, refetch, error };
};
