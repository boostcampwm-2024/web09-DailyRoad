import React from 'react';

import { getCourseList } from '@/api/course';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { CourseList } from '@/types';

import CourseItem from './CourseItem';
import InfiniteListPanel from '@/components/common/List/InfiniteListPanel';

interface CourseListPanelProps {
  query?: string;
}

const CourseListPanel: React.FC<CourseListPanelProps> = ({ query }) => {
  const { data, ref } = useInfiniteScroll<CourseList>({
    queryKey: ['courseList'],
    queryFn: ({ pageParam }) => getCourseList(pageParam, query),
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined,
    fetchWithoutQuery: true,
  });

  const courseItems = data?.pages.flatMap((page) => page.courses) || [];

  return (
    <InfiniteListPanel
      data={courseItems}
      ref={ref}
      renderItem={(course) => (
        <CourseItem key={course.id} courseItem={course} />
      )}
      className="max-h-[700px] p-5"
    />
  );
};

export default CourseListPanel;
