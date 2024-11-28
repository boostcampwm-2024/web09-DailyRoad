import Footer from '@/pages/HomePage/Footer';
import Header from '@/pages/HomePage/Header';

import MainListPanel from './MainListPanel';
import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';

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
      <div className="flex justify-center p-4">
        <button
          onClick={onClick}
          className="w-30 flex h-10 items-center justify-center rounded-md border-[1.5px] border-c_button_gray p-2 text-lg"
        >
          나만의 지도 만들러 가기
        </button>
      </div>
      <MainListPanel />
      <Footer />
    </>
  );
};

export default Homepage;
