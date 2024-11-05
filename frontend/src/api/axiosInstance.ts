import axios from 'axios';

import { AXIOS_BASE_URL, NETWORK } from '@/constants/api';

export const axiosInstance = axios.create({
  baseURL: AXIOS_BASE_URL,
  timeout: NETWORK.TIMEOUT,
  withCredentials: true,
  useAuth: true,
});
