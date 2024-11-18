import { useState } from 'react';

import BaseWrapper from '@/components/common/BaseWrapper';
import Box from '@/components/common/Box';
import DashBoardHeader from '@/components/common/DashBoardHeader';

import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import AddPlaceButton from './AddPlaceButton';
import SideContainer from '../common/SideContainer';
import DetailPlaceForm from './DetailPlaceForm';

const SearchPanel = () => {
  const [query, setQuery] = useState('');
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);

  return (
    <SideContainer>
      <BaseWrapper position="" top="" left="" className="w-1/2">
        <Box>
          <DashBoardHeader title="장소 검색" />
          <SearchBar onSearch={(newQuery) => setQuery(newQuery)} />
        </Box>
        <Box>
          <SearchResults query={query} />
        </Box>
        <AddPlaceButton />
      </BaseWrapper>
      {isSidePanelOpen && <DetailPlaceForm />}
    </SideContainer>
  );
};

export default SearchPanel;
