import { useState } from 'react';
import SearchIcon from './SearchIcon';

type SearchBarProps = {
  onSearch: (query: string) => void;
};

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [input, setInput] = useState('');

  const handleSearch = () => {
    onSearch(input);
  };

  return (
    <div className="flex h-10 gap-1 rounded-md border-[1px] border-c_bg_blue px-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="검색어를 입력하세요"
        className="w-full outline-none"
      />
      <button onClick={handleSearch} className="text-c_bg_blue">
        <SearchIcon />
      </button>
    </div>
  );
};

export default SearchBar;
