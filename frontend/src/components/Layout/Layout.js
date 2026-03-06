import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  return (
    <div className="min-h-screen bg-bone">
      {/* Header с бургер-меню */}
      <Header />

      {/* Main Content */}
      <main className="pb-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-stone/20 bg-bone/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🌱</span>
              <span className="text-sm text-stone">© 2026 EthosLife. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-stone">
              <a href="/privacy" className="hover:text-ink transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-ink transition-colors">Terms</a>
              <a href="/contact" className="hover:text-ink transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
