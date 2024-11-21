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
import type { Course, CoursePlace, CustomPlace, Map, Place } from '@/types';
import PlaceListPanel from './PlaceListPanel';

type SearchPanelProps = {
  mapData: Map | Course;
};

const SearchPanel = ({ mapData }: SearchPanelProps) => {
  const [query, setQuery] = useState('');
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);

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
            <SearchBar onSearch={(newQuery) => setQuery(newQuery)} />
          </Box>
          <Box>
            <SearchResults query={query} />
          </Box>
          <AddPlaceButton onClick={openFormModal} />
        </BaseWrapper>
        {isSidePanelOpen && (
          <PlaceListPanel
            places={mapData.places}
            isDeleteMode={true}
            isDraggable={mapData instanceof Map ? false : true}
          />
        )}
      </SideContainer>
      <Modal isOpen={isFormModalOpen} closeModal={closeFormModal}>
        <DetailPlaceForm
          oncloseModal={closeFormModal}
          placeList={mapData.places as CoursePlace[]}
        />
      </Modal>
    </>
  );
};

export default SearchPanel;
