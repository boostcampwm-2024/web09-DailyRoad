import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from '@/pages/HomePage/HomePage';
import MapPage from '@/pages/MapCreation/MapPage';
import MapCreateMapPage from '@/pages/MapCreation/MapCreateMapPage';
import MapCreateCoursePage from '@/pages/MapCreation/MapCreateCoursePage';
import PlaceCreatePage from '@/pages/PlaceCreation/PlaceCreatePage';
import LayoutCreate from '@/LayoutCreate';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/map" element={<LayoutCreate />}></Route>

        <Route path="/create" element={<LayoutCreate />}>
          <Route index element={<MapPage />} />
          <Route path="map/:id" element={<MapCreateMapPage />} />
          <Route path="course/:id" element={<MapCreateCoursePage />} />
          <Route path="map/:id/:placeId" element={<PlaceCreatePage />} />
          <Route path="course/:id/:placeId" element={<PlaceCreatePage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
