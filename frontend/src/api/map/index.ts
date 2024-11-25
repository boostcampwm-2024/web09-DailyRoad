import { BaseMap, MapList, Map } from '@/types';
import { axiosInstance } from '../axiosInstance';
import { END_POINTS } from '@/constants/api';

type MapResponse = {
  id: number;
};
type EditInfoResponse = {
  id: number;
  title: string;
  description: string;
};
type EditVisResponse = {
  id: number;
  isPublic: boolean;
};

export const getMap = async (mapId: number) => {
  const { data } = await axiosInstance.get<Map>(END_POINTS.MAP(mapId), {
    useAuth: false,
  });
  return data;
};

export const createMap = async (baseMapData: Omit<BaseMap, 'mode'>) => {
  const { data } = await axiosInstance.post<MapResponse>(
    END_POINTS.MAPS,
    baseMapData,
  );
  return data.id;
};

export const getMapList = async (pageParam: number) => {
  const { data } = await axiosInstance.get<MapList>(END_POINTS.MAPS, {
    params: {
      page: pageParam,
    },
    useAuth: false,
  });
  return data;
};

export const getMyMapList = async () => {
  const { data } = await axiosInstance.get<MapList>(END_POINTS.MY_MAP);
  return data;
};

export const editMapInfo = async ({
  title,
  description,
  mapId,
}: {
  title: string;
  description: string;
  mapId: number;
}) => {
  const { data } = await axiosInstance.patch<EditInfoResponse>(
    END_POINTS.EDIT_MAP_INFO(mapId),
    {
      title,
      description,
    },
  );
  return data;
};

export const editMapVisibility = async ({
  mapId,
  isPublic,
}: {
  mapId: number;
  isPublic: boolean;
}) => {
  const { data } = await axiosInstance.patch<EditVisResponse>(
    END_POINTS.EDIT_MAP_VISIBILITY(mapId),
    {
      isPublic,
    },
  );
  return data;
};

export const editMap = async (data: BaseMap & { mapId: number }) => {
  const [infoResponse, visibilityResponse] = await Promise.all([
    editMapInfo({
      title: data.title,
      description: data.description,
      mapId: data.mapId,
    }),
    editMapVisibility({ mapId: data.mapId, isPublic: data.isPublic }),
  ]);
  return { ...infoResponse, ...visibilityResponse };
};

export const deleteMap = async (mapId: number) => {
  const { data } = await axiosInstance.delete(END_POINTS.MAP(mapId));
  return data;
};
