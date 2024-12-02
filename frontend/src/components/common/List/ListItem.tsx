import { Link } from 'react-router-dom';
import PinIcon from '@/components/PinIcon';
import React from 'react';
import ListItemThumbnail from '@/components/common/List/ListItemThumbnail';

type ListItemProps<T> = {
  item: T;
  linkPrefix: string;
};

const ListItem = <T extends {
  id: number;
  title: string;
  thumbnailUrl: string;
  user: { profileImageUrl: string; nickname: string };
  pinCount: number
}>({
     item,
     linkPrefix,
   }: ListItemProps<T>) => {
  return (
    <Link to={`/${linkPrefix}/${item.id}`}>
      <div className="flex h-50 flex-col gap-2 rounded-md border-[1.5px] border-gray-200 p-3">
        <div className="w-full aspect-[4/3] overflow-hidden rounded-md bg-gray-100">
          {item.thumbnailUrl.startsWith('https://example') ? (
            <ListItemThumbnail className="h-full w-full object-cover" />
          ) : (
            <img
              src={item.thumbnailUrl}
              className="h-full w-full object-cover"
              alt={item.title}
            />
          )}
        </div>

        <p className="truncate text-sm font-medium">{item.title}</p>

        <div className="flex items-center gap-2">
          <img
            className="h-6 w-6 rounded-full"
            src={item.user.profileImageUrl}
            alt={item.user.nickname}
          />
          <p className="text-xs text-gray-700">{item.user.nickname}</p>
          <PinIcon className="h-4 w-4" fill="#DC1414" />
          <div className="flex w-5 justify-center rounded-md border-[0.5px] border-gray-400 text-xs text-gray-500">
            <p>{item.pinCount}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListItem;
