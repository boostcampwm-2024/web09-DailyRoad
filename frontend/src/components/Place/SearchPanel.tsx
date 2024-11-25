import { useState } from 'react';

import BaseWrapper from '@/components/common/BaseWrapper';
import Box from '@/components/common/Box';
import DashBoardHeader from '@/components/common/DashBoardHeader';

import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import AddPlaceButton from './AddPlaceButton';
import SideContainer from '../common/SideContainer';
import DetailPlaceForm from './DetailPlaceForm';
import { useOverlay } from '@/hooks/useOverlay';
import Modal from '@/components/common/Modal/Modal';
import type { Course, CoursePlace, CreateMapType, Map } from '@/types';
import PlaceListPanel from './PlaceListPanel';
import { useLocation } from 'react-router-dom';
import SearchGoogleResults from './SearchGoogleResults';

type SearchPanelProps = {
  mapData: Map | Course;
};

const SearchPanel = ({ mapData }: SearchPanelProps) => {
  const [query, setQuery] = useState('');
  const [googleSearchMode, setGoogleSearchMode] = useState(false);
  const location = useLocation();
  const mode = location.pathname.split('/')[2].toUpperCase() as CreateMapType;

  const {
    isOpen: isFormModalOpen,
    close: closeFormModal,
    open: openFormModal,
  } = useOverlay();

  return (
    <>
      <SideContainer>
        <BaseWrapper position="" top="" left="" className="w-1/2">
          <Box>
            <DashBoardHeader title="장소 검색" />
            <div>
              <button
                onClick={() => {
                  setGoogleSearchMode(false);
                }}
              >
                장소 검색
              </button>
              <button
                onClick={() => {
                  setGoogleSearchMode(true);
                }}
              >
                신규 장소 등록
              </button>
            </div>
            <SearchBar onSearch={(newQuery) => setQuery(newQuery)} />
          </Box>
          <Box>
            {googleSearchMode ? (
              <SearchGoogleResults query={query} />
            ) : (
              <SearchResults places={mapData.places} query={query} />
            )}
          </Box>
          <AddPlaceButton onClick={openFormModal} />
        </BaseWrapper>
        {mapData.places.length ? (
          <PlaceListPanel
            places={mapData.places}
            isDeleteMode={true}
            isDraggable={mode === 'MAP' ? false : true}
          />
        ) : (
          <BaseWrapper
            position=""
            top=""
            left=""
            className="pointer-events-none w-1/2 bg-transparent bg-none"
          >
            {''}
          </BaseWrapper>
        )}
      </SideContainer>
      <Modal isOpen={isFormModalOpen} closeModal={closeFormModal}>
        <DetailPlaceForm
          mode={mode}
          oncloseModal={closeFormModal}
          placeList={mapData.places as CoursePlace[]}
        />
      </Modal>
    </>
  );
};

export default SearchPanel;
