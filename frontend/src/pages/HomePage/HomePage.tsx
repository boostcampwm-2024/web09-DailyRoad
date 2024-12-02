import Footer from '@/pages/HomePage/Footer';
import Header from '@/pages/HomePage/Header';

import MainListPanel from './MainListPanel';

import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import SearchBar from '@/components/common/SearchBar';
import BannerSlider from '@/components/Banner/BannerSlider';

const Homepage = () => {
  const addToast = useStore((state) => state.addToast);
  const isLogged = useStore((state) => state.isLogged);
  const navigate = useNavigate();
  const onClick = () => {
    if (isLogged) {
      navigate('/create');
    } else {
      addToast('로그인 후 이용해주세요', '', 'error');
    }
  };

  const handleSearch = (keyword: string) => {
    window.location.href = `/search?query=${keyword}`;
  };

  return (
    <>
      <Header />
      <div className={'flex w-full flex-col items-center justify-center'}>
        <div className="mb-4 flex w-[1080px] flex-col items-center justify-center p-4">
          <SearchBar onSearch={handleSearch}></SearchBar>
          <BannerSlider
            className={'m-10 flex h-[426px] w-full rounded-md'}
          ></BannerSlider>
          <button
            onClick={onClick}
            className="flex h-[60px] w-[342px] items-center justify-center rounded-md border-[1.5px] border-c_brand_BLUE p-2 text-lg text-c_brand_BLUE"
          >
            나만의 지도 만들러 가기
          </button>
        </div>
        <MainListPanel />
      </div>
      <Footer />
    </>
  );
};

export default Homepage;
