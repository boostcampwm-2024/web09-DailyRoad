import { useStore } from '@/store/useStore';
import Box from '../common/Box';
import { useLocation, useNavigate } from 'react-router-dom';

const AddPlaceButton = () => {
  const activePlace = useStore((state) => state.place);
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Box>
      <button
        className={`h-14 w-full rounded-md ${activePlace ? 'bg-c_bg_blue' : 'bg-c_button_gray'} p-4 text-xl font-semibold text-white`}
        disabled={!activePlace}
        onClick={() => navigate(`${location.pathname}/${activePlace?.id}`)}
      >
        장소 추가하기
      </button>
    </Box>
  );
};

export default AddPlaceButton;
