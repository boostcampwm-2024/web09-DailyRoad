import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (value: string) => void;
  query?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, query }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearch = () => {
    onSearch(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative flex h-14 w-[600px] items-center justify-between overflow-hidden rounded-[10.67px] border-[1.33px] border-[#00a3ff] bg-[#f9f9f9] px-4">
      <input
        type="text"
        placeholder={query || '검색어를 입력해주세요'}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        className="w-full flex-grow bg-transparent text-[21px] text-[#858899] outline-none placeholder:text-[#858899]"
      />
      <button
        onClick={handleSearch}
        className="ml-4 flex-shrink-0 flex-grow-0 p-2"
        aria-label="검색"
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M17.6667 17.6667L24 24M20 11C20 15.9706 15.9706 20 11 20C6.02944 20 2 15.9706 2 11C2 6.02944 6.02944 2 11 2C15.9706 2 20 6.02944 20 11Z"
            stroke="#00A3FF"
            strokeWidth="2.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default SearchBar;
