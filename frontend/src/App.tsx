import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { worker } from './mocks/browser';
import Homepage from './pages/Homepage/HomePage';
import MapPage from './pages/MapCreation/MapPage';
import MapCreateMapPage from './pages/MapCreation/MapCreateMapPage';
import MapCreateCoursePage from './pages/MapCreation/MapCreateCoursePage';


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/map/map" element={<MapCreateMapPage />} />
          <Route path="/map/course" element={<MapCreateCoursePage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
