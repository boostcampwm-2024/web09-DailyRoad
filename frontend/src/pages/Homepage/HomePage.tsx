import Footer from '@/pages/HomePage/Footer';
import Header from '@/pages/HomePage/Header';
import NavigateButton from '@/components/common/NavigateButton';

const Homepage = () => {
  return (
    <>
      <Header />
      <NavigateButton text="나만의 지도 만들러 가기" to="/create" />
      <Footer />
    </>
  );
};

export default Homepage;
