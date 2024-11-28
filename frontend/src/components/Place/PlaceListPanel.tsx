import { CustomPlace, Place } from '@/types';
import BaseWrapper from '../common/BaseWrapper';
import Box from '../common/Box';
import PlaceItem from './PlaceItem';
import { useCallback, useMemo, useState } from 'react';
import Marker from '../Marker/Marker';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { usePutPlaceToCourseMutation } from '@/hooks/api/usePutPlaceToCourseMutation';
import { useParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import Polyline from '../Marker/Polyline';

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
  const id = Number(useParams().id);
  const putPlaceToCourseMutation = usePutPlaceToCourseMutation();
  const addToast = useStore((state) => state.addToast);

  const points = useMemo(() => {
    return places.map((place) => ({
      lat: place.location.latitude,
      lng: place.location.longitude,
    }));
  }, [places]);

  const handleDragend = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(places);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const newPlaces = items.map((place, index) => ({
      placeId: place.id,
      comment: place.comment,
      order: index + 1,
    }));
    putPlaceToCourseMutation.mutate(
      { id, places: newPlaces },
      {
        onSuccess: () => {
          addToast('장소 순서가 변경되었습니다.', '', 'success');
        },
      },
    );
  };

  const handleDeleteModeToggle = useCallback(() => {
    setIsDeleteModeActive((prev) => !prev);
  }, []);

  return (
    <DragDropContext onDragEnd={handleDragend}>
      <BaseWrapper
        position=""
        top=""
        left=""
        className="scrollbar-thumb-rounded-lg h-2/3 w-1/2 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 hover:scrollbar-track-gray-200 hover:scrollbar-thumb-gray-500"
      >
        <Droppable key="placeList" droppableId="placeList">
          {(provided, snapshot) => (
            <Box ref={provided.innerRef} {...provided.droppableProps}>
              <h2 className="text-lg font-semibold">{`나의 장소 리스트`}</h2>
              {isDeleteMode && (
                <button
                  className="border-bg-c_button_gray rounded-md border-[0.5px]"
                  onClick={handleDeleteModeToggle}
                >
                  {isDeleteModeActive ? '취소' : '삭제모드'}
                </button>
              )}
              {places.map((place, index) => (
                <Draggable
                  isDragDisabled={!isDraggable}
                  key={place.google_place_id.toString()}
                  draggableId={place.id.toString()}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={snapshot.isDragging ? 'opacity-50' : ''}
                    >
                      <PlaceItem
                        place={place}
                        isDetailPage={true}
                        itemMode={isDeleteModeActive ? 'delete' : 'default'}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </BaseWrapper>
      {places.map((place, index) => (
        <Marker
          key={place.id}
          position={{
            lat: place.location.latitude,
            lng: place.location.longitude,
          }}
          category={place.category}
          color={place.color}
          title={place.name}
          order={isDraggable ? index + 1 : undefined}
        />
      ))}
      {isDraggable && <Polyline points={points} />}
    </DragDropContext>
  );
};

export default PlaceListPanel;
