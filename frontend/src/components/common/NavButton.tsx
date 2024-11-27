import { useNavigate } from 'react-router-dom';
import PrevIcon from './PrevIcon';

type NavButtonProps = {
  to: string;
};

const NavButton = ({ to }: NavButtonProps) => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      aria-label="이전 페이지로 이동"
    >
      <PrevIcon />
    </button>
  );
};

export default NavButton;
