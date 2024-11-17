import BaseWrapper from '../common/BaseWrapper';
import { useStore } from '@/store/useStore';
import PlaceItem from './PlaceItem';
import TextInputArea from '../common/TextInputArea';
import { useState } from 'react';
import Box from '../common/Box';
import Marker from '../Marker/Marker';
import DashBoardHeader from '../common/DashBoardHeader';
import { CreateMapType, CustomPlace, MarkerColor } from '@/types';
import ColorSelector from '@/pages/PlaceCreation/ColorSelector';
import { useAddPlaceMutation } from '@/hooks/api/useAddPlaceMutation';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const DetailPlaceForm = () => {
  const place = useStore((state) => state.place);

  const [description, setDescription] = useState('');

  const [activeColor, setActiveColor] = useState<MarkerColor | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const mode = location.pathname.split('/')[2].toUpperCase() as CreateMapType;
  const id = Number(useParams().id);
  const addPlaceMutation = useAddPlaceMutation(mode);

  const placeMarker: CustomPlace = {
    placeId: place.id,
    color: activeColor as MarkerColor,
    comment: description,
  };

  const onSubmit = () => {
    addPlaceMutation.mutate(
      { id, ...placeMarker },
      {
        onSuccess: () => {
          navigate(-1);
        },
      },
    );
  };

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
      <ColorSelector
        activeColor={activeColor}
        setActiveColor={setActiveColor}
      />
      <Box>
        <button
          onClick={onSubmit}
          className={`h-14 w-full rounded-md ${activeColor ? 'bg-c_bg_blue' : 'bg-c_button_gray'} p-4 text-xl font-semibold text-white`}
          disabled={!activeColor && !place && !description}
        >
          완료
        </button>
      </Box>
      <Marker
        key={place.google_place_id}
        position={{
          lat: place.location.latitude,
          lng: place.location.longitude,
        }}
      />
    </BaseWrapper>
  );
};

export default DetailPlaceForm;
