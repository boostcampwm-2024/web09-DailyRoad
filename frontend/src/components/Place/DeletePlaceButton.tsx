import useDeletePlaceMutation from '@/hooks/api/useDeletePlaceMutation';
import { useStore } from '@/store/useStore';
import { CreateMapType, CustomPlace, Place } from '@/types';
import { useParams } from 'react-router-dom';
import DeleteIcon from '../common/DeleteIcon';
import { usePutPlaceToCourseMutation } from '@/hooks/api/usePutPlaceToCourseMutation';
import { useMemo } from 'react';

type DeletePlaceButtonProps = {
  placeId: number;
  places: (Place & CustomPlace)[];
};

const DeletePlaceButton = ({ placeId, places }: DeletePlaceButtonProps) => {
  const id = Number(useParams<string>().id);
  const mode = location.pathname.split('/')[2].toUpperCase() as CreateMapType;
  const deletePlaceMutation = useDeletePlaceMutation(mode);
  const putPlaceToCourseMutation = usePutPlaceToCourseMutation();
  const addToast = useStore((state) => state.addToast);

  const onClickMapMode = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    deletePlaceMutation.mutate(
      { id, placeId },
      {
        onSuccess: () => {
          addToast('장소가 삭제되었습니다.', '', 'success');
        },
      },
    );
  };

  const newPlaces = useMemo(
    () =>
      places.map((place, index) => ({
        placeId: place.id,
        comment: place.comment,
        order: index + 1,
      })),
    [places],
  );

  const onClickCourseMode = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    putPlaceToCourseMutation.mutate(
      { id, places: newPlaces },
      {
        onSuccess: () => {
          addToast('장소가 삭제되었습니다.', '', 'success');
        },
      },
    );
  };

  return (
    <button
      type="button"
      onClick={mode === 'MAP' ? onClickMapMode : onClickCourseMode}
      aria-label="장소 삭제"
      className="absolute right-2 top-2"
    >
      <DeleteIcon width={16} height={16} className="hover:fill-red-600" />
    </button>
  );
};

export default DeletePlaceButton;
