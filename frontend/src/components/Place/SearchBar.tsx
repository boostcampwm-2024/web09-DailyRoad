import { useState } from 'react';
import SearchIcon from './SearchIcon';

type SearchBarProps = {
  onSearch: (query: string) => void;
};

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [input, setInput] = useState('');
  const isValidInput = (input: string) => input.trim().length > 0;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (!isValidInput(input)) return;
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
        aria-label="장소 검색"
        onKeyDown={handleKeyPress}
      />
      <button
        type="button"
        onClick={handleSearch}
        className="text-c_bg_blue"
        aria-label="검색"
      >
        <SearchIcon />
      </button>
    </div>
  );
};

export default SearchBar;
