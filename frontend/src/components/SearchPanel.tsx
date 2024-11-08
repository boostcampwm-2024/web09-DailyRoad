import { useState } from 'react';
import BaseWrapper from './BaseWrapper';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';

const SearchPanel = () => {
  const [query, setQuery] = useState('');

  return (
    <BaseWrapper>
      <SearchBar onSearch={(newQuery) => setQuery(newQuery)} />
      <SearchResults query={query} />
    </BaseWrapper>
  );
};

export default SearchPanel;
