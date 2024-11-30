import { lazy } from 'react';

export const LazyMapPages = {
  Detail: lazy(() => import('@/pages/MapDetail/MapDetailPage')),
  Edit: lazy(() => import('@/pages/MapEditPage')),
  Create: lazy(() => import('@/pages/MapCreation/MapCreateMapPage')),
};

export const LazyCoursePages = {
  Detail: lazy(() => import('@/pages/MapDetail/CourseDetailPage')),
  Edit: lazy(() => import('@/pages/CourseEditPage')),
  Create: lazy(() => import('@/pages/MapCreation/MapCreateCoursePage')),
};
