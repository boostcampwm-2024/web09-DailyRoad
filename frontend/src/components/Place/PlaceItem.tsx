import { useStore } from '@/store/useStore';
import { Place } from '@/types';

type PlaceItemProps = {
  place: Place;
};

const PlaceItem = ({ place }: PlaceItemProps) => {
  const activePlace = useStore((state) => state.place);
  const setPlace = useStore((state) => state.setPlace);
  const moveToLocation = useStore((state) => state.moveTo);
  const location = place.location;

  const onPlaceClick = () => {
    setPlace(place);
    moveToLocation(location.lat, location.lng);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onPlaceClick();
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onPlaceClick}
      onKeyDown={onKeyDown}
      className={`flex items-center rounded-md border-[1px] ${place.id === activePlace.id ? 'border-1 border-c_bg_blue' : 'border-c_textarea_gray'} p-4`}
    >
      <img
        src={place.thumbnail_url}
        alt={place.name}
        className="h-16 w-16 rounded-md"
      />
      <div className="ml-4" aria-label={`${place.name} 정보`}>
        <h4 className="text-lg font-semibold">{place.name}</h4>
        <p className="text-gray-500">{place.formed_address}</p>
        <div className="text-yellow-500" aria-label={`평점 ${place.rating}점`}>
          {place.rating} ⭐️
        </div>
      </div>
    </article>
  );
};

export default PlaceItem;
