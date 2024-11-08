import { useGoogleMapStore } from '@/store/googleMapState';
import { Place } from '@/types';

const PlaceItem = ({ place }: { place: Place }) => {
  const moveToLocation = useGoogleMapStore((state) => state.moveTo);
  const location = place.location;

  const onPlaceClick = () => {
    moveToLocation(location.lat, location.lng);
  };

  return (
    <div
      onClick={onPlaceClick}
      className="flex items-center border-b border-gray-200 p-4"
    >
      <img
        src={place.thumbnail_url}
        alt={place.name}
        className="h-16 w-16 rounded-md"
      />
      <div className="ml-4">
        <h4 className="text-lg font-semibold">{place.name}</h4>
        <p className="text-gray-500">{place.formed_address}</p>
        <div className="text-yellow-500">{place.rating} ⭐️</div>
      </div>
    </div>
  );
};

export default PlaceItem;
