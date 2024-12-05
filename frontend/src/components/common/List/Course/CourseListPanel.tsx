import CourseItem from './CourseItem';
import InfiniteListPanel from '@/components/common/List/InfiniteListPanel';

import { getCourseList, getMyCourseList } from '@/api/course';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { CourseList } from '@/types';

type CourseListPanelProps = {
  query?: string;
  Range: 'ALL' | 'MY';
};

const CourseListPanel = ({ query, Range }: CourseListPanelProps) => {
  const queryFn =
    Range === 'MY'
      ? ({ pageParam }: { pageParam: number }) => getMyCourseList(pageParam)
      : ({ pageParam }: { pageParam: number }) =>
          getCourseList(pageParam, query);
  const queryKey =
    Range === 'MY'
      ? ['myCourseList', query ?? '']
      : ['courseList', query ?? ''];

  const { data, ref } = useInfiniteScroll<CourseList>({
    queryKey: queryKey,
    queryFn: queryFn,
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
