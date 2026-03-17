/**
 * EthosLife - Human Operating System
 * Main Application Component - V2 IS MAIN
 *
 * Features:
 * - Unified routing system with lazy loading
 * - i18n with 25 language support
 * - Toast notifications
 * - Global error boundary
 * - ALL PAGES AVAILABLE WITHOUT REGISTRATION
 * - V2 IS MAIN PRODUCTION VERSION
 */

import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuthStore } from './store/authStore';
import GuestAccessRoute from './components/Auth/GuestAccessRoute';
import Layout from './components/Layout/Layout';

// Import i18n configuration
import './i18n/config';

// Auth Pages
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));

// MAIN V2 Pages (Production)
const LandingV2 = lazy(() => import('./pages/Landing/LandingV2'));
const DashboardV2 = lazy(() => import('./pages/Unified/DashboardV2'));
const InvestorDemo = lazy(() => import('./pages/InvestorDemo'));

// V2 Health Modules (Main)
const Nutrition2 = lazy(() => import('./pages/Health/Nutrition2'));
const Movement2 = lazy(() => import('./pages/Health/Movement2'));
const Sleep2 = lazy(() => import('./pages/Health/Sleep2'));
const Psychology2 = lazy(() => import('./pages/Health/Psychology2'));
const Medicine2 = lazy(() => import('./pages/Health/Medicine2'));
const Relationships2 = lazy(() => import('./pages/Health/Relationships2'));
const Habits2 = lazy(() => import('./pages/Health/Habits2'));

// V2 Social Modules (Main)
const SocialFeed2 = lazy(() => import('./pages/Social/SocialFeed2'));

// V2 Other Modules (Main)
const AIChatUnified = lazy(() => import('./pages/AI/AIChatUnified'));
const Analytics2 = lazy(() => import('./pages/Analytics/Analytics2'));
const Gamification2 = lazy(() => import('./pages/Gamification/Gamification2'));
const Specialists2 = lazy(() => import('./pages/Specialists/Specialists2'));
const Centers2 = lazy(() => import('./pages/Centers/Centers2'));
const Profile2 = lazy(() => import('./pages/Profile/Profile2'));
const Settings2 = lazy(() => import('./pages/Settings/Settings2'));

// V1 Legacy Features (Integrated - accessible from menu)
const WalletV1 = lazy(() => import('./pages/Dashboard/WalletV1'));
const TokenomicsV1 = lazy(() => import('./pages/Landing/TokenomicsV1'));
const ChallengesV1 = lazy(() => import('./pages/Social/V1/ChallengesV1'));
const FriendsV1 = lazy(() => import('./pages/Social/V1/FriendsV1'));
const GroupsV1 = lazy(() => import('./pages/Social/V1/GroupsV1'));
const MessagesV1 = lazy(() => import('./pages/Social/V1/MessagesV1'));
const LeadersV1 = lazy(() => import('./pages/Social/V1/LeadersV1'));
const FitnessV1 = lazy(() => import('./pages/Health/V1/FitnessV1'));
const FoodDiaryV1 = lazy(() => import('./pages/Health/V1/FoodDiaryV1'));
const MealPlannerV1 = lazy(() => import('./pages/Health/V1/MealPlannerV1'));
const RecipesV1 = lazy(() => import('./pages/Health/V1/RecipesV1'));
const ProductsDBV1 = lazy(() => import('./pages/Health/V1/ProductsDBV1'));
const ExerciseLibraryV1 = lazy(() => import('./pages/Health/V1/ExerciseLibraryV1'));
const WorkoutLoggerV1 = lazy(() => import('./pages/Health/V1/WorkoutLoggerV1'));
const SleepAnalysisV1 = lazy(() => import('./pages/Health/V1/SleepAnalysisV1'));
const MoodTrackerV1 = lazy(() => import('./pages/Health/V1/MoodTrackerV1'));
const MedicationsV1 = lazy(() => import('./pages/Health/V1/MedicationsV1'));
const NotificationsV1 = lazy(() => import('./pages/Dashboard/NotificationsV1'));
const ActivityV1 = lazy(() => import('./pages/Dashboard/ActivityV1'));
const SearchV1 = lazy(() => import('./pages/Dashboard/SearchV1'));

// Landing V2 Pages
const FeaturesV2 = lazy(() => import('./pages/Landing/FeaturesV2'));
const PricingV2 = lazy(() => import('./pages/Landing/PricingV2'));
const TeamV2 = lazy(() => import('./pages/Landing/TeamV2'));
const RoadmapV2 = lazy(() => import('./pages/Landing/RoadmapV2'));
const FAQV2 = lazy(() => import('./pages/Landing/FAQV2'));
const BlogV2 = lazy(() => import('./pages/Landing/BlogV2'));

