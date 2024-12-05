import BaseWrapper from '@/components/common/BaseWrapper';
import PrevIcon from '@/components/common/PrevIcon';
import Box from '@/components/common/Box';
import PlaceItem from './PlaceItem';

import { CustomPlace, Place } from '@/types';

type PlaceDetailPanelProps = {
  place: Place & CustomPlace;
  onClosed: () => void;
};

const PlaceDetailPanel = ({ place, onClosed }: PlaceDetailPanelProps) => {
  return (
    <BaseWrapper position="" left="" top="" className="h-auto w-1/2">
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
        <p className="font-semibold">한줄평</p>
        <div className="flex items-center justify-center text-c_placeholder_gray">
          <p>{place.comment ?? '한줄평이 없습니다.'}</p>
        </div>
      </Box>
    </BaseWrapper>
  );
};

export default PlaceDetailPanel;
