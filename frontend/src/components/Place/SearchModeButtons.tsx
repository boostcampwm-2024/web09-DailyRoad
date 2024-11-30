const searchModeButtons = [
  { mode: 'PLACE' as const, label: '장소 검색' },
  { mode: 'GOOGLE' as const, label: '신규 장소 등록' },
];

type SearchModeButtonsProps = {
  searchMode: 'PLACE' | 'GOOGLE';
  setSearchMode: (mode: 'PLACE' | 'GOOGLE') => void;
};

const SearchModeButtons = ({
  searchMode,
  setSearchMode,
}: SearchModeButtonsProps) => {
  return (
    <div className="flex justify-center gap-2">
      {searchModeButtons.map(({ mode, label }) => (
        <button
          key={mode}
          type="button"
          onClick={() => setSearchMode(mode)}
          className={`rounded px-4 py-2 transition duration-150 ease-in-out ${
            searchMode === mode ? 'bg-c_bg_blue text-white' : 'bg-gray-200'
          } ${searchMode === mode ? 'hover:bg-blue-500' : 'hover:bg-gray-300'}`}
          aria-pressed={searchMode === mode}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default SearchModeButtons;
