import useDeletePlaceMutation from '@/hooks/api/useDeletePlaceMutation';
import { useParams } from 'react-router-dom';

type DeletePlaceButtonProps = {
  placeId: number;
};

const DeletePlaceButton = ({ placeId }: DeletePlaceButtonProps) => {
  const id = Number(useParams<string>().id);
  const deletePlaceMutation = useDeletePlaceMutation();
  const onClick = () => {
    deletePlaceMutation.mutate({ id, placeId });
  };
  return <button onClick={onClick}>삭제</button>;
};

export default DeletePlaceButton;
