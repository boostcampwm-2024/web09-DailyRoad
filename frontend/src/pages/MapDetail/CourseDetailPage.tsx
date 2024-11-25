import { useParams } from 'react-router-dom';

import CourseDetailBoard from '@/components/Map/CourseDetailBoard';
import { useCourseQuery } from '@/hooks/api/useCourseQuery';

const CourseDetailPage = () => {
  const { id } = useParams();
  const courseData = useCourseQuery(Number(id));

  return <CourseDetailBoard courseData={courseData} />;
};

export default CourseDetailPage;
