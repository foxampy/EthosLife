/**
 * EthosLife - Human Operating System
 * Main Application Component
 *
 * Features:
 * - Unified routing system with lazy loading
 * - i18n with 25 language support
 * - Toast notifications
 * - Global error boundary
 * - ALL PAGES AVAILABLE WITHOUT REGISTRATION
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { VersionProvider } from './contexts/VersionContext';
import { GuestDataProvider } from './contexts/GuestDataContext';
import GuestAccessRoute from './components/Auth/GuestAccessRoute';
import Layout from './components/Layout/Layout';

// Import i18n configuration
import './i18n/config';

// Lazy load pages
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const LandingV1 = lazy(() => import('./pages/Landing/LandingV1'));
const DashboardV1 = lazy(() => import('./pages/Dashboard/DashboardV1'));
const HealthCenter = lazy(() => import('./pages/Health/HealthCenter'));
const InvestorDemo = lazy(() => import('./pages/InvestorDemo'));

// V2 Unified Pages
const UnifiedHomePage = lazy(() => import('./pages/Unified/UnifiedHomePage'));
const DashboardV2 = lazy(() => import('./pages/Unified/DashboardV2'));
const NutritionUnified = lazy(() => import('./pages/Unified/Health/NutritionUnified'));
const MovementUnified = lazy(() => import('./pages/Unified/Health/MovementUnified'));
const SleepUnified = lazy(() => import('./pages/Unified/Health/SleepUnified'));
const PsychologyUnified = lazy(() => import('./pages/Unified/Health/PsychologyUnified'));
const MedicineUnified = lazy(() => import('./pages/Unified/Health/MedicineUnified'));
const RelationshipsUnified = lazy(() => import('./pages/Unified/Health/RelationshipsUnified'));
const HabitsUnified = lazy(() => import('./pages/Unified/Health/HabitsUnified'));
const SocialFeedUnified = lazy(() => import('./pages/Unified/Social/SocialFeedUnified'));
const MessagesUnified = lazy(() => import('./pages/Unified/Social/MessagesUnified'));
const GroupsUnified = lazy(() => import('./pages/Unified/Social/GroupsUnified'));
const ChallengesUnified = lazy(() => import('./pages/Unified/Social/ChallengesUnified'));
const AIChatUnified = lazy(() => import('./pages/Unified/AIChatUnified'));
const AnalyticsUnified = lazy(() => import('./pages/Unified/AnalyticsUnified'));
const GamificationUnified = lazy(() => import('./pages/Unified/GamificationUnified'));
const SpecialistsUnified = lazy(() => import('./pages/Unified/SpecialistsUnified'));
const CentersUnified = lazy(() => import('./pages/Unified/CentersUnified'));
const ProfileUnified = lazy(() => import('./pages/Unified/ProfileUnified'));
const SettingsUnified = lazy(() => import('./pages/Unified/SettingsUnified'));
const WalletUnified = lazy(() => import('./pages/Unified/WalletUnified'));

// Loading fallback
const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-bone">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-stone mx-auto mb-4"></div>
      <p className="text-stone">Loading EthosLife...</p>
    </div>
  </div>
);

function App() {
  return (
    <VersionProvider defaultVersion="v2">
      <GuestDataProvider>
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

          <Routes>
            {/* Public routes - Login/Register available for all */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ALL PAGES AVAILABLE WITHOUT REGISTRATION - Guest Access Routes */}
            <Route element={<GuestAccessRoute />}>
              <Route element={<Layout />}>
                {/* Root landing page */}
                <Route path="/" element={<LandingV1 />} />

                {/* V2 Landing/Home */}
                <Route path="/v2" element={<InvestorDemo />} />
                <Route path="/demo" element={<Navigate to="/v2" replace />} />
                <Route path="/home" element={<UnifiedHomePage />} />

                {/* Dashboard */}
                <Route path="/dashboard" element={<DashboardV1 />} />
                <Route path="/dashboard-v2" element={<DashboardV2 />} />
                <Route path="/dashboard-v1" element={<DashboardV1 />} />

                {/* Health Modules - V1 */}
                <Route path="/health" element={<HealthCenter />} />
                <Route path="/health/nutrition-v1" element={lazy(() => import('./pages/Health/V1/NutritionV1'))} />
                <Route path="/health/fitness-v1" element={lazy(() => import('./pages/Health/V1/FitnessV1'))} />
                <Route path="/health/sleep-v1" element={lazy(() => import('./pages/Health/V1/SleepV1'))} />
                <Route path="/health/mental-v1" element={lazy(() => import('./pages/Health/V1/MentalHealthV1'))} />
                <Route path="/health/medical-v1" element={lazy(() => import('./pages/Health/V1/MedicalV1'))} />

                {/* Health Modules - V2 Unified */}
                <Route path="/health/nutrition" element={<NutritionUnified />} />
                <Route path="/health/movement" element={<MovementUnified />} />
                <Route path="/health/sleep" element={<SleepUnified />} />
                <Route path="/health/psychology" element={<PsychologyUnified />} />
                <Route path="/health/medicine" element={<MedicineUnified />} />
                <Route path="/health/relationships" element={<RelationshipsUnified />} />
                <Route path="/health/habits" element={<HabitsUnified />} />

                {/* Social Routes */}
                <Route path="/social" element={lazy(() => import('./pages/Social/Feed'))} />
                <Route path="/social-v1" element={lazy(() => import('./pages/Social/V1/SocialFeedV1'))} />
                <Route path="/social/feed" element={<SocialFeedUnified />} />
                <Route path="/social/messages" element={<MessagesUnified />} />
                <Route path="/social/groups" element={<GroupsUnified />} />
                <Route path="/social/challenges" element={<ChallengesUnified />} />

                {/* AI & Features */}
                <Route path="/ai-chat" element={lazy(() => import('./pages/AI/Chat'))} />
                <Route path="/ai" element={<AIChatUnified />} />
                <Route path="/analytics" element={<AnalyticsUnified />} />
                <Route path="/gamification" element={<GamificationUnified />} />
                <Route path="/achievements" element={<GamificationUnified />} />
                <Route path="/specialists" element={<SpecialistsUnified />} />
                <Route path="/centers" element={<CentersUnified />} />

                {/* User */}
                <Route path="/profile" element={lazy(() => import('./pages/Profile/Profile'))} />
                <Route path="/profile-v2" element={<ProfileUnified />} />
                <Route path="/settings" element={lazy(() => import('./pages/Settings/Settings'))} />
                <Route path="/settings-v2" element={<SettingsUnified />} />
                <Route path="/wallet" element={<WalletUnified />} />

                {/* Landing V1 Pages */}
                <Route path="/v1" element={<LandingV1 />} />
                <Route path="/features-v1" element={lazy(() => import('./pages/Landing/FeaturesV1'))} />
                <Route path="/pricing-v1" element={lazy(() => import('./pages/Landing/PricingV1'))} />
                <Route path="/tokenomics-v1" element={lazy(() => import('./pages/Landing/TokenomicsV1'))} />
                <Route path="/roadmap-v1" element={lazy(() => import('./pages/Landing/RoadmapV1'))} />

                {/* Design System Demo */}
                <Route path="/design-system" element={lazy(() => import('./pages/Unified/DesignSystemDemo'))} />
                <Route path="/design" element={lazy(() => import('./pages/Unified/DesignSystemDemo'))} />
              </Route>
            </Route>

            {/* 404 - Redirect to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </GuestDataProvider>
    </VersionProvider>
  );
}

export default App;
