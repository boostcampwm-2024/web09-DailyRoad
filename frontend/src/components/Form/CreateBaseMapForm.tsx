import FormWrapper from './FormWrapper';
import BaseWrapper from '../common/BaseWrapper';
import { useNavigate } from 'react-router-dom';
import { useAddMapMutation } from '@/hooks/api/useAddMapMutation';
import { useMapForm } from '@/hooks/useMapFrom';
import { CreateMapType } from '@/types';

const CreateBaseMapForm = () => {
  const { mapInfo, updateMapInfo, isMapInfoValid } = useMapForm();
  const addMapMutation = useAddMapMutation();
  const navigate = useNavigate();
  const { mode, ...baseMap } = mapInfo;

  const handlesubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addMapMutation.mutate(baseMap, {
      onSuccess: () => {
        navigateByMode(mode);
      },
    });
  };

  const navigateByMode = (mode: CreateMapType) => {
    if (mode === 'MAP') {
      return navigate('/create/map');
    } else {
      return navigate('/create/course');
    }
  };

  return (
    <BaseWrapper>
      <FormWrapper
        header="새 지도/코스 추가"
        mapInfo={mapInfo}
        updateMapInfo={updateMapInfo}
        isMapInfoValid={isMapInfoValid}
        onSubmitHandler={handlesubmit}
      />
    </BaseWrapper>
  );
};

export default CreateBaseMapForm;
