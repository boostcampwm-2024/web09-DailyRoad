import { MapItemType } from '@/types';
import { Link } from 'react-router-dom';
import PinIcon from '@/components/PinIcon';
import MapThumbnail from './MapThumbnail';

type CourseItemProps = {
  courseItem: MapItemType;
};

const CourseItem = ({ courseItem }: CourseItemProps) => {
  return (
    <Link to={`/course/${courseItem.id}`}>
      <div className="flex h-72 flex-col gap-2 rounded-md border-[1.5px] border-gray-200 p-4">
        <div className="h-4/5 w-full overflow-hidden">
          {courseItem.thumbnailUrl.startsWith('https://example') ? (
            <MapThumbnail className="h-full w-full" />
          ) : (
            <img
              alt={`${courseItem.title} 코스 썸네일`}
              src={courseItem.thumbnailUrl}
              className="object-cover"
            ></img>
          )}
        </div>
        <p className="text-sm">{courseItem.title}</p>
        <div className="flex items-center gap-1">
          <img
            className="h-6 w-6 rounded-full"
            src={courseItem.user.profileImageUrl}
          ></img>
          <p className="text-xs">{courseItem.user.nickname}</p>
          <PinIcon className="h-4 w-4" fill="#DC1414" />
          <div className="flex w-4 justify-center rounded-md border-[0.5px] border-gray-400 text-xs text-gray-500">
            <p>{courseItem.pinCount}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseItem;
