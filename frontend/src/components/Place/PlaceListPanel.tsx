import { CustomPlace, Place } from '@/types';
import BaseWrapper from '../common/BaseWrapper';
import Box from '../common/Box';
import PlaceItem from './PlaceItem';
import React, { useState } from 'react';
import Marker from '../Marker/Marker';

type PlaceListPanelProps = {
  places: (Place & CustomPlace)[];
};

const PlaceListPanel = ({ places }: PlaceListPanelProps) => {
  const [deleteMode, setDeleteMode] = useState(false);
  return (
    <BaseWrapper position="" top="" left="" className="h-2/3 w-1/2">
      <button onClick={() => setDeleteMode(!deleteMode)}>
        삭제 모드{deleteMode ? '취소' : ''}
      </button>
      <Box>
        {places.map((place) => (
          <React.Fragment key={place.id}>
            <PlaceItem
              key={place.id}
              place={place}
              isDetailPage={true}
              isDeleteMode={deleteMode}
            />
            <Marker
              key={place.google_place_id}
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
