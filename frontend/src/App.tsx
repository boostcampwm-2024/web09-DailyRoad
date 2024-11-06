import './App.css';
import { Status, Wrapper } from '@googlemaps/react-wrapper';
import GoogleMap from './GoogleMap';
import Dashboard from './Dashboard';
const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return <>로딩중...</>;
    case Status.FAILURE:
      return <>에러</>;
    case Status.SUCCESS:
      return (
        <>
          <GoogleMap />
          <Dashboard />
        </>
      );
  }
};

function App() {
  return (
    <Wrapper
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}
      render={render}
      libraries={['marker', 'places']}
    />
  );
}

export default App;
