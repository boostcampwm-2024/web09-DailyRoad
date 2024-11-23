import { getUserInfo } from '@/api/auth';
import { User } from '@/types';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

export const useUserInfoQuery = () => {
  const { data: userInfo } = useSuspenseQuery<User, Error>({
    queryKey: ['user'],
    queryFn: getUserInfo,
  });
  return userInfo;
};
