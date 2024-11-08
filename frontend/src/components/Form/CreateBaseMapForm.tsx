import { createMap } from '@/api/map';
import FormWrapper from './FormWrapper';
import BaseWrapper from '../BaseWrapper';

const CreateBaseMapForm = () => {
  return (
    <BaseWrapper>
      <FormWrapper header="지도 생성" onSubmitHandler={createMap} />
    </BaseWrapper>
  );
};

export default CreateBaseMapForm;
