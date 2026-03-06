import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import HealthCenter from './pages/Health/HealthCenter';
import Nutrition from './pages/Health/Nutrition';
import Fitness from './pages/Health/Fitness';
import Sleep from './pages/Health/Sleep';
import Mental from './pages/Health/Mental';
import Medical from './pages/Health/Medical';
import SocialFeed from './pages/Social/Feed';
import AIChat from './pages/AI/Chat';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-stone mx-auto mb-4"></div>
          <p className="text-stone">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/health" element={<HealthCenter />} />
            <Route path="/health/nutrition" element={<Nutrition />} />
            <Route path="/health/fitness" element={<Fitness />} />
            <Route path="/health/sleep" element={<Sleep />} />
            <Route path="/health/mental" element={<Mental />} />
            <Route path="/health/medical" element={<Medical />} />
            <Route path="/social" element={<SocialFeed />} />
            <Route path="/ai-chat" element={<AIChat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
