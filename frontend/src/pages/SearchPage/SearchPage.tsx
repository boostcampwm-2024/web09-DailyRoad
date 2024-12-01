import Footer from '@/pages/HomePage/Footer';
import Header from '@/pages/HomePage/Header';

import MainListPanel from '../HomePage/MainListPanel';
import SearchBar from '@/components/common/SearchBar';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const [searchKeyword, setSearchKeyword] = useState(query);

  const handleSearch = (keyword: string) => {
    window.location.href = `/search?query=${keyword}`;
  };

  return (
    <>
      <Header />
      <div className={'flex w-full flex-col items-center justify-center'}>
        <div className="mb-4 flex w-[1080px] flex-col items-center justify-center p-4">
          <SearchBar onSearch={handleSearch} query={searchKeyword}></SearchBar>
        </div>
        <MainListPanel />
      </div>
      <Footer />
    </>
  );
};

export default SearchPage;
