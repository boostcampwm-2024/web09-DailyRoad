import Footer from '@/pages/HomePage/Footer';
import Header from '@/pages/HomePage/Header';
import NavigateButton from '@/components/common/NavigateButton';
import MapListPanel from '@/components/MapListPanel';

const Homepage = () => {
  return (
    <>
      <Header />
      <MapListPanel />
      <Footer />
    </>
  );
};

export default Homepage;
