import BaseWrapper from '../common/BaseWrapper';
import { useStore } from '@/store/useStore';
import PlaceItem from './PlaceItem';
import TextInputArea from '../common/TextInputArea';
import { useState } from 'react';
import Box from '../common/Box';

const DetailPlaceForm = () => {
  const place = useStore((state) => state.place);
  const [description, setDescription] = useState('');
  const [color, selectColor] = useState('');
  return (
    <BaseWrapper>
      <Box>
        <h2 className="p-4 text-xl font-semibold">장소 추가하기</h2>
        <PlaceItem place={place} />
      </Box>
      <Box>
        <h2 className="text-xl font-semibold">한줄평</h2>
        <TextInputArea
          value={description}
          onChange={(prev) => setDescription(prev)}
          placeholder={'한줄평을 입력해주세요.'}
          maxLength={150}
          height={160}
          isTextArea={true}
        />
      </Box>
    </BaseWrapper>
  );
};

export default DetailPlaceForm;
