import { getCourse } from '@/api/course';
import { Course } from '@/types';
import { useSuspenseQuery } from '@tanstack/react-query';

export const useCourseQuery = (courseId: number) => {
  const { data } = useSuspenseQuery<Course, Error>({
    queryKey: ['course', courseId],
    queryFn: () => getCourse(courseId),
  });
  return data;
};
