import { getUserInfo } from '@/api/auth';
import { User } from '@/types';
import { useSuspenseQuery } from '@tanstack/react-query';

export const useUserInfoQuery = (accessToken: string | null) => {
  if (!accessToken) return null;
  const { data: userInfo } = useSuspenseQuery<User, Error>({
    queryKey: ['user'],
    queryFn: getUserInfo,
  });
  return userInfo;
};
