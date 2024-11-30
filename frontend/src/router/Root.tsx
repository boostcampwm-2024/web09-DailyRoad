import { Outlet } from 'react-router-dom';

import ErrorBoundary from '@/components/Error/ErrorBoundary';
import ErrorFallback from '@/components/Error/ErrorFallback';

import Login from '@/components/Login';
import ToastContainer from '@/components/common/Toast/ToastContainer';

function Root() {
  return (
    <ErrorBoundary Fallback={ErrorFallback}>
      <Login>
        <ToastContainer />
        <Outlet />
      </Login>
    </ErrorBoundary>
  );
}

export default Root;
