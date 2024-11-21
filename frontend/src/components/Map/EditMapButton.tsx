import { useNavigate } from 'react-router-dom';

type EditMapButtonProps = {
  text: string;
  to: string;
  className?: string;
};

const EditMapButton = ({ text, to, className }: EditMapButtonProps) => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(to);
  };
  return (
    <button
      onClick={onClick}
      className={`text-xs text-c_placeholder_gray ${className}`}
    >
      {text}
    </button>
  );
};

export default EditMapButton;
