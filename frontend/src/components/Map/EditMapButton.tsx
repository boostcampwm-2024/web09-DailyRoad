import { useNavigate } from 'react-router-dom';

type EditMapButtonProps = {
  mapId: number;
  text: string;
};

const EditMapButton = ({ mapId, text }: EditMapButtonProps) => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(`/edit/map/${mapId}`);
  };
  return (
    <button onClick={onClick} className="text-xs text-c_placeholder_gray">
      {text}
    </button>
  );
};

export default EditMapButton;
