import useDeletePlaceMutation from '@/hooks/api/useDeletePlaceMutation';
import { useStore } from '@/store/useStore';
import { CreateMapType } from '@/types';
import { useParams } from 'react-router-dom';
import DeleteIcon from '../common/Icon/DeleteIcon';

type DeletePlaceButtonProps = {
  placeId: number;
};

const DeletePlaceButton = ({ placeId }: DeletePlaceButtonProps) => {
  const id = Number(useParams<string>().id);
  const mode = location.pathname.split('/')[2].toUpperCase() as CreateMapType;
  const deletePlaceMutation = useDeletePlaceMutation(mode);
  const addToast = useStore((state) => state.addToast);
  const onClick = () => {
    deletePlaceMutation.mutate(
      { id, placeId },
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
      onClick={onClick}
      aria-label="장소 삭제"
      className="absolute right-2 top-2"
    >
      <DeleteIcon width={16} height={16} className="hover:fill-red-600" />
    </button>
  );
};

export default DeletePlaceButton;
