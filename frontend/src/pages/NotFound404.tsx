import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Heart, Activity, Brain, Moon } from 'lucide-react';

const NotFound404: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e4dfd5] via-[#dcd3c6] to-[#c8c2b6] flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        {/* Logo Animation */}
        <div className="mb-8">
          <div className="text-7xl mb-4 animate-bounce">🌱</div>
          <h1 className="text-8xl font-bold bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] bg-clip-text text-transparent mb-4">
            404
          </h1>
        </div>

        {/* Message */}
        <h2 className="text-3xl font-bold text-[#2d2418] mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-[#5c5243] mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back on track to better health.
        </p>

        {/* Home Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-[#e4dfd5] font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          <Link
            to="/health/nutrition"
            className="bg-[#e4dfd5]/80 backdrop-blur-sm p-6 rounded-2xl border border-[#5c5243]/10 hover:shadow-lg transition-all group"
          >
            <Heart className="w-8 h-8 text-emerald-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-[#2d2418]">Nutrition</p>
          </Link>

          <Link
            to="/health/movement"
            className="bg-[#e4dfd5]/80 backdrop-blur-sm p-6 rounded-2xl border border-[#5c5243]/10 hover:shadow-lg transition-all group"
          >
            <Activity className="w-8 h-8 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-[#2d2418]">Fitness</p>
          </Link>

          <Link
            to="/health/sleep"
            className="bg-[#e4dfd5]/80 backdrop-blur-sm p-6 rounded-2xl border border-[#5c5243]/10 hover:shadow-lg transition-all group"
          >
            <Moon className="w-8 h-8 text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-[#2d2418]">Sleep</p>
          </Link>

          <Link
            to="/health/psychology"
            className="bg-[#e4dfd5]/80 backdrop-blur-sm p-6 rounded-2xl border border-[#5c5243]/10 hover:shadow-lg transition-all group"
          >
            <Brain className="w-8 h-8 text-amber-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-[#2d2418]">Mental Health</p>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-12 text-sm text-[#5c5243]">
          <p>© 2026 EthosLife. Human Operating System for Health.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound404;
