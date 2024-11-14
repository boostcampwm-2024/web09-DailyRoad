import { useNavigate } from 'react-router-dom';

type NavigateButtonProps = {
  text: string;
  to: string;
  className?: string;
};

const NavigateButton = ({ text, to, className }: NavigateButtonProps) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(to);
  };
  return (
    <button className={className} onClick={handleClick}>
      {text}
    </button>
  );
};

export default NavigateButton;
