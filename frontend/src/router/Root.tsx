import { Outlet } from 'react-router-dom';

import ToastContainer from '@/components/common/Toast/ToastContainer';
import ErrorBoundary from '@/components/Error/ErrorBoundary';
import ErrorFallback from '@/components/Error/ErrorFallback';
import Login from '@/components/Login';

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
