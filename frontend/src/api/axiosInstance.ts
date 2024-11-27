import axios from 'axios';

import { AXIOS_BASE_URL, NETWORK } from '@/constants/api';
import {
  checkAndSetToken,
  handleAPIError,
  handleTokenError,
} from './interceptors';

export const axiosInstance = axios.create({
  baseURL: AXIOS_BASE_URL,
  timeout: NETWORK.TIMEOUT,
  withCredentials: true,
  useAuth: true,
});

axiosInstance.interceptors.request.use(checkAndSetToken);

axiosInstance.interceptors.response.use(
  (response) => response,
  handleTokenError,
);
axiosInstance.interceptors.response.use((response) => response, handleAPIError);
