import { END_POINTS } from '@/constants/api';
import { axiosInstance } from '../axiosInstance';
import { User } from '@/types';

type LogInResponse = {
  token: string;
};

export const postLogIn = async (code: string) => {
  const { data } = await axiosInstance.post<LogInResponse>(
    END_POINTS.GOOGLE_LOGIN,
    { code },
  );
  return data;
};

export const getUserInfo = async () => {
  const { data } = await axiosInstance.get<User>(END_POINTS.USER_INFO);
  return data;
};

export const deleteLogOut = async () => {
  const { data } = await axiosInstance.delete('');
  return data;
};
