import React, { useState, createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

// Context for guest mode
export const GuestContext = createContext({
  isGuest: false,
  enableGuestMode: () => {},
  disableGuestMode: () => {},
});

// Hook to use guest context
export const useGuest = () => useContext(GuestContext);

// Guest Access Route - ALL PAGES AVAILABLE WITHOUT REGISTRATION
const GuestAccessRoute = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const [isGuestMode, setIsGuestMode] = useState(true);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bone">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-stone mx-auto mb-4"></div>
          <p className="text-stone">Loading EthosLife...</p>
        </div>
      </div>
    );
  }

  // Always allow access - no registration required
  return (
    <GuestContext.Provider value={{
      isGuest: !isAuthenticated && isGuestMode,
      enableGuestMode: () => setIsGuestMode(true),
      disableGuestMode: () => setIsGuestMode(false),
    }}>
      <div className={!isAuthenticated && isGuestMode ? 'pt-16' : ''}>
        {/* Guest Mode Banner with Sales Pitch */}
        {!isAuthenticated && isGuestMode && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white px-4 py-3 text-center shadow-2xl">
            <div className="flex items-center justify-center space-x-6 flex-wrap">
              <span className="font-bold text-lg">🎁 ПОПРОБУЙТЕ БЕСПЛАТНО - ВСЕ ФУНКЦИИ ДОСТУПНЫ!</span>
              <span className="text-sm opacity-95 hidden md:inline">Ваши данные сохраняются временно. Зарегистрируйтесь, чтобы сохранить навсегда.</span>
              <a
                href="/register"
                className="bg-white text-emerald-700 px-5 py-2 rounded-full text-sm font-bold hover:bg-opacity-95 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                🚀 СОХРАНИТЬ ДАННЫЕ (-50% СКИДКА)
              </a>
            </div>
          </div>
        )}
        <Outlet />
      </div>
    </GuestContext.Provider>
  );
};

export default GuestAccessRoute;
