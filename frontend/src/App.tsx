import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from '@/pages/HomePage/HomePage';
import MapPage from '@/pages/MapCreation/MapPage';
import MapCreateMapPage from '@/pages/MapCreation/MapCreateMapPage';
import MapCreateCoursePage from '@/pages/MapCreation/MapCreateCoursePage';
import PlaceCreatePage from '@/pages/PlaceCreation/PlaceCreatePage';
import LayoutCreate from '@/LayoutCreate';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/create" element={<LayoutCreate />}>
          <Route index element={<MapPage />} />
          <Route path="map" element={<MapCreateMapPage />} />
          <Route path="course" element={<MapCreateCoursePage />} />
          <Route path="map/:mapId" element={<PlaceCreatePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
