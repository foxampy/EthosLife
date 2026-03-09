import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { VersionProvider } from './contexts/VersionContext';
import './index.css';
import './i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <VersionProvider defaultVersion="v2">
      <App />
    </VersionProvider>
  </React.StrictMode>,
);
