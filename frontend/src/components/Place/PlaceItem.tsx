import DeletePlaceButton from './DeletePlaceButton';
import ImageWithSkeleton from '../ImageSkeleton';

import { useStore } from '@/store/useStore';
import { CustomPlace, Place } from '@/types';

type PlaceItemProps = {
  place: Place;
  places?: (Place & CustomPlace)[];
  isDetailPage?: boolean;
  itemMode?: 'default' | 'delete' | 'create';
};

const PlaceItem = ({
  place,
  isDetailPage,
  places = [],
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
      className={`relative flex h-full items-center gap-3 rounded-md border-[1px] ${place.id === activePlace.id && !isDetailPage ? 'border-1 border-c_bg_blue' : 'border-c_border_gray'} p-2`}
    >
      <ImageWithSkeleton
        src={place.thumbnail_url}
        alt={place.name}
        width={32}
        height={32}
      />

      <div className="w-48" aria-label={`${place.name} 정보`}>
        <h4 className="min-w-0 truncate text-lg font-semibold">{place.name}</h4>
        <p className="min-w-0 truncate text-sm text-gray-500">
          {place.formed_address}
        </p>
        <div
          className="flex items-center text-center text-sm text-yellow-500"
          aria-label={`평점 ${place.rating}점`}
        >
          ⭐️{place.rating ?? 0}
        </div>
      </div>
      {itemMode === 'delete' && (
        <DeletePlaceButton places={places} placeId={place.id} />
      )}
    </article>
  );
};

export default PlaceItem;
