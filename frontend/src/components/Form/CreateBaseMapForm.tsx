import { useNavigate } from 'react-router-dom';

import BaseWrapper from '@/components/common/BaseWrapper';
import FormWrapper from './FormWrapper';

import { useAddMapMutation } from '@/hooks/api/useAddMapMutation';
import { useMapForm } from '@/hooks/useMapForm';
import { useStore } from '@/store/useStore';

import { CreateMapType } from '@/types';
import { ROUTES } from '@/constants/routes';

const CreateBaseMapForm = () => {
  const { mapInfo, updateMapInfo, isMapInfoValid } = useMapForm();
  const navigate = useNavigate();
  const { mode, ...baseMap } = mapInfo;
  const addMapMutation = useAddMapMutation(mode);
  const addToast = useStore((state) => state.addToast);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addMapMutation.mutate(baseMap, {
      onSuccess: (id) => {
        addToast('지도/코스가 추가되었습니다.', '', 'success');
        navigateByMode(mode, id);
      },
    });
  };

  const navigateByMode = (mode: CreateMapType, id: number) => {
    return navigate(mode === 'MAP' ? ROUTES.MAP(id) : ROUTES.COURSE(id));
  };

  return (
    <BaseWrapper>
      <FormWrapper
        header="새 지도/코스 추가"
        mapInfo={mapInfo}
        updateMapInfo={updateMapInfo}
        isMapInfoValid={isMapInfoValid}
        onSubmitHandler={handleSubmit}
      />
    </BaseWrapper>
  );
};

export default CreateBaseMapForm;
