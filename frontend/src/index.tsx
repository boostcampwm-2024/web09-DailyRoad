import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import { loadGoogleMapsApi } from './lib/googleMapsAPI-loader';

const isDevelopment = process.env.NODE_ENV === 'development';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
    {isDevelopment && <ReactQueryDevtools initialIsOpen={false} />}
  </QueryClientProvider>,
);
