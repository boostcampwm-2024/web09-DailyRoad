import { BaseMapType, MapItemType, MapType } from '@/types';
import { axiosInstance } from '../axiosInstance';
import { END_POINTS } from '@/constants/api';

type MapResponse = {
  mapId: string;
};

type MapListResponse = {
  maps: MapItemType[];
  totalPages: number;
  currentPage: number;
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

export const getMapList = async () => {
  const { data } = await axiosInstance.get<MapListResponse>(END_POINTS.MAPS);
  return data;
};

export const getCourseList = async () => {
  const { data } = await axiosInstance.get<MapListResponse>(END_POINTS.COURSES);
  return data;
};
