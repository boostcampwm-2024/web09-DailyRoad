import { axiosInstance } from '@/api/axiosInstance';

export interface Banner {
  imageUrl: string;
  redirectUrl: string;
}

export const getBanners = async () => {
  const { data } = await axiosInstance.get<Banner[]>('/banners', {
    useAuth: false,
  });
  return data;
};
