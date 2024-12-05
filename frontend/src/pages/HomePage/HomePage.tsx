import Footer from '@/pages/HomePage/Footer';
import Header from '@/pages/HomePage/Header';

import MainListPanel from './MainListPanel';

import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import BannerSlider from '@/components/Banner/BannerSlider';
import ArrowIcon from '@/components/common/DummyIcon';

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

  return (
    <>
      <Header />
      <div
        className={
          'flex min-h-screen w-full flex-col items-center justify-start'
        }
      >
        <div
          onClick={onClick}
          className="mt-8 flex h-12 w-[300px] cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-c_brand_BLUE p-2 transition-all duration-150 hover:scale-105"
        >
          <p className="text-lg font-semibold text-c_brand_BLUE">
            나만의 지도 만들러 가기
          </p>
          <ArrowIcon width={24} height={24} />
        </div>
        <div className="flex w-[1080px] flex-col items-center justify-center p-5">
          <BannerSlider
            className={'h-100 mb-10 mt-5 flex w-full'}
          ></BannerSlider>
        </div>
        <MainListPanel />
      </div>
      <Footer />
    </>
  );
};

export default Homepage;
