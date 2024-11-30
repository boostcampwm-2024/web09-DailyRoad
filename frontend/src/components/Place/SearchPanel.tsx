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
import { useLocation, useParams } from 'react-router-dom';
import SearchGoogleResults from './SearchGoogleResults';
import SearchModeButtons from './SearchModeButtons';

type SearchPanelProps = {
  mapData: Map | Course;
};

type SearchMode = 'PLACE' | 'GOOGLE';

const SearchPanel = ({ mapData }: SearchPanelProps) => {
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('PLACE');
  const location = useLocation();
  const mode = location.pathname.split('/')[2].toUpperCase() as CreateMapType;
  const id = Number(useParams<{ id: string }>().id);

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
            <SearchModeButtons
              searchMode={searchMode}
              setSearchMode={setSearchMode}
            />
            <SearchBar onSearch={(newQuery) => setQuery(newQuery)} />
          </Box>
          <Box>
            {searchMode === 'GOOGLE' ? (
              <SearchGoogleResults query={query} />
            ) : (
              <SearchResults places={mapData.places} query={query} />
            )}
          </Box>
          <AddPlaceButton onClick={openFormModal} />
        </BaseWrapper>

        {mapData.places.length && (
          <PlaceListPanel
            places={mapData.places}
            isDeleteMode={true}
            isDraggable={mode === 'MAP' ? false : true}
            id={id}
          />
        )}
      </SideContainer>
      <Modal isOpen={isFormModalOpen} closeModal={closeFormModal}>
        <DetailPlaceForm
          mode={mode}
          oncloseModal={closeFormModal}
          placeList={mapData.places as CoursePlace[]}
          id={id}
        />
      </Modal>
    </>
  );
};

export default SearchPanel;
