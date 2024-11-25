import Footer from '@/pages/HomePage/Footer';
import Header from '@/pages/HomePage/Header';

import NavigateButton from '@/components/common/NavigateButton';

import MainListPanel from './MainListPanel';

const Homepage = () => {
  return (
    <>
      <Header />
      <div className="flex justify-center p-4">
        <NavigateButton
          to="/create"
          text="나만의 지도 만들러 가기"
          className="w-30 flex h-10 items-center justify-center rounded-md border-[1.5px] border-c_button_gray p-2 text-lg"
        />
      </div>
      <MainListPanel />
      <Footer />
    </>
  );
};

export default Homepage;
