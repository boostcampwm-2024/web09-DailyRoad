import { BaseMap } from '@/types';
import { axiosInstance } from '../axiosInstance';
import { END_POINTS } from '@/constants/api';

type CourseResponse = {
  id: number;
};

export const createCourse = async (baseMapData: Omit<BaseMap, 'mode'>) => {
  const { data } = await axiosInstance.post<CourseResponse>(
    END_POINTS.MAPS,
    baseMapData,
  );
  return data.id;
};
