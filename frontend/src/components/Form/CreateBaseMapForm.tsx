import { createMap } from '@/api/map';
import FormWrapper from './FormWrapper';
import BaseWrapper from '../BaseWrapper';

const CreateBaseMapForm = () => {
  return (
    <BaseWrapper>
      <FormWrapper header="새 지도/코스 추가" onSubmitHandler={createMap} />
    </BaseWrapper>
  );
};

export default CreateBaseMapForm;
