import { useEffect, useMemo, useState } from 'react';

import BaseWrapper from '@/components/common/BaseWrapper';
import Box from '@/components/common/Box';
import DashBoardHeader from '@/components/common/DashBoardHeader';
import PlaceItem from '@/components/Place/PlaceItem';
import PlaceDetailPanel from '@/components/Place/PlaceDetailPanel';
import SideContainer from '@/components/common/SideContainer';
import Marker from '@/components/Marker/Marker';
import Polyline from '@/components/Marker/Polyline';
import DeleteMapButton from './DeleteMapButton';
import EditMapButton from './EditMapButton';

import { useStore } from '@/store/useStore';
import { Course } from '@/types';

type MapDetailBoardProps = {
  courseData: Course;
};

const CourseDetailBoard = ({ courseData }: MapDetailBoardProps) => {
  const { title, description, isPublic, thumbnailUrl, pinCount, places } =
    courseData;
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  const activePlace = useStore((state) => state.place);
  const user = useStore((state) => state.user);
  const googleMap = useStore((state) => state.googleMap);
  const moveTo = useStore((state) => state.moveTo);

  const customPlace = useMemo(
    () => places.find((place) => place.id === activePlace.id),
    [places, activePlace.id],
  );

  const points = useMemo(() => {
    return places.map((place) => ({
      lat: place.location.latitude,
      lng: place.location.longitude,
    }));
  }, [places]);

  const isOwner = user?.id === courseData.user.id;

  useEffect(() => {
    if (places.length > 0 && googleMap) {
      moveTo(places[0].location.latitude, places[0].location.longitude);
    }
  }, [places, googleMap]);

  return (
    <SideContainer>
      <BaseWrapper position="" top="" left="" className="w-1/2">
        <Box>
          <div className="flex justify-between">
            <DashBoardHeader title={title} />
            {isOwner && (
              <div className="flex items-center gap-1 text-center">
                <EditMapButton
                  text="수정"
                  to={`/edit/course/${courseData.id}`}
                />
                <p className="text-xs text-c_placeholder_gray">|</p>
                <DeleteMapButton mapId={courseData.id} text="삭제" />
              </div>
            )}
          </div>
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt="thumbnail" className="h-40 w-full" />
          ) : (
            <img src="/src/assets/Map.jpg" alt="map" className="h-40 w-full" />
          )}
          <p className="text-lg font-semibold">지도 소개</p>
          <div className="rounded-md border-[1px] border-gray-100 p-1">
            {description}
          </div>
        </Box>
        <Box className="scrollbar-thumb-rounded-lg min-h-80 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 hover:scrollbar-track-gray-200 hover:scrollbar-thumb-gray-500">
          {isOwner && (
            <EditMapButton
              text="수정"
              to={`/create/course/${courseData.id}`}
              className="flex justify-end px-2"
            />
          )}
          {places && places.length > 0 ? (
            <>
              {places.map((place) => (
                <div key={place.id} onClick={() => setIsSidePanelOpen(true)}>
                  <PlaceItem key={place.id} place={place} isDetailPage={true} />
                  <Marker
                    key={place.google_place_id}
                    position={{
                      lat: place.location.latitude,
                      lng: place.location.longitude,
                    }}
                    order={place.order}
                    title={place.name}
                    description={place.comment}
                    address={place.formed_address}
                  />
                </div>
              ))}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-lg text-gray-400">등록된 장소가 없습니다.</p>
            </div>
          )}
        </Box>
      </BaseWrapper>
      {isSidePanelOpen && customPlace && (
        <PlaceDetailPanel
          place={customPlace}
          onClosed={() => setIsSidePanelOpen(false)}
        />
      )}
      <Polyline points={points} />
    </SideContainer>
  );
};

export default CourseDetailBoard;
