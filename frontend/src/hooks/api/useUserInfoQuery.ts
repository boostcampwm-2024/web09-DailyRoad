import { getUserInfo } from '@/api/auth';
import { User } from '@/types';
import { useSuspenseQuery } from '@tanstack/react-query';

export const useUserInfoQuery = () => {
  if (!localStorage.getItem('ACCESS_TOKEN_KEY')) return null;
  const { data: userInfo } = useSuspenseQuery<User, Error>({
    queryKey: ['user'],
    queryFn: getUserInfo,
  });
  return userInfo;
};
