import { useStore } from '@/store/useStore';
import PlaceItem from './PlaceItem';
import TextInputArea from '../common/TextInputArea';
import { useCallback, useMemo, useState } from 'react';
import Box from '../common/Box';

import DashBoardHeader from '../common/DashBoardHeader';
import {
  CoursePlace,
  CreateMapType,
  CustomPlace,
  MarkerColor,
  Place,
} from '@/types';
import ColorSelector from '@/pages/PlaceCreation/ColorSelector';
import { useAddPlaceMutation } from '@/hooks/api/useAddPlaceMutation';
import { usePutPlaceToCourseMutation } from '@/hooks/api/usePutPlaceToCourseMutation';

type DetailPlaceFormProps = {
  oncloseModal: () => void;
  placeList: CoursePlace[];
  mode: CreateMapType;
  id: number;
};

const DetailPlaceForm = ({
  oncloseModal,
  placeList,
  mode,
  id,
}: DetailPlaceFormProps) => {
  const place = useStore((state) => state.place);
  const setPlace = useStore((state) => state.setPlace);
  const addToast = useStore((state) => state.addToast);

  const [description, setDescription] = useState('');
  const [activeColor, setActiveColor] = useState<MarkerColor>('RED');

  const addPlaceMutation = useAddPlaceMutation();
  const addPlaceToCourseMutation = usePutPlaceToCourseMutation();

  const placeMarker: CustomPlace = {
    placeId: place.id,
    color: activeColor as MarkerColor,
    comment: description,
  };

  const newPlaceList = useMemo(
    () => [
      ...placeList.map((place) => ({
        placeId: place.id,
        comment: place.comment,
        order: place.order + 1,
      })),
      {
        placeId: place.id,
        comment: placeMarker.comment,
        order: placeList.length + 1,
      },
    ],
    [placeList, placeMarker],
  );
  const onSubmit = () => {
    if (mode === 'MAP') {
      addPlaceMutation.mutate(
        { id, ...placeMarker },
        {
          onSuccess: () => {
            addToast('장소가 추가되었습니다.', '', 'success');
            setPlace({} as Place);
            oncloseModal();
          },
        },
      );
      return;
    }
    addPlaceToCourseMutation.mutate(
      { id, places: newPlaceList },
      {
        onSuccess: () => {
          addToast('장소가 추가되었습니다.', '', 'success');
          setPlace({} as Place);
          oncloseModal();
        },
      },
    );
  };

  return (
    place.id && (
      <>
        <Box role="region" aria-label="장소 상세 정보">
          <header className="flex gap-2">
            <DashBoardHeader title="장소 추가하기" hasNavButton={false} />
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
        {mode === 'MAP' && (
          <ColorSelector
            activeColor={activeColor}
            setActiveColor={setActiveColor}
          />
        )}
        <Box>
          <button
            onClick={onSubmit}
            className={`h-14 w-full rounded-md ${activeColor ? 'bg-c_bg_blue' : 'bg-c_button_gray'} p-4 text-xl font-semibold text-white`}
            disabled={!activeColor && !place && !description}
          >
            완료
          </button>
        </Box>
      </>
    )
  );
};

export default DetailPlaceForm;
