import useDeleteMapMutation from '@/hooks/api/useDeleteMapMutation';

/**todo : 삭제 모달 구현*/

type DeleteMapButtonProps = {
  mapId: number;
  text: string;
};

const DeleteMapButton = ({ mapId, text }: DeleteMapButtonProps) => {
  const deleteMutation = useDeleteMapMutation();

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
