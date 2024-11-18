import useDeletePlaceMutation from '@/hooks/api/useDeletePlaceMutation';
import { useStore } from '@/store/useStore';
import { useParams } from 'react-router-dom';

type DeletePlaceButtonProps = {
  placeId: number;
};

const DeletePlaceButton = ({ placeId }: DeletePlaceButtonProps) => {
  const id = Number(useParams<string>().id);
  const deletePlaceMutation = useDeletePlaceMutation();
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
  return <button onClick={onClick}>삭제</button>;
};

export default DeletePlaceButton;
