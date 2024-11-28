import { END_POINTS } from '@/constants/api';
import { CoursePlace, CustomPlace, Place, PlaceWithOrder } from '@/types';
import { axiosInstance } from '../axiosInstance';

export const getPlace = async (queryString: string, pageParam: number) => {
  const { data } = await axiosInstance.get<Place[]>(END_POINTS.PLACE, {
    params: {
      query: queryString,
      page: pageParam,
    },
    useAuth: false,
  });

  return data;
};

export type GooglePlaceResponse = {
  photoReference: string;
} & Place;

export const getGooglePlace = async (query: string) => {
  const { data } = await axiosInstance.get<GooglePlaceResponse[]>(
    END_POINTS.GOOGLE_PLACE_SEARCH,
    {
      params: {
        query,
      },
    },
  );
  return data;
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

export const putPlaceToCourse = async ({
  id,
  places,
}: {
  id: number;
  places: PlaceWithOrder[];
}) => {
  const { data } = await axiosInstance.put<CoursePlace[]>(
    END_POINTS.PUT_PLACE_TO_COURSE(id),
    { places },
  );
  return { ...data, id };
};

type Response = {
  code?: number;
  message?: string;
};
type DeletePlaceResponse = {
  deletedId: number;
} & Response;

export const deletePlaceToMap = async ({
  id,
  placeId,
}: {
  id: number;
  placeId: number;
}) => {
  const { data } = await axiosInstance.delete<DeletePlaceResponse>(
    END_POINTS.DELETE_PLACE_TO_MAP(id, placeId),
  );
  return { placeId: data.deletedId, id };
};

export const deletePlaceToCourse = async ({
  id,
  placeId,
}: {
  id: number;
  placeId: number;
}) => {
  const { data } = await axiosInstance.delete<DeletePlaceResponse>(
    END_POINTS.DELETE_PLACE_TO_COURSE(id, placeId),
  );
  return { placeId: data.deletedId, id };
};
