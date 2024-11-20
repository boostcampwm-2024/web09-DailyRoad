import { useNavigate } from 'react-router-dom';

type EditMapButtonProps = {
  mapId: number;
  text: string;
  to: string;
};

const EditMapButton = ({ mapId, text, to }: EditMapButtonProps) => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(to);
  };
  return (
    <button onClick={onClick} className="text-xs text-c_placeholder_gray">
      {text}
    </button>
  );
};

export default EditMapButton;
