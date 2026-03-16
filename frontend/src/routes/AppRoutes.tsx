/**
 * AppRoutes - Unified Application Routing
 * EthosLife - Complete Route Configuration
 */

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ElLayout } from '../components/ElLayout';

// Loading fallback
const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-[var(--neon-cyan)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-[var(--text-secondary)]">Loading...</p>
    </div>
  </div>
);

// Lazy load pages for code splitting
// Landing Pages
const LandingV2 = lazy(() => import('../pages/Landing/LandingV2'));
const FeaturesV2 = lazy(() => import('../pages/Landing/FeaturesV2'));
const PricingV2 = lazy(() => import('../pages/Landing/PricingV2'));
const TeamV2 = lazy(() => import('../pages/Landing/TeamV2'));
const RoadmapV2 = lazy(() => import('../pages/Landing/RoadmapV2'));
const FAQV2 = lazy(() => import('../pages/Landing/FAQV2'));
const BlogV2 = lazy(() => import('../pages/Landing/BlogV2'));

// Auth Pages
const Login = lazy(() => import('../pages/Auth/Login'));
const Register = lazy(() => import('../pages/Auth/Register'));

// Dashboard
const DashboardUnified = lazy(() => import('../pages/Unified/DashboardUnified'));

// Health Modules
const NutritionUnified = lazy(() => import('../pages/Unified/Health/NutritionUnified'));
const MovementUnified = lazy(() => import('../pages/Unified/Health/MovementUnified'));
const SleepUnified = lazy(() => import('../pages/Unified/Health/SleepUnified'));
const PsychologyUnified = lazy(() => import('../pages/Unified/Health/PsychologyUnified'));
const MedicineUnified = lazy(() => import('../pages/Unified/Health/MedicineUnified'));
const RelationshipsUnified = lazy(() => import('../pages/Unified/Health/RelationshipsUnified'));
const HabitsUnified = lazy(() => import('../pages/Unified/Health/HabitsUnified'));

// Social
const SocialFeedUnified = lazy(() => import('../pages/Unified/Social/SocialFeedUnified'));
const MessagesUnified = lazy(() => import('../pages/Unified/Social/MessagesUnified'));
const GroupsUnified = lazy(() => import('../pages/Unified/Social/GroupsUnified'));
const ChallengesUnified = lazy(() => import('../pages/Unified/Social/ChallengesUnified'));

// AI & Other
const AIChatUnified = lazy(() => import('../pages/Unified/AIChatUnified'));
const AnalyticsUnified = lazy(() => import('../pages/Unified/AnalyticsUnified'));
const GamificationUnified = lazy(() => import('../pages/Unified/GamificationUnified'));
const SpecialistsUnified = lazy(() => import('../pages/Unified/SpecialistsUnified'));
const CentersUnified = lazy(() => import('../pages/Unified/CentersUnified'));

// User
const ProfileUnified = lazy(() => import('../pages/Unified/ProfileUnified'));
const SettingsUnified = lazy(() => import('../pages/Unified/SettingsUnified'));
const WalletUnified = lazy(() => import('../pages/Unified/WalletUnified'));

// Design System Demo
const DesignSystemDemo = lazy(() => import('../pages/Unified/DesignSystemDemo'));

