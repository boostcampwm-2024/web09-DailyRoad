import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage/LoginPage';
import DashBoard from '@/pages/DashBoardPage/DashBoardPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path={'/'} element={<LoginPage />} />
        <Route path={'/dashboard'} element={<DashBoard />} />
      </Routes>
    </Router>
  );
}

export default App;
