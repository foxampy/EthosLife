/**
 * EthosLife - Human Operating System
 * Main Application Component
 * 
 * Features:
 * - Unified routing system with lazy loading
 * - i18n with 25 language support
 * - Toast notifications
 * - Global error boundary
 */

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppRoutes } from './routes/AppRoutes';
import { VersionProvider } from './contexts/VersionContext';

// Import i18n configuration
import './i18n/config';

function App() {
  return (
    <VersionProvider defaultVersion="v2">
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--bone-200)',
              color: 'var(--text-primary)',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-elevated)',
              fontFamily: 'var(--font-body)',
            },
            success: {
              iconTheme: {
                primary: 'var(--neon-green)',
                secondary: 'var(--bone-200)',
              },
            },
            error: {
              iconTheme: {
                primary: 'var(--error)',
                secondary: 'var(--bone-200)',
              },
            },
            loading: {
              iconTheme: {
                primary: 'var(--neon-cyan)',
                secondary: 'var(--bone-200)',
              },
            },
          }}
        />
        <AppRoutes />
      </Router>
    </VersionProvider>
  );
}

export default App;
