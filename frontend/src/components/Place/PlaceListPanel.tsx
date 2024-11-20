import { CustomPlace, Place } from '@/types';
import BaseWrapper from '../common/BaseWrapper';
import Box from '../common/Box';
import PlaceItem from './PlaceItem';
import React, { useCallback, useState } from 'react';
import Marker from '../Marker/Marker';

type PlaceListPanelProps = {
  places: (Place & CustomPlace)[];
  isDraggable?: boolean;
  isDeleteMode?: boolean;
};

const PlaceListPanel = ({
  places,
  isDeleteMode = false,
  isDraggable = false,
}: PlaceListPanelProps) => {
  const [isDeleteModeActive, setIsDeleteModeActive] = useState(false);

  const handleDeleteModeToggle = useCallback(() => {
    setIsDeleteModeActive((prev) => !prev);
  }, []);

  return (
    <BaseWrapper position="" top="" left="" className="h-2/3 w-1/2">
      {isDeleteMode && (
        <button onClick={handleDeleteModeToggle}>
          {isDeleteModeActive ? '취소' : '삭제'}
        </button>
      )}
      <Box>
        {places.map((place) => (
          <React.Fragment key={place.id}>
            <PlaceItem
              place={place}
              isDetailPage={true}
              itemMode={isDeleteModeActive ? 'delete' : 'default'}
            />
            <Marker
              position={{
                lat: place.location.latitude,
                lng: place.location.longitude,
              }}
            />
          </React.Fragment>
        ))}
      </Box>
    </BaseWrapper>
  );
};

export default PlaceListPanel;
