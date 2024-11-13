import { useState } from 'react';

import BaseWrapper from '../common/BaseWrapper';
import Box from '../common/Box';

import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import AddPlaceButton from './AddPlaceButton';

const SearchPanel = () => {
  const [query, setQuery] = useState('');

  return (
    <BaseWrapper>
      <Box>
        <h2 className="p-4 text-xl font-semibold">장소 검색</h2>
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
