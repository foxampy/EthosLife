/**
 * EthosLife - Human Operating System
 * Main Application Component
 * 
 * Features:
 * - Unified routing system (AppRoutes)
 * - i18n with 25 language support
 * - Toast notifications
 * - Global error boundary
 * - Guest access enabled
 * - Deep Neumorphism design
 */

import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuthStore } from './store/authStore';
import AppRoutes from './routes/AppRoutes';

// Import i18n configuration
import './i18n/config';

// Loading Component
const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#dcd3c6] via-[#e8e0d5] to-[#f5f0eb]">
    <div className="text-center">
      <motion.div
        className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#5c5243] to-[#8c7a6b] flex items-center justify-center text-white font-bold text-2xl shadow-lg animate-pulse"
      >
        E
      </motion.div>
      <p className="text-[#5c5243] font-medium">Loading EthosLife...</p>
    </div>
  </div>
);

// Error Boundary
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#dcd3c6] via-[#e8e0d5] to-[#f5f0eb]">
          <div className="text-center max-w-md p-8">
            <h1 className="text-3xl font-bold text-[#2d2418] mb-4">Oops!</h1>
            <p className="text-[#5c5243] mb-6">Something went wrong. Please try refreshing the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Main App Content
function AppContent() {
  const initializeAuth = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
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
        success: { iconTheme: { primary: 'var(--neon-green)', secondary: 'var(--bone-200)' } },
        error: { iconTheme: { primary: 'var(--error)', secondary: 'var(--bone-200)' } },
        loading: { iconTheme: { primary: 'var(--neon-cyan)', secondary: 'var(--bone-200)' } },
      }}
    />
  );
}

// App Root
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
        <Suspense fallback={<PageLoader />}>
          <AppRoutes />
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
