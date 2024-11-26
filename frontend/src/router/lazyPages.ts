import { lazy } from 'react';

export const MapDetailPage = lazy(
  () => import('@/pages/MapDetail/MapDetailPage'),
);

export const CourseDetailPage = lazy(
  () => import('@/pages/MapDetail/CourseDetailPage'),
);

export const MapEditPage = lazy(() => import('@/pages/MapEditPage'));

export const CourseEditPage = lazy(() => import('@/pages/CourseEditPage'));

export const MapCreateMapPage = lazy(
  () => import('@/pages/MapCreation/MapCreateMapPage'),
);

export const MapCreateCoursePage = lazy(
  () => import('@/pages/MapCreation/MapCreateCoursePage'),
);
