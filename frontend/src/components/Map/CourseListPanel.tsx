import React from 'react';

import { getCourseList } from '@/api/course';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { CourseList, MapItemType } from '@/types';

import MapItem from '@/components/Map/MapItem';
import CourseItem from './CourseItem';

const CourseListPanel = () => {
  const { data, isFetchingNextPage, hasNextPage, ref } =
    useInfiniteScroll<CourseList>({
      queryKey: ['courseList'],
      queryFn: ({ pageParam }) => getCourseList(pageParam),
      getNextPageParam: (lastPage) => {
        return lastPage.currentPage < lastPage.totalPages
          ? lastPage.currentPage + 1
          : undefined;
      },
      fetchWithoutQuery: true,
    });

  return (
    <>
      <div className="scrollbar-thumb-rounded-lg grid h-full grid-cols-5 gap-8 overflow-y-auto p-20 px-40 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 hover:scrollbar-track-gray-200 hover:scrollbar-thumb-gray-500">
        {data?.pages.map((page, index) => (
          <React.Fragment key={index}>
            {page.courses.map((map: MapItemType) => (
              <CourseItem key={map.id} courseItem={map} />
            ))}
          </React.Fragment>
        ))}
      </div>
      <div ref={ref} className="h-1" />
    </>
  );
};

export default CourseListPanel;