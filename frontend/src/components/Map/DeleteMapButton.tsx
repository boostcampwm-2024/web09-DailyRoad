import { useNavigate } from 'react-router-dom';

import useDeleteMapMutation from '@/hooks/api/useDeleteMapMutation';
import { useStore } from '@/store/useStore';
import { CreateMapType } from '@/types';

/**todo : 삭제 모달 구현*/

type DeleteMapButtonProps = {
  mapId: number;
  text: string;
};

const DeleteMapButton = ({ mapId, text }: DeleteMapButtonProps) => {
  const mode = location.pathname.split('/')[1].toUpperCase() as CreateMapType;
  const deleteMutation = useDeleteMapMutation(mode);
  const addToast = useStore((state) => state.addToast);
  const navigate = useNavigate();

  const onClick = () => {
    deleteMutation.mutate(mapId, {
      onSuccess: () => {
        addToast('지도가 삭제되었습니다.', '', 'success');
        navigate('/');
      },
    });
  };
  return (
    <button onClick={onClick} className="text-xs text-c_placeholder_gray">
      {text}
    </button>
  );
};

export default DeleteMapButton;
