import { useNavigate } from 'react-router-dom';
import PrevIcon from './PrevIcon';

const PrevNavButton = () => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      aria-label="이전 페이지로 이동"
    >
      <PrevIcon />
    </button>
  );
};

export default PrevNavButton;
