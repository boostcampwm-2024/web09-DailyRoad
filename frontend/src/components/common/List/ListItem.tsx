import { Link } from 'react-router-dom';

type ListItemProps<T> = {
  item: T;
  linkPrefix: string;
};

const ListItem = <
  T extends {
    id: number;
    title: string;
    thumbnailUrl: string;
    user: { profileImageUrl: string; nickname: string };
    pinCount: number;
  },
>({
  item,
  linkPrefix,
}: ListItemProps<T>) => {
  return (
    <Link to={`/${linkPrefix}/${item.id}`}>
      <div className="h-50 flex flex-col gap-2 rounded-md border-[1.5px] border-gray-200 p-3">
        <img
          src={item.thumbnailUrl}
          className="object-fit h-32 w-full"
          alt={item.title}
        />
        <p className="text-sm font-semibold text-c_bg_blue">{`${item.pinCount}개의 저장 장소`}</p>
        <p className="truncate text-base font-medium">{item.title}</p>
        <div className="flex items-center gap-1">
          <img
            className="h-6 w-6 rounded-full"
            src={item.user.profileImageUrl}
            alt={item.user.nickname}
          />
          <p className="text-xs font-semibold text-gray-700">
            {item.user.nickname}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ListItem;
