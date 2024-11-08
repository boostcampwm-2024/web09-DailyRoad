import { useNavigate } from 'react-router-dom';

type NavigateButtonProps = {
  text: string;
  to: string;
};

const NavigateButton = ({ text, to }: NavigateButtonProps) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(to);
  };
  return <button onClick={handleClick}>{text}</button>;
};

export default NavigateButton;
