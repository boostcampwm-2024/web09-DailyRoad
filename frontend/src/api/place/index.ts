import { END_POINTS } from '@/constants/api';
import { Place } from '@/types';
import { axiosInstance } from '../axiosInstance';

export const getPlace = async (queryString: string, pageParam: number) => {
  const { data } = await axiosInstance.get<Place[]>(
    END_POINTS.PLACE,
    {
      params: {
        query: queryString,
        page: pageParam,
      },
    },
  );
  const Data =  data.map((place)=>{
    return {
      ...place,
      location: {
        lat: Number(place.location.lat),
        lng: Number(place.location.lng)
      }
    }
  })
  return Data;
};
