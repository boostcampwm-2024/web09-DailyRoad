import { CustomPlace, Place } from '@/types';
import BaseWrapper from '../common/BaseWrapper';
import Box from '../common/Box';
import PlaceItem from './PlaceItem';
import React, { useCallback, useEffect, useState } from 'react';
import Marker from '../Marker/Marker';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useAddPlaceToCourseMutation } from '@/hooks/api/useAddPlaceToCourseMutation';
import { useParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';

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
  const addPlaceToCourseMutation = useAddPlaceToCourseMutation();
  const addToast = useStore((state) => state.addToast);
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
    addPlaceToCourseMutation.mutate(
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
      <BaseWrapper position="" top="" left="" className="h-2/3 w-1/2">
        {isDeleteMode && (
          <button onClick={handleDeleteModeToggle}>
            {isDeleteModeActive ? '취소' : '삭제'}
          </button>
        )}
        <Droppable key="placeList" droppableId="placeList">
          {(provided, snapshot) => (
            <Box ref={provided.innerRef} {...provided.droppableProps}>
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
      {places.map((place) => (
        <Marker
          key={place.id}
          position={{
            lat: place.location.latitude,
            lng: place.location.longitude,
          }}
        />
      ))}
    </DragDropContext>
  );
};

export default PlaceListPanel;
