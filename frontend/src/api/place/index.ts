import { END_POINTS } from '@/constants/api';
import { Place } from '@/types';
import { axiosInstance } from '../axiosInstance';

export const getPlace = async (searchString: string, pageParam: number) => {
  const { data } = await axiosInstance.get<{ results: Place[] }>(
    END_POINTS.PLACE,
    {
      params: {
        search: searchString,
        page: pageParam,
      },
    },
  );
  return data.results;
};
