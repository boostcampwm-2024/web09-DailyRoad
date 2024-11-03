import './App.css';
import { Status, Wrapper } from '@googlemaps/react-wrapper';
import GoogleMap from './GoogleMap';
const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return <>로딩중...</>;
    case Status.FAILURE:
      return <>에러</>;
    case Status.SUCCESS:
      return <GoogleMap />;
  }
};

function App() {
  return (
    <Wrapper
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}
      render={render}
    />
  );
}

export default App;
