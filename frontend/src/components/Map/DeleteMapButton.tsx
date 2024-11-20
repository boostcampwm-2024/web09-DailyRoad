import useDeleteMapMutation from '@/hooks/api/useDeleteMapMutation';
import { CreateMapType } from '@/types';

/**todo : 삭제 모달 구현*/

type DeleteMapButtonProps = {
  mapId: number;
  text: string;
};

const DeleteMapButton = ({ mapId, text }: DeleteMapButtonProps) => {
  const mode = location.pathname.split('/')[2].toUpperCase() as CreateMapType;
  const deleteMutation = useDeleteMapMutation(mode);
  const onClick = () => {
    deleteMutation.mutate(mapId);
  };
  return (
    <button onClick={onClick} className="text-xs text-c_placeholder_gray">
      {text}
    </button>
  );
};

export default DeleteMapButton;
