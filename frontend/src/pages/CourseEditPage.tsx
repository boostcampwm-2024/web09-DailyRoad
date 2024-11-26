import Authorize from '@/components/Authorize';
import SideContainer from '@/components/common/SideContainer';
import EditCourseForm from '@/components/Form/EditCourseForm';

import { useCourseQuery } from '@/hooks/api/useCourseQuery';

import { useParams } from 'react-router-dom';

const CourseEditPage = () => {
  const { id } = useParams();
  const courseData = useCourseQuery(Number(id));
  return (
    <Authorize id={courseData.user.id}>
      <SideContainer>
        <EditCourseForm courseData={courseData} />
      </SideContainer>
    </Authorize>
  );
};

export default CourseEditPage;
