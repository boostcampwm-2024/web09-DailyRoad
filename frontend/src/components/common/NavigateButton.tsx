import { useNavigate } from 'react-router-dom';

type NavigateButtonProps = {
  text: string;
  to: string;
  className?: string;
};

const NavigateButton = ({ text, to, className = '' }: NavigateButtonProps) => {
  const navigate = useNavigate();
  const handleNavigation = () => {
    navigate(to);
  };
  return (
    <button type="button" className={className} onClick={handleNavigation}>
      {text}
    </button>
  );
};

export default NavigateButton;
