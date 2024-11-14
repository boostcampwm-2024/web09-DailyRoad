import { END_POINTS } from '@/constants/api';
import { CustomPlace, Place } from '@/types';
import { axiosInstance } from '../axiosInstance';

export const getPlace = async (queryString: string, pageParam: number) => {
  const { data } = await axiosInstance.get<Place[]>(END_POINTS.PLACE, {
    params: {
      query: queryString,
      page: pageParam,
    },
  });
  const Data = data.map((place) => {
    return {
      ...place,
      location: {
        lat: Number(place.location.lat),
        lng: Number(place.location.lng),
      },
    };
  });
  return Data;
};

type AddPlaceParams = {
  id: number;
} & CustomPlace;

export const addPlaceToMap = async ({
  id,
  ...placeMarkerData
}: AddPlaceParams) => {
  const { data } = await axiosInstance.post<CustomPlace>(
    END_POINTS.ADD_PLACE_TO_MAP(id),
    placeMarkerData,
  );
  return { ...data, id };
};
export const addPlaceToCourse = async ({
  id,
  ...placeMarkerData
}: AddPlaceParams) => {
  const { data } = await axiosInstance.post<CustomPlace>(
    END_POINTS.ADD_PLACE_TO_COURSE(id),
    placeMarkerData,
  );
  return { ...data, id };
};
