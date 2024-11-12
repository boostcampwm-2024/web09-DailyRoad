import { BaseMap, MapList, Map } from '@/types';
import { axiosInstance } from '../axiosInstance';
import { END_POINTS } from '@/constants/api';

type MapResponse = {
  mapId: string;
};

export const getMap = async (mapId: number) => {
  const { data } = await axiosInstance.get<Map>(END_POINTS.MAP(mapId));
  return data;
};

export const createMap = async (baseMapData: Omit<BaseMap, 'mode'>) => {
  const { data } = await axiosInstance.post<MapResponse>(
    END_POINTS.MAPS,
    baseMapData,
  );
  return data.mapId;
};

export const getMapList = async () => {
  const { data } = await axiosInstance.get<MapList>(END_POINTS.MAPS);
  return data;
};

export const getMyMapList = async () => {
  const { data } = await axiosInstance.get<MapList>(END_POINTS.MY_MAP);
  return data;
};

export const getCourseList = async () => {
  const { data } = await axiosInstance.get<MapList>(END_POINTS.COURSES);
  return data;
};
