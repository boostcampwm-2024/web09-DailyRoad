import FormWrapper from './FormWrapper';
import BaseWrapper from '../common/BaseWrapper';
import { useNavigate } from 'react-router-dom';
import { useAddMapMutation } from '@/hooks/api/useAddMapMutation';
import { useMapForm } from '@/hooks/useMapForm';
import { CreateMapType } from '@/types';
import { ROUTES } from '@/constants/routes';

const CreateBaseMapForm = () => {
  const { mapInfo, updateMapInfo, isMapInfoValid } = useMapForm();
  const addMapMutation = useAddMapMutation();
  const navigate = useNavigate();
  const { mode, ...baseMap } = mapInfo;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addMapMutation.mutate(baseMap, {
      onSuccess: () => {
        navigateByMode(mode);
      },
    });
  };

  const navigateByMode = (mode: CreateMapType) => {
    return navigate(mode === 'MAP' ? ROUTES.MAP : ROUTES.COURSE);
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
