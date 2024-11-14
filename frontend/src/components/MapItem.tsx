import { MapItemType } from '@/types';
import { Link } from 'react-router-dom';
import PinIcon from './PinIcon';
import MapThumbnail from './MapThumbnail';

type MapItemProps = {
  mapItem: MapItemType;
};

const MapItem = ({ mapItem }: MapItemProps) => {
  return (
    <Link to={`/map/${mapItem.id}`}>
      <div className="flex h-60 w-44 flex-col gap-2 rounded-md border-[1.5px] border-gray-200 p-4">
        {mapItem.thumbnailUrl ? (
          <MapThumbnail className="h-full w-full" />
        ) : (
          <img src={mapItem.thumbnailUrl}></img>
        )}
        <p className="text-sm">{mapItem.title}</p>
        <div className="flex items-center gap-1">
          <img src={mapItem.user.profile_url}></img>
          <p className="text-xs">{mapItem.user.nickname}</p>
          <PinIcon className="h-4 w-4" fill="#DC1414" />
          <div className="flex w-4 justify-center rounded-md border-[0.5px] border-gray-400 text-xs text-gray-500">
            <p>{mapItem.pinCount}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MapItem;
