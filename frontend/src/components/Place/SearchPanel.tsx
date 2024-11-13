import { useState } from 'react';

import BaseWrapper from '@/components/common/BaseWrapper';
import Box from '@/components/common/Box';
import DashBoardHeader from '../common/DashBoardHeader';

import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import AddPlaceButton from './AddPlaceButton';

const SearchPanel = () => {
  const [query, setQuery] = useState('');

  return (
    <BaseWrapper>
      <Box>
        <DashBoardHeader title="장소 검색" />
        <SearchBar onSearch={(newQuery) => setQuery(newQuery)} />
      </Box>
      <Box>
        <SearchResults query={query} />
      </Box>
      <AddPlaceButton />
    </BaseWrapper>
  );
};

export default SearchPanel;
