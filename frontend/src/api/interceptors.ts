import { ROUTES } from '@/constants/routes';
import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { postTokenRefresh } from './auth';
import { axiosInstance } from './axiosInstance';

interface ErrorResponseData {
  message: string;
  code: string;
}

export const checkAndSetToken = (config: InternalAxiosRequestConfig) => {
  if (!config.useAuth || !config.headers || config.headers.Authorization) {
    console.log(config);
    return config;
  }
  console.log('checkAndSetToken', config);
  const accessToken = localStorage.getItem(`ACCESS_TOKEN_KEY`);
  if (!accessToken) {
    throw new Error('토큰이 유효하지 않습니다');
  }

  // eslint-disable-next-line no-param-reassign
  config.headers.Authorization = `Bearer ${accessToken}`;

  return config;
};

export const handleAPIError = (error: AxiosError<ErrorResponseData>) => {
  if (!error.response) throw error;

  const { data, status } = error.response;

  if (status >= 300) {
    throw new Error(data.message);
  }

  throw new Error('알 수 없는 오류가 발생했습니다');
};

export const handleTokenError = async (
  error: AxiosError<ErrorResponseData>,
) => {
  const originRequest = error.config;
  if (!originRequest) throw error;
  const { data, status } = error.response!;
  console.log(data, status);

  if (status === 401 && data.message === '만료된 토큰입니다.') {
    const { token: accessToken } = await postTokenRefresh();
    originRequest.headers.Authorization = `Bearer ${accessToken}`;
    localStorage.setItem('ACCESS_TOKEN_KEY', accessToken);
    return axiosInstance(originRequest);
  }

  if (data.code === 'E500') {
    console.log('유효하지 않은 토큰입니다.');
    localStorage.removeItem('ACCESS_TOKEN_KEY');
    throw new Error('로그인이 필요합니다.');
  }
};
