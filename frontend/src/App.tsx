import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { worker } from './mocks/browser';
import Homepage from './pages/Homepage/HomePage';
import MapPage from './pages/MapCreation/MapPage';

if (process.env.NODE_ENV === 'development') {
  worker.start();
}

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
