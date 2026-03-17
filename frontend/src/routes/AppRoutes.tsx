/**
 * EthosLife - Unified Router Configuration
 * Single source of truth for all application routes
 * 
 * Architecture:
 * - All routes use ElLayout wrapper (unified design system)
 * - V2 pages are primary (V1 legacy kept for compatibility)
 * - Deep Neumorphism styling throughout
 * - Guest access enabled for all routes
 */

import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Layout
import ElLayout from '../components/ElLayout/ElLayout';

// Loading Component
const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#dcd3c6] via-[#e8e0d5] to-[#f5f0eb]">
    <div className="text-center">
      <motion.div
        className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#5c5243] to-[#8c7a6b] flex items-center justify-center text-white font-bold text-2xl shadow-lg animate-pulse"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        E
      </motion.div>
      <p className="text-[#5c5243] font-medium">Loading EthosLife...</p>
    </div>
  </div>
);

// ==================== PAGES (Lazy Loaded) ====================

// Landing Pages
const LandingV2 = React.lazy(() => import('../pages/Landing/LandingV2'));
const FeaturesV2 = React.lazy(() => import('../pages/Landing/FeaturesV2'));
const PricingV2 = React.lazy(() => import('../pages/Landing/PricingV2'));
const TeamV2 = React.lazy(() => import('../pages/Landing/TeamV2'));
const RoadmapV2 = React.lazy(() => import('../pages/Landing/RoadmapV2'));
const FAQV2 = React.lazy(() => import('../pages/Landing/FAQV2'));
const BlogV2 = React.lazy(() => import('../pages/Landing/BlogV2'));

// Auth
const Login = React.lazy(() => import('../pages/Auth/Login'));
const Register = React.lazy(() => import('../pages/Auth/Register'));

// Dashboard
const DashboardV2 = React.lazy(() => import('../pages/Unified/DashboardV2'));
const InvestorDemo = React.lazy(() => import('../pages/InvestorDemo'));

// Health Modules (V2 - Primary)
const Nutrition2 = React.lazy(() => import('../pages/Health/Nutrition2'));
const Movement2 = React.lazy(() => import('../pages/Health/Movement2'));
const Sleep2 = React.lazy(() => import('../pages/Health/Sleep2'));
const Psychology2 = React.lazy(() => import('../pages/Health/Psychology2'));
const Medicine2 = React.lazy(() => import('../pages/Health/Medicine2'));
const Relationships2 = React.lazy(() => import('../pages/Health/Relationships2'));
const Habits2 = React.lazy(() => import('../pages/Health/Habits2'));

// Social
const SocialFeed2 = React.lazy(() => import('../pages/Social/SocialFeed2'));

// AI & Features
const AIChatUnified = React.lazy(() => import('../pages/AI/AIChatUnified'));
const Analytics2 = React.lazy(() => import('../pages/Analytics/Analytics2'));
const Gamification2 = React.lazy(() => import('../pages/Gamification/Gamification2'));
const Specialists2 = React.lazy(() => import('../pages/Specialists/Specialists2'));
const Centers2 = React.lazy(() => import('../pages/Centers/Centers2'));

// User
const Profile2 = React.lazy(() => import('../pages/Profile/Profile2'));
const Settings2 = React.lazy(() => import('../pages/Settings/Settings2'));

// V1 Legacy (Keep for compatibility)
const WalletV1 = React.lazy(() => import('../pages/Dashboard/WalletV1'));
const TokenomicsV1 = React.lazy(() => import('../pages/Landing/TokenomicsV1'));
const FitnessV1 = React.lazy(() => import('../pages/Health/V1/FitnessV1'));
const FoodDiaryV1 = React.lazy(() => import('../pages/Health/V1/FoodDiaryV1'));
const MealPlannerV1 = React.lazy(() => import('../pages/Health/V1/MealPlannerV1'));
const RecipesV1 = React.lazy(() => import('../pages/Health/V1/RecipesV1'));
const ProductsDBV1 = React.lazy(() => import('../pages/Health/V1/ProductsDBV1'));
const ExerciseLibraryV1 = React.lazy(() => import('../pages/Health/V1/ExerciseLibraryV1'));
const WorkoutLoggerV1 = React.lazy(() => import('../pages/Health/V1/WorkoutLoggerV1'));
const SleepAnalysisV1 = React.lazy(() => import('../pages/Health/V1/SleepAnalysisV1'));
const MoodTrackerV1 = React.lazy(() => import('../pages/Health/V1/MoodTrackerV1'));
const MedicationsV1 = React.lazy(() => import('../pages/Health/V1/MedicationsV1'));
const ChallengesV1 = React.lazy(() => import('../pages/Social/V1/ChallengesV1'));
const FriendsV1 = React.lazy(() => import('../pages/Social/V1/FriendsV1'));
const GroupsV1 = React.lazy(() => import('../pages/Social/V1/GroupsV1'));
const MessagesV1 = React.lazy(() => import('../pages/Social/V1/MessagesV1'));
const LeadersV1 = React.lazy(() => import('../pages/Social/V1/LeadersV1'));
const NotificationsV1 = React.lazy(() => import('../pages/Dashboard/NotificationsV1'));
const ActivityV1 = React.lazy(() => import('../pages/Dashboard/ActivityV1'));
const SearchV1 = React.lazy(() => import('../pages/Dashboard/SearchV1'));

