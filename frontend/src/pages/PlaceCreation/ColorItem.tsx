import CheckIcon from '@/components/Place/CheckIcon';

import { MarkerColor } from '@/types';
import { markerBgColor } from '@/constants/map';

type ColorItemProps = {
  color: MarkerColor;
  activeColor: MarkerColor | null;
  setActiveColor: (color: MarkerColor) => void;
};

const ColorItem = ({ color, activeColor, setActiveColor }: ColorItemProps) => {
  const bgColor = markerBgColor[color];
  return (
    <div
      onClick={() => setActiveColor(color)}
      className={`${bgColor} flex h-11 w-11 cursor-pointer items-center justify-center rounded-md`}
    >
      {activeColor === color && <CheckIcon />}
    </div>
  );
};

export default ColorItem;
