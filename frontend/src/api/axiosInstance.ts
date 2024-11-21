import axios from 'axios';

import { AXIOS_BASE_URL, NETWORK } from '@/constants/api';
import { checkAndSetToken, handleAPIError } from './interceptors';

const accessToken = import.meta.env.VITE_TEST_ACCESS_TOKEN as string;

export const axiosInstance = axios.create({
  baseURL: AXIOS_BASE_URL,
  timeout: NETWORK.TIMEOUT,
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
  withCredentials: true,
  useAuth: true,
});
//axiosInstance.interceptors.request.use(checkAndSetToken);

axiosInstance.interceptors.response.use((response) => response, handleAPIError);
