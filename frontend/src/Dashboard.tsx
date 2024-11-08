import { useState } from 'react';

import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';

const Dashboard = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="absolute left-0 top-0 h-full w-96 bg-white">
      <SearchBar onSearch={(query) => setQuery(query)} />
      <SearchResults query={query} />
    </div>
  );
};

export default Dashboard;
