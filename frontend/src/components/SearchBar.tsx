import { useState } from 'react';

type SearchBarProps = {
  onSearch: (query: string) => void;
};

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [input, setInput] = useState('');

  const handleSearch = () => {
    onSearch(input);
  };

  return (
    <div className="flex h-20 gap-1 p-4">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="검색어를 입력하세요"
        className="w-full rounded border p-2"
      />
      <button onClick={handleSearch} className="rounded bg-blue-500 text-white">
        검색
      </button>
    </div>
  );
};

export default SearchBar;
