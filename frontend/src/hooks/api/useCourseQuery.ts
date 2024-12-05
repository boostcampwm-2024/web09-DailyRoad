import { useSuspenseQuery } from '@tanstack/react-query';

import { getCourse } from '@/api/course';
import { QUERY_KEY } from '@/constants/api';

import { Course } from '@/types';

export const useCourseQuery = (courseId: number) => {
  const { data } = useSuspenseQuery<Course, Error>({
    queryKey: QUERY_KEY.COURSE(courseId),
    queryFn: () => getCourse(courseId),
  });
  return data;
};
