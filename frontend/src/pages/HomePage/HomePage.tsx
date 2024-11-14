import Footer from '@/pages/HomePage/Footer';
import Header from '@/pages/HomePage/Header';
import NavigateButton from '@/components/common/NavigateButton';
import MapListPanel from '@/components/MapListPanel';

const Homepage = () => {
  return (
    <>
      <Header />
      <NavigateButton text="나만의 지도 만들러 가기" to="/create" />
      <MapListPanel />
      <Footer />
    </>
  );
};

export default Homepage;
