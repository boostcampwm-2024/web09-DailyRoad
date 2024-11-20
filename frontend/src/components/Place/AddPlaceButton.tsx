import { useStore } from '@/store/useStore';
import Box from '../common/Box';

type AddPlaceButtonProps = {
  onClick: () => void;
};

const AddPlaceButton = ({ onClick }: AddPlaceButtonProps) => {
  const activePlace = useStore((state) => state.place);
  return (
    <Box>
      <button
        className={`h-14 w-full rounded-md ${activePlace ? 'bg-c_bg_blue' : 'bg-c_button_gray'} p-4 text-xl font-semibold text-white`}
        disabled={!activePlace}
        onClick={onClick}
      >
        장소 추가하기
      </button>
    </Box>
  );
};

export default AddPlaceButton;
