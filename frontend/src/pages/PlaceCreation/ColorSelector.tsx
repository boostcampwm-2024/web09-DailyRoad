import Box from '@/components/common/Box';
import ColorItem from './ColorItem';

import { MARKER_COLORS } from '@/constants/map';
import { MarkerColor } from '@/types';

type ColorSelectorProps = {
  activeColor: MarkerColor | null;
  setActiveColor: (color: MarkerColor) => void;
};

const ColorSelector = ({ activeColor, setActiveColor }: ColorSelectorProps) => {
  return (
    <Box>
      <h2 className="text-xl font-semibold">색상 선택</h2>
      <div className="flex gap-2">
        {MARKER_COLORS.map((color: MarkerColor) => (
          <ColorItem
            key={color}
            color={color}
            activeColor={activeColor}
            setActiveColor={setActiveColor}
          />
        ))}
      </div>
    </Box>
  );
};

export default ColorSelector;
