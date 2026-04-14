import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { VersionProvider } from './contexts/VersionContext';
import { GuestDataProvider } from './contexts/GuestDataContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import './i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <VersionProvider defaultVersion="v2">
        <GuestDataProvider>
          <App />
        </GuestDataProvider>
      </VersionProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
