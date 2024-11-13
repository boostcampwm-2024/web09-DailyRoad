import { Outlet } from 'react-router-dom';
import GoogleMap from './GoogleMap';

const LayoutCreate = () => {
  return (
    <>
      <GoogleMap />
      <Outlet />
    </>
  );
};

export default LayoutCreate;
