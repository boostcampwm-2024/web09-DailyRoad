import { CustomPlace, Place } from '@/types';
import BaseWrapper from '../common/BaseWrapper';
import DashBoardHeader from '../common/DashBoardHeader';
import Box from '../common/Box';
import PlaceItem from './PlaceItem';
import PrevIcon from '../common/PrevIcon';

type PlaceDetailPanelProps = {
  place: Place & CustomPlace;
  onClosed: () => void;
};

const PlaceDetailPanel = ({ place, onClosed }: PlaceDetailPanelProps) => {
  return (
    <BaseWrapper position="" left="" top="" className="w-1/2">
      <Box>
        <button onClick={onClosed}>
          <PrevIcon />
        </button>
        <h2 className="p-4 text-xl font-semibold" id="review-heading">
          장소 상세 정보
        </h2>
        <PlaceItem place={place} isDetailPage={false} />
      </Box>
      <Box>
        <p>한줄평</p>
        <p>{place.comment}</p>
      </Box>
    </BaseWrapper>
  );
};

export default PlaceDetailPanel;
