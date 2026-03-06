import React, { createContext, useContext, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

// Context for guest mode
export const GuestContext = createContext({
  isGuest: false,
  enableGuestMode: () => {},
  disableGuestMode: () => {},
});

// Hook to use guest context
export const useGuest = () => useContext(GuestContext);

// Guest Access Route - allows both authenticated and guest users
const GuestAccessRoute = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const [isGuestMode, setIsGuestMode] = useState(true); // Enable guest mode by default for v2 pages
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bone">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-stone mx-auto mb-4"></div>
          <p className="text-stone">Loading EthoLife...</p>
        </div>
      </div>
    );
  }

  // Allow access to authenticated users or guest mode
  const hasAccess = isAuthenticated || isGuestMode;

  if (!hasAccess) {
    return <Navigate to="/login" replace />;
  }

  return (
    <GuestContext.Provider value={{ 
      isGuest: !isAuthenticated && isGuestMode,
      enableGuestMode: () => setIsGuestMode(true),
      disableGuestMode: () => setIsGuestMode(false),
    }}>
      {/* Guest Mode Banner */}
      {!isAuthenticated && isGuestMode && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 text-center shadow-lg">
          <div className="flex items-center justify-center space-x-4">
            <span className="font-medium">🔍 Guest Preview Mode - For Investor Demo</span>
            <span className="text-sm opacity-90">All features visible, data is simulated</span>
            <a 
              href="/login" 
              className="bg-white text-orange-600 px-3 py-1 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-colors"
            >
              Sign In →
            </a>
          </div>
        </div>
      )}
      <div className={!isAuthenticated && isGuestMode ? 'pt-12' : ''}>
        <Outlet />
      </div>
    </GuestContext.Provider>
  );
};

export default GuestAccessRoute;