// Design & Utilities
const DesignSystemDemo = React.lazy(() => import('../pages/Unified/DesignSystemDemo'));
const NotFound404 = React.lazy(() => import('../pages/NotFound404'));

// ==================== ROUTE CONFIGURATION ====================

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* =============== LANDING PAGES =============== */}
        <Route path="/" element={<LandingV2 />} />
        <Route path="/v2" element={<InvestorDemo />} />
        <Route path="/demo" element={<Navigate to="/v2" replace />} />
        
        {/* Landing Sub-pages */}
        <Route path="/features" element={<ElLayout><FeaturesV2 /></ElLayout>} />
        <Route path="/pricing" element={<ElLayout><PricingV2 /></ElLayout>} />
        <Route path="/team" element={<ElLayout><TeamV2 /></ElLayout>} />
        <Route path="/roadmap" element={<ElLayout><RoadmapV2 /></ElLayout>} />
        <Route path="/faq" element={<ElLayout><FAQV2 /></ElLayout>} />
        <Route path="/blog" element={<ElLayout><BlogV2 /></ElLayout>} />

        {/* =============== AUTH =============== */}
        <Route path="/login" element={<ElLayout showFooter={false}><Login /></ElLayout>} />
        <Route path="/register" element={<ElLayout showFooter={false}><Register /></ElLayout>} />

        {/* =============== DASHBOARD =============== */}
        <Route path="/dashboard" element={<DashboardV2 />} />

        {/* =============== HEALTH MODULES =============== */}
        <Route path="/health" element={<Navigate to="/health/nutrition" replace />} />
        
        {/* Primary Health Routes */}
        <Route path="/health/nutrition" element={<Nutrition2 />} />
        <Route path="/health/movement" element={<Movement2 />} />
        <Route path="/health/sleep" element={<Sleep2 />} />
        <Route path="/health/psychology" element={<Psychology2 />} />
        <Route path="/health/medicine" element={<Medicine2 />} />
        <Route path="/health/relationships" element={<Relationships2 />} />
        <Route path="/health/habits" element={<Habits2 />} />

        {/* Legacy Health Routes (V1) */}
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

        {/* =============== SOCIAL =============== */}
        <Route path="/social" element={<SocialFeed2 />} />
        
        {/* Legacy Social Routes */}
        <Route path="/challenges" element={<ChallengesV1 />} />
        <Route path="/friends" element={<FriendsV1 />} />
        <Route path="/groups" element={<GroupsV1 />} />
        <Route path="/messages" element={<MessagesV1 />} />
        <Route path="/leaders" element={<LeadersV1 />} />

        {/* =============== AI & FEATURES =============== */}
        <Route path="/ai-chat" element={<AIChatUnified />} />
        <Route path="/ai" element={<AIChatUnified />} />
        <Route path="/analytics" element={<Analytics2 />} />
        <Route path="/gamification" element={<Gamification2 />} />
        <Route path="/achievements" element={<Gamification2 />} />
        <Route path="/specialists" element={<Specialists2 />} />
        <Route path="/centers" element={<Centers2 />} />

        {/* =============== USER =============== */}
        <Route path="/profile" element={<Profile2 />} />
        <Route path="/settings" element={<Settings2 />} />
        <Route path="/wallet" element={<WalletV1 />} />
        <Route path="/tokenomics" element={<TokenomicsV1 />} />

        {/* =============== LEGACY DASHBOARD =============== */}
        <Route path="/notifications" element={<NotificationsV1 />} />
        <Route path="/activity" element={<ActivityV1 />} />
        <Route path="/search" element={<SearchV1 />} />

        {/* =============== DESIGN SYSTEM =============== */}
        <Route path="/design-system" element={<DesignSystemDemo />} />
        <Route path="/design" element={<DesignSystemDemo />} />

        {/* =============== 404 =============== */}
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
