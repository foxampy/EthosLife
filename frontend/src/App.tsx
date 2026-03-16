/**
 * EthosLife - Human Operating System V2
 * Main Application Component
 *
 * Features:
 * - Unified routing system with lazy loading
 * - i18n with 25 language support
 * - Toast notifications
 * - Global error boundary
 * - ALL PAGES AVAILABLE WITHOUT REGISTRATION
 * - V2 IS MAIN - All V1 features integrated
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

// Auth Pages
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));

// V2 Main Pages (Default)
const LandingV2 = lazy(() => import('./pages/Landing/LandingV2'));
const DashboardV2 = lazy(() => import('./pages/Unified/DashboardV2'));
const InvestorDemo = lazy(() => import('./pages/InvestorDemo'));

// V2 Health Modules
const Nutrition2 = lazy(() => import('./pages/Health/Nutrition2'));
const Movement2 = lazy(() => import('./pages/Health/Movement2'));
const Sleep2 = lazy(() => import('./pages/Health/Sleep2'));
const Psychology2 = lazy(() => import('./pages/Health/Psychology2'));
const Medicine2 = lazy(() => import('./pages/Health/Medicine2'));
const Relationships2 = lazy(() => import('./pages/Health/Relationships2'));
const Habits2 = lazy(() => import('./pages/Health/Habits2'));

// V2 Social Modules
const SocialFeed2 = lazy(() => import('./pages/Social/SocialFeed2'));

// V2 Other Modules
const AIChat2 = lazy(() => import('./pages/AI/AIChat2'));
const Analytics2 = lazy(() => import('./pages/Analytics/Analytics2'));
const Gamification2 = lazy(() => import('./pages/Gamification/Gamification2'));
const Specialists2 = lazy(() => import('./pages/Specialists/Specialists2'));
const Centers2 = lazy(() => import('./pages/Centers/Centers2'));
const Profile2 = lazy(() => import('./pages/Profile/Profile2'));
const Settings2 = lazy(() => import('./pages/Settings/Settings2'));

// V1 Pages (for features not yet in V2 - lazy loaded on demand)
const WalletV1 = lazy(() => import('./pages/Dashboard/WalletV1'));
const NotificationsV1 = lazy(() => import('./pages/Dashboard/NotificationsV1'));
const ActivityV1 = lazy(() => import('./pages/Dashboard/ActivityV1'));
const SearchV1 = lazy(() => import('./pages/Dashboard/SearchV1'));
const TokenomicsV1 = lazy(() => import('./pages/Landing/TokenomicsV1'));
const ChallengesV1 = lazy(() => import('./pages/Social/V1/ChallengesV1'));
const FriendsV1 = lazy(() => import('./pages/Social/V1/FriendsV1'));
const GroupsV1 = lazy(() => import('./pages/Social/V1/GroupsV1'));
const MessagesV1 = lazy(() => import('./pages/Social/V1/MessagesV1'));
const LeadersV1 = lazy(() => import('./pages/Social/V1/LeadersV1'));
const FoodDiaryV1 = lazy(() => import('./pages/Health/V1/FoodDiaryV1'));
const MealPlannerV1 = lazy(() => import('./pages/Health/V1/MealPlannerV1'));
const RecipesV1 = lazy(() => import('./pages/Health/V1/RecipesV1'));
const ProductsDBV1 = lazy(() => import('./pages/Health/V1/ProductsDBV1'));
const ExerciseLibraryV1 = lazy(() => import('./pages/Health/V1/ExerciseLibraryV1'));
const WorkoutLoggerV1 = lazy(() => import('./pages/Health/V1/WorkoutLoggerV1'));
const SleepAnalysisV1 = lazy(() => import('./pages/Health/V1/SleepAnalysisV1'));
const MoodTrackerV1 = lazy(() => import('./pages/Health/V1/MoodTrackerV1'));
const MedicationsV1 = lazy(() => import('./pages/Health/V1/MedicationsV1'));
const FitnessV1 = lazy(() => import('./pages/Health/V1/FitnessV1'));

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
                {/* Root - V2 Landing as Main */}
                <Route path="/" element={<LandingV2 />} />
                
                {/* V2 Main Routes */}
                <Route path="/v2" element={<InvestorDemo />} />
                <Route path="/demo" element={<Navigate to="/v2" replace />} />
                <Route path="/dashboard" element={<DashboardV2 />} />
                
                {/* V2 Health Modules - Main */}
                <Route path="/health" element={<Navigate to="/health/nutrition" replace />} />
                <Route path="/health/nutrition" element={<Nutrition2 />} />
                <Route path="/health/movement" element={<Movement2 />} />
                <Route path="/health/sleep" element={<Sleep2 />} />
                <Route path="/health/psychology" element={<Psychology2 />} />
                <Route path="/health/medicine" element={<Medicine2 />} />
                <Route path="/health/relationships" element={<Relationships2 />} />
                <Route path="/health/habits" element={<Habits2 />} />
                
                {/* V2 Social */}
                <Route path="/social" element={<SocialFeed2 />} />
                
                {/* V2 Other Modules */}
                <Route path="/ai-chat" element={<AIChat2 />} />
                <Route path="/analytics" element={<Analytics2 />} />
                <Route path="/gamification" element={<Gamification2 />} />
                <Route path="/specialists" element={<Specialists2 />} />
                <Route path="/centers" element={<Centers2 />} />
                <Route path="/profile" element={<Profile2 />} />
                <Route path="/settings" element={<Settings2 />} />
                
                {/* V1 Features NOT YET IN V2 - Integrated from V1 */}
                {/* Web3 & Crypto */}
                <Route path="/wallet" element={<WalletV1 />} />
                <Route path="/tokenomics" element={<TokenomicsV1 />} />
                
                {/* Social V1 Features */}
                <Route path="/challenges" element={<ChallengesV1 />} />
                <Route path="/friends" element={<FriendsV1 />} />
                <Route path="/groups" element={<GroupsV1 />} />
                <Route path="/messages" element={<MessagesV1 />} />
                <Route path="/leaders" element={<LeadersV1 />} />
                
                {/* Health V1 Features - Extended */}
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
                
                {/* Dashboard V1 Features */}
                <Route path="/notifications" element={<NotificationsV1 />} />
                <Route path="/activity" element={<ActivityV1 />} />
                <Route path="/search" element={<SearchV1 />} />
                
                {/* Landing V2 Pages */}
                <Route path="/features" element={lazy(() => import('./pages/Landing/FeaturesV2'))} />
                <Route path="/pricing" element={lazy(() => import('./pages/Landing/PricingV2'))} />
                <Route path="/team" element={lazy(() => import('./pages/Landing/TeamV2'))} />
                <Route path="/roadmap" element={lazy(() => import('./pages/Landing/RoadmapV2'))} />
                <Route path="/faq" element={lazy(() => import('./pages/Landing/FAQV2'))} />
                <Route path="/blog" element={lazy(() => import('./pages/Landing/BlogV2'))} />
                
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
