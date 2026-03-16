/**
 * AppRoutes - Unified Application Routing
 * EthosLife - Complete Route Configuration
 * DEMO MODE: All routes are publicly accessible
 */

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
// New Unified Pages (Widget System)
const UnifiedHomePage = lazy(() => import('../pages/Unified/UnifiedHomePage'));
const DashboardV2 = lazy(() => import('../pages/Unified/DashboardV2'));

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

// AI & Features
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

// Demo Banner Component
const DemoBanner: React.FC = () => (
  <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
    <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-purple)] text-white text-sm font-medium shadow-lg flex items-center gap-2">
      <span>🚀</span>
      <span>Demo Mode - All features accessible</span>
    </div>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Landing & Home */}
          <Route path="/" element={<UnifiedHomePage />} />
          <Route path="/home" element={<UnifiedHomePage />} />
          <Route path="/landing" element={<ElLayout><LandingV2 /></ElLayout>} />
          <Route path="/features" element={<ElLayout><FeaturesV2 /></ElLayout>} />
          <Route path="/pricing" element={<ElLayout><PricingV2 /></ElLayout>} />
          <Route path="/team" element={<ElLayout><TeamV2 /></ElLayout>} />
          <Route path="/roadmap" element={<ElLayout><RoadmapV2 /></ElLayout>} />
          <Route path="/faq" element={<ElLayout><FAQV2 /></ElLayout>} />
          <Route path="/blog" element={<ElLayout><BlogV2 /></ElLayout>} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<ElLayout showFooter={false}><Login /></ElLayout>} />
          <Route path="/register" element={<ElLayout showFooter={false}><Register /></ElLayout>} />
          <Route path="/auth" element={<Navigate to="/login" replace />} />
          
          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardV2 />} />
          <Route path="/dashboard-v2" element={<DashboardV2 />} />
          
          {/* Health Modules */}
          <Route path="/health" element={<Navigate to="/health/nutrition" replace />} />
          <Route path="/health/nutrition" element={<NutritionUnified />} />
          <Route path="/health/movement" element={<MovementUnified />} />
          <Route path="/health/sleep" element={<SleepUnified />} />
          <Route path="/health/psychology" element={<PsychologyUnified />} />
          <Route path="/health/medicine" element={<MedicineUnified />} />
          <Route path="/health/relationships" element={<RelationshipsUnified />} />
          <Route path="/health/habits" element={<HabitsUnified />} />
          
          {/* Social */}
          <Route path="/social" element={<SocialFeedUnified />} />
          <Route path="/social/feed" element={<SocialFeedUnified />} />
          <Route path="/social/messages" element={<MessagesUnified />} />
          <Route path="/social/groups" element={<GroupsUnified />} />
          <Route path="/social/challenges" element={<ChallengesUnified />} />
          
          {/* AI & Features */}
          <Route path="/ai-chat" element={<AIChatUnified />} />
          <Route path="/ai" element={<AIChatUnified />} />
          <Route path="/analytics" element={<AnalyticsUnified />} />
          <Route path="/gamification" element={<GamificationUnified />} />
          <Route path="/achievements" element={<GamificationUnified />} />
          <Route path="/specialists" element={<SpecialistsUnified />} />
          <Route path="/centers" element={<CentersUnified />} />
          
          {/* User */}
          <Route path="/profile" element={<ProfileUnified />} />
          <Route path="/profile/:username" element={<ProfileUnified />} />
          <Route path="/settings" element={<SettingsUnified />} />
          <Route path="/wallet" element={<WalletUnified />} />
          
          {/* Design System Demo */}
          <Route path="/design-system" element={<DesignSystemDemo />} />
          <Route path="/design" element={<DesignSystemDemo />} />
          
          {/* Static Pages */}
          <Route path="/whitepaper" element={<Whitepaper />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          
          {/* 404 */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-[var(--bone-200)]">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-[var(--neon-cyan)] mb-4">404</h1>
                <p className="text-xl text-[var(--text-primary)] mb-6">Page not found</p>
                <a href="/" className="text-[var(--neon-cyan)] hover:underline">Go back home</a>
              </div>
            </div>
          } />
        </Routes>
      </Suspense>
      <DemoBanner />
    </>
  );
};

export default AppRoutes;
