import ErrorBoundary from '@/components/Error/ErrorBoundary';
import ErrorFallback from '@/components/Error/ErrorFallback';
import { createBrowserRouter } from 'react-router-dom';
import Root from './Root';
import { Suspense } from 'react';
import Homepage from '@/pages/HomePage/HomePage';
import LayoutCreate from '@/LayoutCreate';

import MapPage from '@/pages/MapCreation/MapPage';

import RedirectPage from '@/pages/RedirectPage';
import NotFound from '@/pages/NotFound';
import * as Lazy from './lazyPages';
import Loading from '@/pages/MapDetail/Loading';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorBoundary Fallback={ErrorFallback} />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: 'map',
        element: (
          <Suspense fallback={<Loading />}>
            <LayoutCreate />
          </Suspense>
        ),
        children: [
          {
            path: ':id',
            element: <Lazy.MapDetailPage />,
          },
        ],
      },
      {
        path: 'course',
        element: (
          <Suspense fallback={<Loading />}>
            <LayoutCreate />
          </Suspense>
        ),
        children: [
          {
            path: ':id',
            element: <Lazy.CourseDetailPage />,
          },
        ],
      },
      {
        path: 'create',
        element: <LayoutCreate />,
        children: [
          {
            index: true,
            element: <MapPage />,
          },
          {
            path: 'map/:id',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <Lazy.MapCreateMapPage />
              </Suspense>
            ),
          },
          {
            path: 'course/:id',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <Lazy.MapCreateCoursePage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: 'edit',
        element: <LayoutCreate />,
        children: [
          {
            path: 'map/:id',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <Lazy.MapEditPage />
              </Suspense>
            ),
          },
          {
            path: 'course/:id',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <Lazy.CourseEditPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: 'auth/callback',
        element: <RedirectPage />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
