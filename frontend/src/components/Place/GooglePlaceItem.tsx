import { GooglePlaceResponse } from '@/api/place';

type GooglePlaceItemProps = {
  place: GooglePlaceResponse;
};

const GooglePlaceItem = ({ place }: GooglePlaceItemProps) => {
  return (
    <div>
      <div>{place.name}</div>
      <div>{place.formed_address}</div>
    </div>
  );
};

export default GooglePlaceItem;
