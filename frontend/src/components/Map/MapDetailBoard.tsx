import BaseWrapper from '@/components/common/BaseWrapper';
import Box from '@/components/common/Box';
import DashBoardHeader from '@/components/common/DashBoardHeader';
import { Map } from '@/types';
import PlaceItem from '@/components/Place/PlaceItem';
import { useMemo, useState } from 'react';
import PlaceDetailPanel from '@/components/Place/PlaceDetailPanel';
import { useStore } from '@/store/useStore';
import SideContainer from '@/components/common/SideContainer';
import Marker from '@/components/Marker/Marker';
import DeleteMapButton from './DeleteMapButton';
import EditMapButton from './EditMapButton';

type MapDetailBoardProps = {
  mapData: Map;
};

const MapDetailBoard = ({ mapData }: MapDetailBoardProps) => {
  const { title, description, isPublic, thumbnailUrl, pinCount, places } =
    mapData;
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const activePlace = useStore((state) => state.place);
  const customPlace = useMemo(
    () => places.find((place) => place.id === activePlace.id),
    [places, activePlace],
  );

  return (
    <SideContainer>
      <BaseWrapper position="" top="" left="" className="w-1/2">
        <Box>
          <div className="flex justify-between">
            <DashBoardHeader title="나의 지도" />
            <div className="flex gap-1 text-center">
              <EditMapButton mapId={mapData.id} text="수정" />
              <p>|</p>
              <DeleteMapButton mapId={mapData.id} text="삭제" />
            </div>
          </div>
          <img src="/src/assets/Map.jpg" alt="map" className="h-40 w-full" />
          <h2>{title}</h2>
          <p>지도 소개</p>
          <p>{description}</p>
        </Box>
        <Box>
          {places.map((place) => (
            <div key={place.id} onClick={() => setIsSidePanelOpen(true)}>
              <PlaceItem key={place.id} place={place} isDetailPage={true} />
              <Marker
                key={place.google_place_id}
                position={{
                  lat: place.location.latitude,
                  lng: place.location.longitude,
                }}
              />
            </div>
          ))}
        </Box>
      </BaseWrapper>
      {isSidePanelOpen && customPlace && (
        <PlaceDetailPanel
          place={customPlace}
          onClosed={() => setIsSidePanelOpen(false)}
        />
      )}
    </SideContainer>
  );
};

export default MapDetailBoard;
