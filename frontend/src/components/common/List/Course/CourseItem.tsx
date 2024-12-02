import { MapItemType } from '@/types';
import ListItem from '@/components/common/List/ListItem';

type CourseItemProps = {
  courseItem: MapItemType;
};

const CourseItem = ({ courseItem }: CourseItemProps) => {
  return <ListItem item={courseItem} linkPrefix="course" />;
};

export default CourseItem;
