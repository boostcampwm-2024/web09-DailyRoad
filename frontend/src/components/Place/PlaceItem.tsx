import { useStore } from '@/store/useStore';
import { Place } from '@/types';

import DeletePlaceButton from './DeletePlaceButton';
type PlaceItemProps = {
  place: Place;
  isDetailPage?: boolean;
  itemMode?: 'default' | 'delete' | 'create';
};

const PlaceItem = ({
  place,
  isDetailPage,
  itemMode = 'default',
}: PlaceItemProps) => {
  const activePlace = useStore((state) => state.place);
  const setPlace = useStore((state) => state.setPlace);
  const moveToLocation = useStore((state) => state.moveTo);
  const location = place.location;

  const onPlaceClick = () => {
    setPlace(place);
    moveToLocation(location.latitude, location.longitude);
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onPlaceClick}
      className={`relative flex items-center rounded-md border-[1px] ${place.id === activePlace.id && !isDetailPage ? 'border-1 border-c_bg_blue' : 'border-c_border_gray'} p-4`}
    >
      <img
        src="/src/assets/Map.jpg"
        alt={place.name}
        className="h-16 w-16 rounded-md"
      />
      <div className="ml-4" aria-label={`${place.name} 정보`}>
        <h4 className="text-lg font-semibold">{place.name}</h4>
        <p className="text-sm text-gray-500">{place.formed_address}</p>
        <div
          className="flex items-center text-center text-sm text-yellow-500"
          aria-label={`평점 ${place.rating}점`}
        >
          ⭐️{place.rating}
        </div>
      </div>
      {itemMode === 'delete' && <DeletePlaceButton placeId={place.id} />}
    </article>
  );
};

export default PlaceItem;
