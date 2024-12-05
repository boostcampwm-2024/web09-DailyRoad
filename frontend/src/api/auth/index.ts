import { axiosInstance } from '@/api/axiosInstance';

import { END_POINTS } from '@/constants/api';
import { User } from '@/types';

type LogInResponse = {
  accessToken: string;
};

type TokenRefrechResponse = {
  token: string;
};

export const postLogIn = async (code: string) => {
  const { data } = await axiosInstance.post<LogInResponse>(
    END_POINTS.GOOGLE_LOGIN,
    { code },
    { useAuth: false },
  );
  return data;
};

export const getUserInfo = async () => {
  const { data } = await axiosInstance.get<User>(END_POINTS.USER_INFO);

  return data;
};

export const getRedirectUri = async () => {
  const { data } = await axiosInstance.get<string>(
    END_POINTS.GOOGLE_REDIRECT_URI,
    { useAuth: false },
  );

  return data;
};

export const deleteLogOut = async () => {
  const { data } = await axiosInstance.delete(END_POINTS.LOGOUT);
  return data;
};

export const postTokenRefresh = async () => {
  const { data } = await axiosInstance.post<TokenRefrechResponse>(
    END_POINTS.TOKEN_REFRESH,
  );
  return data;
};
