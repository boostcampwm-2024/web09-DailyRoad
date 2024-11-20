import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from '@/pages/HomePage/HomePage';
import MapPage from '@/pages/MapCreation/MapPage';
import MapCreateMapPage from '@/pages/MapCreation/MapCreateMapPage';
import MapCreateCoursePage from '@/pages/MapCreation/MapCreateCoursePage';
import PlaceCreatePage from '@/pages/PlaceCreation/PlaceCreatePage';
import LayoutCreate from '@/LayoutCreate';
import NotFound from './pages/NotFound';
import MapDetailPage from './pages/MapDetail/MapDetailPage';
import { Suspense } from 'react';
import MapEditPage from './pages/MapEditPage';
import ToastContainer from './components/common/Toast/ToastContainer';
import ErrorBoundary from './components/Error/ErrorBoundary';
import ErrorFallback from './components/Error/ErrorFallback';
import RedirectPage from './pages/RedirectPage';

function App() {
  return (
    <ErrorBoundary Fallback={ErrorFallback}>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Homepage />} />

          <Route
            path="/map"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <LayoutCreate />
              </Suspense>
            }
          >
            <Route path=":id" element={<MapDetailPage />} />
          </Route>

          <Route path="/create" element={<LayoutCreate />}>
            <Route index element={<MapPage />} />
            <Route path="map/:id" element={<MapCreateMapPage />} />
            <Route path="map/:id/:placeId" element={<PlaceCreatePage />} />
            <Route path="course/:id" element={<MapCreateCoursePage />} />
            <Route path="course/:id/:placeId" element={<PlaceCreatePage />} />
          </Route>

          <Route path="/edit" element={<LayoutCreate />}>
            <Route path="map/:id" element={<MapEditPage />} />
            <Route path="course/:id" element={<MapCreateCoursePage />} />
            <Route path="map/:id/:placeId" element={<PlaceCreatePage />} />
            <Route path="course/:id/:placeId" element={<PlaceCreatePage />} />
          </Route>

          <Route path="/auth/callback" element={<RedirectPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
