import React from 'react';
import BaseWrapper from '../common/BaseWrapper';
import FormWrapper from './FormWrapper';
import { BaseMap, Map } from '@/types';
import { useEditMapMutation } from '@/hooks/api/useEditMapMutation';
import { useMapForm } from '@/hooks/useMapForm';

import PlaceListPanel from '../Place/PlaceListPanel';
import { useNavigate } from 'react-router-dom';

type EditMapFormProps = {
  mapData: Map;
};

const EditMapForm = ({ mapData }: EditMapFormProps) => {
  const editMapMutation = useEditMapMutation();
  const navigate = useNavigate();
  const initialMapData: BaseMap = {
    title: mapData.title,
    description: mapData.description,
    isPublic: mapData.isPublic,
    thumbnailUrl: mapData.thumbnailUrl,
    mode: 'MAP',
  };

  const { mapInfo, updateMapInfo, isMapInfoValid } = useMapForm(initialMapData);

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    editMapMutation.mutate({ mapId: mapData.id, ...mapInfo });
    navigate(`/map/${mapData.id}`);
  };
  console.log(mapData);
  return (
    <>
      <BaseWrapper position="" top="" left="" className="w-1/2">
        <FormWrapper
          header="지도 수정"
          mapInfo={mapInfo}
          updateMapInfo={updateMapInfo}
          isMapInfoValid={isMapInfoValid}
          onSubmitHandler={onSubmitHandler}
          isEditMode={true}
        />
      </BaseWrapper>
      <PlaceListPanel places={mapData.places} />
    </>
  );
};

export default EditMapForm;
