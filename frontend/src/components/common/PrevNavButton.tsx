import { useNavigate } from 'react-router-dom';
import PrevIcon from './PrevIcon';

const PrevNavButton = () => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(-1)}>
      <PrevIcon />
    </button>
  );
};

export default PrevNavButton;
