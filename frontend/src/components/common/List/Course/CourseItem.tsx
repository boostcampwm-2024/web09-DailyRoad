import ListItem from '@/components/common/List/ListItem';

import { MapItemType } from '@/types';

type CourseItemProps = {
  courseItem: MapItemType;
};

const CourseItem = ({ courseItem }: CourseItemProps) => {
  return <ListItem item={courseItem} linkPrefix="course" />;
};

export default CourseItem;
