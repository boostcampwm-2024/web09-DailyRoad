import BaseWrapper from '../common/BaseWrapper';
import { useStore } from '@/store/useStore';
import PlaceItem from './PlaceItem';
import TextInputArea from '../common/TextInputArea';
import { useState } from 'react';
import Box from '../common/Box';
import Marker from '../Marker/Marker';
import DashBoardHeader from '../common/DashBoardHeader';

const DetailPlaceForm = () => {
  const place = useStore((state) => state.place);
  const [description, setDescription] = useState('');
  const [color, selectColor] = useState('');
  return (
    <BaseWrapper>
      <Box role="region" aria-label="장소 상세 정보">
        <header className="flex gap-2">
          <DashBoardHeader title="장소 추가하기" />
        </header>
        <PlaceItem place={place} isDetailPage={true} />
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
          aria-labelledby="review-heading"
        />
      </Box>
      <Marker key={place.google_place_id} position={place.location} />
    </BaseWrapper>
  );
};

export default DetailPlaceForm;
