import DetailPlaceForm from '@/components/Place/DetailPlaceForm';
import GoogleMap from '@/GoogleMap';

const PlaceCreatePage = () => {
  return (
    <>
      <GoogleMap />
      <DetailPlaceForm />
    </>
  );
};

export default PlaceCreatePage;
