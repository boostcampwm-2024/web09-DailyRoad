import { BaseMap } from '@/types';
import { useCallback, useEffect, useState } from 'react';

const defualtMapData: BaseMap = {
  title: '',
  description: '',
  thumbnailUrl: 'https://example.com/map7.jpg',
  isPublic: true,
  mode: 'MAP',
};

export const useMapForm = (initialMapData?: BaseMap) => {
  const [mapInfo, setMapInfo] = useState<BaseMap>(
    initialMapData ?? defualtMapData,
  );
  const [isMapInfoValid, setIsMapInfoValid] = useState(false);

  useEffect(() => {
    validateInputs();
  }, [mapInfo]);

  const validateInputs = () => {
    const { title, description } = mapInfo;
    setIsMapInfoValid(!!title && !!description);
  };

  const updateMapInfo = useCallback(
    <K extends keyof BaseMap>(field: K, value: BaseMap[K]) => {
      setMapInfo((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  return { mapInfo, updateMapInfo, isMapInfoValid };
};
