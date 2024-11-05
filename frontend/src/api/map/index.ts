import { BaseMapType, MapType } from '@/types';
import { axiosInstance } from '../axiosInstance';
import { END_POINTS } from '@/constants/api';

type MapResponse = {
  mapId: string;
};

export const getMap = async (mapId: number) => {
  const { data } = await axiosInstance.get<MapType>(END_POINTS.MAP(mapId));
  return data;
};

export const createMap = async (baseMapData: BaseMapType) => {
  const { data } = await axiosInstance.post<MapResponse>(
    END_POINTS.MAPS,
    baseMapData,
  );
  return data.mapId;
};
