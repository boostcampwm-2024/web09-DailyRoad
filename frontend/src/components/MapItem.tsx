import { MapItemType } from '@/types';
import { Link } from 'react-router-dom';

type MapItemProps = {
  mapItem: MapItemType;
};

const MapItem = ({ mapItem }: MapItemProps) => {
  return (
    <Link to={`/map/${mapItem.id}`}>
      <div className="flex w-40 flex-col gap-2">
        <img src={mapItem.thumbnailUrl}></img>
        <p>{mapItem.title}</p>
        <div className="flex gap-1">
          <img src={mapItem.user.profile_url}></img>
          <p>{mapItem.user.nickname}</p>
        </div>
        <p>{mapItem.description}</p>
      </div>
    </Link>
  );
};

export default MapItem;