// Design System
const DesignSystemDemo = lazy(() => import('./pages/Unified/DesignSystemDemo'));
const NotFound404 = lazy(() => import('./pages/NotFound404'));

// Loading fallback with better styling
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

// Error Boundary Component
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

function AppContent() {
  // Initialize auth store on app mount
  const initializeAuth = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <>
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
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ALL PAGES AVAILABLE WITHOUT REGISTRATION */}
      <Route element={<GuestAccessRoute />}>
        <Route element={<Layout />}>
          {/* MAIN V2 ROUTES */}
          <Route path="/" element={<LandingV2 />} />
          <Route path="/v2" element={<InvestorDemo />} />
          <Route path="/demo" element={<Navigate to="/v2" replace />} />
          <Route path="/dashboard" element={<DashboardV2 />} />

          {/* Health (V2 Main) */}
          <Route path="/health" element={<Navigate to="/health/nutrition" replace />} />
          <Route path="/health/nutrition" element={<Nutrition2 />} />
          <Route path="/health/movement" element={<Movement2 />} />
          <Route path="/health/sleep" element={<Sleep2 />} />
          <Route path="/health/psychology" element={<Psychology2 />} />
          <Route path="/health/medicine" element={<Medicine2 />} />
          <Route path="/health/relationships" element={<Relationships2 />} />
          <Route path="/health/habits" element={<Habits2 />} />

          {/* Social (V2 Main) */}
          <Route path="/social" element={<SocialFeed2 />} />

          {/* Other V2 Modules */}
          <Route path="/ai-chat" element={<AIChatUnified />} />
          <Route path="/analytics" element={<Analytics2 />} />
          <Route path="/gamification" element={<Gamification2 />} />
          <Route path="/specialists" element={<Specialists2 />} />
          <Route path="/centers" element={<Centers2 />} />
          <Route path="/profile" element={<Profile2 />} />
          <Route path="/settings" element={<Settings2 />} />

          {/* V1 LEGACY FEATURES (Accessible from menu) */}
          {/* Web3 */}
          <Route path="/wallet" element={<WalletV1 />} />
          <Route path="/tokenomics" element={<TokenomicsV1 />} />

          {/* Social Legacy */}
          <Route path="/challenges" element={<ChallengesV1 />} />
          <Route path="/friends" element={<FriendsV1 />} />
          <Route path="/groups" element={<GroupsV1 />} />
          <Route path="/messages" element={<MessagesV1 />} />
          <Route path="/leaders" element={<LeadersV1 />} />

          {/* Health Legacy Extended */}
          <Route path="/health/fitness" element={<FitnessV1 />} />
          <Route path="/health/nutrition/diary" element={<FoodDiaryV1 />} />
          <Route path="/health/nutrition/meal-plan" element={<MealPlannerV1 />} />
          <Route path="/health/nutrition/recipes" element={<RecipesV1 />} />
          <Route path="/health/nutrition/products" element={<ProductsDBV1 />} />
          <Route path="/health/fitness/exercises" element={<ExerciseLibraryV1 />} />
          <Route path="/health/fitness/workout" element={<WorkoutLoggerV1 />} />
          <Route path="/health/sleep/analysis" element={<SleepAnalysisV1 />} />
          <Route path="/health/mental/mood" element={<MoodTrackerV1 />} />
          <Route path="/health/medical/medications" element={<MedicationsV1 />} />

          {/* Dashboard Legacy */}
          <Route path="/notifications" element={<NotificationsV1 />} />
          <Route path="/activity" element={<ActivityV1 />} />
          <Route path="/search" element={<SearchV1 />} />

          {/* Landing Pages */}
          <Route path="/features" element={<FeaturesV2 />} />
          <Route path="/pricing" element={<PricingV2 />} />
          <Route path="/team" element={<TeamV2 />} />
          <Route path="/roadmap" element={<RoadmapV2 />} />
          <Route path="/faq" element={<FAQV2 />} />
          <Route path="/blog" element={<BlogV2 />} />

          {/* Design System */}
          <Route path="/design-system" element={<DesignSystemDemo />} />
          <Route path="/design" element={<DesignSystemDemo />} />
        </Route>
      </Route>

      {/* 404 - Not Found */}
      <Route path="*" element={<NotFound404 />} />
    </Routes>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <AppContent />
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
