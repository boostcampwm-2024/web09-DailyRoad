import { createMap } from '@/api/map';
import FormWrapper from './FormWrapper';

const CreateForm = () => {
  return <FormWrapper header="지도 생성" onSubmitHandler={createMap} />;
};

export default CreateForm;