// Static Pages
const Whitepaper = lazy(() => import('../pages/Static/Whitepaper'));
const Privacy = lazy(() => import('../pages/Static/Privacy'));
const Terms = lazy(() => import('../pages/Static/Terms'));
const Disclaimer = lazy(() => import('../pages/Static/Disclaimer'));

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // TODO: Implement actual auth check
  const isAuthenticated = true; // Mock
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route wrapper (redirect if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = false; // Mock
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<ElLayout><LandingV2 /></ElLayout>} />
        <Route path="/features" element={<ElLayout><FeaturesV2 /></ElLayout>} />
        <Route path="/pricing" element={<ElLayout><PricingV2 /></ElLayout>} />
        <Route path="/team" element={<ElLayout><TeamV2 /></ElLayout>} />
        <Route path="/roadmap" element={<ElLayout><RoadmapV2 /></ElLayout>} />
        <Route path="/faq" element={<ElLayout><FAQV2 /></ElLayout>} />
        <Route path="/blog" element={<ElLayout><BlogV2 /></ElLayout>} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<PublicRoute><ElLayout showFooter={false}><Login /></ElLayout></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><ElLayout showFooter={false}><Register /></ElLayout></PublicRoute>} />
        
        {/* Design System Demo */}
        <Route path="/design-system" element={<ElLayout><DesignSystemDemo /></ElLayout>} />
        
        {/* Static Pages */}
        <Route path="/whitepaper" element={<ElLayout><Whitepaper /></ElLayout>} />
        <Route path="/privacy" element={<ElLayout><Privacy /></ElLayout>} />
        <Route path="/terms" element={<ElLayout><Terms /></ElLayout>} />
        <Route path="/disclaimer" element={<ElLayout><Disclaimer /></ElLayout>} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><ElLayout><DashboardUnified /></ElLayout></ProtectedRoute>} />
        
        {/* Health Modules */}
        <Route path="/health" element={<ProtectedRoute><ElLayout><Navigate to="/health/nutrition" replace /></ElLayout></ProtectedRoute>} />
        <Route path="/health/nutrition" element={<ProtectedRoute><ElLayout><NutritionUnified /></ElLayout></ProtectedRoute>} />
        <Route path="/health/movement" element={<ProtectedRoute><ElLayout><MovementUnified /></ElLayout></ProtectedRoute>} />
        <Route path="/health/sleep" element={<ProtectedRoute><ElLayout><SleepUnified /></ElLayout></ProtectedRoute>} />
        <Route path="/health/psychology" element={<ProtectedRoute><ElLayout><PsychologyUnified /></ElLayout></ProtectedRoute>} />
        <Route path="/health/medicine" element={<ProtectedRoute><ElLayout><MedicineUnified /></ElLayout></ProtectedRoute>} />
        <Route path="/health/relationships" element={<ProtectedRoute><ElLayout><RelationshipsUnified /></ElLayout></ProtectedRoute>} />
        <Route path="/health/habits" element={<ProtectedRoute><ElLayout><HabitsUnified /></ElLayout></ProtectedRoute>} />
        
        {/* Social */}
        <Route path="/social" element={<ProtectedRoute><ElLayout><SocialFeedUnified /></ElLayout></ProtectedRoute>} />
        <Route path="/social/messages" element={<ProtectedRoute><ElLayout><MessagesUnified /></ElLayout></ProtectedRoute>} />
        <Route path="/social/groups" element={<ProtectedRoute><ElLayout><GroupsUnified /></ElLayout></ProtectedRoute>} />
        <Route path="/social/challenges" element={<ProtectedRoute><ElLayout><ChallengesUnified /></ElLayout></ProtectedRoute>} />
        
        {/* AI & Features */}
        <Route path="/ai-chat" element={<ProtectedRoute><ElLayout><AIChatUnified /></ElLayout></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><ElLayout><AnalyticsUnified /></ElLayout></ProtectedRoute>} />
        <Route path="/gamification" element={<ProtectedRoute><ElLayout><GamificationUnified /></ElLayout></ProtectedRoute>} />
        <Route path="/specialists" element={<ProtectedRoute><ElLayout><SpecialistsUnified /></ElLayout></ProtectedRoute>} />
        <Route path="/centers" element={<ProtectedRoute><ElLayout><CentersUnified /></ElLayout></ProtectedRoute>} />
        
        {/* User */}
        <Route path="/profile" element={<ProtectedRoute><ElLayout><ProfileUnified /></ElLayout></ProtectedRoute>} />
        <Route path="/profile/:username" element={<ProtectedRoute><ElLayout><ProfileUnified /></ElLayout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><ElLayout><SettingsUnified /></ElLayout></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><ElLayout><WalletUnified /></ElLayout></ProtectedRoute>} />
        
        {/* 404 */}
        <Route path="*" element={<ElLayout><div className="py-20 text-center"><h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">404</h1><p className="text-[var(--text-secondary)]">Page not found</p></div></ElLayout>} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
