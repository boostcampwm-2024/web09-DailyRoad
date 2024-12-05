import React from 'react';
import { useNavigate } from 'react-router-dom';

import BaseWrapper from '@/components/common/BaseWrapper';
import FormWrapper from './FormWrapper';

import { useEditMapMutation } from '@/hooks/api/useEditMapMutation';
import { useMapForm } from '@/hooks/useMapForm';
import { useStore } from '@/store/useStore';
import { BaseMap, Map } from '@/types';

type EditMapFormProps = {
  mapData: Map;
};

const EditMapForm = ({ mapData }: EditMapFormProps) => {
  const editMapMutation = useEditMapMutation();
  const navigate = useNavigate();
  const addToast = useStore((state) => state.addToast);

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
    editMapMutation.mutate(
      { mapId: mapData.id, ...mapInfo },
      {
        onSuccess: () => {
          addToast('지도가 수정되었습니다.', '', 'success');
          navigate(`/map/${mapData.id}`);
        },
      },
    );
  };

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
    </>
  );
};

export default EditMapForm;
