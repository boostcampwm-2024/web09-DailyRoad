import { ROUTES } from '@/constants/routes';
import { AxiosError, InternalAxiosRequestConfig } from 'axios';

interface ErrorResponseData {
  message: string;
}

export const checkAndSetToken = (config: InternalAxiosRequestConfig) => {
  if (!config.useAuth || !config.headers || config.headers.Authorization)
    return config;

  const accessToken = import.meta.env.VITE_TEST_ACCESS_TOKEN;
  if (!accessToken) {
    window.location.href = ROUTES.ROOT;
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
